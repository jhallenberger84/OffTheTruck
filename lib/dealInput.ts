import { money } from "./http";
import { CATEGORIES } from "./site";

export const DEAL_FIELDS = [
  "slug", "title", "brand", "category", "retailer", "url", "source", "sale_price", "list_price", "list_price_label",
  "condition", "notes", "truck_brand", "truck_title", "truck_price", "truck_url", "truck_checked_at", "affiliate_url",
  "featured", "status", "checked_at", "expires_at",
] as const;

export function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
}

/** Validates and picks known fields. `partial` allows updates that only change some fields. */
export function cleanDeal(input: Record<string, unknown>, partial = false): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
  const v: Record<string, unknown> = {};
  for (const k of DEAL_FIELDS) if (k in input) v[k] = input[k] === "" ? null : input[k];
  for (const k of ["sale_price", "list_price", "truck_price"] as const) if (k in v && v[k] !== null) {
    const m = money(v[k]);
    if (m === null) return { ok: false, error: `${k} must be a number` };
    v[k] = m;
  }
  if ("category" in v && !CATEGORIES.some((c) => c.slug === v.category)) return { ok: false, error: `category must be one of ${CATEGORIES.map((c) => c.slug).join(", ")}` };
  if ("status" in v && !["active", "expired", "draft"].includes(String(v.status))) return { ok: false, error: "status must be active, expired, or draft" };
  if ("url" in v && !/^https?:\/\//.test(String(v.url))) return { ok: false, error: "url must start with http(s)://" };
  if (!partial) {
    for (const k of ["title", "brand", "category", "retailer", "url", "sale_price", "list_price"]) if (v[k] === undefined || v[k] === null) return { ok: false, error: `${k} is required` };
    if (!v.slug) v.slug = slugify(`${v.brand} ${v.title}`);
    if (!v.source) v.source = v.url;
    if (!v.checked_at) v.checked_at = new Date().toISOString();
  }
  if (v.sale_price !== undefined && v.list_price !== undefined && Number(v.sale_price) > Number(v.list_price)) return { ok: false, error: "sale_price is higher than list_price" };
  return { ok: true, value: v };
}
