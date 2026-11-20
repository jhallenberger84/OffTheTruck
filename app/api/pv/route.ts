import { NextResponse } from "next/server";
import { db, logError } from "@/lib/db";

const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor/i;

export async function POST(req: Request) {
  if (BOT.test(req.headers.get("user-agent") || "")) return new NextResponse(null, { status: 204 });
  let path = "/";
  try {
    path = String(((await req.json()) as { path?: string }).path || "/").slice(0, 200);
  } catch {}
  if (!path.startsWith("/") || path.startsWith("/api")) return new NextResponse(null, { status: 204 });
  try {
    const sql = await db();
    if (sql) {
      await sql`insert into pageviews (path, day, views) values (${path}, (now() at time zone 'America/Chicago')::date, 1)
                on conflict (path, day) do update set views = pageviews.views + 1`;
    }
  } catch (e) {
    await logError("pv", e);
  }
  return new NextResponse(null, { status: 204 });
}
