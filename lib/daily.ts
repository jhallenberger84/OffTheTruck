import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** One real deal in a daily post. Prices are a snapshot taken when the post was written. */
export type DailyDeal = {
  slug: string; // deal slug on the site; links go through /go/<slug>
  title: string;
  retailer: string;
  sale_price: number;
  list_price?: number;
  source_url: string; // the retailer page the price came from
  truck_brand?: string;
  truck_title?: string;
  truck_price?: number;
  truck_url?: string;
  checked_at: string; // ISO timestamp the prices were checked
};

export type DailyPost = {
  date: string; // YYYY-MM-DD (America/Chicago), also the file name
  subject: string;
  summary: string; // one sentence for the index, RSS, and meta description
  body: string[]; // plain-text paragraphs
  deals: DailyDeal[];
  sponsor?: { name: string; url: string; headline?: string };
};

const DIR = join(process.cwd(), "content", "daily");
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function getDailyPosts(): DailyPost[] {
  let files: string[] = [];
  try {
    files = readdirSync(DIR).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f));
  } catch {
    return [];
  }
  return files
    .map((f) => JSON.parse(readFileSync(join(DIR, f), "utf8")) as DailyPost)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getDailyPost(date: string): DailyPost | null {
  if (!DATE_RE.test(date)) return null;
  return getDailyPosts().find((p) => p.date === date) ?? null;
}

export const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export function dailyLabel(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}
