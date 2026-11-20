import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryChips } from "@/components/CategoryChips";
import { DealGrid } from "@/components/DealCard";
import { CategoryIcon } from "@/components/Icons";
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
  const all = await getActiveDeals();
  const deals = all.filter((d) => d.category === c.slug);
  return (
    <>
      <section className="relative -mx-4 -mt-5 mb-5 overflow-hidden diamond-plate sm:mx-0 sm:mt-0 sm:rounded-2xl">
        <div className="flex items-center gap-4 px-5 py-6 sm:px-8">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-safety-500 text-black ring-4 ring-black/60">
            <CategoryIcon slug={c.slug} className="h-10 w-10" />
          </span>
          <div>
            <h1 className="text-3xl font-black uppercase leading-none tracking-tight text-white text-shadow-hard">{c.name}</h1>
            <p className="mt-2 text-sm text-steel-300">{c.blurb} {deals.length} live deals.</p>
          </div>
        </div>
        <div className="h-2 hazard" aria-hidden />
      </section>
      <div className="mb-5"><CategoryChips deals={all} active={c.slug} /></div>
      {deals.length ? <DealGrid deals={deals} /> : <p className="text-steel-400">No live deals here right now. Check back tomorrow.</p>}
    </>
  );
}
