import type { Metadata } from "next";
import Link from "next/link";
import { PaymentCalculator } from "@/components/PaymentCalculator";
import { ShareBar } from "@/components/ShareBar";
import { TopSignup } from "@/components/TopSignup";
import { getTruckPairs } from "@/lib/pairs";
import { fmtDate } from "@/lib/facts";

export const revalidate = 300;

const PATH = "/tool-truck-payment-calculator";
export const metadata: Metadata = {
  title: "Tool truck payment calculator: what that weekly payment really costs",
  description:
    "Put in the truck price, your weekly payment and the rate. See how many weeks it takes, the total you pay, and what the same kind of tool costs online today.",
  alternates: { canonical: PATH },
  openGraph: { url: PATH, type: "website" },
};

// Snap-on Inc. Form 10-K for fiscal 2025: average yield on finance receivables, 2025 (same source as /tool-truck-vs-online-prices).
const DEFAULT_APR = 17.6;
const SNAPON_10K = "https://www.sec.gov/Archives/edgar/data/91440/000009144026000045/sna-20260103.htm";
const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default async function CalculatorPage() {
  const pairs = (await getTruckPairs()).filter((p) => p.save > 0);
  const calcPairs = pairs.map((p) => ({ slug: p.slug, label: `${p.truck_brand} ${usd(p.truck_price)} vs ${p.brand} ${usd(p.sale_price)}`, truck: p.truck_price, online: p.sale_price, retailer: p.retailer }));
  return (
    <article className="mx-auto max-w-3xl">
      <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-safety-400">Free calculator</p>
      <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl">Tool truck payment calculator</h1>
      <p className="mt-3 text-steel-300">
        &ldquo;Only $20 a week&rdquo; is how a lot of us end up with a balance on the truck. Put in the price, your weekly payment and the rate,
        and see how long it takes and what you pay in total, next to what the same kind of tool costs online today.
      </p>
      <div className="mt-5"><PaymentCalculator pairs={calcPairs} defaultApr={DEFAULT_APR} /></div>

      <section className="mt-6 text-sm text-steel-300">
        <h2 className="mb-2 text-lg font-black text-white">Where the 17.6% default comes from</h2>
        <p>
          It&apos;s Snap-on&apos;s average yield on its finance receivables for 2025, from the company&apos;s own annual report (<a className="text-safety-400 hover:underline" href={SNAPON_10K} target="_blank" rel="noopener">Form 10-K for fiscal 2025, Financial Services section: &ldquo;average yields on finance receivables were 17.6%&rdquo;</a>).
          That&apos;s a company-wide average, not your rate. Change it to whatever is on your account. Set it to 0 if your dealer doesn&apos;t charge interest.
        </p>
      </section>

      <ShareBar path={PATH} text="Ran my truck payment through this. Worth 30 seconds before you sign for anything on the truck." source="calculator" />

      {pairs.length ? (
        <section className="mt-6">
          <h2 className="mb-3 text-xl font-black text-white">Truck price vs. online, checked {fmtDate(pairs[0].checked_at)}</h2>
          <ul className="space-y-2">
            {pairs.map((p) => (
              <li key={p.slug}>
                <Link href={`/vs/${p.slug}`} className="flex justify-between gap-3 rounded-lg border border-shop-700 bg-shop-900 px-4 py-3 text-sm hover:border-safety-500">
                  <span className="text-steel-300">{p.truck_brand} {usd(p.truck_price)} vs {p.brand} {usd(p.sale_price)} at {p.retailer}</span>
                  <span className="shrink-0 font-bold text-safety-400">save {usd(p.save)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="my-8"><TopSignup source="calculator" /></div>
      <p className="text-sm">More: <Link className="text-safety-400 hover:underline" href="/tool-truck-vs-online-prices">Is the tool truck worth it?</Link> · <Link className="text-safety-400 hover:underline" href="/black-friday-tool-deals-for-mechanics">Black Friday tool deals</Link></p>
    </article>
  );
}
