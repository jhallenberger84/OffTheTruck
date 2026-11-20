import { validUnsub } from "@/lib/unsub";

export const dynamic = "force-dynamic";
export const metadata = { title: "Unsubscribe", robots: { index: false, follow: false } };

export default async function Unsubscribe({ searchParams }: { searchParams: Promise<{ e?: string; t?: string; done?: string }> }) {
  const { e = "", t = "", done } = await searchParams;
  return (
    <div className="mx-auto max-w-md py-10">
      <h1 className="text-2xl font-black text-white">Unsubscribe</h1>
      {done ? (
        <p className="mt-3 text-steel-300">You&apos;re unsubscribed. No more Off the Truck emails.</p>
      ) : validUnsub(e, t) ? (
        <form method="post" action="/api/unsubscribe" className="mt-3">
          <p className="text-steel-300">Stop Off the Truck emails to {e}?</p>
          <input type="hidden" name="e" value={e} />
          <input type="hidden" name="t" value={t} />
          <button className="mt-4 rounded-md bg-safety-500 px-4 py-2 font-bold text-black hover:bg-safety-400">Yes, unsubscribe me</button>
        </form>
      ) : (
        <p className="mt-3 text-steel-300">That unsubscribe link isn&apos;t valid. Reply to any Off the Truck email and we&apos;ll take you off by hand.</p>
      )}
    </div>
  );
}
