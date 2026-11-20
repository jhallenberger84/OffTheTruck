import { brandsOf, getActiveDeals, type Deal } from "./deals";
import { CATEGORIES } from "./site";

/** Facts about the live catalog, computed from the same data source the site renders. */
export async function catalogFacts() {
  const deals = await getActiveDeals();
  return catalogFactsFrom(deals);
}

export function catalogFactsFrom(deals: Deal[]) {
  const retailers = new Map<string, number>();
  for (const d of deals) retailers.set(d.retailer, (retailers.get(d.retailer) ?? 0) + 1);
  const truckBrands = [...new Set(deals.map((d) => d.truck_brand).filter((b): b is string => Boolean(b)))];
  const withTruck = deals.filter((d) => d.truck_price && d.truck_brand);
  const latest = deals.reduce<string | null>((m, d) => (!m || d.checked_at > m ? d.checked_at : m), null);
  return {
    deals,
    total: deals.length,
    brands: brandsOf(deals),
    categories: CATEGORIES.map((c) => ({ ...c, count: deals.filter((d) => d.category === c.slug).length })),
    retailers: [...retailers.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count })),
    truckBrands,
    withTruck,
    lastChecked: latest,
  };
}

export const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Chicago" }) : "unknown";
export const isoDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-CA", { timeZone: "America/Chicago" }) : "unknown";
