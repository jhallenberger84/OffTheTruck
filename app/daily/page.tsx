import Link from "next/link";
import { dailyLabel, getDailyPosts } from "@/lib/daily";
import { SignupBlock } from "@/components/SignupBlock";
import { TopSignup } from "@/components/TopSignup";

export const metadata = {
  title: "Daily deals",
  description: "One real tool deal a day for auto techs, with the truck-brand price next to it.",
  alternates: { canonical: "/daily", types: { "application/rss+xml": "/rss.xml" } },
};

export default function DailyIndex() {
  const posts = getDailyPosts();
  return (
    <>
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h1 className="text-2xl font-black text-white">Daily deals</h1>
        <a href="/rss.xml" className="text-sm text-safety-400 hover:underline">RSS</a>
      </div>
      <div className="mb-4">
        <TopSignup source="daily-index-top" />
      </div>
      {posts.length === 0 ? (
        <p className="text-steel-300">The first daily post is coming soon. <Link href="/" className="text-safety-400 underline">See today&apos;s deals</Link>.</p>
      ) : (
        <ul className="space-y-2">
          {posts.map((p) => (
            <li key={p.date}>
              <Link href={`/daily/${p.date}`} className="block rounded-lg border border-shop-700 bg-shop-900 p-4 hover:border-safety-500">
                <span className="text-xs font-bold uppercase tracking-widest text-steel-400">{dailyLabel(p.date)}</span>
                <span className="mt-1 block text-lg font-black text-white">{p.subject}</span>
                <span className="mt-1 block text-sm text-steel-300">{p.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <SignupBlock source="daily-index" />
    </>
  );
}
