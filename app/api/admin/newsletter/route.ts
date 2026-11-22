import { render } from "@react-email/render";
import { NextResponse } from "next/server";
import WeeklyDeals from "@/emails/WeeklyDeals";
import { isAdmin, unauthorized } from "@/lib/admin";
import { getActiveDeals } from "@/lib/deals";
import { activeSponsor } from "@/lib/sponsor";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/newsletter           -> rendered HTML of the daily top-5 email (top 5 live deals)
 * GET /api/admin/newsletter?format=json -> { subject, html, text, picks } ready for a Resend Broadcast.
 * This endpoint never sends anything.
 */
export async function GET(req: Request) {
  if (!isAdmin(req)) return unauthorized();
  const picks = (await getActiveDeals()).slice(0, 5);
  const s = await activeSponsor();
  const dateLabel = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Chicago" });
  const el = WeeklyDeals({ picks, siteUrl: SITE_URL, dateLabel, sponsor: s ? { name: s.sponsor_name, url: `${SITE_URL}/go/sponsor?p=email` } : undefined });
  const html = await render(el);
  if (new URL(req.url).searchParams.get("format") === "json") {
    const text = await render(el, { plainText: true });
    return NextResponse.json({ subject: `5 tool deals worth a look: ${picks[0]?.brand ?? ""} and more`, html, text, picks: picks.map((p) => p.slug) });
  }
  return new NextResponse(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
