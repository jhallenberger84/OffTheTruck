import type { Metadata } from "next";
import Link from "next/link";
import { DealGrid } from "@/components/DealCard";
import { SignupBlock } from "@/components/SignupBlock";
import { TopSignup } from "@/components/TopSignup";
import { ShareBar } from "@/components/ShareBar";
import { catalogFacts, fmtDate } from "@/lib/facts";
import { pctOff, type Deal } from "@/lib/deals";

export const revalidate = 300;

const PATH = "/black-friday-tool-deals-for-mechanics";
export const metadata: Metadata = {
  title: "Black Friday 2026 tool deals for mechanics: live prices vs the truck",
  description:
    "Black Friday 2026 tool deals for auto techs, checked against the retailer's own page: flash sales with their end time, deals next to a real Mac Tools truck price, and the biggest discounts on Milwaukee, DeWALT, GearWrench, Knipex, Tekton and more.",
  alternates: { canonical: PATH },
  openGraph: { url: PATH, type: "article" },
};

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const MILWAUKEE_WARRANTY = "https://www.milwaukeetool.com/support/warranty";
const GEARWRENCH_WARRANTY = "https://www.gearwrench.com/warranty";

/** expires_at comes straight from the DB row (Date or ISO string); not every deal has one. */
function expiresAt(d: Deal): Date | null {
  const v = (d as unknown as { expires_at?: string | Date | null }).expires_at;
  if (!v) return null;
  const t = new Date(v);
  return Number.isNaN(t.getTime()) ? null : t;
}

const fmtEnd = (t: Date) => {
  const ct = t.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" });
  const et = t.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });
  return `${ct} CT (${et} ET)`;
};

export default async function BlackFridayToolDeals() {
  const f = await catalogFacts();
  const timed = f.deals
    .map((d) => ({ d, end: expiresAt(d) }))
    .filter((x): x is { d: Deal; end: Date } => x.end !== null && x.end.getTime() > Date.now())
    .sort((a, b) => a.end.getTime() - b.end.getTime());
  const timedSlugs = new Set(timed.map((x) => x.d.slug));
  const truckPairs = f.withTruck.slice().sort((a, b) => ((b.truck_price as number) - b.sale_price) - ((a.truck_price as number) - a.sale_price));
  const onlineCheaper = truckPairs.filter((d) => (d.truck_price as number) > d.sale_price).length;
  const biggest = f.deals
    .filter((d) => !timedSlugs.has(d.slug) && pctOff(d) > 0)
    .sort((a, b) => pctOff(b) - pctOff(a))
    .slice(0, 9);
  const lastChecked = fmtDate(f.lastChecked);
  const truckChecked = fmtDate(truckPairs.reduce<string | null>((m, d) => (d.truck_checked_at && (!m || d.truck_checked_at > m) ? d.truck_checked_at : m), null));

  return (
    <article className="mx-auto max-w-5xl space-y-8 text-steel-300">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-safety-400">Black Friday 2026, prices updated live</p>
        <h1 className="mt-1 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">Black Friday tool deals for mechanics</h1>
        <p className="mt-3 max-w-3xl">
          Black Friday is Friday, November 27, 2026, and Cyber Monday is November 30, but retailers are already running sales. This page lists the {f.total} tool deals we track right now, prices last checked {lastChecked}, pulled from the retailer&apos;s own product page. Time-limited deals are at the top with their end time, then the deals we can put next to a real tool-truck price ({truckPairs.length} today, {onlineCheaper} cheaper online), then the biggest discounts. Every card links to the page the price came from.
        </p>
      </header>

      <TopSignup source="seo-top-black-friday" />

      <section aria-labelledby="ending">
        <h2 id="ending" className="mb-2 text-2xl font-black text-white">Ending soon ({timed.length})</h2>
        {timed.length ? (
          <>
            <ul className="mb-3 list-disc space-y-1 pl-5 text-sm">
              {timed.map(({ d, end }) => (
                <li key={d.slug}>
                  <a className="text-white hover:underline" href={`/go/${d.slug}`} rel="nofollow sponsored">{d.title}</a>: {usd(d.sale_price)} at {d.retailer}
                  {d.list_price > d.sale_price ? <> (retailer&apos;s compare-at {usd(d.list_price)})</> : null}. Comes off this page {fmtEnd(end)}{d.notes ? <>. Retailer terms we noted: {d.notes}</> : null}
                </li>
              ))}
            </ul>
            <DealGrid deals={timed.map((x) => x.d)} />
          </>
        ) : (
          <p>No time-limited deals are listed right now. Check back; flash deals show up here with their end time.</p>
        )}
      </section>

      {truckPairs.length > 0 && (
        <section aria-labelledby="truck">
          <h2 id="truck" className="mb-2 text-2xl font-black text-white">Online deal vs. the truck price</h2>
          <p className="mb-3">Before you buy off the truck this month, here is the closest Mac Tools item we could match for each deal, with both prices. Read the model names: these are close matches, not always the same tool.</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-shop-600 text-xs uppercase tracking-wider text-steel-400">
                  <th className="py-2 pr-3">Online deal</th><th className="py-2 pr-3">Online</th><th className="py-2 pr-3">Truck item</th><th className="py-2 pr-3">Truck site</th><th className="py-2">Difference</th>
                </tr>
              </thead>
              <tbody>
                {truckPairs.map((d) => {
                  const save = (d.truck_price as number) - d.sale_price;
                  return (
                    <tr key={d.slug} className="border-b border-shop-700 align-top">
                      <td className="py-2 pr-3 text-white"><a className="hover:underline" href={`/go/${d.slug}`} rel="nofollow sponsored">{d.title}</a> <span className="text-steel-400">({d.retailer})</span></td>
                      <td className="py-2 pr-3 font-mono">{usd(d.sale_price)}</td>
                      <td className="py-2 pr-3"><a className="text-safety-400 hover:underline" href={d.truck_url ?? "#"} rel="nofollow noopener" target="_blank">{d.truck_title}</a></td>
                      <td className="py-2 pr-3 font-mono">{usd(d.truck_price as number)}</td>
                      <td className={`py-2 font-mono ${save > 0 ? "text-green-400" : "text-amber-300"}`}>{save > 0 ? `${usd(save)} less online` : `${usd(-save)} less on the truck site`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-steel-400">Truck prices are from the truck brand&apos;s own website, last checked {truckChecked}; the price on the truck, and any truck holiday promo, can differ. We don&apos;t list Snap-on or Matco prices. More on this: <Link className="underline" href="/tool-truck-vs-online-prices">is the tool truck worth it?</Link></p>
        </section>
      )}

      <section aria-labelledby="biggest">
        <h2 id="biggest" className="mb-2 text-2xl font-black text-white">Biggest discounts right now</h2>
        {biggest.length ? <DealGrid deals={biggest} /> : <p>No discounted deals are listed right now.</p>}
        <p className="mt-3 text-xs text-steel-400">The percent off is against the retailer&apos;s own compare-at or list price, which is their figure, not a market price. Treat it as a hint. Amazon prices change often, and any price can change after we check.</p>
      </section>

      <section aria-labelledby="cats">
        <h2 id="cats" className="mb-2 text-2xl font-black text-white">Shop by category</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {f.categories.map((c) => (
            <li key={c.slug}><Link className="text-safety-400 hover:underline" href={`/c/${c.slug}`}>{c.name}</Link> <span className="text-steel-400">({c.count} live)</span></li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tips">
        <h2 id="tips" className="mb-2 text-2xl font-black text-white">Black Friday buying, tech to tech</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong className="text-white">Price the batteries, not just the tool.</strong> If you&apos;re already on a platform, a battery or kit deal is usually worth more than a bare tool. We work out cost per amp-hour on <Link className="text-safety-400 hover:underline" href="/milwaukee-vs-dewalt-for-mechanics">Milwaukee vs DeWALT</Link>.</li>
          <li><strong className="text-white">Keep the order email.</strong> GearWrench says that for online purchases it may ask for proof of purchase on a warranty claim (<a className="text-safety-400 hover:underline" href={GEARWRENCH_WARRANTY} rel="noopener" target="_blank">GearWrench warranty</a>). Milwaukee says its warranty comes with tools bought from an authorized Milwaukee distributor, recommends keeping the receipt, and lists the M18 REDLITHIUM 48-11-1850R battery at three years (<a className="text-safety-400 hover:underline" href={MILWAUKEE_WARRANTY} rel="noopener" target="_blank">Milwaukee warranty</a>).</li>
          <li><strong className="text-white">Don&apos;t put a sale on a weekly payment.</strong> A discount doesn&apos;t help if it ends up on a truck account with interest. See the financing example on <Link className="text-safety-400 hover:underline" href="/tool-truck-vs-online-prices">truck prices vs. online</Link>.</li>
          <li><strong className="text-white">Buy what you&apos;ll use this month.</strong> A tool that saves you time on jobs you already do pays back. A deep discount on something that sits in the box doesn&apos;t.</li>
        </ul>
        <p className="mt-3">Also see <Link className="text-safety-400 hover:underline" href="/knipex-vs-tool-truck-pliers">Knipex vs tool truck pliers</Link>, the <Link className="text-safety-400 hover:underline" href="/daily">daily deal post</Link>, or <Link className="text-safety-400 hover:underline" href="/">all {f.total} current deals</Link>.</p>
      </section>

      <p className="text-sm text-steel-300">Paying weekly on the truck? <Link className="font-semibold text-safety-400 hover:underline" href="/tool-truck-payment-calculator">Run it through the payment calculator</Link> or see <Link className="font-semibold text-safety-400 hover:underline" href="/vs">every truck vs. online price pair</Link>.</p>

      <ShareBar path={PATH} text="Black Friday tool deals for mechanics, next to the truck price. Checked daily." source="black-friday" />

      <section aria-labelledby="sources" className="text-sm">
        <h2 id="sources" className="mb-2 text-xl font-black text-white">Sources</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Prices: each card links to the retailer page it was read from, with the check date on the card. Live data from our deals database; end times are the ones we recorded from the retailer when we added the deal.</li>
          <li>Truck prices: the Mac Tools product page linked in each row.</li>
          <li><a className="text-safety-400 hover:underline" href={MILWAUKEE_WARRANTY} rel="noopener" target="_blank">Milwaukee Tool, Registration &amp; Warranty</a> (authorized distributor, keep your receipt, battery warranty periods). Checked November 22, 2026.</li>
          <li><a className="text-safety-400 hover:underline" href={GEARWRENCH_WARRANTY} rel="noopener" target="_blank">GEARWRENCH warranty</a> (proof of purchase for online purchases). Checked November 22, 2026.</li>
        </ul>
        <p className="mt-3 text-xs text-steel-400">Off the Truck earns a commission on some of the links above. It doesn&apos;t change the prices we show. See <Link className="underline" href="/about-for-ai">how the site works</Link>.</p>
      </section>

      <SignupBlock source="seo-black-friday" />
    </article>
  );
}
