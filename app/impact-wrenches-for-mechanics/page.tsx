import type { Metadata } from "next";
import Link from "next/link";
import { DealGrid } from "@/components/DealCard";
import { SignupBlock } from "@/components/SignupBlock";
import { TopSignup } from "@/components/TopSignup";
import { catalogFacts, fmtDate } from "@/lib/facts";
import type { Deal } from "@/lib/deals";
import { brandSlug } from "@/lib/site";

export const revalidate = 300;

const PATH = "/impact-wrenches-for-mechanics";
export const metadata: Metadata = {
  title: "Impact wrenches and impact drivers for mechanics: live online prices vs the truck",
  description:
    "Live air impact wrench and cordless impact driver deals, with Mac Tools list prices next to them when we already have a checked pair in our database. No guessed truck prices.",
  alternates: { canonical: PATH },
  openGraph: { url: PATH, type: "article" },
};

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

/** Air impact wrenches, plus 1/4" impact drivers. Skip combo kits so the grid stays on the gun itself. */
const isImpactGun = (d: Deal) =>
  /impact wrench/i.test(d.title) || (/impact driver/i.test(d.title) && !/combo kit/i.test(d.title));

const latest = (ds: Deal[]) => fmtDate(ds.reduce<string | null>((m, d) => (!m || d.checked_at > m ? d.checked_at : m), null));

export default async function ImpactWrenches() {
  const f = await catalogFacts();
  const guns = f.deals.filter(isImpactGun);
  const wrenches = guns.filter((d) => /impact wrench/i.test(d.title));
  const drivers = guns.filter((d) => /impact driver/i.test(d.title));
  const pairs = guns.filter((d) => d.truck_price && d.truck_brand);
  const checkedOn = latest(guns);
  const brands = [...new Set(guns.map((d) => d.brand))];

  return (
    <article className="mx-auto max-w-5xl space-y-8 text-steel-300">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-safety-400">Price check, updated live</p>
        <h1 className="mt-1 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">Impact wrenches and impact drivers for mechanics: live prices vs the truck</h1>
        <p className="mt-3 max-w-3xl">
          An impact wrench turns sockets (lug nuts, stubborn bolts). An impact driver is the 1/4&quot; hex gun for fasteners. They get used in the same bay, and they&apos;re the kind of tool people finance off the truck. Here are the {guns.length} live deals we track right now, prices last checked {checkedOn} on the seller&apos;s own page. Where we already have a Mac Tools list price in our database, that pair is linked below. We don&apos;t invent truck prices.
        </p>
      </header>

      <TopSignup source="seo-top-impact-wrenches" />

      <section aria-labelledby="live-wrenches">
        <h2 id="live-wrenches" className="mb-2 text-2xl font-black text-white">Live air impact wrench deals ({wrenches.length})</h2>
        {wrenches.length ? <DealGrid deals={wrenches} /> : <p>No air impact wrench deals are live right now. <Link className="text-safety-400 hover:underline" href="/c/impacts-power">See all impact and power tool deals</Link>.</p>}
      </section>

      <section aria-labelledby="live-drivers">
        <h2 id="live-drivers" className="mb-2 text-2xl font-black text-white">Live impact driver deals ({drivers.length})</h2>
        {drivers.length ? <DealGrid deals={drivers} /> : <p>No impact driver deals are live right now.</p>}
      </section>

      <section aria-labelledby="truck">
        <h2 id="truck" className="mb-2 text-2xl font-black text-white">Next to a Mac Tools price</h2>
        {pairs.length ? (
          <>
            <p className="mb-3">These are the live impact-driver deals that already have a Mac Tools list price in our database, read from Mac&apos;s website. Each row links to its own shareable comparison page. We do not have a Mac Tools list price on file for the air impact wrench deal above, so that one is not in this table.</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-shop-700 text-steel-400">
                    <th className="py-2 pr-3">Online deal</th><th className="py-2 pr-3">Online</th><th className="py-2 pr-3">Mac Tools item</th><th className="py-2 pr-3">Mac site</th><th className="py-2">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {pairs.map((d) => {
                    const save = (d.truck_price ?? 0) - d.sale_price;
                    return (
                      <tr key={d.slug} className="border-b border-shop-800">
                        <td className="py-2 pr-3"><Link className="text-safety-400 hover:underline" href={`/vs/${d.slug}`}>{d.title}</Link> at {d.retailer}</td>
                        <td className="py-2 pr-3 font-mono">{usd(d.sale_price)}</td>
                        <td className="py-2 pr-3">{d.truck_url ? <a className="underline decoration-shop-600 underline-offset-2 hover:text-white" href={d.truck_url} rel="nofollow noopener" target="_blank">{d.truck_title}</a> : d.truck_title}</td>
                        <td className="py-2 pr-3 font-mono">{usd(d.truck_price ?? 0)}</td>
                        <td className="py-2 font-semibold text-safety-400">{save > 0 ? `save ${usd(save)}` : `truck ${usd(-save)} less`}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-steel-400">Mac Tools prices are list prices from the brand&apos;s website; the price on a truck can differ. Online prices are live from the seller page on each card. Dates are on the <Link className="text-safety-400 hover:underline" href="/vs">comparison pages</Link>.</p>
          </>
        ) : (
          <p>None of the live impact deals currently have a truck-brand price in our database. See <Link className="text-safety-400 hover:underline" href="/vs">every truck vs online pair</Link> we do have.</p>
        )}
      </section>

      <section aria-labelledby="pick">
        <h2 id="pick" className="mb-2 text-2xl font-black text-white">How to decide, tech to tech</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong className="text-white">Don&apos;t compare an air wrench to a 1/4&quot; driver.</strong> Different jobs, different anvils. The air wrench deal and the cordless drivers above are listed separately on purpose.</li>
          <li><strong className="text-white">A kit is not a bare tool.</strong> The DeWALT DCF787C1 comes with two batteries; the Milwaukee SURGE deal is tool-only. The Mac prices next to them follow that same split (kit vs bare) in our database.</li>
          <li><strong className="text-white">Confirm stock and the price on the seller page.</strong> These move, especially around a holiday week.</li>
        </ul>
        <p className="mt-3">More: <Link className="text-safety-400 hover:underline" href="/c/impacts-power">all impact and power tool deals</Link>, {brands.map((b, i) => (<span key={b}>{i ? ", " : ""}<Link className="text-safety-400 hover:underline" href={`/b/${brandSlug(b)}`}>{b}</Link></span>))}, <Link className="text-safety-400 hover:underline" href="/impact-socket-sets-for-mechanics">impact socket sets</Link>, <Link className="text-safety-400 hover:underline" href="/milwaukee-vs-dewalt-for-mechanics">Milwaukee vs DeWALT</Link>, <Link className="text-safety-400 hover:underline" href="/vs">every truck vs online pair</Link>, or <Link className="text-safety-400 hover:underline" href="/">all {f.total} current deals</Link>.</p>
      </section>

      <section aria-labelledby="sources" className="text-sm">
        <h2 id="sources" className="mb-2 text-xl font-black text-white">Sources</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Online prices: each card links to the seller page it was read from, with the check date on the card. Live data from our deals database.</li>
          <li>Mac Tools comparison prices: only the deals that already have a truck price in that same database. Those pages are under <Link className="text-safety-400 hover:underline" href="/vs">/vs</Link>. We did not add new Mac list prices for this page.</li>
        </ul>
        <p className="mt-3 text-xs text-steel-400">Off the Truck earns a commission on some of the links above. It doesn&apos;t change the prices we show. See <Link className="underline" href="/about-for-ai">how the site works</Link>.</p>
      </section>

      <SignupBlock source="seo-impact-wrenches" />
    </article>
  );
}
