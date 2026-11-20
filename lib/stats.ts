import { db } from "./db";

export type Stats = {
  db: boolean;
  liveDeals: number;
  subscribers: number;
  pageviews30d: number;
  pageviewsAllTime: number;
  outboundClicks30d: number;
  sponsorClicks30d: number;
  pendingSubmissions: number;
  sponsorInquiries: number;
  errors7d: number;
};

export async function getStats(): Promise<Stats> {
  const sql = await db();
  if (!sql) {
    return { db: false, liveDeals: 0, subscribers: 0, pageviews30d: 0, pageviewsAllTime: 0, outboundClicks30d: 0, sponsorClicks30d: 0, pendingSubmissions: 0, sponsorInquiries: 0, errors7d: 0 };
  }
  const [r] = await sql`
    select
      (select count(*) from entries where status = 'active' and (expires_at is null or expires_at > now()))::int as "liveDeals",
      (select count(*) from signups)::int as subscribers,
      (select coalesce(sum(views),0) from pageviews where day > current_date - 30)::int as "pageviews30d",
      (select coalesce(sum(views),0) from pageviews)::int as "pageviewsAllTime",
      (select count(*) from outbound_clicks where created_at > now() - interval '30 days')::int as "outboundClicks30d",
      (select count(*) from sponsor_clicks where created_at > now() - interval '30 days')::int as "sponsorClicks30d",
      (select count(*) from submissions where status = 'pending')::int as "pendingSubmissions",
      (select count(*) from sponsor_inquiries)::int as "sponsorInquiries",
      (select count(*) from errors where created_at > now() - interval '7 days')::int as "errors7d"`;
  return { db: true, ...(r as unknown as Omit<Stats, "db">) };
}
