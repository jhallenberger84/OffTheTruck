import { NextResponse } from "next/server";
import { db, logError } from "@/lib/db";
import { isInternal } from "@/lib/internal";
import { isBotUserAgent, storedUserAgent } from "@/lib/bot";
import { getDealBySlug } from "@/lib/deals";
import { outboundUrl } from "@/lib/affiliate";
import { activeSponsor } from "@/lib/sponsor";
import { vidFromCookieHeader, hasPriorPageview } from "@/lib/visitor";

export const dynamic = "force-dynamic";

async function priorPageview(req: Request): Promise<boolean> {
  const vid = vidFromCookieHeader(req.headers.get("cookie"));
  if (!vid) return false;
  try {
    const sql = await db();
    if (!sql) return false;
    const [row] = await sql`select last_seen_at from visitor_seen where vid = ${vid}`;
    return hasPriorPageview(row?.last_seen_at as Date | string | undefined);
  } catch {
    return false;
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const internal = isInternal(req.headers);
  const referrer = (req.headers.get("referer") || "").slice(0, 300) || null;
  const userAgent = storedUserAgent(req.headers.get("user-agent"));
  const isBot = isBotUserAgent(userAgent);
  const hasPriorPv = internal ? false : await priorPageview(req);

  if (slug === "sponsor") {
    const s = await activeSponsor();
    try {
      const sql = await db();
      if (sql && !internal) {
        await sql`insert into sponsor_clicks (sponsor_week_id, placement, is_bot, user_agent, has_prior_pv) values (${s?.id ?? null}, ${new URL(req.url).searchParams.get("p") || "bar"}, ${isBot}, ${userAgent}, ${hasPriorPv})`;
      }
    } catch (e) {
      await logError("go.sponsor", e);
    }
    return NextResponse.redirect(s?.url || new URL("/sponsor", req.url), 302);
  }

  const deal = await getDealBySlug(slug);
  if (!deal) return NextResponse.redirect(new URL("/", req.url), 302);
  try {
    const sql = await db();
    if (sql && !internal) {
      await sql`insert into outbound_clicks (slug, entry_id, referrer, is_bot, user_agent, has_prior_pv) values (${slug}, ${deal.id ?? null}, ${referrer}, ${isBot}, ${userAgent}, ${hasPriorPv})`;
    }
  } catch (e) {
    await logError("go.click", e);
  }
  const res = NextResponse.redirect(outboundUrl(deal), 302);
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  return res;
}
