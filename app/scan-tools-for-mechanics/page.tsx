import type { Metadata } from "next";
import Link from "next/link";
import { DealGrid } from "@/components/DealCard";
import { SignupBlock } from "@/components/SignupBlock";
import { TopSignup } from "@/components/TopSignup";
import { catalogFacts, fmtDate } from "@/lib/facts";
import type { Deal } from "@/lib/deals";
import { brandSlug } from "@/lib/site";

export const revalidate = 300;

const PATH = "/scan-tools-for-mechanics";
export const metadata: Metadata = {
  title: "Scan tools and diagnostic deals for mechanics: live prices vs the truck",
  description:
    "Live OBD-II scan tool and other diagnostic deals (code readers, multimeters, thermal cameras), with a Mac Tools list price next to a deal only when that pair is already in our database.",
  alternates: { canonical: PATH },
  openGraph: { url: PATH, type: "article" },
};

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const isScanTool = (d: Deal) => /scan|obd|code reader/i.test(d.title);
const isDiagnostic = (d: Deal) => d.category === "diagnostic";

const latest = (ds: Deal[]) => fmtDate(ds.reduce<string | null>((m, d) => (!m || d.checked_at > m ? d.checked_at : m), null));

export default async function ScanTools() {
  const f = await catalogFacts();
  const scanners = f.deals.filter(isScanTool);
  const otherDx = f.deals.filter((d) => isDiagnostic(d) && !isScanTool(d));
  const pairs = f.deals.filter((d) => isDiagnostic(d) && d.truck_price && d.truck_brand);
  const checkedOn = latest([...scanners, ...otherDx]);
  const brands = [...new Set([...scanners, ...otherDx].map((d) => d.brand))];

  return (
    <article className="mx-auto max-w-5xl space-y-8 text-steel-300">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-safety-400">Price check, updated live</p>
        <h1 className="mt-1 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">Scan tools and diagnostic deals for mechanics</h1>
        <p className="mt-3 max-w-3xl">
          A scan tool reads codes and live data; a multimeter and a thermal camera do different diagnostic jobs. We currently track {scanners.length} live OBD-II scanner deal{scanners.length === 1 ? "" : "s"} and {otherDx.length} other live diagnostic deal{otherDx.length === 1 ? "" : "s"}, prices last checked {checkedOn} on the seller&apos;s own page. Truck-brand prices appear only when they&apos;re already in our database — we did not invent any for this page.
        </p>
      </header>

      <TopSignup source="seo-top-scan-tools" />

      <section aria-labelledby="live-scanners">
        <h2 id="live-scanners" className="mb-2 text-2xl font-black text-white">Live scan tool deals ({scanners.length})</h2>
        {scanners.length ? <DealGrid deals={scanners} /> : <p>No OBD-II scan tool deals are live right now. <Link className="text-safety-400 hover:underline" href="/c/diagnostic">See all diagnostic deals</Link>.</p>}
        <p className="mt-3 text-sm">We do not have a Mac, Snap-on, or Matco list price on file for the scanner deal{scanners.length === 1 ? "" : "s"} above, so there is no /vs page for {scanners.length === 1 ? "it" : "them"} yet.</p>
      </section>

      <section aria-labelledby="live-dx">
        <h2 id="live-dx" className="mb-2 text-2xl font-black text-white">Other live diagnostic deals ({otherDx.length})</h2>
        <p className="mb-3">These are in our diagnostic category but they are not scan tools: multimeters, thermal cameras, and similar bay gear.</p>
        {otherDx.length ? <DealGrid deals={otherDx} /> : <p>No other diagnostic deals are live right now.</p>}
      </section>

      <section aria-labelledby="truck">
        <h2 id="truck" className="mb-2 text-2xl font-black text-white">Next to a Mac Tools price</h2>
        {pairs.length ? (
          <>
            <p className="mb-3">The diagnostic deals that already have a Mac Tools list price in our database:</p>
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
            <p className="mt-2 text-xs text-steel-400">Mac Tools prices are list prices from the brand&apos;s website; the price on a truck can differ. Dates are on each <Link className="text-safety-400 hover:underline" href="/vs">comparison page</Link>.</p>
          </>
        ) : (
          <p>None of the live diagnostic deals currently have a truck-brand price in our database. See <Link className="text-safety-400 hover:underline" href="/vs">every truck vs online pair</Link> we do have.</p>
        )}
      </section>

      <section aria-labelledby="pick">
        <h2 id="pick" className="mb-2 text-2xl font-black text-white">How to decide, tech to tech</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong className="text-white">A $20 code reader is not a factory-level scan tool.</strong> Check supported protocols, whether it can clear codes, and whether it shows live data. The seller page for each card is the source for that.</li>
          <li><strong className="text-white">A multimeter does not replace a scanner, and vice versa.</strong> If you&apos;re comparing to a truck-brand meter, use the pair in the table above rather than lining a meter up against a code reader.</li>
        </ul>
        <p className="mt-3">More: <Link className="text-safety-400 hover:underline" href="/c/diagnostic">all diagnostic deals</Link>, {brands.map((b, i) => (<span key={b}>{i ? ", " : ""}<Link className="text-safety-400 hover:underline" href={`/b/${brandSlug(b)}`}>{b}</Link></span>))}, <Link className="text-safety-400 hover:underline" href="/vs">every truck vs online pair</Link>, or <Link className="text-safety-400 hover:underline" href="/">all {f.total} current deals</Link>.</p>
      </section>

      <section aria-labelledby="sources" className="text-sm">
        <h2 id="sources" className="mb-2 text-xl font-black text-white">Sources</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Online prices: each card links to the seller page it was read from, with the check date on the card. Live data from our deals database.</li>
          <li>Mac Tools comparison prices: only deals that already have a truck price in that same database, linked under <Link className="text-safety-400 hover:underline" href="/vs">/vs</Link>. No new truck list prices were added for this page.</li>
        </ul>
        <p className="mt-3 text-xs text-steel-400">Off the Truck earns a commission on some of the links above. It doesn&apos;t change the prices we show. See <Link className="underline" href="/about-for-ai">how the site works</Link>.</p>
      </section>

      <SignupBlock source="seo-scan-tools" />
    </article>
  );
}
