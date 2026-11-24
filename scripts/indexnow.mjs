// Ping IndexNow (Bing, Yandex, Seznam, Naver...) with every URL in the live sitemap, or with URLs passed as args.
// Usage: node scripts/indexnow.mjs            -> all sitemap URLs
//        node scripts/indexnow.mjs <url> ...  -> just those
import { readdirSync, readFileSync } from "node:fs";
const HOST = "offthetruckhq.com";
const keyFile = readdirSync(new URL("../public/", import.meta.url)).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
const key = readFileSync(new URL(`../public/${keyFile}`, import.meta.url), "utf8").trim();
let urls = process.argv.slice(2);
if (!urls.length) {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`, { headers: { "user-agent": "OTT-indexnow", "x-ott-internal": "1" } })).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${keyFile}`, urlList: urls }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urls.length} URLs`);
console.log(await res.text());
