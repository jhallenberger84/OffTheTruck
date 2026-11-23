/** First-party anonymous visitor id for the page-first human-click rule. */

export const VISITOR_COOKIE = "ott_vid";
export const PRIOR_PV_WINDOW_MS = 30 * 60 * 1000;

const VID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidVid(vid: string | null | undefined): vid is string {
  return Boolean(vid && VID_RE.test(vid));
}

export function newVid(): string {
  return crypto.randomUUID();
}

/** Read ott_vid from a Cookie header. Invalid values are ignored. */
export function vidFromCookieHeader(cookie: string | null | undefined): string | null {
  if (!cookie) return null;
  for (const part of cookie.split(";")) {
    const [rawName, ...rest] = part.split("=");
    if (rawName.trim() !== VISITOR_COOKIE) continue;
    const value = decodeURIComponent(rest.join("=").trim());
    return isValidVid(value) ? value : null;
  }
  return null;
}

export function hasPriorPageview(lastSeenAt: Date | string | null | undefined, now = new Date(), windowMs = PRIOR_PV_WINDOW_MS): boolean {
  if (!lastSeenAt) return false;
  const t = lastSeenAt instanceof Date ? lastSeenAt : new Date(lastSeenAt);
  if (Number.isNaN(t.getTime())) return false;
  const age = now.getTime() - t.getTime();
  return age >= 0 && age <= windowMs;
}

/** Set-Cookie value for the first-party visitor id (no HttpOnly; /go and the beacon both need it). */
export function visitorSetCookie(vid: string, secure: boolean): string {
  return `${VISITOR_COOKIE}=${vid}; Path=/; Max-Age=31536000; SameSite=Lax${secure ? "; Secure" : ""}`;
}
