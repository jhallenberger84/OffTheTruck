import Link from "next/link";
import { pctOff, type Deal } from "@/lib/deals";
import { brandSlug, categoryName } from "@/lib/site";

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });
const checked = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Chicago" });

export function DealCard({ d, rank }: { d: Deal; rank?: number }) {
  const off = pctOff(d);
  const truckSave = d.truck_price ? d.truck_price - d.sale_price : null;
  return (
    <article className="relative flex flex-col rounded-xl border border-shop-700 bg-shop-900 p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-xs">
        <Link href={`/b/${brandSlug(d.brand)}`} className="rounded bg-shop-700 px-2 py-0.5 font-semibold uppercase tracking-wide text-steel-300 hover:text-white">
          {d.brand}
        </Link>
        <Link href={`/c/${d.category}`} className="text-steel-400 hover:text-white">{categoryName(d.category)}</Link>
        {off > 0 && <span className="ml-auto rounded bg-safety-500 px-2 py-0.5 font-bold text-black">{off}% off</span>}
      </div>
      <h3 className="text-[15px] font-semibold leading-snug text-white">
        <a href={`/go/${d.slug}`} rel="nofollow sponsored noopener" target="_blank" className="hover:text-safety-400">
          {rank ? <span className="mr-1 text-safety-500">#{rank}</span> : null}
          {d.title}
        </a>
      </h3>
      <div className="mt-3 flex items-baseline gap-3">
        <span className="font-mono text-2xl font-bold text-safety-400">{usd(d.sale_price)}</span>
        <span className="text-sm text-steel-400">
          <span className="line-through">{usd(d.list_price)}</span> <span className="text-xs">{(d.list_price_label || "List price").toLowerCase()}</span>
        </span>
      </div>
      {d.truck_price && d.truck_brand ? (
        <p className="mt-2 rounded-md border border-shop-700 bg-shop-950 px-3 py-2 text-[13px] text-steel-300">
          <span className="font-semibold text-white">Truck price:</span>{" "}
          <a href={d.truck_url || "#"} target="_blank" rel="nofollow noopener" className="underline decoration-shop-600 hover:text-white">
            {d.truck_title || d.truck_brand}
          </a>{" "}
          {usd(d.truck_price)}
          {truckSave !== null && truckSave > 0 ? (
            <span className="text-safety-400"> · save {usd(truckSave)}</span>
          ) : (
            <span className="text-steel-400"> · truck version costs less</span>
          )}
        </p>
      ) : null}
      {d.condition ? <p className="mt-2 text-xs text-amber-300">{d.condition}</p> : null}
      {d.notes ? <p className="mt-1 text-xs text-steel-400">{d.notes}</p> : null}
      <div className="mt-auto flex items-center justify-between pt-3 text-xs text-steel-400">
        <span>
          {d.retailer} · checked {checked(d.checked_at)}
        </span>
        <a href={`/go/${d.slug}`} rel="nofollow sponsored noopener" target="_blank" className="rounded-md bg-safety-500 px-3 py-1.5 text-sm font-bold text-black hover:bg-safety-400">
          See deal
        </a>
      </div>
    </article>
  );
}

export function DealGrid({ deals, numbered }: { deals: Deal[]; numbered?: boolean }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {deals.map((d, i) => (
        <DealCard key={d.slug} d={d} rank={numbered ? i + 1 : undefined} />
      ))}
    </div>
  );
}
