import Link from "next/link";
import { DealGrid } from "@/components/DealCard";
import { SignupForm } from "@/components/Forms";
import { getActiveDeals } from "@/lib/deals";
import { CATEGORIES } from "@/lib/site";

export const revalidate = 300;

export default async function Home() {
  const deals = await getActiveDeals();
  const latest = deals.reduce((m, d) => (d.checked_at > m ? d.checked_at : m), "");
  const when = latest ? new Date(latest).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", timeZone: "America/Chicago" }) : "";
  return (
    <>
      <section className="mb-4">
        <h1 className="text-2xl font-black leading-tight text-white sm:text-3xl">Today&apos;s best tool deals</h1>
        <p className="mt-1 text-sm text-steel-400">
          {deals.length} live deals on ICON, Tekton, GearWrench, Milwaukee, Knipex, Wera and more, with the truck price when there&apos;s a fair match. Last checked {when}.
        </p>
      </section>
      <DealGrid deals={deals.slice(0, 12)} numbered />
      <section className="my-8 rounded-xl border border-safety-600/50 bg-shop-900 p-5">
        <h2 className="text-lg font-bold text-white">The 5 best deals, every Thursday morning</h2>
        <p className="mb-3 text-sm text-steel-400">One short email. No spam, unsubscribe anytime.</p>
        <SignupForm source="home" />
      </section>
      <section className="mb-6">
        <h2 className="mb-3 text-lg font-bold text-white">Shop by category</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/c/${c.slug}`} className="rounded-lg border border-shop-700 bg-shop-900 p-3 hover:border-safety-500">
              <span className="block font-semibold text-white">{c.name}</span>
              <span className="text-xs text-steel-400">{deals.filter((d) => d.category === c.slug).length} deals</span>
            </Link>
          ))}
        </div>
      </section>
      {deals.length > 12 && (
        <section>
          <h2 className="mb-3 text-lg font-bold text-white">More deals</h2>
          <DealGrid deals={deals.slice(12)} />
        </section>
      )}
    </>
  );
}
