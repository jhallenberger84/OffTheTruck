import type { Deal } from "./deals";

/**
 * Builds the outbound URL for a deal. Affiliate accounts don't exist yet, so this
 * returns the plain product URL. When a program is approved, set its env var
 * (e.g. AMAZON_ASSOCIATE_TAG) and the tag is added here, with no other code changes.
 * A per-deal affiliate_url (set through /api/admin/deals) always wins.
 */
export function outboundUrl(d: Pick<Deal, "url" | "affiliate_url">) {
  if (d.affiliate_url) return d.affiliate_url;
  try {
    const u = new URL(d.url);
    const amazonTag = process.env.AMAZON_ASSOCIATE_TAG;
    if (amazonTag && /(^|\.)amazon\.com$/.test(u.hostname)) u.searchParams.set("tag", amazonTag);
    return u.toString();
  } catch {
    return d.url;
  }
}
