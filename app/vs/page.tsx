import type { Metadata } from "next";
import Link from "next/link";
import { getTruckPairs } from "@/lib/pairs";
import { fmtDate } from "@/lib/facts";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Truck price vs. online: every pair we've checked",
  description: "Every live deal we have next to a real tool-truck brand price, biggest difference first. Each one has its own shareable page.",
  alternates: { canonical: "/vs" },
};
const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default async function VsIndex() {
  const pairs = await getTruckPairs();
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-black text-white">Truck price vs. online</h1>
      <p className="mt-2 text-steel-300">Every live deal we have next to a real truck-brand price from the brand&apos;s own site. Tap one for a page you can send to a coworker.</p>
      <ul className="mt-5 space-y-2">
        {pairs.map((p) => (
          <li key={p.slug}>
            <Link href={`/vs/${p.slug}`} className="flex justify-between gap-3 rounded-lg border border-shop-700 bg-shop-900 px-4 py-3 text-sm hover:border-safety-500">
              <span className="text-steel-300">{p.truck_brand} {usd(p.truck_price)} vs {p.brand} {usd(p.sale_price)} at {p.retailer} <span className="text-xs text-steel-400">(checked {fmtDate(p.checked_at)})</span></span>
              <span className={`shrink-0 font-bold ${p.save > 0 ? "text-safety-400" : "text-amber-300"}`}>{p.save > 0 ? `save ${usd(p.save)}` : `truck ${usd(-p.save)} less`}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm">Paying weekly? Try the <Link className="font-semibold text-safety-400 hover:underline" href="/tool-truck-payment-calculator">tool truck payment calculator</Link>.</p>
    </article>
  );
}
