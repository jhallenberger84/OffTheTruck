import Link from "next/link";
import { BrandChip, DealGrid } from "@/components/DealCard";
import { CategoryChips } from "@/components/CategoryChips";
import { CategoryIcon, TruckIcon } from "@/components/Icons";
import { ProductImage } from "@/components/ProductImage";
import { SignupBlock } from "@/components/SignupBlock";
import { brandColor } from "@/lib/brands";
import { brandsOf, getActiveDeals } from "@/lib/deals";
import { brandSlug, CATEGORIES } from "@/lib/site";

export const revalidate = 300;

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default async function Home() {
  const deals = await getActiveDeals();
  const latest = deals.reduce((m, d) => (d.checked_at > m ? d.checked_at : m), "");
  const when = latest ? new Date(latest).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", timeZone: "America/Chicago" }) : "";
  const brands = brandsOf(deals);
  const beatTruck = deals.filter((d) => d.truck_price && d.truck_price > d.sale_price);
  const best = [...beatTruck].sort((a, b) => (b.truck_price! - b.sale_price) - (a.truck_price! - a.sale_price))[0];

  return (
    <>
      <section className="relative -mx-4 -mt-5 mb-6 overflow-hidden border-b border-black diamond-plate sm:mx-0 sm:mt-0 sm:rounded-2xl sm:border">
        <div className="grid gap-6 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-safety-400 ring-1 ring-safety-500/40">
              <TruckIcon className="h-4 w-4" /> Tool deals for auto techs
            </p>
            <h1 className="mt-3 text-4xl font-black uppercase leading-[0.95] tracking-tight text-white text-shadow-hard sm:text-6xl">
              Know the price <span className="text-safety-500">before the truck</span> pulls up.
            </h1>
            <p className="mt-4 max-w-xl text-base text-steel-300">
              {deals.length} live deals on GearWrench, Milwaukee, DeWALT, Tekton, Knipex, Wera and more, with the truck-brand price when there&apos;s a fair match. Last checked {when}.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="#deals" className="rounded-md bg-safety-500 px-5 py-3 text-sm font-black uppercase tracking-wide text-black shadow-lg shadow-black/40 hover:bg-safety-400">See today&apos;s deals</a>
              <a href="#signup" className="rounded-md border-2 border-white/80 bg-black/30 px-5 py-3 text-sm font-black uppercase tracking-wide text-white hover:bg-white hover:text-black">Get the Thursday email</a>
            </div>
            <dl className="mt-6 grid max-w-lg grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-black/45 p-3 ring-1 ring-white/10">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-steel-400">Live deals</dt>
                <dd className="font-mono text-2xl font-black text-white">{deals.length}</dd>
              </div>
              <div className="rounded-lg bg-black/45 p-3 ring-1 ring-white/10">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-steel-400">Brands</dt>
                <dd className="font-mono text-2xl font-black text-white">{brands.length}</dd>
              </div>
              <div className="rounded-lg bg-black/45 p-3 ring-1 ring-white/10">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-steel-400">Beat the truck</dt>
                <dd className="font-mono text-2xl font-black text-safety-400">{beatTruck.length}</dd>
              </div>
            </dl>
          </div>
          {best ? (
            <a href={`/go/${best.slug}`} rel="nofollow sponsored noopener" target="_blank" className="group block overflow-hidden rounded-xl bg-shop-950 shadow-2xl shadow-black/60 ring-1 ring-white/10">
              <div className="flex items-center justify-between bg-safety-500 px-4 py-2 text-xs font-black uppercase tracking-widest text-black">
                <span>Biggest truck savings today</span>
                <TruckIcon className="h-5 w-5" />
              </div>
              <div className="relative aspect-[16/9] overflow-hidden bg-white">
                <ProductImage src={best.image_url} alt="" category={best.category} brand={best.brand} color={brandColor(brandSlug(best.brand)).bg} />
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold leading-snug text-white group-hover:text-safety-400">{best.title}</p>
                <p className="mt-2 flex flex-wrap items-baseline gap-x-3 text-sm text-steel-400">
                  <span className="font-mono text-2xl font-black text-safety-400">{usd(best.sale_price)}</span>
                  <span>vs. {best.truck_title || best.truck_brand} <span className="font-mono line-through">{usd(best.truck_price!)}</span></span>
                </p>
                <p className="mt-2 inline-block rounded bg-white px-2 py-1 text-sm font-black text-black">
                  Save {usd(best.truck_price! - best.sale_price)} vs. truck price
                </p>
              </div>
            </a>
          ) : null}
        </div>
        <div className="h-3 hazard" aria-hidden />
      </section>

      <CategoryChips deals={deals} />

      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        <span className="shrink-0 text-xs font-bold uppercase tracking-widest text-steel-400">On sale:</span>
        {brands.map((b) => (
          <BrandChip key={b.slug} brand={b.name} />
        ))}
      </div>

      <div id="deals" className="mb-4 mt-8 flex scroll-mt-4 items-end justify-between gap-3">
        <h2 className="text-2xl font-black uppercase tracking-tight text-white">
          Today&apos;s top 12 <span className="text-safety-500">deals</span>
        </h2>
        <span className="hidden text-xs text-steel-400 sm:block">Ranked by real savings. Prices change fast; confirm on the store page.</span>
      </div>
      <DealGrid deals={deals.slice(0, 12)} numbered />

      <div id="signup" className="scroll-mt-4">
        <SignupBlock source="home" />
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-black uppercase tracking-tight text-white">Shop by <span className="text-safety-500">category</span></h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/c/${c.slug}`} className="group relative overflow-hidden rounded-xl border border-shop-700 diamond-plate p-4 transition hover:border-safety-500">
              <CategoryIcon slug={c.slug} className="h-10 w-10 text-safety-500 transition group-hover:scale-110" />
              <span className="mt-3 block font-black uppercase leading-tight text-white">{c.name}</span>
              <span className="text-xs text-steel-300">{deals.filter((d) => d.category === c.slug).length} deals</span>
            </Link>
          ))}
        </div>
      </section>

      {deals.length > 12 && (
        <section>
          <h2 className="mb-4 text-2xl font-black uppercase tracking-tight text-white">More <span className="text-safety-500">deals</span></h2>
          <DealGrid deals={deals.slice(12)} />
        </section>
      )}
    </>
  );
}
