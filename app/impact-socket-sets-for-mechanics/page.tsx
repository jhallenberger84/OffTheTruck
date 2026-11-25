import type { Metadata } from "next";
import Link from "next/link";
import { DealGrid } from "@/components/DealCard";
import { SignupBlock } from "@/components/SignupBlock";
import { TopSignup } from "@/components/TopSignup";
import { catalogFacts, fmtDate } from "@/lib/facts";
import type { Deal } from "@/lib/deals";
import { brandSlug } from "@/lib/site";

export const revalidate = 300;

const PATH = "/impact-socket-sets-for-mechanics";
export const metadata: Metadata = {
  title: "Impact socket sets for mechanics: online vs tool truck prices",
  description:
    "Live impact socket deals (GearWrench, Wera Zyklop Impaktor, Koken) with prices checked on the seller's page, set by set next to Mac Tools impact socket prices, and what each maker says the sockets are made of.",
  alternates: { canonical: PATH },
  openGraph: { url: PATH, type: "article" },
};

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const MAC_CHECKED = "November 25, 2026";
const MAC_38_DEEP = "https://www.mactools.com/products/sxdpm156brpt";
const MAC_12_DEEP = "https://www.mactools.com/products/svdpm166tr";
const MAC_THIN_WALL = "https://www.mactools.com/products/dts6-set";
const GW_66 = "https://www.gearwrench.com/products/gwmsiskmm";

/** A deal counts as an impact socket deal if it's in sockets/ratchets and the title says impact socket, Impaktor, or wheel nut socket. */
const isImpactSocket = (d: Deal) =>
  d.category === "sockets-ratchets" && /impact socket|impaktor|wheel nut socket/i.test(d.title);

/** Mac Tools prices read from mactools.com product pages on 2026-11-25. The online side is the live deal from our database. */
const PAIRS = [
  {
    slug: "wera-zyklop-impaktor-deep-socket-set",
    mac: { title: "Mac Tools SXDPM156BRPT 15-pc. 3/8\" Drive Metric Deep Impact Socket Set, 6-pt.", price: 309.99, url: MAC_38_DEEP },
    match: "Close match: both are 3/8\" drive metric deep impact socket sets, 6-point. Wera: 14 sockets, 8, 10-19, 21, 22 and 24 mm, foam insert. Mac: 15 sockets, 10-24 mm.",
  },
  {
    slug: "gearwrench-gwmsiskmm-66pc-metric-impact-sockets",
    mac: { title: "Mac Tools SVDPM166TR 16-pc. 1/2\" Drive Metric Deep Impact Socket Set, 6-pt.", price: 519.99, url: MAC_12_DEEP },
    match: "Not the same set, shown for scale: the GearWrench set is 66 metric 6-point impact sockets across 1/4\", 3/8\" and 1/2\" drive, standard and deep. The Mac set is 16 1/2\" drive deep sockets, 10-25 mm, made in the USA, with a metal tray.",
  },
];

const latest = (ds: Deal[]) => fmtDate(ds.reduce<string | null>((m, d) => (!m || d.checked_at > m ? d.checked_at : m), null));

export default async function ImpactSocketSets() {
  const f = await catalogFacts();
  const sockets = f.deals.filter(isImpactSocket);
  const pairs = PAIRS.map((p) => ({ ...p, deal: f.deals.find((d) => d.slug === p.slug) })).filter((p) => p.deal);
  const checkedOn = latest(sockets);
  const brands = [...new Set(sockets.map((d) => d.brand))];

  return (
    <article className="mx-auto max-w-5xl space-y-8 text-steel-300">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-safety-400">Price check, updated live</p>
        <h1 className="mt-1 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">Impact socket sets for mechanics: online vs tool truck prices</h1>
        <p className="mt-3 max-w-3xl">
          Impact sockets get beat on every day, so it&apos;s fair to ask whether the truck set is worth the extra. Here are the {sockets.length} impact socket deals we track right now, prices last checked {checkedOn} on the seller&apos;s own page, then the same kind of set from Mac Tools at the price on Mac&apos;s website, then what each maker says about how the sockets are built. Every number has a source.
        </p>
      </header>

      <TopSignup source="seo-top-impact-socket-sets" />

      <section aria-labelledby="live-sockets">
        <h2 id="live-sockets" className="mb-2 text-2xl font-black text-white">Live impact socket deals ({sockets.length})</h2>
        {sockets.length ? <DealGrid deals={sockets} /> : <p>No impact socket deals are live right now. <Link className="text-safety-400 hover:underline" href="/c/sockets-ratchets">See all socket and ratchet deals</Link>.</p>}
        <p className="mt-3 text-xs text-steel-400">&ldquo;List,&rdquo; &ldquo;typical&rdquo; and &ldquo;compare-at&rdquo; prices are the seller&apos;s own figure, so treat the percent-off as a hint. Amazon prices change often. Prices can change after we check.</p>
      </section>

      {pairs.length > 0 && (
        <section aria-labelledby="truck">
          <h2 id="truck" className="mb-2 text-2xl font-black text-white">Next to a Mac Tools price</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-shop-600 text-xs uppercase tracking-wider text-steel-400">
                  <th className="py-2 pr-3">Online deal</th><th className="py-2 pr-3">Online</th><th className="py-2 pr-3">Mac Tools item</th><th className="py-2 pr-3">Mac site</th><th className="py-2">Difference</th>
                </tr>
              </thead>
              <tbody>
                {pairs.map((p) => {
                  const d = p.deal as Deal;
                  const save = p.mac.price - d.sale_price;
                  return (
                    <tr key={p.slug} className="border-b border-shop-700 align-top">
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
          <p className="mt-2 text-xs text-steel-400">Mac Tools prices are from mactools.com, checked {MAC_CHECKED}; the price on the truck can differ. Online prices are live from the seller page on each card.</p>
          <p className="mt-3">Wheel sockets too: Mac&apos;s <a className="text-safety-400 hover:underline" href={MAC_THIN_WALL} rel="nofollow noopener" target="_blank">DTS6-SET 6-piece deep thin-wall impact socket set</a> (for wheel lugs, including aftermarket wheels) is {usd(204.99)} on mactools.com, about {usd(204.99 / 6)} a socket. If you mostly need one size for the cars you see, a single thin-wall wheel socket like the Koken 22 mm above costs less than that per socket. Mac&apos;s page doesn&apos;t list the six sizes, so check it against your lug sizes before comparing.</p>
          <p className="mt-3">Buying on a truck balance? Interest adds to the sticker. The <Link className="text-safety-400 hover:underline" href="/tool-truck-payment-calculator">tool truck payment calculator</Link> shows what a set really costs at a weekly payment.</p>
        </section>
      )}

      <section aria-labelledby="build">
        <h2 id="build" className="mb-2 text-2xl font-black text-white">What the makers say they&apos;re made of</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong className="text-white">GearWrench GWMSISKMM (66 pc):</strong> chrome molybdenum (Cr-Mo) alloy steel, black oxide finish, an off-corner loading design to reduce fastener rounding, meets or exceeds ASME requirements, precut foam tray. Warranty listed as full lifetime, on the tools only (<a className="text-safety-400 hover:underline" href={GW_66} rel="noopener" target="_blank">GearWrench product page</a>).</li>
          <li><strong className="text-white">Wera Zyklop B 3/8&quot; Impaktor deep set (14 pc):</strong> for electric or pneumatic 3/8&quot; drive wrenches, hex (6-point) profile, a cross hole and ring groove for the retaining pin and ring, color coding by size, 63 mm long sockets (from the KC Tool product page on the card).</li>
          <li><strong className="text-white">Mac Tools SVDPM166TR (16 pc, 1/2&quot; deep):</strong> Mac-Drive design that contacts the flats instead of the corners, forged alloy steel, black oxide, &ldquo;specially manufactured to extra-hard tolerances&rdquo; for high-torque impact tools, made in the USA (<a className="text-safety-400 hover:underline" href={MAC_12_DEEP} rel="nofollow noopener" target="_blank">mactools.com</a>).</li>
          <li><strong className="text-white">Mac Tools SXDPM156BRPT (15 pc, 3/8&quot; deep):</strong> non-slip design Mac says removes fasteners rounded off up to 85%, cro-moly steel, meets ASME/ANSI, BS and DIN standards (<a className="text-safety-400 hover:underline" href={MAC_38_DEEP} rel="nofollow noopener" target="_blank">mactools.com</a>).</li>
        </ul>
        <p className="mt-2">GearWrench and Mac both describe Cr-Mo or forged alloy steel, and both describe a 6-point design that drives on the flats rather than the corners. The differences you pay for are in the details: where it&apos;s made, the tray, the size run, and the warranty process.</p>
      </section>

      <section aria-labelledby="pick">
        <h2 id="pick" className="mb-2 text-2xl font-black text-white">How to decide, tech to tech</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong className="text-white">Count the sockets and the sizes.</strong> A 14-piece set that skips 20 and 23 mm isn&apos;t the same as a 15-piece 10-24 mm set. Line up the size lists before you compare prices.</li>
          <li><strong className="text-white">Buy the drive you actually run.</strong> A big three-drive set is good value if you&apos;re starting out; if you already have a 1/2&quot; set, a 3/8&quot; deep set alone may be all you need.</li>
          <li><strong className="text-white">Use impact sockets on the gun.</strong> They&apos;re built and finished for it, as the maker pages above say. Keep the chrome ones for the ratchet.</li>
        </ul>
        <p className="mt-3">More: <Link className="text-safety-400 hover:underline" href="/c/sockets-ratchets">all socket and ratchet deals</Link>, {brands.map((b, i) => (<span key={b}>{i ? ", " : ""}<Link className="text-safety-400 hover:underline" href={`/b/${brandSlug(b)}`}>{b}</Link></span>))}, <Link className="text-safety-400 hover:underline" href="/gearwrench-vs-tekton-for-mechanics">GearWrench vs Tekton</Link>, <Link className="text-safety-400 hover:underline" href="/wera-vs-tool-truck-tools">Wera vs tool truck tools</Link>, <Link className="text-safety-400 hover:underline" href="/vs">every truck vs online pair</Link>, or <Link className="text-safety-400 hover:underline" href="/">all {f.total} current deals</Link>.</p>
      </section>

      <section aria-labelledby="sources" className="text-sm">
        <h2 id="sources" className="mb-2 text-xl font-black text-white">Sources</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Online prices: each card links to the seller page it was read from, with the check date on the card. Live data from our deals database.</li>
          <li>Mac Tools prices and set details: <a className="text-safety-400 hover:underline" href={MAC_38_DEEP} rel="nofollow noopener" target="_blank">SXDPM156BRPT</a>, <a className="text-safety-400 hover:underline" href={MAC_12_DEEP} rel="nofollow noopener" target="_blank">SVDPM166TR</a> and <a className="text-safety-400 hover:underline" href={MAC_THIN_WALL} rel="nofollow noopener" target="_blank">DTS6-SET</a> on mactools.com, checked {MAC_CHECKED}.</li>
          <li><a className="text-safety-400 hover:underline" href={GW_66} rel="noopener" target="_blank">GearWrench GWMSISKMM product page</a> (material, finish, contents, warranty). Checked {MAC_CHECKED}.</li>
          <li>Wera Zyklop Impaktor set contents and features: the KC Tool product page on the card, checked {MAC_CHECKED}.</li>
        </ul>
        <p className="mt-3 text-xs text-steel-400">Off the Truck earns a commission on some of the links above. It doesn&apos;t change the prices we show. See <Link className="underline" href="/about-for-ai">how the site works</Link>.</p>
      </section>

      <SignupBlock source="seo-impact-socket-sets" />
    </article>
  );
}
