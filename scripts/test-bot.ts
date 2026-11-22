import { isBotUserAgent, storedUserAgent } from "../lib/bot.ts";

const bots: [string, string][] = [
  ["empty", ""],
  ["whitespace", "   "],
  ["Googlebot", "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"],
  ["Googlebot simple", "Googlebot/2.1 (+http://www.google.com/bot.html)"],
  ["bingbot", "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"],
  ["facebookexternalhit", "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"],
  ["facebookcatalog", "facebookcatalog/1.0"],
  ["Facebot", "Facebot"],
  ["Twitterbot", "Twitterbot/1.0"],
  ["Slackbot", "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)"],
  ["Slack-ImgPreview", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Slack-ImgPreview"],
  ["Discordbot", "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)"],
  ["LinkedInBot", "LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)"],
  ["LinkedInBot mozilla-compatible", "Mozilla/5.0 (compatible; LinkedInBot/1.0; +http://www.linkedin.com)"],
  ["TelegramBot", "TelegramBot (like TwitterBot)"],
  ["Applebot", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15 (Applebot/0.1)"],
  ["AhrefsBot", "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)"],
  ["SemrushBot", "Mozilla/5.0 (compatible; SemrushBot/7~bl; +http://www.semrush.com/bot.html)"],
  ["curl", "curl/8.5.0"],
  ["wget", "Wget/1.21.4"],
  ["python-requests", "python-requests/2.31.0"],
  ["Go-http-client", "Go-http-client/2.0"],
  ["node-fetch", "node-fetch/1.0"],
  ["axios", "axios/1.6.0"],
  ["HeadlessChrome", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/120.0.0.0 Safari/537.36"],
  ["crawler", "Mozilla/5.0 (compatible; SomeCrawler/1.0)"],
  ["spider", "Mozilla/5.0 (compatible; myspider/1.0)"],
  ["Bytespider", "Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; https://zhanzhang.sm.cn/)"],
  ["WhatsApp preview bare", "WhatsApp/2.21.10.20 A"],
  ["WhatsApp preview version only", "WhatsApp/2.23.20.0"],
  ["Instagram preview bare", "Instagram/10.0.0.0.0"],
];

const humans: [string, string][] = [
  ["Chrome desktop", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"],
  ["iPhone Safari", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"],
  ["Android Chrome", "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.43 Mobile Safari/537.36"],
  ["Firefox", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0"],
  [
    "WhatsApp in-app iOS",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1 WhatsApp/2.23.20.0",
  ],
  [
    "WhatsApp in-app Android",
    "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36 WhatsApp/2.24.2.76",
  ],
  [
    "Instagram iOS",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/20A362 Instagram 10.0.0.0.0 (iPhone14,3; iOS 16_0; en_US; en-US; scale=3.00; 1170x2532; 458737399)",
  ],
  [
    "Facebook iOS",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21A329 [FBAN/FBIOS;FBAV/10.0.0.20.74;FBBV/1;FBDV/iPhone14,3;FBMD/iPhone;FBSN/iOS;FBSV/17.0;FBSS/3;FBID/phone;FBLC/en_US;FBOP/5]",
  ],
  [
    "Facebook Android",
    "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/10.0.0.20.74;]",
  ],
  [
    "Messenger iOS",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21A329 [FBAN/MessengerForiOS;FBAV/10.0.0;]",
  ],
  [
    "LinkedIn in-app",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21A329 [LinkedInApp]",
  ],
  [
    "Snapchat iOS",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21A329 Snapchat/12.0.0.0",
  ],
  [
    "TikTok iOS",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21A329 musical_ly_32.0.0 BytedanceWebview/1.0",
  ],
  [
    "TikTok Android",
    "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36 TikTok 32.0.0",
  ],
  [
    "Line iOS",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21A329 Safari Line/13.0.0",
  ],
  [
    "Twitter iPhone",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21A329 Twitter-iPhone/10.0",
  ],
  [
    "Twitter Android",
    "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36 TwitterAndroid/10.0",
  ],
  [
    "X / Twitter slash",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21A329 Twitter/10.0",
  ],
  ["OTTKeeper (classifier only; isInternal skips logging)", "OTTKeeper"],
];

let failed = 0;
for (const [name, ua] of bots) {
  if (!isBotUserAgent(ua)) {
    console.error("FALSE NEGATIVE:", name, JSON.stringify(ua));
    failed++;
  }
}
for (const [name, ua] of humans) {
  if (isBotUserAgent(ua)) {
    console.error("FALSE POSITIVE:", name, JSON.stringify(ua));
    failed++;
  }
}
if (storedUserAgent("") !== null) {
  console.error("empty UA should store null");
  failed++;
}
if (storedUserAgent("  Chrome  ") !== "Chrome") {
  console.error("trim failed");
  failed++;
}
if (failed) {
  console.error("FAILED", failed);
  process.exit(1);
}
console.log("ok", bots.length, "bots flagged,", humans.length, "humans clean");
