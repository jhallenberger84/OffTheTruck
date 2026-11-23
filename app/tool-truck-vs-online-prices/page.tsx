import type { Metadata } from "next";
import Link from "next/link";
import { DealGrid } from "@/components/DealCard";
import { SignupBlock } from "@/components/SignupBlock";
import { TopSignup } from "@/components/TopSignup";
import { catalogFacts, fmtDate } from "@/lib/facts";

export const revalidate = 300;

const PATH = "/tool-truck-vs-online-prices";
export const metadata: Metadata = {
  title: "Is the tool truck worth it? Truck prices vs. online, checked daily",
  description:
    "Side-by-side prices: the same kind of tool on a Mac Tools truck-brand site vs. ToolNut, KC Tool, Tekton and Amazon, plus what financing a truck tool really costs, with sources.",
  alternates: { canonical: PATH },
  openGraph: { url: PATH, type: "article" },
};

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

// Snap-on Inc. Form 10-K for fiscal 2025 (filed Feb 2026): average yield on finance receivables, 2025.
const YIELD = 0.176;
const TERM_MONTHS = 48;
function monthlyPayment(principal: number, annualRate: number, months: number) {
  const r = annualRate / 12;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

const SNAPON_10K = "https://www.sec.gov/Archives/edgar/data/91440/000009144026000045/sna-20260103.htm";
const SNAPON_RECEIVABLES = "https://www.sec.gov/Archives/edgar/data/91440/000009144026000045/R13.htm";

export default async function TruckVsOnline() {
  const f = await catalogFacts();
  const rows = f.withTruck
    .map((d) => ({ d, save: (d.truck_price as number) - d.sale_price }))
    .sort((a, b) => b.save - a.save);
  const cheaperOnline = rows.filter((r) => r.save > 0);
  const cheaperTruck = rows.filter((r) => r.save <= 0);
  const pay = monthlyPayment(1000, YIELD, TERM_MONTHS);
  const checkedOn = fmtDate(f.lastChecked);

  return (
    <article className="mx-auto max-w-5xl space-y-8 text-steel-300">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-safety-400">Price check, updated live</p>
        <h1 className="mt-1 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">Is the tool truck worth it? Truck prices vs. online</h1>
        <p className="mt-3 max-w-3xl">
          Short answer: sometimes, and you can check each tool before you sign for it. Below are the tools we track right now that have a real Mac Tools price next to an online price. Prices were last checked {checkedOn}. Nothing here is a guess; each card links to both pages.
        </p>
      </header>

      <TopSignup source="seo-top-tool-truck-vs-online" />

      <section aria-labelledby="live">
        <h2 id="live" className="mb-2 text-2xl font-black text-white">Live: {rows.length} tools with a truck price next to an online price</h2>
        {rows.length ? (
          <>
            <p className="mb-4">
              Right now {cheaperOnline.length} of {rows.length} are cheaper online and {cheaperTruck.length} {cheaperTruck.length === 1 ? "is" : "are"} cheaper on the Mac Tools site.
              {" "}Read the model names on each card: some pairs are the same tool and some are the closest comparable one, not an identical part number.
            </p>
            <DealGrid deals={rows.map((r) => r.d)} />
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <caption className="mb-2 text-left text-xs text-steel-400">Same data as the cards, as a table. Truck prices are from the Mac Tools website.</caption>
                <thead>
                  <tr className="border-b border-shop-600 text-xs uppercase tracking-wider text-steel-400">
                    <th className="py-2 pr-3">Online deal</th><th className="py-2 pr-3">Online</th><th className="py-2 pr-3">Mac Tools item</th><th className="py-2 pr-3">Mac Tools</th><th className="py-2">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ d, save }) => (
                    <tr key={d.slug} className="border-b border-shop-700 align-top">
                      <td className="py-2 pr-3 text-white">{d.title} <span className="text-steel-400">({d.retailer})</span></td>
                      <td className="py-2 pr-3 font-mono">{usd(d.sale_price)}</td>
                      <td className="py-2 pr-3"><a className="text-safety-400 hover:underline" href={d.truck_url ?? "#"} rel="nofollow noopener" target="_blank">{d.truck_title}</a></td>
                      <td className="py-2 pr-3 font-mono">{usd(d.truck_price as number)}</td>
                      <td className={`py-2 font-mono ${save > 0 ? "text-green-400" : "text-amber-300"}`}>{save > 0 ? `${usd(save)} less online` : `${usd(-save)} less on the truck site`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p>No truck-brand comparisons are loaded right now. Check back tomorrow, or see <Link className="text-safety-400 hover:underline" href="/">all current deals</Link>.</p>
        )}
        <p className="mt-3 text-xs text-steel-400">
          Truck prices are what Mac Tools lists on mactools.com. The price your truck guy quotes can be different, and we don&apos;t have Snap-on or Matco prices. Amazon prices move often. &ldquo;Compare-at&rdquo; prices are the retailer&apos;s own figure.
        </p>
      </section>

      <section aria-labelledby="finance">
        <h2 id="finance" className="mb-2 text-2xl font-black text-white">The part that changes the math: what financing costs</h2>
        <p>
          A lot of the case for the truck is paying weekly instead of up front. That is a real convenience, and it has a price. We can&apos;t see what any one tech is charged, but Snap-on is a public company and reports its numbers:
        </p>
        <ul className="my-3 list-disc space-y-1 pl-5">
          <li>
            Snap-on Credit&apos;s extended-term contracts for technicians and shop owners have an average payment term of about four years (<a className="text-safety-400 hover:underline" href={SNAPON_RECEIVABLES} rel="noopener" target="_blank">Snap-on 10-K, Receivables note</a>).
          </li>
          <li>
            Snap-on reported an average yield on finance receivables of 17.6% in 2025 and 17.7% in 2024 (<a className="text-safety-400 hover:underline" href={SNAPON_10K} rel="noopener" target="_blank">Snap-on 10-K for fiscal 2025, Financial Services section</a>). Yield is what the company earns on the whole portfolio. It is not the rate on your contract, but it tells you the ballpark of what that credit costs overall.
          </li>
        </ul>
        <div className="rounded-xl border border-shop-600 bg-shop-900 p-4">
          <p className="font-bold text-white">Illustration only, not a quote</p>
          <p className="mt-1">
            If you financed a $1,000 purchase at 17.6% over {TERM_MONTHS} months, the standard loan formula gives about {usd(pay)} a month, or {usd(pay * TERM_MONTHS)} total. That is {usd(pay * TERM_MONTHS - 1000)} in interest. Compare that number with the price gaps above. Your real rate, term and fees will differ, so ask for the APR and total cost in writing. This example uses Snap-on&apos;s reported figure; we have not found equivalent published numbers for Mac Tools or Matco.
          </p>
        </div>
      </section>

      <section aria-labelledby="think">
        <h2 id="think" className="mb-2 text-2xl font-black text-white">So is it worth it?</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong className="text-white">For a tool you need today</strong> and can&apos;t get locally, the truck&apos;s convenience can be worth a few dollars. For a big-ticket item, check the price gap first. In our list above the gap runs both ways, so check each tool.</li>
          <li><strong className="text-white">For anything you&apos;d finance,</strong> add the interest to the price before comparing. A smaller online price paid in full usually wins over a bigger price paid slowly.</li>
          <li><strong className="text-white">Warranty and service</strong> matter too. We haven&apos;t compared warranty terms, so ask for the exact terms on the exact tool, from both the truck and the online seller.</li>
          <li><strong className="text-white">Don&apos;t buy a brand, buy the tool.</strong> Several non-truck brands we track (<Link className="text-safety-400 hover:underline" href="/brands">see brands</Link>) sit in the same price range as the truck lines. Look at the spec, not the logo.</li>
        </ul>
        <p className="mt-3">Want the full list, not just the truck matches? <Link className="text-safety-400 hover:underline" href="/">See all {f.total} current deals</Link>.</p>
      </section>

      <section aria-labelledby="sources" className="text-sm">
        <h2 id="sources" className="mb-2 text-xl font-black text-white">Sources</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Prices: each card links to the retailer page and the Mac Tools product page it was read from, with the check date shown on the card. Live data, updated at least daily.</li>
          <li><a className="text-safety-400 hover:underline" href={SNAPON_10K} rel="noopener" target="_blank">Snap-on Inc. Form 10-K for the fiscal year ended January 3, 2026 (SEC)</a>: financing yields.</li>
          <li><a className="text-safety-400 hover:underline" href={SNAPON_RECEIVABLES} rel="noopener" target="_blank">Same filing, Receivables note</a>: payment terms.</li>
        </ul>
        <p className="mt-3 text-xs text-steel-400">Off the Truck earns a commission on some of the links above. It doesn&apos;t change the prices we show. See <Link className="underline" href="/about-for-ai">how the site works</Link>.</p>
      </section>

      <SignupBlock source="seo-tool-truck-vs-online" />
    </article>
  );
}
