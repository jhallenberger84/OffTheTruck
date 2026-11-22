import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DealGrid } from "@/components/DealCard";
import { SignupBlock } from "@/components/SignupBlock";
import { getActiveDeals } from "@/lib/deals";
import { brandColor } from "@/lib/brands";
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
      <section className="relative -mx-4 -mt-5 mb-5 overflow-hidden diamond-plate sm:mx-0 sm:mt-0 sm:rounded-2xl">
        <div className="px-5 py-6 sm:px-8">
          <span className="inline-block rounded-sm px-4 py-2 text-2xl font-black uppercase tracking-wider ring-2 ring-black/50" style={{ background: brandColor(brand).bg, color: brandColor(brand).fg }}>
            {deals[0].brand}
          </span>
          <p className="mt-3 text-sm text-steel-300">{deals.length} live {deals.length === 1 ? "deal" : "deals"} on {deals[0].brand} right now.</p>
          <h1 className="sr-only">{deals[0].brand} deals</h1>
        </div>
        <div className="h-2 hazard" aria-hidden />
      </section>
      <DealGrid deals={deals} />
      <SignupBlock source={`brand-${brand}`.slice(0, 40)} />
    </>
  );
}
