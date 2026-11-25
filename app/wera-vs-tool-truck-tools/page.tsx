import type { Metadata } from "next";
import Link from "next/link";
import { DealGrid } from "@/components/DealCard";
import { SignupBlock } from "@/components/SignupBlock";
import { TopSignup } from "@/components/TopSignup";
import { catalogFacts, fmtDate } from "@/lib/facts";
import { categoryName } from "@/lib/site";
import type { Deal } from "@/lib/deals";

export const revalidate = 300;

const PATH = "/wera-vs-tool-truck-tools";
export const metadata: Metadata = {
  title: "Is Wera worth it? Wera vs tool truck prices for mechanics",
  description:
    "Live Wera deals (Joker ratcheting wrenches, Zyklop, Kraftform, Click-Torque) with prices checked on the seller's page, a Wera Joker set next to a Mac Tools ratcheting wrench set, and what Wera's warranty says about bits and bit holders.",
  alternates: { canonical: PATH },
  openGraph: { url: PATH, type: "article" },
};

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const WERA_WARRANTY = "https://22518787.hs-sites.com/wera-tools-warranty-submission";
const WERA_SUPPORT = "https://www.weratools.com/en-us/service-support";
const KC_WARRANTIES = "https://kctool.com/pages/lifetime-warranties";
const MAC_CHECKED = "November 24, 2026";

/** Mac Tools prices read from mactools.com product pages on 2026-11-24. The Wera side is the live deal from our database. */
const PAIRS = [
  {
    weraSlug: "wera-joker-11-long-ratcheting-wrench-set",
    mac: { title: "Mac Tools SRWMO212PTB 12-pc. Metric Reversible Ratcheting Wrench Set, 12-pt.", price: 399.99, url: "https://www.mactools.com/products/srwmo212ptb" },
    match: "Close match: both are metric ratcheting combination wrench sets. Wera: 11 wrenches, 8 and 10-19 mm, 80-tooth ratchet, holding plate in the open end, roll pouch. Mac: 12 wrenches, 7, 8 and 10-19 mm, plastic holder.",
  },
];

const latest = (ds: Deal[]) => fmtDate(ds.reduce<string | null>((m, d) => (!m || d.checked_at > m ? d.checked_at : m), null));

export default async function WeraVsToolTruck() {
  const f = await catalogFacts();
  const wera = f.deals.filter((d) => d.brand === "Wera");
  const pairs = PAIRS.map((p) => ({ ...p, deal: wera.find((d) => d.slug === p.weraSlug) })).filter((p) => p.deal);
  const cats = [...new Set(wera.map((d) => d.category))];
  const checkedOn = latest(wera);
  const joker = pairs.find((p) => p.weraSlug === PAIRS[0].weraSlug);

  return (
    <article className="mx-auto max-w-5xl space-y-8 text-steel-300">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-safety-400">Brand check, prices updated live</p>
        <h1 className="mt-1 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">Is Wera worth it? Wera vs tool truck prices</h1>
        <p className="mt-3 max-w-3xl">
          Wera gets talked about as the online brand that&apos;s as good as the truck. It isn&apos;t always cheaper, though, and its warranty has a line every tech should read before buying a bit set. Here are the {wera.length} Wera deals we track right now, prices last checked {checkedOn} on the seller&apos;s own page, then a Wera set next to a Mac Tools truck price, then the warranty, with sources.
        </p>
      </header>

      <TopSignup source="seo-top-wera-vs-tool-truck" />

      <section aria-labelledby="live-wera">
        <h2 id="live-wera" className="mb-2 text-2xl font-black text-white">Live Wera deals ({wera.length})</h2>
        {wera.length ? <DealGrid deals={wera} /> : <p>No Wera deals are live right now.</p>}
        <p className="mt-3 text-xs text-steel-400">&ldquo;List&rdquo; and &ldquo;compare-at&rdquo; prices are the seller&apos;s own figure, so treat the percent-off as a hint. Prices can change after we check.</p>
      </section>

      {pairs.length > 0 && (
        <section aria-labelledby="truck">
          <h2 id="truck" className="mb-2 text-2xl font-black text-white">Next to a Mac Tools price</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-shop-600 text-xs uppercase tracking-wider text-steel-400">
                  <th className="py-2 pr-3">Wera deal</th><th className="py-2 pr-3">Online</th><th className="py-2 pr-3">Mac Tools item</th><th className="py-2 pr-3">Mac site</th><th className="py-2">Difference</th>
                </tr>
              </thead>
              <tbody>
                {pairs.map((p) => {
                  const d = p.deal as Deal;
                  const save = p.mac.price - d.sale_price;
                  return (
                    <tr key={p.weraSlug} className="border-b border-shop-700 align-top">
                      <td className="py-2 pr-3 text-white"><a className="hover:underline" href={`/go/${d.slug}`} rel="nofollow sponsored">{d.title}</a> <span className="text-steel-400">({d.retailer})</span><p className="mt-1 text-xs text-steel-400">{p.match}</p></td>
                      <td className="py-2 pr-3 font-mono">{usd(d.sale_price)}</td>
                      <td className="py-2 pr-3"><a className="text-safety-400 hover:underline" href={p.mac.url} rel="nofollow noopener" target="_blank">{p.mac.title}</a></td>
                      <td className="py-2 pr-3 font-mono">{usd(p.mac.price)}</td>
                      <td className={`py-2 font-mono ${save > 0 ? "text-green-400" : "text-amber-300"}`}>{save > 0 ? `${usd(save)} less online` : `${usd(-save)} less on the Mac site`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-steel-400">Mac Tools prices are from mactools.com, checked {MAC_CHECKED}; the price on the truck can differ. Wera prices are live from the seller page on each card.</p>
          {joker && (joker.deal as Deal).sale_price > joker.mac.price && (
            <p className="mt-3">Yes, you read that right: even on sale, this Wera Joker set costs more than Mac&apos;s list price on its own website for a 12-piece metric ratcheting set. If you want Joker features (the holding plate, the 80-tooth ring, the long pattern), you&apos;re paying for those, not saving money. If you only want a metric ratcheting set, look at the price first, and remember a truck balance adds interest: run it through the <Link className="text-safety-400 hover:underline" href="/tool-truck-payment-calculator">tool truck payment calculator</Link>.</p>
          )}
        </section>
      )}

      <section aria-labelledby="warranty">
        <h2 id="warranty" className="mb-2 text-2xl font-black text-white">Wera&apos;s warranty, in its own words</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong className="text-white">Hand tools:</strong> a limited lifetime warranty covering breakage caused by defects in materials or workmanship &ldquo;throughout the product&apos;s normal lifespan.&rdquo;</li>
          <li><strong className="text-white">Not covered:</strong> tools that have been altered, abused, misused, neglected or stored improperly.</li>
          <li><strong className="text-white">Bits, bit holders and L-keys are not covered.</strong> Wera classifies them as &ldquo;consumable&rdquo; items. That matters for sets like the Kraftform Kompakt or Tool-Check, which are mostly bits and a bit holder.</li>
          <li><strong className="text-white">Inspection:</strong> Wera may inspect a claim before replacing the tool, and may ask you to send the tool in if photos or videos aren&apos;t enough. Claims start on Wera&apos;s online warranty form.</li>
          <li><strong className="text-white">Torque tools:</strong> Wera&apos;s own form page doesn&apos;t give a torque term. Retailers that publish Wera&apos;s policy (for example <a className="text-safety-400 hover:underline" href={KC_WARRANTIES} rel="noopener" target="_blank">KC Tool</a>) quote it as up to 5,000 torque cycles within one year of purchase, and say return shipping isn&apos;t included but replacements are sent at no cost. Confirm with Wera before you count on it.</li>
        </ul>
        <p className="mt-2 text-xs text-steel-400">From <a className="underline" href={WERA_WARRANTY} rel="noopener" target="_blank">Wera Tools Warranty Submission</a> (linked from <a className="underline" href={WERA_SUPPORT} rel="noopener" target="_blank">weratools.com Service &amp; support</a>), checked November 24, 2026. Terms can change; read the full text before you rely on it.</p>
      </section>

      <section aria-labelledby="pick">
        <h2 id="pick" className="mb-2 text-2xl font-black text-white">How to decide, tech to tech</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong className="text-white">Don&apos;t assume Wera is the cheap option.</strong> Compare the exact set: count the wrenches and the sizes.{joker && (joker.deal as Deal).sale_price > joker.mac.price ? " Above, the Mac set has one more wrench (7 mm) and costs less on Mac's site." : " When we last had the Wera Joker 11-piece set live (KC Tool, $489.91 on November 24, 2026), Mac's 12-piece metric ratcheting set was $399.99 on mactools.com: one more wrench (7 mm) and less money."}</li>
          <li><strong className="text-white">Buying a bit set?</strong> Wera&apos;s warranty doesn&apos;t cover bits or bit holders. Budget for replacing bits the same as you would with any brand.</li>
          <li><strong className="text-white">Paying cash vs. a truck balance.</strong> A truck price on a weekly payment costs more than the sticker if there&apos;s interest. The <Link className="text-safety-400 hover:underline" href="/tool-truck-payment-calculator">payment calculator</Link> shows how much.</li>
        </ul>
        <p className="mt-3">Shop these by category: {cats.map((c, i) => (<span key={c}>{i ? ", " : ""}<Link className="text-safety-400 hover:underline" href={`/c/${c}`}>{categoryName(c)}</Link></span>))}. Brand page: <Link className="text-safety-400 hover:underline" href="/b/wera">Wera</Link>. Also see <Link className="text-safety-400 hover:underline" href="/vs">every truck vs online pair</Link>, <Link className="text-safety-400 hover:underline" href="/gearwrench-vs-tekton-for-mechanics">GearWrench vs Tekton</Link>, <Link className="text-safety-400 hover:underline" href="/knipex-vs-tool-truck-pliers">Knipex vs tool truck pliers</Link>, or <Link className="text-safety-400 hover:underline" href="/">all {f.total} current deals</Link>.</p>
      </section>

      <section aria-labelledby="sources" className="text-sm">
        <h2 id="sources" className="mb-2 text-xl font-black text-white">Sources</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Wera prices: each card links to the seller page it was read from, with the check date on the card. Live data from our deals database.</li>
          <li>Mac Tools price and set contents: <a className="text-safety-400 hover:underline" href={PAIRS[0].mac.url} rel="nofollow noopener" target="_blank">SRWMO212PTB</a> on mactools.com, checked {MAC_CHECKED}.</li>
          <li>Wera Joker set contents (sizes, 80-tooth ratchet, holding plate): the KC Tool product page on the card.</li>
          <li><a className="text-safety-400 hover:underline" href={WERA_WARRANTY} rel="noopener" target="_blank">Wera Tools Warranty Submission</a> (lifetime coverage, exclusions, consumables, inspection). Checked November 24, 2026.</li>
          <li><a className="text-safety-400 hover:underline" href={KC_WARRANTIES} rel="noopener" target="_blank">KC Tool, Lifetime Warranties</a> (retailer&apos;s copy of Wera&apos;s policy, including the torque term and shipping). Checked November 24, 2026.</li>
        </ul>
        <p className="mt-3 text-xs text-steel-400">Off the Truck earns a commission on some of the links above. It doesn&apos;t change the prices we show. See <Link className="underline" href="/about-for-ai">how the site works</Link>.</p>
      </section>

      <SignupBlock source="seo-wera-vs-tool-truck" />
    </article>
  );
}
