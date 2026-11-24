import { getActiveDeals, type Deal } from "./deals";

export type Pair = Deal & { truck_price: number; truck_brand: string; save: number; savePct: number };

function toPair(d: Deal): Pair | null {
  if (!d.truck_price || !d.truck_brand) return null;
  const save = d.truck_price - d.sale_price;
  return { ...(d as Pair), save, savePct: Math.round((save / d.truck_price) * 100) };
}

/** Live deals that have a real truck-brand price next to them, biggest saving first. */
export async function getTruckPairs(): Promise<Pair[]> {
  const deals = await getActiveDeals();
  return deals.map(toPair).filter((p): p is Pair => Boolean(p)).sort((a, b) => b.save - a.save);
}

/** One live pair by deal slug (same filter as the site: active and not past its end time). */
export async function getTruckPair(slug: string): Promise<Pair | null> {
  return (await getTruckPairs()).find((p) => p.slug === slug) ?? null;
}

export const shortTruck = (p: Pick<Pair, "truck_brand" | "truck_title">) =>
  p.truck_title ? `${p.truck_brand} ${p.truck_title.replace(new RegExp(`^${p.truck_brand}\\s*`, "i"), "")}` : p.truck_brand;
