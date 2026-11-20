import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin, noDb, unauthorized } from "@/lib/admin";

export const dynamic = "force-dynamic";

/** GET /api/admin/queue?status=pending|approved|rejected|all */
export async function GET(req: Request) {
  if (!isAdmin(req)) return unauthorized();
  const sql = await db();
  if (!sql) return noDb();
  const status = new URL(req.url).searchParams.get("status") || "pending";
  const rows = status === "all"
    ? await sql`select * from submissions order by created_at desc limit 200`
    : await sql`select * from submissions where status = ${status} order by created_at asc limit 200`;
  return NextResponse.json({ count: rows.length, submissions: rows });
}
