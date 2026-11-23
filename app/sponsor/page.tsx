import { SponsorInquiryForm } from "@/components/Forms";
import { getStats, publicHumanClicks } from "@/lib/stats";
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
  // Known test rows from launch day (2026-11-19), not real readers: the owner's own signup (1)
  // and one test pageview (1). Historical deal clicks are not shown: most were bots or link
  // checkers, and older rows have no user agent, so we can't honestly count them as human.
  const TEST = { subscribers: 1, pageviews: 1 };
  const real = (n: number, t: number) => fmt(Math.max(0, n - t));
  const shownClicks = stats?.db ? publicHumanClicks(stats.outboundClicks30d) : null;
  const cells = stats?.db
    ? [
        ["Email subscribers", real(stats.subscribers, TEST.subscribers)],
        ["Pageviews since launch (Nov 19, 2026)", real(stats.pageviews30d, TEST.pageviews)],
        ...(shownClicks !== null ? [["Deal clicks from real visitors", fmt(shownClicks)] as [string, string]] : []),
        ["Live deals tracked", fmt(stats.liveDeals)],
      ]
    : null;
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-black text-white">Sponsor Off the Truck</h1>
      <p className="mt-2 text-steel-300">
        Off the Truck is a free tool-deals tracker for auto techs and shop folks: working technicians, shop owners, and students who buy their own tools and want to know the price before the truck pulls up. One sponsor per week gets the bar at the top of every page and the &ldquo;Sponsored by&rdquo; line in the daily email.
      </p>
      <h2 className="mt-6 mb-2 text-sm font-bold uppercase tracking-wide text-steel-400">Real numbers, launched Nov 2026</h2>
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
      <p className="mt-2 text-xs text-steel-400">Off the Truck launched in November 2026, so these numbers are small. We leave out the test signup and test pageview we know about. {shownClicks !== null ? <>Deal clicks only count clicks since November 21, 2026 from browsers we don&apos;t recognize as bots. Older clicks didn&apos;t store a user agent and most were bots or link checkers, so they&apos;re left out. Some automated traffic can still look like a normal browser, so read the click number as an upper bound too. </> : <>Deal clicks aren&apos;t listed yet: most recorded clicks so far were bots or link checkers, and we didn&apos;t store user agents on older clicks, so we can&apos;t honestly separate them. Going forward we only count real visitor clicks, and we&apos;ll show that number once it&apos;s big enough to mean something. </>}Pageviews may still include some of our own untagged testing and automated traffic (we skip our tagged test visits, but pageviews are stored as daily totals without a user agent, so we can&apos;t split them the same way). Read them as an upper bound. They come live from our database, and we won&apos;t pad them.</p>
      <div className="mt-6 rounded-xl border border-safety-600/50 bg-shop-900 p-5">
        <p className="text-lg font-bold text-white">${SPONSOR_PRICE_PER_WEEK} per week, launch pricing</p>
        <ul className="mt-2 list-inside list-disc text-sm text-steel-300">
          <li>Top bar on every page for 7 days (Monday to Sunday)</li>
          <li>&ldquo;Sponsored by&rdquo; line in that week&apos;s daily emails</li>
          <li>Click report at the end of the week</li>
        </ul>
        <p className="mt-3 text-sm font-semibold text-white">How to book</p>
        <ul className="mt-1 list-inside list-disc text-sm text-steel-300">
          <li>Fill out the form below with your company, website, and the ad copy you want to run.</li>
          <li>We reply by email within a day to confirm your week and send payment details. Online checkout isn&apos;t set up yet, so booking is by email for now.</li>
        </ul>
        <p className="mt-2 text-xs text-steel-400">The price goes up as the list grows. Weeks you book now keep this price.</p>
      </div>
      <h2 className="mt-8 mb-3 text-lg font-bold text-white">Get in touch</h2>
      <SponsorInquiryForm />
      <p className="mt-4 text-sm text-steel-400">
        Prefer email? <a href="mailto:offthetruckhq@mail.grokbot.com" className="font-semibold text-safety-400 underline hover:text-white">Contact</a> us at offthetruckhq@mail.grokbot.com.
      </p>
    </div>
  );
}
