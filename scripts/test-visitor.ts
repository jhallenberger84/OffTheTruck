import { isValidVid, newVid, vidFromCookieHeader, hasPriorPageview, VISITOR_COOKIE, PRIOR_PV_WINDOW_MS } from "../lib/visitor.ts";

let failed = 0;
function check(name: string, got: unknown, want: unknown) {
  if (got !== want) {
    console.error("FAIL", name, "got", got, "want", want);
    failed++;
  }
}

const id = newVid();
check("newVid is valid", isValidVid(id), true);
check("empty invalid", isValidVid(""), false);
check("null invalid", isValidVid(null), false);
check("garbage invalid", isValidVid("ott-not-a-uuid"), false);
check("almost uuid invalid", isValidVid("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"), false);

const cookie = `${VISITOR_COOKIE}=${id}; Path=/; Other=1`;
check("parse cookie", vidFromCookieHeader(cookie), id);
check("parse among others", vidFromCookieHeader(`foo=bar; ${VISITOR_COOKIE}=${id}; baz=qux`), id);
check("missing cookie", vidFromCookieHeader("foo=bar"), null);
check("empty header", vidFromCookieHeader(""), null);
check("null header", vidFromCookieHeader(null), null);
check("invalid vid in cookie ignored", vidFromCookieHeader(`${VISITOR_COOKIE}=not-a-uuid`), null);

const now = new Date("2026-11-22T23:30:00-06:00");
check("missing last seen", hasPriorPageview(null, now), false);
check("undefined last seen", hasPriorPageview(undefined, now), false);
check("just now", hasPriorPageview(now, now), true);
check("29 minutes ago", hasPriorPageview(new Date(now.getTime() - 29 * 60 * 1000), now), true);
check("exactly 30 minutes ago", hasPriorPageview(new Date(now.getTime() - PRIOR_PV_WINDOW_MS), now), true);
check("30 minutes and 1ms ago", hasPriorPageview(new Date(now.getTime() - PRIOR_PV_WINDOW_MS - 1), now), false);
check("in the future", hasPriorPageview(new Date(now.getTime() + 1000), now), false);
check("iso string 10 min ago", hasPriorPageview(new Date(now.getTime() - 10 * 60 * 1000).toISOString(), now), true);
check("bad date string", hasPriorPageview("not-a-date", now), false);

// A click is public-human only if not a bot AND has prior pv.
function isPageFirstHuman(isBot: boolean | null, hasPriorPv: boolean | null): boolean {
  return isBot === false && hasPriorPv === true;
}
check("ua-human without pv is not page-first", isPageFirstHuman(false, false), false);
check("ua-human with null pv (legacy) is not page-first", isPageFirstHuman(false, null), false);
check("ua-human with prior pv is page-first", isPageFirstHuman(false, true), true);
check("bot with prior pv is not human", isPageFirstHuman(true, true), false);
check("unknown with prior pv is not human", isPageFirstHuman(null, true), false);

if (failed) {
  console.error("FAILED", failed);
  process.exit(1);
}
console.log("ok visitor id + 30-minute page-first checks");
