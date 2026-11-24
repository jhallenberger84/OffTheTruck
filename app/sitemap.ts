import type { MetadataRoute } from "next";
import { brandsOf, getActiveDeals } from "@/lib/deals";
import { getDailyPosts } from "@/lib/daily";
import { getTruckPairs } from "@/lib/pairs";
import { CATEGORIES, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const deals = await getActiveDeals();
  const now = new Date();
  const pairs = await getTruckPairs();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    ...CATEGORIES.map((c) => ({ url: `${SITE_URL}/c/${c.slug}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.8 })),
    { url: `${SITE_URL}/brands`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    ...brandsOf(deals).map((b) => ({ url: `${SITE_URL}/b/${b.slug}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.6 })),
    { url: `${SITE_URL}/daily`, changeFrequency: "daily", priority: 0.7 },
    ...getDailyPosts().map((p) => ({ url: `${SITE_URL}/daily/${p.date}`, lastModified: new Date(`${p.date}T12:00:00Z`), changeFrequency: "never" as const, priority: 0.5 })),
    { url: `${SITE_URL}/tool-truck-vs-online-prices`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/milwaukee-vs-dewalt-for-mechanics`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/knipex-vs-tool-truck-pliers`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/black-friday-tool-deals-for-mechanics`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/gearwrench-vs-tekton-for-mechanics`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/wera-vs-tool-truck-tools`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/tool-truck-payment-calculator`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/vs`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    ...pairs.map((p) => ({ url: `${SITE_URL}/vs/${p.slug}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.6 })),
    { url: `${SITE_URL}/about-for-ai`, lastModified: now, changeFrequency: "weekly", priority: 0.4 },
    { url: `${SITE_URL}/submit`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/sponsor`, changeFrequency: "monthly", priority: 0.4 },
  ];
}
