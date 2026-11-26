import type { Metadata } from "next";
import Link from "next/link";
import { DealGrid } from "@/components/DealCard";
import { SignupBlock } from "@/components/SignupBlock";
import { TopSignup } from "@/components/TopSignup";
import { catalogFacts, fmtDate } from "@/lib/facts";
import type { Deal } from "@/lib/deals";

export const revalidate = 300;

const PATH = "/cordless-tool-batteries-for-mechanics";
export const metadata: Metadata = {
  title: "Cordless tool batteries for mechanics: cost per amp-hour, online vs the truck",
  description:
    "Live Milwaukee M18 and DeWALT 20V MAX battery deals with the price per amp-hour worked out, next to the Mac Tools 20V battery price from mactools.com. Sourced warranty terms, no guessed prices.",
  alternates: { canonical: PATH },
  openGraph: { url: PATH, type: "article" },
};

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const MAC_BATTERY = { url: "https://www.mactools.com/products/mcbp034g", title: "Mac Tools MCBP034G 20V 1.7Ah XR oil-resistant battery", price: 189.99, ah: 1.7, checked: "November 26, 2026" };
const MAC_KIT = "https://www.mactools.com/products/mcf886gp1d1";
const MAC_CHARGER = "https://www.mactools.com/products/dcb1104";
const MILWAUKEE_WARRANTY = "https://www.milwaukeetool.com/support/warranty";
const DEWALT_WARRANTY = "https://www.dewalt.com/en-us/support/warranty";

/** Battery-only deals (packs and battery + charger starter kits). Total Ah is read from the product title / seller page. */
const BATTERY_AH: Record<string, { ah: number; pack: string; charger?: boolean }> = {
  "dewalt-dcb205-5ah-battery-4-pack": { ah: 20, pack: "4 x 5.0Ah" },
  "dewalt-dewalt-20v-max-5-0ah-battery-2-pack-promo-dcb205-2": { ah: 10, pack: "2 x 5.0Ah" },
  "dewalt-dewalt-20v-max-4-0ah-compact-battery-dcb240": { ah: 4, pack: "1 x 4.0Ah compact" },
  "dewalt-dewalt-20v-max-3-0ah-compact-battery-charger-starter-kit-dcb230c": { ah: 3, pack: "1 x 3.0Ah + charger", charger: true },
  "milwaukee-48-11-1850r-xc5-battery-2-pack": { ah: 10, pack: "2 x XC5.0 oil/solvent resistant" },
  "milwaukee-milwaukee-m18-redlithium-high-output-xc-6-0ah-battery-starter-kit-48-5": { ah: 6, pack: "1 x HIGH OUTPUT XC6.0 + M18/M12 charger", charger: true },
};

/** Tool deals that come with batteries in the box (not battery-only). */
const comesWithBattery = (d: Deal) => !BATTERY_AH[d.slug] && /(\+|with|w\/).*(battery|batteries|\dah)|batteries\)|kit with .*ah/i.test(d.title);

const latest = (ds: Deal[]) => fmtDate(ds.reduce<string | null>((m, d) => (!m || d.checked_at > m ? d.checked_at : m), null));

export default async function CordlessBatteries() {
  const f = await catalogFacts();
  const packs = f.deals
    .filter((d) => BATTERY_AH[d.slug])
    .map((d) => ({ d, ...BATTERY_AH[d.slug], perAh: d.sale_price / BATTERY_AH[d.slug].ah }))
    .sort((a, b) => a.perAh - b.perAh);
  const bundles = f.deals.filter(comesWithBattery);
  const checkedOn = latest(packs.map((p) => p.d));
  const macPerAh = MAC_BATTERY.price / MAC_BATTERY.ah;
  const cheapest = packs[0];

  return (
    <article className="mx-auto max-w-5xl space-y-8 text-steel-300">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-safety-400">Price check, updated live</p>
        <h1 className="mt-1 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">Cordless tool batteries for mechanics: what an amp-hour costs, online vs the truck</h1>
        <p className="mt-3 max-w-3xl">
          Once you&apos;re on a platform, batteries are the part you keep buying. So the useful number isn&apos;t the price of a pack, it&apos;s the price per amp-hour. Below are the {packs.length} battery deals we track right now, prices last checked {checkedOn} on the seller&apos;s own page, worked out per Ah, next to the one 20V battery Mac Tools lists on its own website.
        </p>
      </header>

      <TopSignup source="seo-top-cordless-batteries" />

      <section aria-labelledby="per-ah">
        <h2 id="per-ah" className="mb-2 text-2xl font-black text-white">Price per amp-hour, today</h2>
        {packs.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-shop-700 text-steel-400">
                  <th className="py-2 pr-3">Battery deal</th><th className="py-2 pr-3">What&apos;s in it</th><th className="py-2 pr-3">Price</th><th className="py-2">Per Ah</th>
                </tr>
              </thead>
              <tbody>
                {packs.map((p) => (
                  <tr key={p.d.slug} className="border-b border-shop-800">
                    <td className="py-2 pr-3"><a className="text-safety-400 hover:underline" href={`/go/${p.d.slug}`} rel="nofollow sponsored noopener" target="_blank">{p.d.title}</a> at {p.d.retailer}</td>
                    <td className="py-2 pr-3">{p.pack} ({p.ah} Ah total)</td>
                    <td className="py-2 pr-3 font-mono">{usd(p.d.sale_price)}</td>
                    <td className="py-2 font-mono font-semibold text-safety-400">{usd(p.perAh)}</td>
                  </tr>
                ))}
                <tr className="border-b border-shop-800">
                  <td className="py-2 pr-3"><a className="underline decoration-shop-600 underline-offset-2 hover:text-white" href={MAC_BATTERY.url} rel="nofollow noopener" target="_blank">{MAC_BATTERY.title}</a> on mactools.com</td>
                  <td className="py-2 pr-3">1 x 1.7Ah</td>
                  <td className="py-2 pr-3 font-mono">{usd(MAC_BATTERY.price)}</td>
                  <td className="py-2 font-mono font-semibold">{usd(macPerAh)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p>No battery-only deals are live right now. <Link className="text-safety-400 hover:underline" href="/c/impacts-power">See all impact and power tool deals</Link>.</p>
        )}
        <p className="mt-2 text-xs text-steel-400">
          Per Ah = sale price divided by the total amp-hours in the box. Starter kits include a charger, so their per-Ah number is a little high for the battery alone. These are not identical batteries: the Mac pack is a compact 1.7Ah oil-resistant XR battery, the Milwaukee 2-pack is the oil and solvent resistant XC5.0, the 6.0 is Milwaukee&apos;s HIGH OUTPUT pack, and per Ah ignores weight and output. Mac price read from mactools.com on {MAC_BATTERY.checked}; the price on a truck can differ.
        </p>
        {cheapest && (
          <p className="mt-3">Today the lowest cost per amp-hour is the {cheapest.d.title} at {usd(cheapest.perAh)} per Ah. The Mac 20V battery works out to {usd(macPerAh)} per Ah, about {Math.round(macPerAh / cheapest.perAh)} times as much per amp-hour.</p>
        )}
      </section>

      <section aria-labelledby="live">
        <h2 id="live" className="mb-2 text-2xl font-black text-white">Live battery deals ({packs.length})</h2>
        {packs.length ? <DealGrid deals={packs.map((p) => p.d)} /> : <p>None live right now.</p>}
      </section>

      {bundles.length > 0 && (
        <section aria-labelledby="bundles">
          <h2 id="bundles" className="mb-2 text-2xl font-black text-white">Tool deals that come with batteries ({bundles.length})</h2>
          <p className="mb-3">If you need a tool anyway, a kit or a &quot;free battery&quot; bundle can be the cheaper way to add packs. Check what&apos;s in the box on the seller page.</p>
          <DealGrid deals={bundles} />
        </section>
      )}

      <section aria-labelledby="mac">
        <h2 id="mac" className="mb-2 text-2xl font-black text-white">What&apos;s in a Mac Tools 20V kit</h2>
        <p>
          The box contents on Mac&apos;s own <a className="text-safety-400 hover:underline" href={MAC_KIT} rel="nofollow noopener" target="_blank">MCF886GP1D1 20V MAX impact driver kit page</a> list a &quot;Dewalt 12V/20V Max Lithium-Ion Battery Charger&quot;, a &quot;Dewalt 20V MAX* Oil-Resistant 2.0AH Battery&quot; and a &quot;Dewalt 20V MAX* Oil-Resistant 5.0AH Battery&quot;. Mac also sells the DeWALT <a className="text-safety-400 hover:underline" href={MAC_CHARGER} rel="nofollow noopener" target="_blank">DCB1104 charger</a> (listed for DEWALT 12V MAX, 20V MAX and FLEXVOLT batteries) for $89.99 on its site, checked {MAC_BATTERY.checked}. If you run Mac 20V tools, read the battery part numbers in your own kit before you shop for spares.
        </p>
      </section>

      <section aria-labelledby="warranty">
        <h2 id="warranty" className="mb-2 text-2xl font-black text-white">Battery warranty, from each brand&apos;s own page</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong className="text-white">Milwaukee:</strong> the warranty page lists M18 packs including the 48-11-1850R (XC5.0 resistant) and 48-11-1865 (the HIGH OUTPUT XC6.0) at three years from date of purchase, for products bought from an authorized Milwaukee distributor (<a className="text-safety-400 hover:underline" href={MILWAUKEE_WARRANTY} rel="noopener" target="_blank">Milwaukee warranty</a>).</li>
          <li><strong className="text-white">DeWALT:</strong> the warranty page says DeWALT tools come with a 3-year limited warranty, a 1-year free service contract and a 90-day money-back guarantee, for the original end-user purchaser (<a className="text-safety-400 hover:underline" href={DEWALT_WARRANTY} rel="noopener" target="_blank">DeWALT warranty</a>).</li>
          <li><strong className="text-white">Mac Tools:</strong> the MCBP034G battery page lists a 3 year warranty (<a className="text-safety-400 hover:underline" href={MAC_BATTERY.url} rel="nofollow noopener" target="_blank">mactools.com MCBP034G</a>).</li>
        </ul>
        <p className="mt-2 text-sm">Keep the order email. Warranty pages ask for proof of purchase.</p>
      </section>

      <section aria-labelledby="pick">
        <h2 id="pick" className="mb-2 text-2xl font-black text-white">How to decide, tech to tech</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong className="text-white">Stay on the platform you own.</strong> Batteries don&apos;t cross between Milwaukee M18 and DeWALT 20V MAX. Price packs for the tools already in your box.</li>
          <li><strong className="text-white">Bigger packs are usually cheaper per Ah,</strong> but they&apos;re heavier on a 1/4&quot; driver or a ratchet. A compact pack for hand tools and a big one for the impact wrench is a common split.</li>
          <li><strong className="text-white">Holiday battery prices move.</strong> Confirm the price and stock on the seller page before you buy.</li>
        </ul>
        <p className="mt-3">More: <Link className="text-safety-400 hover:underline" href="/milwaukee-vs-dewalt-for-mechanics">Milwaukee vs DeWALT for mechanics</Link>, <Link className="text-safety-400 hover:underline" href="/impact-wrenches-for-mechanics">impact wrenches and drivers</Link>, <Link className="text-safety-400 hover:underline" href="/b/milwaukee">Milwaukee</Link>, <Link className="text-safety-400 hover:underline" href="/b/dewalt">DeWALT</Link>, <Link className="text-safety-400 hover:underline" href="/tool-truck-payment-calculator">tool truck payment calculator</Link>, <Link className="text-safety-400 hover:underline" href="/vs">every truck vs online pair</Link>, or <Link className="text-safety-400 hover:underline" href="/">all {f.total} current deals</Link>.</p>
      </section>

      <section aria-labelledby="sources" className="text-sm">
        <h2 id="sources" className="mb-2 text-xl font-black text-white">Sources</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Online prices: each card links to the seller page it was read from, with the check date on the card. Live data from our deals database.</li>
          <li><a className="text-safety-400 hover:underline" href={MAC_BATTERY.url} rel="nofollow noopener" target="_blank">mactools.com MCBP034G</a> ($189.99, 3 year warranty), <a className="text-safety-400 hover:underline" href={MAC_KIT} rel="nofollow noopener" target="_blank">MCF886GP1D1 kit contents</a>, <a className="text-safety-400 hover:underline" href={MAC_CHARGER} rel="nofollow noopener" target="_blank">DCB1104 charger</a> ($89.99). Checked {MAC_BATTERY.checked}.</li>
          <li><a className="text-safety-400 hover:underline" href={MILWAUKEE_WARRANTY} rel="noopener" target="_blank">Milwaukee Registration &amp; Warranty</a> and <a className="text-safety-400 hover:underline" href={DEWALT_WARRANTY} rel="noopener" target="_blank">DeWALT Warranty</a>. Checked {MAC_BATTERY.checked}.</li>
        </ul>
        <p className="mt-3 text-xs text-steel-400">Off the Truck earns a commission on some of the links above. It doesn&apos;t change the prices we show. See <Link className="underline" href="/about-for-ai">how the site works</Link>.</p>
      </section>

      <SignupBlock source="seo-cordless-batteries" />
    </article>
  );
}
