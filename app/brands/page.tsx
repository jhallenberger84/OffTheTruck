import Link from "next/link";
import { brandsOf, getActiveDeals } from "@/lib/deals";

export const revalidate = 300;
export const metadata = { title: "Brands", description: "Tool deals by brand: Tekton, GearWrench, Milwaukee, DeWALT, Knipex, Wera, and more.", alternates: { canonical: "/brands" } };

export default async function Brands() {
  const brands = brandsOf(await getActiveDeals());
  return (
    <>
      <h1 className="mb-4 text-2xl font-black text-white">Brands</h1>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {brands.map((b) => (
          <Link key={b.slug} href={`/b/${b.slug}`} className="rounded-lg border border-shop-700 bg-shop-900 p-3 hover:border-safety-500">
            <span className="block font-semibold text-white">{b.name}</span>
            <span className="text-xs text-steel-400">{b.count} deals</span>
          </Link>
        ))}
      </div>
    </>
  );
}
