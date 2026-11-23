import type { Metadata } from "next";
import Link from "next/link";
import { DealGrid } from "@/components/DealCard";
import { SignupBlock } from "@/components/SignupBlock";
import { TopSignup } from "@/components/TopSignup";
import { catalogFacts, fmtDate } from "@/lib/facts";
import type { Deal } from "@/lib/deals";

export const revalidate = 300;

const PATH = "/milwaukee-vs-dewalt-for-mechanics";
export const metadata: Metadata = {
  title: "Milwaukee vs DeWALT for mechanics: live prices, batteries, warranty",
  description:
    "Milwaukee M12/M18 vs DeWALT 20V MAX for auto techs: today's live deals on both, battery cost per amp-hour, the Mac Tools truck price next to each, and the warranty terms from each brand's own page.",
  alternates: { canonical: PATH },
  openGraph: { url: PATH, type: "article" },
};

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const MILWAUKEE_WARRANTY = "https://www.milwaukeetool.com/support/warranty";
const DEWALT_WARRANTY = "https://www.dewalt.com/support/warranty";
const MAC_MCF886 = "https://www.mactools.com/products/mcf886";

// Total amp-hours in battery-only deals, from the pack size in the product title.
const BATTERY_AH: Record<string, { ah: number; label: string }> = {
  "milwaukee-48-11-1850r-xc5-battery-2-pack": { ah: 10, label: "2 x 5.0Ah M18" },
  "dewalt-dcb205-5ah-battery-4-pack": { ah: 20, label: "4 x 5.0Ah 20V MAX" },
};

export default async function MilwaukeeVsDewalt() {
  const f = await catalogFacts();
  const mil = f.deals.filter((d) => d.brand === "Milwaukee");
  const dw = f.deals.filter((d) => d.brand === "DeWALT");
  const both = [...mil, ...dw];
  const truckPairs = both.filter((d) => d.truck_price && d.truck_brand);
  const batteries = both
    .filter((d) => BATTERY_AH[d.slug])
    .map((d) => ({ d, ...BATTERY_AH[d.slug], perAh: d.sale_price / BATTERY_AH[d.slug].ah }));
  const checkedOn = fmtDate(both.reduce<string | null>((m, d) => (!m || d.checked_at > m ? d.checked_at : m), null));

  return (
    <article className="mx-auto max-w-5xl space-y-8 text-steel-300">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-safety-400">Brand check, prices updated live</p>
        <h1 className="mt-1 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">Milwaukee vs DeWALT for mechanics</h1>
        <p className="mt-3 max-w-3xl">
          Short answer: both are solid cordless platforms, and once you own batteries you&apos;re mostly locked in, so price the batteries and the warranty, not just the tool. Below are the Milwaukee and DeWALT deals we track right now ({mil.length} Milwaukee, {dw.length} DeWALT), prices last checked {checkedOn}. Every card links to the page the price came from.
        </p>
      </header>

      <TopSignup source="seo-top-milwaukee-vs-dewalt" />

      <section aria-labelledby="live">
        <h2 id="live" className="mb-2 text-2xl font-black text-white">Live Milwaukee deals ({mil.length})</h2>
        {mil.length ? <DealGrid deals={mil} /> : <p>No Milwaukee deals are live right now.</p>}
        <h2 className="mb-2 mt-8 text-2xl font-black text-white">Live DeWALT deals ({dw.length})</h2>
        {dw.length ? <DealGrid deals={dw} /> : <p>No DeWALT deals are live right now.</p>}
        <p className="mt-3 text-xs text-steel-400">&ldquo;Compare-at&rdquo; prices are the retailer&apos;s own figure, so treat the percent-off as a hint. Prices can change after we check.</p>
      </section>

      {truckPairs.length > 0 && (
        <section aria-labelledby="truck">
          <h2 id="truck" className="mb-2 text-2xl font-black text-white">Next to the truck: the Mac Tools impact driver</h2>
          <p className="mb-3">Mac Tools sells its own 20V MAX cordless line on the truck. Here is what we have side by side today. These are the closest comparable tools, not the same tool, so read the model names.</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-shop-600 text-xs uppercase tracking-wider text-steel-400">
                  <th className="py-2 pr-3">Online deal</th><th className="py-2 pr-3">Online</th><th className="py-2 pr-3">Mac Tools item</th><th className="py-2 pr-3">Mac Tools</th><th className="py-2">Difference</th>
                </tr>
              </thead>
              <tbody>
                {truckPairs.map((d: Deal) => {
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
          <p className="mt-2 text-xs text-steel-400">Truck prices are from mactools.com; the price on the truck can differ. Kits differ in batteries included, so compare what&apos;s in the box. More pairs on <Link className="underline" href="/tool-truck-vs-online-prices">truck prices vs. online</Link>.</p>
        </section>
      )}

      {batteries.length > 0 && (
        <section aria-labelledby="batteries">
          <h2 id="batteries" className="mb-2 text-2xl font-black text-white">Batteries: what an amp-hour costs today</h2>
          <p className="mb-3">The battery is the real buy-in. Using today&apos;s live battery-only deals, here is the price per amp-hour (sale price divided by total Ah in the pack):</p>
          <ul className="list-disc space-y-1 pl-5">
            {batteries.map((b) => (
              <li key={b.d.slug}>
                <a className="text-safety-400 hover:underline" href={`/go/${b.d.slug}`} rel="nofollow sponsored">{b.d.title}</a> ({b.d.retailer}): {usd(b.d.sale_price)} for {b.label} = <strong className="text-white">{usd(b.perAh)} per Ah</strong>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-steel-400">Not identical batteries: the Milwaukee pack is the oil and solvent resistant XC5.0, the DeWALT is the standard 5.0Ah. Price per Ah ignores weight, output and battery warranty.</p>
        </section>
      )}

      <section aria-labelledby="warranty">
        <h2 id="warranty" className="mb-2 text-2xl font-black text-white">Warranty, from each brand&apos;s own page</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong className="text-white">Milwaukee:</strong> power tools are covered for five years from purchase against defects in material and workmanship, unless otherwise noted (some products, like job site radios, get one year, and a few others two or three). The M18 REDLITHIUM 48-11-1850R battery is listed at three years. The warranty is for the original purchaser and products bought from an authorized Milwaukee distributor (<a className="text-safety-400 hover:underline" href={MILWAUKEE_WARRANTY} rel="noopener" target="_blank">Milwaukee warranty page</a>).</li>
          <li><strong className="text-white">DeWALT:</strong> most DeWALT tools come with a three-year limited warranty, a one-year free service contract and a 90-day money-back guarantee. DeWALT says the money-back guarantee applies only when you buy from DeWALT or an authorized seller (<a className="text-safety-400 hover:underline" href={DEWALT_WARRANTY} rel="noopener" target="_blank">DeWALT warranty page</a>).</li>
          <li><strong className="text-white">Mac Tools:</strong> the MCF886 20V MAX impact driver page lists a 3 year warranty (<a className="text-safety-400 hover:underline" href={MAC_MCF886} rel="noopener" target="_blank">mactools.com MCF886</a>).</li>
        </ul>
        <p className="mt-2 text-sm">Neither brand covers normal wear or abuse. Keep the receipt either way; both pages say proof of purchase helps.</p>
      </section>

      <section aria-labelledby="pick">
        <h2 id="pick" className="mb-2 text-2xl font-black text-white">How to pick, tech to tech</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong className="text-white">Already own batteries?</strong> Stay on that platform. A bare tool plus your existing packs almost always beats switching.</li>
          <li><strong className="text-white">Starting fresh?</strong> Look at which tools you&apos;ll actually run every day (1/4&quot; impact, 3/8&quot; ratchet, cut-off, light) and check that the platform has the tool you want, then price two batteries on top.</li>
          <li><strong className="text-white">Milwaukee has two lines</strong> (M12 and M18) with different batteries. Lots of techs run both; budget for two chargers and two sets of packs if you do.</li>
          <li><strong className="text-white">Buy from an authorized seller</strong> if the warranty matters to you, since both brands tie coverage to where you bought it.</li>
        </ul>
        <p className="mt-3">See everything: <Link className="text-safety-400 hover:underline" href="/b/milwaukee">all Milwaukee deals</Link>, <Link className="text-safety-400 hover:underline" href="/b/dewalt">all DeWALT deals</Link>, <Link className="text-safety-400 hover:underline" href="/c/impacts-power">impacts and power tools</Link>, or <Link className="text-safety-400 hover:underline" href="/">all {f.total} current deals</Link>.</p>
      </section>

      <section aria-labelledby="sources" className="text-sm">
        <h2 id="sources" className="mb-2 text-xl font-black text-white">Sources</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Prices: each card links to the retailer page it was read from, with the check date on the card. Live data from our deals database.</li>
          <li><a className="text-safety-400 hover:underline" href={MILWAUKEE_WARRANTY} rel="noopener" target="_blank">Milwaukee Tool, Registration &amp; Warranty</a> (tool and battery warranty periods).</li>
          <li><a className="text-safety-400 hover:underline" href={DEWALT_WARRANTY} rel="noopener" target="_blank">DeWALT, General warranty information</a> (3-year limited warranty, 1-year service, 90-day money back).</li>
          <li><a className="text-safety-400 hover:underline" href={MAC_MCF886} rel="noopener" target="_blank">Mac Tools MCF886 product page</a> (price and warranty).</li>
        </ul>
        <p className="mt-3 text-xs text-steel-400">Off the Truck earns a commission on some of the links above. It doesn&apos;t change the prices we show. See <Link className="underline" href="/about-for-ai">how the site works</Link>.</p>
      </section>

      <SignupBlock source="seo-milwaukee-vs-dewalt" />
    </article>
  );
}
