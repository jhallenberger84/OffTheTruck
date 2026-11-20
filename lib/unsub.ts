import { createHmac, timingSafeEqual } from "node:crypto";
import { SITE_URL } from "./site";

/** Signed unsubscribe links for one-off (non-broadcast) emails. Broadcasts use Resend's {{{RESEND_UNSUBSCRIBE_URL}}} instead. */
const secret = () => process.env.RESEND_API_KEY || "";

export function unsubToken(email: string) {
  return createHmac("sha256", secret()).update(`unsub:${email.trim().toLowerCase()}`).digest("hex").slice(0, 32);
}

export function unsubUrl(email: string) {
  return `${SITE_URL}/unsubscribe?e=${encodeURIComponent(email)}&t=${unsubToken(email)}`;
}

export function validUnsub(email: string, token: string) {
  if (!secret() || !email || !token) return false;
  const a = Buffer.from(unsubToken(email));
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}
