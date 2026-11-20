import Link from "next/link";
import { notFound } from "next/navigation";
import { dailyLabel, getDailyPost, getDailyPosts, usd } from "@/lib/daily";
import { SignupBlock } from "@/components/SignupBlock";

export const dynamicParams = false;
export function generateStaticParams() {
  return getDailyPosts().map((p) => ({ date: p.date }));
}

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }) {
  const p = getDailyPost((await params).date);
  if (!p) return {};
  return {
    title: p.subject,
    description: p.summary,
    alternates: { canonical: `/daily/${p.date}` },
    openGraph: { type: "article", title: p.subject, description: p.summary, publishedTime: `${p.date}T12:00:00Z` },
  };
}

export default async function DailyPostPage({ params }: { params: Promise<{ date: string }> }) {
  const p = getDailyPost((await params).date);
  if (!p) notFound();
  return (
    <article className="mx-auto max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-widest text-steel-400">
        <Link href="/daily" className="hover:text-white">Daily deals</Link> · {dailyLabel(p.date)}
      </p>
      <h1 className="mt-1 text-3xl font-black leading-tight text-white">{p.subject}</h1>
      {p.sponsor && (
        <p className="mt-4 rounded-md bg-safety-500 px-3 py-2 text-sm font-semibold text-black">
          Sponsored by <a href="/go/sponsor?p=daily" rel="sponsored nofollow" className="underline">{p.sponsor.headline || p.sponsor.name}</a>
        </p>
      )}
      <div className="mt-4 space-y-3 text-steel-300">
        {p.body.map((para, i) => <p key={i}>{para}</p>)}
      </div>
      <div className="mt-6 space-y-3">
        {p.deals.map((d) => (
          <div key={d.slug} className="rounded-lg border border-shop-700 bg-shop-900 p-4">
            <a href={`/go/${d.slug}`} rel="sponsored nofollow noopener" className="font-bold text-white underline decoration-safety-500 underline-offset-2">{d.title}</a>
            <p className="mt-1 text-sm text-steel-300">
              <span className="font-mono font-bold text-safety-400">{usd(d.sale_price)}</span> at {d.retailer}
              {d.list_price ? ` (list ${usd(d.list_price)})` : ""}
            </p>
            {d.truck_price && d.truck_brand && (
              <p className="mt-1 text-sm text-steel-300">
                {d.truck_brand}: {d.truck_url ? <a href={d.truck_url} target="_blank" rel="nofollow noopener" className="underline">{d.truck_title || "comparable tool"}</a> : d.truck_title || "comparable tool"}{" "}
                <span className="font-mono">{usd(d.truck_price)}</span>
              </p>
            )}
            <p className="mt-1 text-xs text-steel-400">Prices checked {new Date(d.checked_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" })} CT. They can change fast.</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm"><Link href="/" className="font-semibold text-safety-400 hover:underline">See all deals on Off the Truck →</Link></p>
      <SignupBlock source={`daily-${p.date}`} />
    </article>
  );
}
