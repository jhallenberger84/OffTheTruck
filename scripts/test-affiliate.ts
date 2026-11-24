import { outboundUrl } from "../lib/affiliate.ts";

let failed = 0;
function check(name: string, got: unknown, want: unknown) {
  if (got !== want) {
    console.error("FAIL", name, "got", got, "want", want);
    failed++;
  }
}

const savedAmazon = process.env.AMAZON_ASSOCIATE_TAG;
const savedRfsn = process.env.KCTOOL_RFSN;
function setEnv(amazon: string | undefined, rfsn: string | undefined) {
  if (amazon === undefined) delete process.env.AMAZON_ASSOCIATE_TAG;
  else process.env.AMAZON_ASSOCIATE_TAG = amazon;
  if (rfsn === undefined) delete process.env.KCTOOL_RFSN;
  else process.env.KCTOOL_RFSN = rfsn;
}

const RFSN = "9423510.adea47";
const tagged = (path: string, extra = "") => {
  const u = new URL(path);
  if (extra) {
    const e = new URLSearchParams(extra);
    e.forEach((v, k) => u.searchParams.set(k, v));
  }
  u.searchParams.set("rfsn", RFSN);
  return u.toString();
};

setEnv(undefined, undefined);

check(
  "www.kctool.com gets fallback rfsn",
  outboundUrl({ url: "https://www.kctool.com/products/hazet-2152-600-multimeter", affiliate_url: null }),
  tagged("https://www.kctool.com/products/hazet-2152-600-multimeter"),
);
check(
  "apex kctool.com gets rfsn",
  outboundUrl({ url: "https://kctool.com/products/foo", affiliate_url: null }),
  tagged("https://kctool.com/products/foo"),
);
check(
  "subdomain of kctool.com gets rfsn",
  outboundUrl({ url: "https://shop.kctool.com/products/foo", affiliate_url: null }),
  tagged("https://shop.kctool.com/products/foo"),
);
check(
  "preserves existing query params",
  outboundUrl({ url: "https://www.kctool.com/products/foo?color=red&utm_source=email", affiliate_url: null }),
  tagged("https://www.kctool.com/products/foo?color=red&utm_source=email"),
);
check(
  "does not double-add rfsn on url",
  outboundUrl({ url: `https://www.kctool.com/products/foo?rfsn=${RFSN}&color=red`, affiliate_url: null }),
  "https://www.kctool.com/products/foo?rfsn=9423510.adea47&color=red",
);
check(
  "leaves a different existing rfsn alone",
  outboundUrl({ url: "https://www.kctool.com/products/foo?rfsn=other.id", affiliate_url: null }),
  "https://www.kctool.com/products/foo?rfsn=other.id",
);
check(
  "does not tag lookalike hosts",
  outboundUrl({ url: "https://notkctool.com/products/foo", affiliate_url: null }),
  "https://notkctool.com/products/foo",
);
check(
  "does not tag kctool.com.evil.com",
  outboundUrl({ url: "https://kctool.com.evil.com/products/foo", affiliate_url: null }),
  "https://kctool.com.evil.com/products/foo",
);
check(
  "keeps hash on kctool urls",
  outboundUrl({ url: "https://www.kctool.com/products/foo#reviews", affiliate_url: null }),
  tagged("https://www.kctool.com/products/foo") + "#reviews",
);

check(
  "affiliate_url with rfsn is left alone",
  outboundUrl({
    url: "https://www.kctool.com/products/foo",
    affiliate_url: "https://www.kctool.com/products/foo?rfsn=already.set&keep=1",
  }),
  "https://www.kctool.com/products/foo?rfsn=already.set&keep=1",
);
check(
  "affiliate_url on kctool without rfsn gets it appended",
  outboundUrl({
    url: "https://example.com/ignored",
    affiliate_url: "https://www.kctool.com/products/foo?keep=1",
  }),
  tagged("https://www.kctool.com/products/foo?keep=1"),
);
check(
  "non-kctool affiliate_url wins unchanged",
  outboundUrl({
    url: "https://www.kctool.com/products/foo",
    affiliate_url: "https://www.toolnut.com/products/foo?irclick=1",
  }),
  "https://www.toolnut.com/products/foo?irclick=1",
);
check("invalid url returned as-is", outboundUrl({ url: "not a url", affiliate_url: null }), "not a url");

setEnv("offthetruck01-20", undefined);
check(
  "amazon tag is added",
  outboundUrl({ url: "https://www.amazon.com/dp/B09PCZRFZK", affiliate_url: null }),
  "https://www.amazon.com/dp/B09PCZRFZK?tag=offthetruck01-20",
);
check(
  "amazon tag preserves existing params",
  outboundUrl({ url: "https://www.amazon.com/dp/B09PCZRFZK?th=1", affiliate_url: null }),
  "https://www.amazon.com/dp/B09PCZRFZK?th=1&tag=offthetruck01-20",
);
check(
  "amazon affiliate_url wins without adding tag",
  outboundUrl({ url: "https://www.amazon.com/dp/B09PCZRFZK", affiliate_url: "https://www.amazon.com/dp/B09PCZRFZK?tag=custom-20" }),
  "https://www.amazon.com/dp/B09PCZRFZK?tag=custom-20",
);
check(
  "kctool still tagged when amazon env is set",
  outboundUrl({ url: "https://www.kctool.com/products/foo", affiliate_url: null }),
  tagged("https://www.kctool.com/products/foo"),
);
check(
  "non-amazon non-kctool unchanged",
  outboundUrl({ url: "https://www.toolnut.com/products/foo", affiliate_url: null }),
  "https://www.toolnut.com/products/foo",
);

setEnv("offthetruck01-20", "override.id");
check(
  "KCTOOL_RFSN env overrides fallback",
  outboundUrl({ url: "https://kctool.com/products/foo", affiliate_url: null }),
  "https://kctool.com/products/foo?rfsn=override.id",
);

if (savedAmazon === undefined) delete process.env.AMAZON_ASSOCIATE_TAG;
else process.env.AMAZON_ASSOCIATE_TAG = savedAmazon;
if (savedRfsn === undefined) delete process.env.KCTOOL_RFSN;
else process.env.KCTOOL_RFSN = savedRfsn;

if (failed) {
  console.error(failed, "failed");
  process.exit(1);
}
console.log("ok");
