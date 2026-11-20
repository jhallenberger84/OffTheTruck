import { render } from "@react-email/render";
import { writeFileSync } from "node:fs";
import WeeklyDeals from "../emails/WeeklyDeals";
import seed from "../lib/seed.json";

// Same ranking as the site: featured first, then capped % off.
const off = (d: any) => Math.round((1 - d.sale_price / d.list_price) * 100);
const score = (d: any) => (d.featured ? 1000 : 0) + Math.min(off(d), 40) + (d.truck_price && d.truck_price > d.sale_price ? 10 : 0);
const picks = [...(seed as any[])].sort((a, b) => score(b) - score(a) || off(b) - off(a)).slice(0, 5);
const siteUrl = process.env.SITE_URL || "https://offthetruckhq.com";
(async () => {
  const el = WeeklyDeals({ picks, siteUrl, dateLabel: "November 19, 2026" });
  writeFileSync(process.argv[2] || "newsletter.html", await render(el));
  writeFileSync((process.argv[2] || "newsletter.html").replace(/\.html$/, ".txt"), await render(el, { plainText: true }));
  console.log(picks.map((p) => p.slug).join("\n"));
})();
