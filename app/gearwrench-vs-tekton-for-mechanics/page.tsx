import type { Metadata } from "next";
import Link from "next/link";
import { DealGrid } from "@/components/DealCard";
import { SignupBlock } from "@/components/SignupBlock";
import { TopSignup } from "@/components/TopSignup";
import { catalogFacts, fmtDate } from "@/lib/facts";
import { categoryName } from "@/lib/site";
import type { Deal } from "@/lib/deals";

export const revalidate = 300;

const PATH = "/gearwrench-vs-tekton-for-mechanics";
export const metadata: Metadata = {
  title: "GearWrench vs Tekton for mechanics: live prices and warranty side by side",
  description:
    "GearWrench or Tekton? Today's live GearWrench and Tekton deals, prices checked on the seller's own page, a torque wrench next to a Mac Tools truck price, and what each brand's warranty actually says about receipts, torque wrenches and bit sockets.",
  alternates: { canonical: PATH },
  openGraph: { url: PATH, type: "article" },
};

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const GEARWRENCH_WARRANTY = "https://www.gearwrench.com/warranty";
const TEKTON_WARRANTY = "https://www.tekton.com/our-warranty";
const TEKTON_CLAIM = "https://www.tekton.com/warranty";

const latest = (ds: Deal[]) => fmtDate(ds.reduce<string | null>((m, d) => (!m || d.checked_at > m ? d.checked_at : m), null));

export default async function GearwrenchVsTekton() {
  const f = await catalogFacts();
  const gw = f.deals.filter((d) => d.brand === "GearWrench");
  const tk = f.deals.filter((d) => d.brand === "Tekton");
  const both = [...gw, ...tk];
  const truckPairs = both.filter((d) => d.truck_price && d.truck_brand);
  const outlet = tk.filter((d) => /outlet/i.test(d.condition ?? "") || /outlet/i.test(d.retailer));
  const cats = [...new Set(both.map((d) => d.category))];
  const checkedOn = latest(both);

  return (
    <article className="mx-auto max-w-5xl space-y-8 text-steel-300">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-safety-400">Brand check, prices updated live</p>
        <h1 className="mt-1 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">GearWrench vs Tekton for mechanics</h1>
        <p className="mt-3 max-w-3xl">
          Both are the brands techs reach for when they want good hand tools without truck prices. The real differences are in the warranty fine print and where you can buy them, so that&apos;s what this page lays out, with sources. First, the {gw.length} GearWrench and {tk.length} Tekton deals we track right now, prices last checked {checkedOn} on the seller&apos;s own page. Every card links to the page the price came from.
        </p>
      </header>

      <TopSignup source="seo-top-gearwrench-vs-tekton" />

      <section aria-labelledby="live-gw">
        <h2 id="live-gw" className="mb-2 text-2xl font-black text-white">Live GearWrench deals ({gw.length})</h2>
        {gw.length ? <DealGrid deals={gw} /> : <p>No GearWrench deals are live right now.</p>}
      </section>

      <section aria-labelledby="live-tk">
        <h2 id="live-tk" className="mb-2 text-2xl font-black text-white">Live Tekton deals ({tk.length})</h2>
        {tk.length ? <DealGrid deals={tk} /> : <p>No Tekton deals are live right now.</p>}
        {outlet.length > 0 && (
          <p className="mt-3 text-sm">{outlet.length} of these {outlet.length === 1 ? "is" : "are"} from Tekton&apos;s outlet, where items are marked discontinued. Tekton says that if a tool is discontinued without a direct replacement, it issues a credit greater than the tool&apos;s last MSRP to use on Tekton.com (<a className="text-safety-400 hover:underline" href={TEKTON_WARRANTY} rel="noopener" target="_blank">Tekton warranty</a>).</p>
        )}
        <p className="mt-3 text-xs text-steel-400">&ldquo;List,&rdquo; &ldquo;typical&rdquo; and &ldquo;original&rdquo; prices are the seller&apos;s own figure, so treat the percent-off as a hint. Amazon prices change often. Prices can change after we check.</p>
      </section>

      {truckPairs.length > 0 && (
        <section aria-labelledby="truck">
          <h2 id="truck" className="mb-2 text-2xl font-black text-white">Next to a truck price</h2>
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
                      <td className="py-2 pr-3"><a className="text-safety-400 hover:underline" href={d.truck_url ?? "#"} rel="nofollow noopener" target="_blank">{d.truck_title}</a> <span className="text-steel-400">({d.truck_brand})</span></td>
                      <td className="py-2 pr-3 font-mono">{usd(d.truck_price as number)}</td>
                      <td className={`py-2 font-mono ${save > 0 ? "text-green-400" : "text-amber-300"}`}>{save > 0 ? `${usd(save)} less online` : `${usd(-save)} less on the truck site`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-steel-400">Truck prices are from the truck brand&apos;s own website; the price on the truck can differ. Check the item counts: a set is not always the same as a single tool. More: <Link className="underline" href="/tool-truck-vs-online-prices">is the tool truck worth it?</Link></p>
        </section>
      )}

      <section aria-labelledby="warranty">
        <h2 id="warranty" className="mb-2 text-2xl font-black text-white">Warranty: what each brand&apos;s own page says</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-shop-600 text-xs uppercase tracking-wider text-steel-400">
                <th className="py-2 pr-3"></th><th className="py-2 pr-3">GearWrench</th><th className="py-2">Tekton</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-shop-700 align-top">
                <td className="py-2 pr-3 text-white">Hand tools</td>
                <td className="py-2 pr-3">Lifetime of the original end-user purchaser</td>
                <td className="py-2">No time limits: &ldquo;It doesn&apos;t matter when you got the tool or how old it is.&rdquo;</td>
              </tr>
              <tr className="border-b border-shop-700 align-top">
                <td className="py-2 pr-3 text-white">Receipt</td>
                <td className="py-2 pr-3">Asks where you bought it; for select purchases, like online retailers, requests proof of purchase</td>
                <td className="py-2">No receipts needed; they often ask for a picture of the tool</td>
              </tr>
              <tr className="border-b border-shop-700 align-top">
                <td className="py-2 pr-3 text-white">Torque wrenches</td>
                <td className="py-2 pr-3">1 year, plus a 90-day calibration guarantee; warranty evaluation goes through an authorized repair center</td>
                <td className="py-2">The warranty page lists no separate torque term; Tekton also lists a recertification service</td>
              </tr>
              <tr className="border-b border-shop-700 align-top">
                <td className="py-2 pr-3 text-white">Bits and bit sockets</td>
                <td className="py-2 pr-3">Listed as consumable, with no warranty support (along with cutting tools, taps and dies)</td>
                <td className="py-2">The warranty page lists no consumable exclusions</td>
              </tr>
              <tr className="border-b border-shop-700 align-top">
                <td className="py-2 pr-3 text-white">How you claim</td>
                <td className="py-2 pr-3">&ldquo;EZ Warranty&rdquo;: send a photo of the damage, no need to return the tool (U.S. and Canada)</td>
                <td className="py-2">Online claim with photos; Tekton pays shipping on the replacement, same-day ship if received before 2 p.m. ET on a weekday</td>
              </tr>
              <tr className="align-top">
                <td className="py-2 pr-3 text-white">Other periods</td>
                <td className="py-2 pr-3">Diagnostics 2 years, tool storage 3 years, tool carts 5 years, shop accessories 1 year</td>
                <td className="py-2">Not listed separately</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-steel-400">Summarized from <a className="underline" href={GEARWRENCH_WARRANTY} rel="noopener" target="_blank">GearWrench&apos;s warranty page</a> and Tekton&apos;s <a className="underline" href={TEKTON_WARRANTY} rel="noopener" target="_blank">warranty explained</a> and <a className="underline" href={TEKTON_CLAIM} rel="noopener" target="_blank">warranty claim</a> pages, checked November 23, 2026. Read the full terms before you count on them; they can change.</p>
      </section>

      <section aria-labelledby="pick">
        <h2 id="pick" className="mb-2 text-2xl font-black text-white">How to pick, tech to tech</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong className="text-white">Buying a torque wrench?</strong> Read the torque line above before you choose. GearWrench gives torque products 1 year; Tekton&apos;s page doesn&apos;t carve torque wrenches out.</li>
          <li><strong className="text-white">Buying bit sockets or bit sets?</strong> GearWrench treats bits and bit sockets as consumables with no warranty support. Tekton&apos;s page lists no such exclusion.</li>
          <li><strong className="text-white">Buying GearWrench online?</strong> Keep the order email. GearWrench says it may ask online buyers for proof of purchase, and its warranty page points to a list of authorized sellers.</li>
          <li><strong className="text-white">Need it on a specific day?</strong> Our GearWrench deals today are on Amazon; our Tekton deals are from Tekton&apos;s own site, mostly the outlet. Outlet items are discontinued, so you can&apos;t count on buying more of the same later.</li>
          <li><strong className="text-white">Compare like with like.</strong> Piece count isn&apos;t value. Count the sizes you actually use, and check tooth count, 6-point vs 12-point, and whether the set has the deep sockets you need.</li>
        </ul>
        <p className="mt-3">Shop these by category: {cats.map((c, i) => (<span key={c}>{i ? ", " : ""}<Link className="text-safety-400 hover:underline" href={`/c/${c}`}>{categoryName(c)}</Link></span>))}. Brand pages: <Link className="text-safety-400 hover:underline" href="/b/gearwrench">GearWrench</Link>, <Link className="text-safety-400 hover:underline" href="/b/tekton">Tekton</Link>. Also see <Link className="text-safety-400 hover:underline" href="/milwaukee-vs-dewalt-for-mechanics">Milwaukee vs DeWALT</Link>, <Link className="text-safety-400 hover:underline" href="/knipex-vs-tool-truck-pliers">Knipex vs tool truck pliers</Link>, or <Link className="text-safety-400 hover:underline" href="/">all {f.total} current deals</Link>.</p>
      </section>

      <section aria-labelledby="sources" className="text-sm">
        <h2 id="sources" className="mb-2 text-xl font-black text-white">Sources</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Prices: each card links to the seller page it was read from, with the check date on the card. Live data from our deals database.</li>
          <li>Truck prices: the truck brand&apos;s product page linked in the table.</li>
          <li><a className="text-safety-400 hover:underline" href={GEARWRENCH_WARRANTY} rel="noopener" target="_blank">GEARWRENCH Product Warranty</a> (warranty periods, proof of purchase, torque calibration guarantee, consumables). Checked November 23, 2026.</li>
          <li><a className="text-safety-400 hover:underline" href={TEKTON_WARRANTY} rel="noopener" target="_blank">TEKTON, Our Warranty Explained</a> (no time limits, no receipts, shipping, discontinued tools) and <a className="text-safety-400 hover:underline" href={TEKTON_CLAIM} rel="noopener" target="_blank">TEKTON warranty claim page</a> (photos, same-day shipping). Checked November 23, 2026.</li>
        </ul>
        <p className="mt-3 text-xs text-steel-400">Off the Truck earns a commission on some of the links above. It doesn&apos;t change the prices we show. See <Link className="underline" href="/about-for-ai">how the site works</Link>.</p>
      </section>

      <SignupBlock source="seo-gearwrench-vs-tekton" />
    </article>
  );
}
