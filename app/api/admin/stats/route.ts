import { NextResponse } from "next/server";
import { isAdmin, unauthorized } from "@/lib/admin";
import { getStats } from "@/lib/stats";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdmin(req)) return unauthorized();
  const stats = await getStats();
  const sql = await db();
  let extra = {};
  if (sql) {
    const topClicks = await sql`select slug,
      count(*) filter (where is_bot is false and has_prior_pv is true)::int as clicks,
      count(*) filter (where is_bot is false)::int as clicks_ua_human,
      count(*) filter (where is_bot is true)::int as clicks_bot,
      count(*) filter (where is_bot is null)::int as clicks_unknown,
      count(*)::int as clicks_raw
      from outbound_clicks where created_at > now() - interval '30 days'
      group by slug order by clicks_raw desc limit 10`;
    const topPages = await sql`select path, sum(views)::int as views from pageviews where day > current_date - 30 group by path order by views desc limit 10`;
    const recentErrors = await sql`select context, message, created_at from errors order by created_at desc limit 10`;
    const recentHumanClicks = await sql`select created_at, slug, user_agent, has_prior_pv
      from outbound_clicks
      where is_bot is false
      order by created_at desc
      limit 50`;
    extra = { topClicks, topPages, recentErrors, recentHumanClicks };
  }
  return NextResponse.json({ ...stats, ...extra });
}
