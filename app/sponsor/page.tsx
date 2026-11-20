import { SponsorInquiryForm } from "@/components/Forms";
import { getStats } from "@/lib/stats";
import { SPONSOR_PRICE_PER_WEEK } from "@/lib/site";
import { logError } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sponsor Off the Truck", description: "Put your tool brand, school, or shop in front of auto techs who are actively shopping for tools.", alternates: { canonical: "/sponsor" } };

export default async function Sponsor() {
  let stats = null;
  try {
    stats = await getStats();
  } catch (e) {
    await logError("sponsor.stats", e);
  }
  const fmt = (n: number) => n.toLocaleString("en-US");
  const cells = stats?.db
    ? [
        ["Email subscribers", fmt(stats.subscribers)],
        ["Pageviews, last 30 days", fmt(stats.pageviews30d)],
        ["Deal clicks, last 30 days", fmt(stats.outboundClicks30d)],
        ["Live deals", fmt(stats.liveDeals)],
      ]
    : null;
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-black text-white">Sponsor Off the Truck</h1>
      <p className="mt-2 text-steel-300">
        Off the Truck is where auto techs check tool prices before they buy. One sponsor per week gets the bar at the top of every page and the &ldquo;Sponsored by&rdquo; line in the Thursday email.
      </p>
      <h2 className="mt-6 mb-2 text-sm font-bold uppercase tracking-wide text-steel-400">Real numbers, straight from our database</h2>
      {cells ? (
        <div className="grid grid-cols-2 gap-2">
          {cells.map(([k, v]) => (
            <div key={k} className="rounded-lg border border-shop-700 bg-shop-900 p-3">
              <div className="font-mono text-2xl font-bold text-safety-400">{v}</div>
              <div className="text-xs text-steel-400">{k}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-shop-700 bg-shop-900 p-3 text-sm text-steel-400">Stats tracking is starting up. Ask us for current numbers.</p>
      )}
      <p className="mt-2 text-xs text-steel-400">We&apos;re new, so these numbers are small and honest. They update live.</p>
      <div className="mt-6 rounded-xl border border-safety-600/50 bg-shop-900 p-5">
        <p className="text-lg font-bold text-white">${SPONSOR_PRICE_PER_WEEK} per week, launch pricing</p>
        <ul className="mt-2 list-inside list-disc text-sm text-steel-300">
          <li>Top bar on every page for 7 days (Monday to Sunday)</li>
          <li>&ldquo;Sponsored by&rdquo; line in that week&apos;s Thursday email</li>
          <li>Click report at the end of the week</li>
        </ul>
        <p className="mt-2 text-xs text-steel-400">The price goes up as the list grows. Weeks you book now keep this price.</p>
      </div>
      <h2 className="mt-8 mb-3 text-lg font-bold text-white">Get in touch</h2>
      <SponsorInquiryForm />
    </div>
  );
}
