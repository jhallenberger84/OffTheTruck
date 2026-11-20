import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin, noDb, unauthorized } from "@/lib/admin";

export const dynamic = "force-dynamic";

/** Zero-result searches, grouped, most common first. ?days=30 */
export async function GET(req: Request) {
  if (!isAdmin(req)) return unauthorized();
  const sql = await db();
  if (!sql) return noDb();
  const days = Math.min(365, Math.max(1, Number(new URL(req.url).searchParams.get("days")) || 30));
  const rows = await sql`select q, count(*)::int as times, max(created_at) as last_seen from zero_result_searches
    where created_at > now() - make_interval(days => ${days}) group by q order by times desc, last_seen desc limit 200`;
  return NextResponse.json({ days, count: rows.length, searches: rows });
}
