export const SITE_NAME = "Off the Truck";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://offthetruckhq.com").replace(/\/$/, "");
export const SITE_TAGLINE = "Pro tool deals for auto techs, checked daily. Know the price before the truck pulls up.";
export const OWNER_EMAIL = process.env.OWNER_EMAIL || "jhallenberger84@gmail.com";
export const SPONSOR_PRICE_PER_WEEK = 50;

export const CATEGORIES = [
  { slug: "sockets-ratchets", name: "Sockets & Ratchets", blurb: "Socket sets, ratchets, bit sockets, and torque wrenches." },
  { slug: "wrenches", name: "Wrenches", blurb: "Combination, ratcheting, flare-nut, and open-end wrenches." },
  { slug: "impacts-power", name: "Impacts & Power Tools", blurb: "Cordless impacts, ratchets, grinders, cut-off tools, and batteries." },
  { slug: "diagnostic", name: "Diagnostic Tools", blurb: "Scan tools, meters, battery testers, jump packs, and thermal cameras." },
  { slug: "specialty", name: "Specialty Tools", blurb: "Pliers, hose clamp tools, bleeders, lights, and job-specific tools." },
  { slug: "storage", name: "Tool Storage", blurb: "Tool boxes, carts, PACKOUT, and creepers." },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function categoryName(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}

export function brandSlug(brand: string) {
  return brand.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
