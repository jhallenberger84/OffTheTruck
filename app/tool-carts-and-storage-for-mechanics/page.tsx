import type { Metadata } from "next";
import Link from "next/link";
import { DealGrid } from "@/components/DealCard";
import { SignupBlock } from "@/components/SignupBlock";
import { TopSignup } from "@/components/TopSignup";
import { catalogFacts, fmtDate } from "@/lib/facts";
import type { Deal } from "@/lib/deals";

export const revalidate = 300;

const PATH = "/tool-carts-and-storage-for-mechanics";
export const metadata: Metadata = {
  title: "Tool carts and storage for mechanics: PACKOUT deals vs Mac Tools carts",
  description:
    "Live Milwaukee PACKOUT rolling storage deals for techs next to Mac Tools utility cart prices read from mactools.com, with load ratings and warranty terms from the seller pages. No guessed prices.",
  alternates: { canonical: PATH },
  openGraph: { url: PATH, type: "article" },
};

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const MAC_CHECKED = "November 27, 2026";
/** Mac Tools carts, read from each product page on mactools.com (price, features, warranty line) on MAC_CHECKED. */
const MAC_CARTS = [
  { sku: "UC3016", url: "https://www.mactools.com/products/uc3016-bk", title: "Mac Tools Utility Cart (UC3016)", price: 369.99, what: "Two 3\" deep shelves, 18-gauge steel, 350 lb capacity, 4\" casters (two locking)", warranty: "1 year" },
  { sku: "MB6UC", url: "https://www.mactools.com/products/mb6uc", title: "Mac Tools Composite Utility Cart with Lid (MB6UC)", price: 424.99, what: "Structural foam, 150 lb per shelf, lockable lid, resistant to most automotive chemicals", warranty: "Limited lifetime" },
  { sku: "UC3016-1DRW", url: "https://www.mactools.com/products/uc3016-1drw-bk", title: "Mac Tools 1-Drawer Utility Cart (UC3016-1DRW)", price: 589.99, what: "Locking top with piano hinge, one ball-bearing drawer, 18-gauge steel, 350 lb capacity", warranty: "1 year" },
  { sku: "UC3919-3DRW", url: "https://www.mactools.com/products/uc3919-3drw-bk", title: "Mac Tools 3-Drawer Utility Cart (UC3919-3DRW)", price: 1119.99, what: "Gas-strut lid, three drawers on 100 lb full-extension ball-bearing slides", warranty: "1 year" },
  { sku: "UC3222DTF", url: "https://www.mactools.com/products/uc3222dtf-bk", title: "Mac Tools 7-Drawer Utility Cart (UC3222DTF)", price: 2499.99, what: "Power strip (3 outlets, 2 USB), 6\" deep top compartment, seven drawers on 100 lb slides", warranty: "1 year" },
];

/** Load ratings for the PACKOUT deals, from the ToolNut product description of each listing (checked MAC_CHECKED). */
const PACKOUT_NOTES: Record<string, string> = {
  "milwaukee-packout-cabinet-rolling-drawer": "Rolling Drawer Tool Box rated 250 lb on 9\" wheels; Cabinet rated 50 lb on a wall plate, 25 lb in transit",
  "milwaukee-milwaukee-packout-cabinet-with-packout-rolling-tool-box": "Rolling Tool Box rated 250 lb, IP65 weather seal; Cabinet rated 50 lb, 25 lb in transit",
  "milwaukee-milwaukee-48-22-8440-packout-crate-48-22-8420-packout-rolling-drawer": "Rolling Drawer Tool Box rated 250 lb on 9\" wheels; Crate rated 50 lb",
  "milwaukee-milwaukee-48-22-8445-packout-cabinet-48-22-8442-packout-2-drawer-too": "2-Drawer Tool Box with metal ball-bearing slides and a padlockable bar; Cabinet rated 50 lb (no wheels in this combo)",
};

const isPackout = (d: Deal) => /packout/i.test(d.title);

const latest = (ds: Deal[]) => fmtDate(ds.reduce<string | null>((m, d) => (!m || d.checked_at > m ? d.checked_at : m), null));

export default async function ToolCartsStorage() {
  const f = await catalogFacts();
  const packout = f.deals.filter(isPackout).sort((a, b) => a.sale_price - b.sale_price);
  const otherStorage = f.deals.filter((d) => d.category === "storage" && !isPackout(d));
  const pairs = f.deals.filter((d) => d.category === "storage" && d.truck_price && d.truck_brand);
  const checkedOn = latest([...packout, ...otherStorage]);
  const cheapestPackout = packout[0];
  const cheapestMac = MAC_CARTS[0];

  return (
    <article className="mx-auto max-w-5xl space-y-8 text-steel-300">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-safety-400">Price check, updated live</p>
        <h1 className="mt-1 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">Tool carts and storage for mechanics: PACKOUT deals vs the truck cart</h1>
        <p className="mt-3 max-w-3xl">
          A cart next to the car saves you a lot of trips to the box, and storage is a big-ticket buy whether it comes off the truck or from a store. Below are the {packout.length} Milwaukee PACKOUT storage deal{packout.length === 1 ? "" : "s"} we track right now, prices last checked {checkedOn} on the seller&apos;s own page, next to the utility carts Mac Tools lists on its own website. They are not the same kind of thing, and we say where they differ.
        </p>
      </header>

      <TopSignup source="seo-top-tool-carts" />

      <section aria-labelledby="compare">
        <h2 id="compare" className="mb-2 text-2xl font-black text-white">Rolling storage prices, today</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-shop-700 text-steel-400">
                <th className="py-2 pr-3">Item</th><th className="py-2 pr-3">What the seller page says</th><th className="py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {packout.map((d) => (
                <tr key={d.slug} className="border-b border-shop-800">
                  <td className="py-2 pr-3"><a className="text-safety-400 hover:underline" href={`/go/${d.slug}`} rel="nofollow sponsored noopener" target="_blank">{d.title}</a> at {d.retailer}</td>
                  <td className="py-2 pr-3">{PACKOUT_NOTES[d.slug] ?? "Milwaukee PACKOUT modular storage; see the seller page for ratings"}</td>
                  <td className="py-2 font-mono font-semibold text-safety-400">{usd(d.sale_price)}</td>
                </tr>
              ))}
              {MAC_CARTS.map((m) => (
                <tr key={m.sku} className="border-b border-shop-800">
                  <td className="py-2 pr-3"><a className="underline decoration-shop-600 underline-offset-2 hover:text-white" href={m.url} rel="nofollow noopener" target="_blank">{m.title}</a> on mactools.com</td>
                  <td className="py-2 pr-3">{m.what}. Warranty: {m.warranty}.</td>
                  <td className="py-2 font-mono font-semibold">{usd(m.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-steel-400">
          PACKOUT prices are live from our deals database; ratings are from each ToolNut product page. Mac Tools prices, features and warranty lines were read from mactools.com on {MAC_CHECKED}; the price on a truck can differ. PACKOUT is stackable polymer boxes on wheels; the Mac carts are shop carts (steel, except the composite MB6UC). Not identical products.
        </p>
        {cheapestPackout && (
          <p className="mt-3">Today the cheapest rolling PACKOUT combo we track is {usd(cheapestPackout.sale_price)}. The lowest-priced Mac Tools cart on mactools.com, the {cheapestMac.title}, is {usd(cheapestMac.price)}, and it is an open two-shelf cart with no drawers or lid. The first Mac cart with a drawer is {usd(MAC_CARTS[2].price)}.</p>
        )}
      </section>

      <section aria-labelledby="live">
        <h2 id="live" className="mb-2 text-2xl font-black text-white">Live PACKOUT storage deals ({packout.length})</h2>
        {packout.length ? <DealGrid deals={packout} /> : <p>No PACKOUT deals are live right now. <Link className="text-safety-400 hover:underline" href="/c/storage">See all storage deals</Link>.</p>}
      </section>

      {otherStorage.length > 0 && (
        <section aria-labelledby="other">
          <h2 id="other" className="mb-2 text-2xl font-black text-white">Other shop storage and creeper deals ({otherStorage.length})</h2>
          <DealGrid deals={otherStorage} />
          {pairs.length > 0 && (
            <ul className="mt-3 list-disc space-y-1 pl-5">
              {pairs.map((d) => (
                <li key={d.slug}>
                  <Link className="text-safety-400 hover:underline" href={`/vs/${d.slug}`}>{d.title}</Link> {usd(d.sale_price)} at {d.retailer} vs {d.truck_title} {usd(d.truck_price ?? 0)} on the Mac site.
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section aria-labelledby="pick">
        <h2 id="pick" className="mb-2 text-2xl font-black text-white">How to decide, tech to tech</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong className="text-white">Cart or box first?</strong> A rolling cart you pull up to the fender is what you touch all day. Plenty of techs start with a cart and a used or budget box and add the big box later.</li>
          <li><strong className="text-white">PACKOUT travels, a steel cart doesn&apos;t.</strong> If you take tools home, to a second job, or on road calls, stackable boxes that latch together beat a cart. If everything stays in one bay, a flat-top steel cart is easier to work off.</li>
          <li><strong className="text-white">Read the rating that matters.</strong> PACKOUT cabinets carry a lower in-transit rating than on the wall, and drawer slides have their own limit. Heavy sockets and air tools go on the wheeled base.</li>
          <li><strong className="text-white">Do the payment math.</strong> If a cart or box is going on a truck account, put the price and weekly payment into the <Link className="text-safety-400 hover:underline" href="/tool-truck-payment-calculator">tool truck payment calculator</Link> before you sign.</li>
        </ul>
        <p className="mt-3">More: <Link className="text-safety-400 hover:underline" href="/c/storage">all storage deals</Link>, <Link className="text-safety-400 hover:underline" href="/b/milwaukee">Milwaukee</Link>, <Link className="text-safety-400 hover:underline" href="/tool-truck-vs-online-prices">tool truck vs online prices</Link>, <Link className="text-safety-400 hover:underline" href="/vs">every truck vs online pair</Link>, or <Link className="text-safety-400 hover:underline" href="/">all {f.total} current deals</Link>.</p>
      </section>

      <section aria-labelledby="sources" className="text-sm">
        <h2 id="sources" className="mb-2 text-xl font-black text-white">Sources</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Online prices: each card links to the seller page it was read from, with the check date on the card. Live data from our deals database. PACKOUT load ratings from the ToolNut product description of each listing.</li>
          <li>Mac Tools: {MAC_CARTS.map((m, i) => (<span key={m.sku}>{i ? ", " : ""}<a className="text-safety-400 hover:underline" href={m.url} rel="nofollow noopener" target="_blank">{m.sku}</a> ({usd(m.price)})</span>))}. Price, features and the &quot;Warranty Info&quot; line read from each product page on {MAC_CHECKED}.</li>
        </ul>
        <p className="mt-3 text-xs text-steel-400">Off the Truck earns a commission on some of the links above. It doesn&apos;t change the prices we show. See <Link className="underline" href="/about-for-ai">how the site works</Link>.</p>
      </section>

      <SignupBlock source="seo-tool-carts" />
    </article>
  );
}
