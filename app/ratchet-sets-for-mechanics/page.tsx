import type { Metadata } from "next";
import Link from "next/link";
import { DealGrid } from "@/components/DealCard";
import { SignupBlock } from "@/components/SignupBlock";
import { TopSignup } from "@/components/TopSignup";
import { catalogFacts, fmtDate } from "@/lib/facts";
import type { Deal } from "@/lib/deals";
import { brandSlug } from "@/lib/site";

export const revalidate = 300;

const PATH = "/ratchet-sets-for-mechanics";
export const metadata: Metadata = {
  title: "Ratchet sets for mechanics: live online prices, no guessed truck numbers",
  description:
    "Live ratchet, ratcheting wrench, and mechanics-set deals (GearWrench, DeWALT, Gedore, Stahlwille) with prices checked on the seller's page. Truck comparisons only when a pair is already in our database.",
  alternates: { canonical: PATH },
  openGraph: { url: PATH, type: "article" },
};

const isRatchetDeal = (d: Deal) =>
  /ratchet|ratcheting|mechanics set|microdriver/i.test(d.title);

const latest = (ds: Deal[]) => fmtDate(ds.reduce<string | null>((m, d) => (!m || d.checked_at > m ? d.checked_at : m), null));

export default async function RatchetSets() {
  const f = await catalogFacts();
  const ratchets = f.deals.filter(isRatchetDeal);
  const sets = ratchets.filter((d) => /set/i.test(d.title));
  const singles = ratchets.filter((d) => !/set/i.test(d.title));
  const pairs = ratchets.filter((d) => d.truck_price && d.truck_brand);
  const checkedOn = latest(ratchets);
  const brands = [...new Set(ratchets.map((d) => d.brand))];
  const amazon = ratchets.filter((d) => /amazon/i.test(d.retailer));

  return (
    <article className="mx-auto max-w-5xl space-y-8 text-steel-300">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-safety-400">Price check, updated live</p>
        <h1 className="mt-1 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">Ratchet sets for mechanics: live online prices</h1>
        <p className="mt-3 max-w-3xl">
          This is the live ratchet and ratcheting-wrench mix we track: full mechanics sets, ratcheting wrench sets, a cordless 1/2&quot; ratchet kit, a bit ratchet, and a single combination ratcheting wrench. Prices last checked {checkedOn} on the seller&apos;s own page. {pairs.length ? `A truck-brand price is already in our database for ${pairs.length} of these.` : "None of these deals currently have a tool-truck price in our database, so this page does not invent one."}
        </p>
      </header>

      <TopSignup source="seo-top-ratchet-sets" />

      <section aria-labelledby="live-sets">
        <h2 id="live-sets" className="mb-2 text-2xl font-black text-white">Live ratchet and mechanics sets ({sets.length})</h2>
        {sets.length ? <DealGrid deals={sets} /> : <p>No ratchet sets are live right now. <Link className="text-safety-400 hover:underline" href="/c/sockets-ratchets">See all socket and ratchet deals</Link>.</p>}
      </section>

      {singles.length ? (
        <section aria-labelledby="live-singles">
          <h2 id="live-singles" className="mb-2 text-2xl font-black text-white">Single ratcheting wrenches ({singles.length})</h2>
          <DealGrid deals={singles} />
        </section>
      ) : null}

      <section aria-labelledby="truck">
        <h2 id="truck" className="mb-2 text-2xl font-black text-white">Truck price comparisons</h2>
        {pairs.length ? (
          <p>These ratchet deals already have a truck-brand price in our database: {pairs.map((d, i) => (<span key={d.slug}>{i ? ", " : ""}<Link className="text-safety-400 hover:underline" href={`/vs/${d.slug}`}>{d.title}</Link></span>))}. We did not add new truck list prices for this page.</p>
        ) : (
          <p>
            We don&apos;t have a Mac, Snap-on, or Matco list price on file for the ratchet deals above, so there is no /vs comparison page for them yet. For other tools where we do have a checked truck price, see <Link className="text-safety-400 hover:underline" href="/vs">every truck vs online pair</Link>. A related live pair, if you&apos;re shopping torque wrenches rather than ratchets, is the <Link className="text-safety-400 hover:underline" href="/vs/tekton-trq99903-split-beam-torque-set-outlet">Tekton split-beam set next to a Mac Tools TWV250P</Link>.
          </p>
        )}
      </section>

      <section aria-labelledby="pick">
        <h2 id="pick" className="mb-2 text-2xl font-black text-white">How to decide, tech to tech</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong className="text-white">A mechanics set, a ratcheting wrench set, and a cordless ratchet are three different buys.</strong> Count the teeth, the drive sizes, and whether you&apos;re getting a handle, a powered tool, or both.</li>
          <li><strong className="text-white">Fine-tooth heads matter in tight engine bays.</strong> GearWrench advertises 90-tooth and 120XP mechanisms on the sets above; read the seller page for the actual swing arc before you compare them to a coarser truck ratchet.</li>
          {amazon.length ? <li><strong className="text-white">Amazon prices on this page can move several times a day.</strong> Recheck the Amazon listing before you buy.</li> : null}
        </ul>
        <p className="mt-3">More: <Link className="text-safety-400 hover:underline" href="/c/sockets-ratchets">all socket and ratchet deals</Link>, <Link className="text-safety-400 hover:underline" href="/c/wrenches">wrenches</Link>, {brands.map((b, i) => (<span key={b}>{i ? ", " : ""}<Link className="text-safety-400 hover:underline" href={`/b/${brandSlug(b)}`}>{b}</Link></span>))}, <Link className="text-safety-400 hover:underline" href="/gearwrench-vs-tekton-for-mechanics">GearWrench vs Tekton</Link>, <Link className="text-safety-400 hover:underline" href="/impact-socket-sets-for-mechanics">impact socket sets</Link>, or <Link className="text-safety-400 hover:underline" href="/">all {f.total} current deals</Link>.</p>
      </section>

      <section aria-labelledby="sources" className="text-sm">
        <h2 id="sources" className="mb-2 text-xl font-black text-white">Sources</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Online prices: each card links to the seller page it was read from, with the check date on the card. Live data from our deals database.</li>
          <li>No new tool-truck list prices were collected for this page. Truck comparisons appear only when that data is already in the database.</li>
        </ul>
        <p className="mt-3 text-xs text-steel-400">Off the Truck earns a commission on some of the links above. It doesn&apos;t change the prices we show. See <Link className="underline" href="/about-for-ai">how the site works</Link>.</p>
      </section>

      <SignupBlock source="seo-ratchet-sets" />
    </article>
  );
}
