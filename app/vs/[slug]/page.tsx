import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareBar } from "@/components/ShareBar";
import { TopSignup } from "@/components/TopSignup";
import { ArrowIcon, TruckIcon } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { getTruckPair, getTruckPairs, shortTruck } from "@/lib/pairs";
import { fmtDate } from "@/lib/facts";
import { SITE_URL } from "@/lib/site";

export const revalidate = 300;

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getTruckPair(slug);
  if (!p) return { title: "Truck price vs online", robots: { index: false } };
  const title = p.save > 0
    ? `${p.truck_brand} ${usd(p.truck_price)} vs ${p.brand} ${usd(p.sale_price)}: save ${usd(p.save)} off the truck`
    : `${p.truck_brand} ${usd(p.truck_price)} vs ${p.brand} ${usd(p.sale_price)}`;
  const description = `${shortTruck(p)} lists at ${usd(p.truck_price)} on the brand's site. ${p.title} is ${usd(p.sale_price)} at ${p.retailer} (checked ${fmtDate(p.checked_at)}).`;
  return { title, description, alternates: { canonical: `/vs/${slug}` }, openGraph: { url: `/vs/${slug}`, type: "article", title, description }, twitter: { card: "summary_large_image", title, description } };
}

export default async function VsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getTruckPair(slug);
  if (!p) notFound();
  const others = (await getTruckPairs()).filter((o) => o.slug !== slug && o.save > 0);
  const max = Math.max(p.truck_price, p.sale_price);
  const shareText = p.save > 0
    ? `${p.truck_brand} ${usd(p.truck_price)} vs ${p.brand} ${usd(p.sale_price)} online. ${usd(p.save)} difference.`
    : `${p.truck_brand} vs ${p.brand}: price check`;
  const truckName = shortTruck(p);
  const pageUrl = `${SITE_URL}/vs/${slug}`;
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    brand: { "@type": "Brand", name: p.brand },
    description: `${truckName} lists at ${usd(p.truck_price)} on the brand's site. ${p.title} is ${usd(p.sale_price)} at ${p.retailer} (checked ${fmtDate(p.checked_at)}).`,
    offers: {
      "@type": "Offer",
      price: p.sale_price.toFixed(2),
      priceCurrency: "USD",
      url: pageUrl,
      seller: { "@type": "Organization", name: p.retailer },
    },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How much is the ${truckName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${usd(p.truck_price)} list on the ${p.truck_brand} website${p.truck_checked_at ? `, checked ${fmtDate(p.truck_checked_at)}` : ""}. The price on a truck can differ.`,
        },
      },
      {
        "@type": "Question",
        name: `How much is the ${p.title} online?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${usd(p.sale_price)} at ${p.retailer}, checked ${fmtDate(p.checked_at)}. Confirm the price on the store page before you buy.`,
        },
      },
      ...(p.save > 0
        ? [{
            "@type": "Question",
            name: `How much do you save vs the ${p.truck_brand} price?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${usd(p.save)} (${p.savePct}%) if you buy the ${p.brand} at ${p.retailer} instead of paying the ${p.truck_brand} list price.`,
            },
          }]
        : []),
    ],
  };
  return (
    <article className="mx-auto max-w-3xl">
      <JsonLd data={productLd} />
      <JsonLd data={faqLd} />
      <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-safety-400"><TruckIcon className="h-4 w-4" /> Truck price vs. online</p>
      <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl">
        {p.save > 0 ? <>Save {usd(p.save)} ({p.savePct}%) vs. the {p.truck_brand} price</> : <>{p.truck_brand} vs. {p.brand}: the truck one is cheaper right now</>}
      </h1>
      <p className="mt-3 text-steel-300">Same kind of tool, two prices. Both read from the seller&apos;s own page.</p>

      <div className="mt-5 space-y-4 rounded-xl border border-shop-700 bg-shop-900 p-5">
        <div>
          <div className="flex justify-between gap-3 text-steel-300">
            <span>{p.truck_url ? <a href={p.truck_url} target="_blank" rel="nofollow noopener" className="underline decoration-shop-600 underline-offset-2 hover:text-white">{shortTruck(p)}</a> : shortTruck(p)}</span>
            <span className="shrink-0 font-mono text-lg">{usd(p.truck_price)}</span>
          </div>
          <div className="mt-1 h-3 rounded-full bg-shop-800" aria-hidden><div className="h-3 rounded-full bg-steel-400/70" style={{ width: `${(p.truck_price / max) * 100}%` }} /></div>
          <p className="mt-1 text-xs text-steel-400">{p.truck_brand} list price on the brand&apos;s website{p.truck_checked_at ? `, checked ${fmtDate(p.truck_checked_at)}` : ""}. Truck prices can differ.</p>
        </div>
        <div>
          <div className="flex justify-between gap-3 font-semibold text-white">
            <span>{p.title} at {p.retailer}</span>
            <span className="shrink-0 font-mono text-lg text-safety-400">{usd(p.sale_price)}</span>
          </div>
          <div className="mt-1 h-3 rounded-full bg-shop-800" aria-hidden><div className="h-3 rounded-full bg-safety-500" style={{ width: `${(p.sale_price / max) * 100}%` }} /></div>
          <p className="mt-1 text-xs text-steel-400">Checked {fmtDate(p.checked_at)}. Prices move fast, so confirm on the store page.</p>
        </div>
        {p.notes ? <p className="text-sm text-steel-300">{p.notes}</p> : null}
        <a href={`/go/${p.slug}`} rel="nofollow sponsored noopener" target="_blank" className="inline-flex items-center gap-1 rounded-md bg-safety-500 px-4 py-2.5 font-black uppercase tracking-wide text-black hover:bg-safety-400">
          Check price at {p.retailer} <ArrowIcon className="h-4 w-4" />
        </a>
      </div>

      <ShareBar path={`/vs/${p.slug}`} text={shareText} source={`vs-${p.slug}`} />

      <div className="my-6"><TopSignup source={`vs-${p.slug}`} /></div>

      {others.length ? (
        <section className="mt-8">
          <h2 className="mb-3 text-xl font-black text-white">More truck vs. online prices</h2>
          <ul className="space-y-2">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/vs/${o.slug}`} className="flex justify-between gap-3 rounded-lg border border-shop-700 bg-shop-900 px-4 py-3 text-sm hover:border-safety-500">
                  <span className="text-steel-300">{o.truck_brand} {usd(o.truck_price)} vs {o.brand} {usd(o.sale_price)}</span>
                  <span className="shrink-0 font-bold text-safety-400">save {usd(o.save)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm">Paying weekly on the truck? Run the numbers on the <Link href="/tool-truck-payment-calculator" className="font-semibold text-safety-400 hover:underline">tool truck payment calculator</Link>.</p>
        </section>
      ) : null}
      <p className="mt-6 text-xs text-steel-400">Off the Truck earns a commission on some links. It doesn&apos;t change the prices shown.</p>
    </article>
  );
}
