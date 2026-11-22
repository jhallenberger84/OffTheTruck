/**
 * Obvious non-human User-Agents for /go click logging.
 * Empty or missing UA is treated as a bot. Internal OTT traffic is skipped
 * before this runs (see isInternal in lib/internal.ts).
 *
 * In-app browsers (WhatsApp, Instagram, Facebook, Messenger, LinkedIn,
 * Snapchat, TikTok, Line, Twitter/X) are real people when the UA is a
 * Mozilla/WebKit/Gecko browser string. Bare "App/1.2" fetchers with no
 * browser engine are treated as link-preview bots. Named crawlers
 * (Googlebot, facebookexternalhit, Twitterbot, LinkedInBot, Bytespider,
 * etc.) stay flagged even if they include Mozilla.
 */
const BROWSER_ENGINE = /mozilla\/\d|applewebkit\/|\bgecko\//i;

const CRAWLERS =
  /googlebot|google-inspectiontool|mediapartners-google|adsbot-google|bingbot|bingpreview|facebookexternalhit|facebookcatalog|facebot|twitterbot|slackbot|discordbot|linkedinbot|telegrambot|applebot|ahrefsbot|semrushbot|dotbot|mj12bot|petalbot|bytespider|gptbot|chatgpt-user|ccbot|claudebot|anthropic-ai|perplexitybot|meta-externalagent|ia_archiver|duckduckbot|yandexbot|baiduspider|screaming frog|chrome-lighthouse/i;

const TOOLS =
  /(?:^|[\s\/;(])(?:curl|wget|httpie)(?:\/|\s|$)|python-requests|python-urllib|go-http-client|node-fetch|axios\/|libwww-perl|\bokhttp|headlesschrome|headless|phantomjs|puppeteer|playwright|selenium/i;

const GENERIC = /bot\b|crawler|spider|crawl|preview|linkchecker|link.?check|w3c-checklink/i;

/** Tokens that appear in in-app browsers and in some link-preview fetchers. */
const IN_APP =
  /whatsapp|instagram|\bfban\b|\bfbav\b|fb_iab|\bfbios\b|messenger|linkedinapp|\blinkedin\/|\blinkedin\b|snapchat|tiktok|musical_ly|bytedancewebview|\bline\/|twitterandroid|twitter-iphone|\btwitter\/|\bx\/[0-9]/i;

export function hasBrowserEngine(ua: string): boolean {
  return BROWSER_ENGINE.test(ua);
}

export function isBotUserAgent(ua: string | null | undefined): boolean {
  const s = (ua || "").trim();
  if (!s) return true;
  if (CRAWLERS.test(s) || TOOLS.test(s)) return true;
  const inApp = IN_APP.test(s);
  const browser = hasBrowserEngine(s);
  if (inApp && !browser) return true; // bare App/x.y link-preview fetcher
  if (inApp && browser) return false; // real person in an in-app browser
  return GENERIC.test(s);
}

/** Truncate a User-Agent for storage. Empty string becomes null. */
export function storedUserAgent(ua: string | null | undefined): string | null {
  const s = (ua || "").trim().slice(0, 300);
  return s || null;
}
