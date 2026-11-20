import Link from "next/link";
import { pctOff, type Deal } from "@/lib/deals";
import { brandColor } from "@/lib/brands";
import { brandSlug, categoryName } from "@/lib/site";
import { ArrowIcon, CategoryIcon, TruckIcon } from "./Icons";
import { ProductImage } from "./ProductImage";

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });
const usd0 = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: n >= 100 ? 0 : 2 });
const checked = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Chicago" });

export function BrandChip({ brand, size = "sm" }: { brand: string; size?: "sm" | "md" }) {
  const slug = brandSlug(brand);
  const c = brandColor(slug);
  return (
    <Link
      href={`/b/${slug}`}
      style={{ background: c.bg, color: c.fg }}
      className={`inline-flex items-center rounded-sm font-black uppercase tracking-wider ring-1 ring-white/20 ring-inset hover:brightness-110 ${size === "md" ? "px-3 py-1.5 text-sm" : "px-2 py-0.5 text-[11px]"}`}
    >
      {brand}
    </Link>
  );
}

function TruckCompare({ d }: { d: Deal }) {
  if (!d.truck_price || !d.truck_brand) return null;
  const max = Math.max(d.truck_price, d.sale_price);
  const save = d.truck_price - d.sale_price;
  const savePct = Math.round((save / d.truck_price) * 100);
  const cheaper = save > 0;
  return (
    <div className="mt-3 rounded-lg border border-shop-600 bg-shop-950 p-3">
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-steel-400">
        <TruckIcon className="h-4 w-4" /> Truck price vs. Off the Truck
      </p>
      <div className="space-y-1.5 text-[13px]">
        <div>
          <div className="flex justify-between gap-2 text-steel-300">
            <a href={d.truck_url || undefined} target="_blank" rel="nofollow noopener" className="truncate underline decoration-shop-600 underline-offset-2 hover:text-white" title={d.truck_title || d.truck_brand}>
              {d.truck_brand}{d.truck_title ? ` ${d.truck_title.replace(new RegExp(`^${d.truck_brand}\\s*`, "i"), "")}` : ""}
            </a>
            <span className="shrink-0 font-mono">{usd(d.truck_price)}</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-shop-800" aria-hidden>
            <div className="h-2 rounded-full bg-steel-400/70" style={{ width: `${(d.truck_price / max) * 100}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between gap-2 font-semibold text-white">
            <span>This deal at {d.retailer}</span>
            <span className="shrink-0 font-mono text-safety-400">{usd(d.sale_price)}</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-shop-800" aria-hidden>
            <div className="h-2 rounded-full bg-safety-500" style={{ width: `${(d.sale_price / max) * 100}%` }} />
          </div>
        </div>
      </div>
      {cheaper ? (
        <p className="mt-2 inline-block rounded bg-safety-500 px-2 py-1 text-sm font-black text-black">
          Save {usd(save)} / {savePct}% vs. truck price
        </p>
      ) : (
        <p className="mt-2 text-xs font-semibold text-amber-300">Heads up: the {d.truck_brand} version is {usd(-save)} cheaper right now.</p>
      )}
    </div>
  );
}

export function DealCard({ d, rank }: { d: Deal; rank?: number }) {
  const off = pctOff(d);
  const listSave = d.list_price > d.sale_price ? d.list_price - d.sale_price : 0;
  const color = brandColor(brandSlug(d.brand)).bg;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-shop-700 bg-shop-900 shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:border-safety-500/70">
      <a href={`/go/${d.slug}`} rel="nofollow sponsored noopener" target="_blank" className="relative block aspect-[4/3] overflow-hidden bg-white sm:aspect-[16/11]" tabIndex={-1} aria-hidden>
        <ProductImage src={d.image_url} alt="" category={d.category} brand={d.brand} color={color} />
        {rank ? (
          <span className="absolute left-0 top-3 rounded-r-md bg-shop-950 px-2.5 py-1 font-mono text-sm font-black text-safety-400 shadow">#{rank}</span>
        ) : null}
        {off > 0 ? (
          <span className="absolute right-2 top-2 flex h-14 w-14 rotate-6 flex-col items-center justify-center rounded-full bg-safety-500 text-black shadow-md ring-2 ring-black/80">
            <span className="text-lg font-black leading-none">{off}%</span>
            <span className="text-[10px] font-bold uppercase leading-none">off</span>
          </span>
        ) : null}
        {d.condition ? (
          <span className="absolute bottom-0 left-0 bg-amber-300 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-black">{d.condition}</span>
        ) : null}
      </a>
      <div className="h-1 hazard" aria-hidden />
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
          <BrandChip brand={d.brand} />
          <Link href={`/c/${d.category}`} className="inline-flex items-center gap-1 text-steel-400 hover:text-white">
            <CategoryIcon slug={d.category} className="h-3.5 w-3.5" />
            {categoryName(d.category)}
          </Link>
        </div>
        <h3 className="text-[15px] font-semibold leading-snug text-white">
          <a href={`/go/${d.slug}`} rel="nofollow sponsored noopener" target="_blank" className="hover:text-safety-400">
            {d.title}
          </a>
        </h3>
        <div className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-1">
          <span className="font-mono text-3xl font-black tracking-tight text-safety-400">{usd(d.sale_price)}</span>
          <span className="pb-1 text-sm text-steel-400">
            <span className="line-through">{usd(d.list_price)}</span> <span className="text-xs">{(d.list_price_label || "List price").toLowerCase()}</span>
          </span>
        </div>
        {listSave > 0 && !d.truck_price ? (
          <p className="mt-1 text-sm font-bold text-green-400">You save {usd0(listSave)}</p>
        ) : null}
        <TruckCompare d={d} />
        {d.notes ? <p className="mt-2 text-xs text-steel-400">{d.notes}</p> : null}
        <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-xs text-steel-400">
          <span>
            <span className="font-semibold text-steel-300">{d.retailer}</span> · checked {checked(d.checked_at)}
          </span>
          <a href={`/go/${d.slug}`} rel="nofollow sponsored noopener" target="_blank" className="inline-flex shrink-0 items-center gap-1 rounded-md bg-safety-500 px-3 py-2 text-sm font-black uppercase tracking-wide text-black hover:bg-safety-400">
            See deal <ArrowIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}

export function DealGrid({ deals, numbered }: { deals: Deal[]; numbered?: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {deals.map((d, i) => (
        <DealCard key={d.slug} d={d} rank={numbered ? i + 1 : undefined} />
      ))}
    </div>
  );
}
