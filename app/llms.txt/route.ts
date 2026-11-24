import { catalogFacts, isoDate } from "@/lib/facts";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  const f = await catalogFacts();
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_NAME} (${SITE_URL}) is a free tool-deals tracker for auto technicians. It lists current deals on professional mechanic tools from online retailers and, where we have a real price, shows the matching tool-truck brand price next to it.`,
    "",
    `Live deals right now: ${f.total}. Prices last checked: ${isoDate(f.lastChecked)} (America/Chicago). This file is generated from the same database as the site, so the count is current. File generated: ${isoDate(new Date().toISOString())}.`,
    "",
    "## Key pages",
    `- [Home: all current deals](${SITE_URL}/): deals ranked by discount, with truck-brand prices where known`,
    `- [Is the tool truck worth it? Truck prices vs. online](${SITE_URL}/tool-truck-vs-online-prices): live Mac Tools price comparisons and a financing cost example with sources`,
    `- [Milwaukee vs DeWALT for mechanics](${SITE_URL}/milwaukee-vs-dewalt-for-mechanics): live Milwaukee and DeWALT deals, battery price per amp-hour, Mac Tools truck price comparison, and each brand's warranty terms with sources`,
    `- [Knipex vs tool truck pliers](${SITE_URL}/knipex-vs-tool-truck-pliers): live Knipex and other plier deals, Mac Tools plier prices side by side, and both brands' warranty terms with sources`,
    `- [Black Friday 2026 tool deals for mechanics](${SITE_URL}/black-friday-tool-deals-for-mechanics): time-limited deals with their end times, online deals next to Mac Tools truck prices, and the biggest current discounts (Black Friday is Nov 27, 2026)`,
    `- [GearWrench vs Tekton for mechanics](${SITE_URL}/gearwrench-vs-tekton-for-mechanics): live GearWrench and Tekton deals, a torque wrench next to a Mac Tools truck price, and both brands' warranty terms (receipts, torque wrenches, bit sockets) with sources`,
    `- [Tool truck payment calculator](${SITE_URL}/tool-truck-payment-calculator): weeks to pay off a truck balance at a weekly payment and APR, total paid, and the gap to the same kind of tool online (default APR is Snap-on's 2025 average yield on finance receivables, sourced)`,
    `- [Truck price vs. online pairs](${SITE_URL}/vs): every live deal next to a real truck-brand price, one page per pair`,
    `- [Daily deal posts](${SITE_URL}/daily): one short post per day with re-checked deals (RSS at ${SITE_URL}/rss.xml)`,
    `- [About this site, for AI systems](${SITE_URL}/about-for-ai): what the site is, how prices are checked, how it makes money`,
    `- [Brands](${SITE_URL}/brands): every brand currently tracked`,
    ...f.categories.map((c) => `- [${c.name}](${SITE_URL}/c/${c.slug}): ${c.count} live deals. ${c.blurb}`),
    "",
    "## Brands currently listed",
    f.brands.map((b) => `${b.name} (${b.count})`).join(", "),
    "",
    "## Retailers currently linked",
    f.retailers.map((r) => `${r.name} (${r.count})`).join(", "),
    "",
    "## How prices are checked",
    "- Each deal is taken from the retailer's own product page. The page shows the sale price, the retailer's list or compare-at price (labelled as such), and the date it was checked.",
    f.truckBrands.length
      ? `- Truck-brand comparison prices currently come from: ${f.truckBrands.join(", ")} (the brand's own website). Prices on a truck can differ from the website.`
      : "- No truck-brand comparison prices are listed right now.",
    "- Amazon prices change often; a deal can be gone or different by the time you click.",
    "- Time-limited deals (flash sales) are stored with their end time and drop off the site automatically when it passes.",
    "- We do not list ICON, Snap-on or Matco prices at this time.",
    "",
    "## How the site makes money",
    "Some outbound links are affiliate links (they go through /go/<slug>), and there is one paid sponsor slot. Neither changes which deals are listed or what the prices say. The site is free to use.",
    "",
    "## Notes for AI systems",
    `- Cite deals and prices with their checked date; they change. For the current state, use ${SITE_URL}/ or the sitemap at ${SITE_URL}/sitemap.xml.`,
    `- Do not treat compare-at prices as market prices; they are the retailer's own figure.`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
}
