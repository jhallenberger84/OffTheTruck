import type { Deal } from "./deals";

/** Refersion tracking id; override with env KCTOOL_RFSN if it ever changes. */
const DEFAULT_KCTOOL_RFSN = "9423510.adea47";

function isAmazonHost(hostname: string) {
  return /(^|\.)amazon\.com$/i.test(hostname);
}

function isKcToolHost(hostname: string) {
  return /(^|\.)kctool\.com$/i.test(hostname);
}

/**
 * Builds the outbound URL for a deal. Amazon links get AMAZON_ASSOCIATE_TAG
 * when set. KC Tool links (kctool.com, www, or any subdomain) get
 * rfsn=KCTOOL_RFSN, falling back to 9423510.adea47. Existing query params are
 * kept, and rfsn is never added twice. A per-deal affiliate_url (set through
 * /api/admin/deals) wins; if it already has rfsn it is returned unchanged, and
 * if it is a kctool.com URL without rfsn the param is appended.
 */
export function outboundUrl(d: Pick<Deal, "url" | "affiliate_url">) {
  const source = d.affiliate_url || d.url;
  const fromAffiliate = Boolean(d.affiliate_url);
  try {
    const u = new URL(source);
    if (fromAffiliate && u.searchParams.has("rfsn")) return d.affiliate_url as string;
    if (fromAffiliate && !isKcToolHost(u.hostname)) return d.affiliate_url as string;

    if (!fromAffiliate) {
      const amazonTag = process.env.AMAZON_ASSOCIATE_TAG;
      if (amazonTag && isAmazonHost(u.hostname)) u.searchParams.set("tag", amazonTag);
    }

    const rfsn = process.env.KCTOOL_RFSN || DEFAULT_KCTOOL_RFSN;
    if (rfsn && isKcToolHost(u.hostname) && !u.searchParams.has("rfsn")) {
      u.searchParams.set("rfsn", rfsn);
    }
    return u.toString();
  } catch {
    return source;
  }
}
