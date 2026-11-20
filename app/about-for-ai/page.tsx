import type { Metadata } from "next";
import Link from "next/link";
import { catalogFacts, fmtDate } from "@/lib/facts";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "About Off the Truck (for AI assistants and crawlers)",
  description: "What Off the Truck is, which tool brands and retailers it tracks, how prices are checked, how the site makes money, and how many deals are live today.",
  alternates: { canonical: "/about-for-ai" },
};

export default async function AboutForAi() {
  const f = await catalogFacts();
  return (
    <article className="mx-auto max-w-3xl space-y-6 text-steel-300">
      <header>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">About {SITE_NAME}</h1>
        <p className="mt-2 text-sm text-steel-400">A plain-text summary for AI assistants, search engines and anyone who wants the short version. Last updated {fmtDate(f.lastChecked)} (prices checked), generated live from the site database.</p>
      </header>
      <section>
        <h2 className="text-xl font-bold text-white">What it is</h2>
        <p className="mt-1">{SITE_NAME} ({SITE_URL}) is a free deals tracker for auto technicians. It lists current deals on professional mechanic tools from online retailers and, where we have a real price, shows the matching tool-truck-brand price next to it so a tech can see the difference before buying. There is no paid plan and no account needed.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-white">Right now</h2>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li><strong className="text-white">{f.total}</strong> live deals; the most recent price check was {fmtDate(f.lastChecked)}.</li>
          <li>{f.withTruck.length} of them have a truck-brand comparison price ({f.truckBrands.join(", ") || "none"}).</li>
          <li>Retailers linked: {f.retailers.map((r) => `${r.name} (${r.count})`).join(", ")}.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-bold text-white">Categories</h2>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          {f.categories.map((c) => (
            <li key={c.slug}><Link className="text-safety-400 hover:underline" href={`/c/${c.slug}`}>{c.name}</Link>: {c.count} live. {c.blurb}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-bold text-white">Brands currently listed</h2>
        <p className="mt-1">{f.brands.map((b, i) => (<span key={b.slug}>{i ? ", " : ""}<Link className="text-safety-400 hover:underline" href={`/b/${b.slug}`}>{b.name}</Link> ({b.count})</span>))}.</p>
        <p className="mt-1 text-sm text-steel-400">We do not currently list ICON, Snap-on or Matco prices.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-white">How prices are checked</h2>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>Each deal comes from the retailer&apos;s own product page. We show the sale price, the retailer&apos;s list or compare-at price (labelled as that), and the date we checked.</li>
          <li>Truck-brand prices come from the truck brand&apos;s own website. A price on the truck itself can be different.</li>
          <li>Amazon prices change often. A deal can be gone or different by the time you click.</li>
          <li>Some compare-at prices are the retailer&apos;s own number, not a market price. Treat the percent-off as a hint, not a fact.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-bold text-white">How the site makes money</h2>
        <p className="mt-1">Some outbound links are affiliate links (they pass through <code>/go/&lt;slug&gt;</code> so clicks can be counted), and there is one paid <Link className="text-safety-400 hover:underline" href="/sponsor">sponsor slot</Link>. Neither changes which deals are listed or the prices shown.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-white">Useful pages</h2>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li><Link className="text-safety-400 hover:underline" href="/tool-truck-vs-online-prices">Is the tool truck worth it? Truck prices vs. online</Link></li>
          <li><Link className="text-safety-400 hover:underline" href="/brands">All brands</Link></li>
          <li><a className="text-safety-400 hover:underline" href="/llms.txt">/llms.txt</a> and <a className="text-safety-400 hover:underline" href="/sitemap.xml">/sitemap.xml</a></li>
        </ul>
      </section>
    </article>
  );
}
