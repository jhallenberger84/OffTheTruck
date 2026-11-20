import seed from "./seed.json";
import { db, logError } from "./db";
import { brandSlug } from "./site";

export type Deal = {
  id?: number;
  slug: string;
  title: string;
  brand: string;
  category: string;
  retailer: string;
  url: string;
  source?: string | null;
  sale_price: number;
  list_price: number;
  list_price_label?: string | null;
  condition?: string | null;
  notes?: string | null;
  truck_brand?: string | null;
  truck_title?: string | null;
  truck_price?: number | null;
  truck_url?: string | null;
  truck_checked_at?: string | null;
  affiliate_url?: string | null;
  featured?: boolean | null;
  image_url?: string | null;
  status?: string;
  checked_at: string;
};

export function pctOff(d: Pick<Deal, "sale_price" | "list_price">) {
  if (!d.list_price || d.list_price <= d.sale_price) return 0;
  return Math.round((1 - d.sale_price / d.list_price) * 100);
}

const seedImages = new Map((seed as { slug: string; image_url?: string }[]).map((d) => [d.slug, d.image_url ?? null]));

function normalize(r: Record<string, unknown>): Deal {
  const num = (v: unknown) => (v === null || v === undefined ? null : Number(v));
  const iso = (v: unknown) => (v instanceof Date ? v.toISOString() : (v as string | null) ?? null);
  return {
    ...(r as unknown as Deal),
    sale_price: Number(r.sale_price),
    list_price: Number(r.list_price),
    truck_price: num(r.truck_price),
    checked_at: iso(r.checked_at) as string,
    truck_checked_at: iso(r.truck_checked_at),
    // Rows seeded before the image column existed fall back to the image fetched with the seed data.
    image_url: (r.image_url as string | null) || seedImages.get(r.slug as string) || null,
  };
}

const seedDeals: Deal[] = (seed as Record<string, unknown>[]).map(normalize);

/**
 * Score: hand-featured picks first, then % off (capped at 40 so inflated "compare-at" prices
 * can't dominate), plus a bump when the deal beats a real truck-brand price.
 */
export function score(d: Deal) {
  const beatsTruck = d.truck_price && d.truck_price > d.sale_price ? 10 : 0;
  return (d.featured ? 1000 : 0) + Math.min(pctOff(d), 40) + beatsTruck;
}
function rank(a: Deal, b: Deal) {
  return score(b) - score(a) || pctOff(b) - pctOff(a);
}

export async function getActiveDeals(): Promise<Deal[]> {
  try {
    const sql = await db();
    if (sql) {
      const rows = await sql`select * from entries where status = 'active' and (expires_at is null or expires_at > now())`;
      return rows.map((r) => normalize(r)).sort(rank);
    }
  } catch (e) {
    await logError("getActiveDeals", e);
  }
  return [...seedDeals].sort(rank);
}

export async function getDealBySlug(slug: string): Promise<Deal | null> {
  try {
    const sql = await db();
    if (sql) {
      const [r] = await sql`select * from entries where slug = ${slug} limit 1`;
      return r ? normalize(r) : null;
    }
  } catch (e) {
    await logError("getDealBySlug", e);
  }
  return seedDeals.find((d) => d.slug === slug) ?? null;
}

export function brandsOf(deals: Deal[]) {
  const m = new Map<string, { name: string; slug: string; count: number }>();
  for (const d of deals) {
    const s = brandSlug(d.brand);
    const cur = m.get(s) ?? { name: d.brand, slug: s, count: 0 };
    cur.count++;
    m.set(s, cur);
  }
  return [...m.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function searchDeals(deals: Deal[], q: string) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return deals.filter((d) => {
    const hay = `${d.title} ${d.brand} ${d.category} ${d.retailer}`.toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
}
