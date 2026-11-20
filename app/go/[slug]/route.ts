import { NextResponse } from "next/server";
import { db, logError } from "@/lib/db";
import { getDealBySlug } from "@/lib/deals";
import { outboundUrl } from "@/lib/affiliate";
import { activeSponsor } from "@/lib/sponsor";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const referrer = (req.headers.get("referer") || "").slice(0, 300) || null;

  if (slug === "sponsor") {
    const s = await activeSponsor();
    try {
      const sql = await db();
      if (sql) await sql`insert into sponsor_clicks (sponsor_week_id, placement) values (${s?.id ?? null}, ${new URL(req.url).searchParams.get("p") || "bar"})`;
    } catch (e) {
      await logError("go.sponsor", e);
    }
    return NextResponse.redirect(s?.url || new URL("/sponsor", req.url), 302);
  }

  const deal = await getDealBySlug(slug);
  if (!deal) return NextResponse.redirect(new URL("/", req.url), 302);
  try {
    const sql = await db();
    if (sql) await sql`insert into outbound_clicks (slug, entry_id, referrer) values (${slug}, ${deal.id ?? null}, ${referrer})`;
  } catch (e) {
    await logError("go.click", e);
  }
  const res = NextResponse.redirect(outboundUrl(deal), 302);
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  return res;
}
