import Link from "next/link";
import { brandColor } from "@/lib/brands";
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
          <Link key={b.slug} href={`/b/${b.slug}`} className="overflow-hidden rounded-lg border border-shop-700 bg-shop-900 hover:border-safety-500">
            <span className="block px-3 py-3 text-center text-lg font-black uppercase tracking-wider" style={{ background: brandColor(b.slug).bg, color: brandColor(b.slug).fg }}>{b.name}</span>
            <span className="block px-3 py-2 text-xs text-steel-300">{b.count} {b.count === 1 ? "deal" : "deals"}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
