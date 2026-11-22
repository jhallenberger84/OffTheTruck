import { db } from "./db";

export type Stats = {
  db: boolean;
  liveDeals: number;
  subscribers: number;
  pageviews30d: number;
  pageviewsAllTime: number;
  /** Classified-human deal clicks (is_bot = false). Historical rows with unknown UA are excluded. */
  outboundClicks30d: number;
  outboundClicksRaw30d: number;
  outboundClicksBot30d: number;
  outboundClicksUnknown30d: number;
  /** Classified-human sponsor clicks (is_bot = false). */
  sponsorClicks30d: number;
  sponsorClicksRaw30d: number;
  sponsorClicksBot30d: number;
  sponsorClicksUnknown30d: number;
  pendingSubmissions: number;
  sponsorInquiries: number;
  errors7d: number;
};

const EMPTY: Stats = {
  db: false,
  liveDeals: 0,
  subscribers: 0,
  pageviews30d: 0,
  pageviewsAllTime: 0,
  outboundClicks30d: 0,
  outboundClicksRaw30d: 0,
  outboundClicksBot30d: 0,
  outboundClicksUnknown30d: 0,
  sponsorClicks30d: 0,
  sponsorClicksRaw30d: 0,
  sponsorClicksBot30d: 0,
  sponsorClicksUnknown30d: 0,
  pendingSubmissions: 0,
  sponsorInquiries: 0,
  errors7d: 0,
};

/** Hide the public click number until we have enough classified-human clicks to stand behind. */
export const PUBLIC_HUMAN_CLICKS_MIN = 10;

export function publicHumanClicks(human: number): number | null {
  return human >= PUBLIC_HUMAN_CLICKS_MIN ? human : null;
}

export async function getStats(): Promise<Stats> {
  const sql = await db();
  if (!sql) return { ...EMPTY };
  const [r] = await sql`
    select
      (select count(*) from entries where status = 'active' and (expires_at is null or expires_at > now()))::int as "liveDeals",
      (select count(*) from signups)::int as subscribers,
      (select coalesce(sum(views),0) from pageviews where day > current_date - 30)::int as "pageviews30d",
      (select coalesce(sum(views),0) from pageviews)::int as "pageviewsAllTime",
      (select count(*) from outbound_clicks where created_at > now() - interval '30 days' and is_bot is false)::int as "outboundClicks30d",
      (select count(*) from outbound_clicks where created_at > now() - interval '30 days')::int as "outboundClicksRaw30d",
      (select count(*) from outbound_clicks where created_at > now() - interval '30 days' and is_bot is true)::int as "outboundClicksBot30d",
      (select count(*) from outbound_clicks where created_at > now() - interval '30 days' and is_bot is null)::int as "outboundClicksUnknown30d",
      (select count(*) from sponsor_clicks where created_at > now() - interval '30 days' and is_bot is false)::int as "sponsorClicks30d",
      (select count(*) from sponsor_clicks where created_at > now() - interval '30 days')::int as "sponsorClicksRaw30d",
      (select count(*) from sponsor_clicks where created_at > now() - interval '30 days' and is_bot is true)::int as "sponsorClicksBot30d",
      (select count(*) from sponsor_clicks where created_at > now() - interval '30 days' and is_bot is null)::int as "sponsorClicksUnknown30d",
      (select count(*) from submissions where status = 'pending')::int as "pendingSubmissions",
      (select count(*) from sponsor_inquiries)::int as "sponsorInquiries",
      (select count(*) from errors where created_at > now() - interval '7 days')::int as "errors7d"`;
  return { db: true, ...(r as unknown as Omit<Stats, "db">) };
}
