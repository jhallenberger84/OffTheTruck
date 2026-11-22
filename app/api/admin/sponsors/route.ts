import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin, noDb, unauthorized } from "@/lib/admin";
import { readBody } from "@/lib/http";
import { SPONSOR_PRICE_PER_WEEK } from "@/lib/site";

export const dynamic = "force-dynamic";

/** GET: sponsor weeks (with click counts) and inquiries. */
export async function GET(req: Request) {
  if (!isAdmin(req)) return unauthorized();
  const sql = await db();
  if (!sql) return noDb();
  const weeks = await sql`select w.*,
      (select count(*)::int from sponsor_clicks c where c.sponsor_week_id = w.id and c.is_bot is false) as clicks,
      (select count(*)::int from sponsor_clicks c where c.sponsor_week_id = w.id and c.is_bot is true) as clicks_bot,
      (select count(*)::int from sponsor_clicks c where c.sponsor_week_id = w.id and c.is_bot is null) as clicks_unknown,
      (select count(*)::int from sponsor_clicks c where c.sponsor_week_id = w.id) as clicks_raw
    from sponsor_weeks w order by week_start desc limit 100`;
  const inquiries = await sql`select * from sponsor_inquiries order by created_at desc limit 100`;
  const unattributedClicks = await sql`select
      count(*) filter (where is_bot is false)::int as human,
      count(*) filter (where is_bot is true)::int as bot,
      count(*) filter (where is_bot is null)::int as unknown,
      count(*)::int as n
    from sponsor_clicks where sponsor_week_id is null`;
  const u = unattributedClicks[0];
  return NextResponse.json({
    price_per_week_usd: SPONSOR_PRICE_PER_WEEK,
    weeks,
    inquiries,
    placeholder_bar_clicks: u.human,
    placeholder_bar_clicks_bot: u.bot,
    placeholder_bar_clicks_unknown: u.unknown,
    placeholder_bar_clicks_raw: u.n,
  });
}

/** POST: book a week. { week_start: "2026-11-23", sponsor_name, url, headline?, price_cents? }  PATCH: { id, status } */
export async function POST(req: Request) {
  if (!isAdmin(req)) return unauthorized();
  const sql = await db();
  if (!sql) return noDb();
  const b = await readBody(req);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(b.week_start)) || !b.sponsor_name || !/^https?:\/\//.test(String(b.url)))
    return NextResponse.json({ error: "week_start (YYYY-MM-DD), sponsor_name, and url are required" }, { status: 400 });
  const [w] = await sql`insert into sponsor_weeks (week_start, sponsor_name, headline, url, price_cents)
    values (${String(b.week_start)}, ${String(b.sponsor_name)}, ${b.headline ? String(b.headline) : null}, ${String(b.url)}, ${Number(b.price_cents) || SPONSOR_PRICE_PER_WEEK * 100}) returning *`;
  return NextResponse.json({ ok: true, week: w });
}

export async function PATCH(req: Request) {
  if (!isAdmin(req)) return unauthorized();
  const sql = await db();
  if (!sql) return noDb();
  const b = await readBody(req);
  if (!["booked", "live", "done", "cancelled"].includes(String(b.status))) return NextResponse.json({ error: "status must be booked, live, done, or cancelled" }, { status: 400 });
  const [w] = await sql`update sponsor_weeks set status = ${String(b.status)} where id = ${Number(b.id)} returning *`;
  return w ? NextResponse.json({ ok: true, week: w }) : NextResponse.json({ error: "not found" }, { status: 404 });
}
