import { getDailyPosts, usd } from "@/lib/daily";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const posts = getDailyPosts().slice(0, 30);
  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/daily/${p.date}`;
      const deals = p.deals.map((d) => `${d.title}: ${usd(d.sale_price)} at ${d.retailer}`).join(" | ");
      return `<item><title>${esc(p.subject)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(`${p.date}T12:00:00Z`).toUTCString()}</pubDate><description>${esc(`${p.summary} ${deals}`.trim())}</description></item>`;
    })
    .join("");
  const last = posts[0] ? `<lastBuildDate>${new Date(`${posts[0].date}T12:00:00Z`).toUTCString()}</lastBuildDate>` : "";
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${SITE_NAME}: daily deals</title><link>${SITE_URL}/daily</link><description>One real tool deal a day for auto techs, with the truck-brand price next to it.</description><language>en-us</language><atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>${last}${items}</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
}
