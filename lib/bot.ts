/**
 * Obvious non-human User-Agents for /go click logging.
 * Empty or missing UA is treated as a bot. Internal OTT traffic is skipped
 * before this runs (see isInternal in lib/internal.ts).
 */
const NAMED =
  /googlebot|google-inspectiontool|mediapartners-google|adsbot-google|bingbot|bingpreview|facebookexternalhit|facebookcatalog|facebot|twitterbot|slackbot|discordbot|linkedinbot|whatsapp|telegrambot|applebot|ahrefsbot|semrushbot|dotbot|mj12bot|petalbot|bytespider|gptbot|chatgpt-user|ccbot|claudebot|anthropic-ai|perplexitybot|meta-externalagent|ia_archiver|duckduckbot|yandexbot|baiduspider|screaming frog|chrome-lighthouse/i;

const TOOLS =
  /(?:^|[\s\/;(])(?:curl|wget|httpie)(?:\/|\s|$)|python-requests|python-urllib|go-http-client|node-fetch|axios\/|libwww-perl|\bokhttp|headlesschrome|headless|phantomjs|puppeteer|playwright|selenium/i;

const GENERIC = /bot\b|crawler|spider|crawl|preview|linkchecker|link.?check|w3c-checklink/i;

export function isBotUserAgent(ua: string | null | undefined): boolean {
  const s = (ua || "").trim();
  if (!s) return true;
  return NAMED.test(s) || TOOLS.test(s) || GENERIC.test(s);
}

/** Truncate a User-Agent for storage. Empty string becomes null. */
export function storedUserAgent(ua: string | null | undefined): string | null {
  const s = (ua || "").trim().slice(0, 300);
  return s || null;
}
