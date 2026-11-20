import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DealGrid } from "@/components/DealCard";
import { getActiveDeals } from "@/lib/deals";
import { brandSlug } from "@/lib/site";

export const revalidate = 300;
export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const slug = (await params).brand;
  const d = (await getActiveDeals()).find((x) => brandSlug(x.brand) === slug);
  if (!d) return {};
  return { title: `${d.brand} tool deals`, description: `What's on sale from ${d.brand} right now, with truck-brand price comparisons.`, alternates: { canonical: `/b/${slug}` } };
}
export default async function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params;
  const deals = (await getActiveDeals()).filter((d) => brandSlug(d.brand) === brand);
  if (!deals.length) notFound();
  return (
    <>
      <h1 className="text-2xl font-black text-white">{deals[0].brand} deals</h1>
      <p className="mb-4 text-sm text-steel-400">{deals.length} live deals.</p>
      <DealGrid deals={deals} />
    </>
  );
}
