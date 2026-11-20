import type { MetadataRoute } from "next";
import { brandsOf, getActiveDeals } from "@/lib/deals";
import { CATEGORIES, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const deals = await getActiveDeals();
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    ...CATEGORIES.map((c) => ({ url: `${SITE_URL}/c/${c.slug}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.8 })),
    { url: `${SITE_URL}/brands`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    ...brandsOf(deals).map((b) => ({ url: `${SITE_URL}/b/${b.slug}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.6 })),
    { url: `${SITE_URL}/submit`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/sponsor`, changeFrequency: "monthly", priority: 0.4 },
  ];
}
