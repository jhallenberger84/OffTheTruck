import Link from "next/link";
import { DealGrid } from "@/components/DealCard";
import { db, logError } from "@/lib/db";
import { getActiveDeals, searchDeals } from "@/lib/deals";

export const dynamic = "force-dynamic";
export const metadata = { title: "Search", robots: { index: false } };

export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = String((await searchParams).q ?? "").trim().slice(0, 100);
  const results = q ? searchDeals(await getActiveDeals(), q) : [];
  if (q && results.length === 0) {
    try {
      const sql = await db();
      if (sql) await sql`insert into zero_result_searches (q) values (${q.toLowerCase()})`;
    } catch (e) {
      await logError("search.log", e);
    }
  }
  return (
    <>
      <h1 className="mb-1 text-2xl font-black text-white">{q ? `Results for “${q}”` : "Search deals"}</h1>
      <form action="/search" className="mb-4 flex gap-2">
        <input name="q" defaultValue={q} placeholder="e.g. ratcheting wrench, impact, Knipex" className="w-full rounded-md border border-shop-600 bg-shop-950 px-3 py-2 text-white focus:border-safety-500 focus:outline-none" />
        <button className="rounded-md bg-safety-500 px-4 font-bold text-black">Search</button>
      </form>
      {q && results.length === 0 ? (
        <p className="text-steel-400">
          Nothing on sale for that right now. We log searches like this to know what to hunt for next. Found a deal yourself? <Link href="/submit" className="text-safety-400 underline">Submit it</Link>.
        </p>
      ) : (
        <DealGrid deals={results} />
      )}
    </>
  );
}
