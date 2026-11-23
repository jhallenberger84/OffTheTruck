import type { Metadata } from "next";
import Link from "next/link";
import { DealGrid } from "@/components/DealCard";
import { SignupBlock } from "@/components/SignupBlock";
import { TopSignup } from "@/components/TopSignup";
import { catalogFacts, fmtDate } from "@/lib/facts";
import type { Deal } from "@/lib/deals";

export const revalidate = 300;

const PATH = "/knipex-vs-tool-truck-pliers";
export const metadata: Metadata = {
  title: "Knipex vs tool truck pliers: live prices next to Mac Tools",
  description:
    "Are Knipex pliers worth it over tool truck pliers? Today's live Knipex deals, the closest Mac Tools truck pliers with their prices side by side, and each brand's warranty terms from its own page.",
  alternates: { canonical: PATH },
  openGraph: { url: PATH, type: "article" },
};

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const KNIPEX_WARRANTY = "https://www.knipex-tools.com/our-warranty-0";
const MAC_P8TGA = "https://www.mactools.com/products/p8tga";
const MAC_HCP18001 = "https://www.mactools.com/products/hcp18001";

const isPlier = (d: Deal) => /plier/i.test(d.title);

export default async function KnipexVsTruckPliers() {
  const f = await catalogFacts();
  const knipex = f.deals.filter((d) => d.brand === "Knipex");
  const otherPliers = f.deals.filter((d) => d.brand !== "Knipex" && isPlier(d));
  const truckPairs = [...knipex, ...otherPliers].filter((d) => d.truck_price && d.truck_brand);
  const gaps = truckPairs.map((d) => (d.truck_price as number) - d.sale_price);
  const truckCheaper = gaps.filter((g) => g <= 0).length;
  const maxGap = gaps.length ? Math.max(...gaps.map(Math.abs)) : 0;
  const checkedOn = fmtDate(knipex.reduce<string | null>((m, d) => (!m || d.checked_at > m ? d.checked_at : m), null));

  return (
    <article className="mx-auto max-w-5xl space-y-8 text-steel-300">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-safety-400">Brand check, prices updated live</p>
        <h1 className="mt-1 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">Knipex vs tool truck pliers</h1>
        <p className="mt-3 max-w-3xl">
          Short answer: on pliers, the gap between buying online and buying off the truck is small.{truckPairs.length > 0 && <> In the {truckPairs.length} plier pairs we can match today, the biggest difference is {usd(maxGap)}{truckCheaper > 0 ? <>, and in {truckCheaper} of them the Mac Tools price is the lower one</> : null}.</>} So pick pliers for the job they do, not the logo. Below are the Knipex deals we track right now ({knipex.length}), prices last checked {checkedOn}, plus the closest Mac Tools pliers. Every card links to the page the price came from.
        </p>
      </header>

      <TopSignup source="seo-top-knipex-vs-truck-pliers" />

      <section aria-labelledby="live">
        <h2 id="live" className="mb-2 text-2xl font-black text-white">Live Knipex deals ({knipex.length})</h2>
        {knipex.length ? <DealGrid deals={knipex} /> : <p>No Knipex deals are live right now.</p>}
        {otherPliers.length > 0 && (
          <>
            <h2 className="mb-2 mt-8 text-2xl font-black text-white">Other pliers on sale ({otherPliers.length})</h2>
            <DealGrid deals={otherPliers} />
          </>
        )}
        <p className="mt-3 text-xs text-steel-400">&ldquo;Compare-at&rdquo; and list prices are the retailer&apos;s own figure, so treat the percent-off as a hint. Amazon prices change often. Prices can change after we check.</p>
      </section>

      {truckPairs.length > 0 && (
        <section aria-labelledby="truck">
          <h2 id="truck" className="mb-2 text-2xl font-black text-white">Next to the truck: Mac Tools pliers</h2>
          <p className="mb-3">These are the closest Mac Tools pliers we could match, not the same tool, so read the model names. Sizes and jaw styles differ.</p>
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
          <p className="mt-2 text-xs text-steel-400">Truck prices are from mactools.com; the price on the truck can differ. When we checked on November 21, 2026, mactools.com showed the HCP18001 hose clamp pliers as out of stock. More pairs on <Link className="underline" href="/tool-truck-vs-online-prices">truck prices vs. online</Link>.</p>
        </section>
      )}

      <section aria-labelledby="warranty">
        <h2 id="warranty" className="mb-2 text-2xl font-black text-white">Warranty, from each brand&apos;s own page</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong className="text-white">Knipex (USA and Canada):</strong> a Lifetime Limited Warranty for the original end-user against defects in material and workmanship. It does not cover misuse, abuse, alteration, accident, lack of maintenance, or tools worn out by use. Claims need a Return Goods Authorization (RGA) number, the tool, and proof of purchase, and you pay shipping (<a className="text-safety-400 hover:underline" href={KNIPEX_WARRANTY} rel="noopener" target="_blank">Knipex warranty page</a>).</li>
          <li><strong className="text-white">Mac Tools:</strong> the P8TGA tongue and groove pliers and the HCP18001 hose clamp pliers pages both list a Limited Lifetime Warranty (<a className="text-safety-400 hover:underline" href={MAC_P8TGA} rel="noopener" target="_blank">P8TGA</a>, <a className="text-safety-400 hover:underline" href={MAC_HCP18001} rel="noopener" target="_blank">HCP18001</a>).</li>
        </ul>
        <p className="mt-2 text-sm">Both are lifetime-type warranties. Knipex&apos;s page says claims go through Knipex or the dealer where you bought the tool, with shipping on you, so keep the receipt.</p>
      </section>

      <section aria-labelledby="pick">
        <h2 id="pick" className="mb-2 text-2xl font-black text-white">How to pick, tech to tech</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong className="text-white">Compare the exact job.</strong> A 7-1/4&quot; narrow-jaw Cobra and an 8&quot; tongue and groove plier are not the same reach. Size and jaw shape matter more than the brand on pliers.</li>
          <li><strong className="text-white">Check specialty pliers by model number</strong> (circlip, hose clamp, body clip). Online listings show the exact model, so you can match it to the job before you buy.</li>
          <li><strong className="text-white">Pay cash for pliers.</strong> At these prices there&apos;s no reason to put them on a weekly truck payment.</li>
        </ul>
        <p className="mt-3">See everything: <Link className="text-safety-400 hover:underline" href="/b/knipex">all Knipex deals</Link>, <Link className="text-safety-400 hover:underline" href="/c/specialty">specialty tools</Link>, <Link className="text-safety-400 hover:underline" href="/milwaukee-vs-dewalt-for-mechanics">Milwaukee vs DeWALT</Link>, or <Link className="text-safety-400 hover:underline" href="/">all {f.total} current deals</Link>.</p>
      </section>

      <section aria-labelledby="sources" className="text-sm">
        <h2 id="sources" className="mb-2 text-xl font-black text-white">Sources</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Prices: each card links to the retailer page it was read from, with the check date on the card. Live data from our deals database.</li>
          <li><a className="text-safety-400 hover:underline" href={KNIPEX_WARRANTY} rel="noopener" target="_blank">KNIPEX Tools, Our Warranty (USA &amp; Canada Lifetime Limited Warranty)</a>.</li>
          <li><a className="text-safety-400 hover:underline" href={MAC_P8TGA} rel="noopener" target="_blank">Mac Tools P8TGA product page</a> and <a className="text-safety-400 hover:underline" href={MAC_HCP18001} rel="noopener" target="_blank">Mac Tools HCP18001 product page</a> (price and warranty).</li>
        </ul>
        <p className="mt-3 text-xs text-steel-400">Off the Truck earns a commission on some of the links above. It doesn&apos;t change the prices we show. See <Link className="underline" href="/about-for-ai">how the site works</Link>.</p>
      </section>

      <SignupBlock source="seo-knipex-vs-truck-pliers" />
    </article>
  );
}
