import Link from "next/link";
import type { Deal } from "@/lib/deals";
import { CATEGORIES } from "@/lib/site";
import { CategoryIcon } from "./Icons";

export function CategoryChips({ deals, active }: { deals: Deal[]; active?: string }) {
  return (
    <nav aria-label="Categories" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
      {CATEGORIES.map((c) => {
        const n = deals.filter((d) => d.category === c.slug).length;
        const on = active === c.slug;
        return (
          <Link
            key={c.slug}
            href={`/c/${c.slug}`}
            aria-current={on ? "page" : undefined}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
              on ? "border-safety-500 bg-safety-500 text-black" : "border-shop-600 bg-shop-900 text-steel-300 hover:border-safety-500 hover:text-white"
            }`}
          >
            <CategoryIcon slug={c.slug} className="h-5 w-5" />
            {c.name}
            <span className={`rounded-full px-1.5 text-xs ${on ? "bg-black/20" : "bg-shop-700 text-steel-300"}`}>{n}</span>
          </Link>
        );
      })}
    </nav>
  );
}
