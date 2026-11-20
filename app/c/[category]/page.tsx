import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DealGrid } from "@/components/DealCard";
import { getActiveDeals } from "@/lib/deals";
import { CATEGORIES } from "@/lib/site";

export const revalidate = 300;
export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const c = CATEGORIES.find((x) => x.slug === category);
  if (!c) return {};
  return { title: `${c.name} deals`, description: `Current deals on ${c.name.toLowerCase()} for auto techs. ${c.blurb}`, alternates: { canonical: `/c/${c.slug}` } };
}
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = CATEGORIES.find((x) => x.slug === category);
  if (!c) notFound();
  const deals = (await getActiveDeals()).filter((d) => d.category === c.slug);
  return (
    <>
      <h1 className="text-2xl font-black text-white">{c.name}</h1>
      <p className="mb-4 text-sm text-steel-400">{c.blurb} {deals.length} live deals.</p>
      {deals.length ? <DealGrid deals={deals} /> : <p className="text-steel-400">No live deals here right now. Check back tomorrow.</p>}
    </>
  );
}
