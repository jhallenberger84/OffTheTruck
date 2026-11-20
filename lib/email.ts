import { Resend } from "resend";
import { OWNER_EMAIL } from "./site";

export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
export const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || "";
/** onboarding@resend.dev can only deliver to the Resend account's own address until a domain is verified. */
export const FROM_EMAIL = process.env.EMAIL_FROM || "Off the Truck <onboarding@resend.dev>";

const DISPOSABLE = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "sharklasers.com", "10minutemail.com", "tempmail.com",
  "temp-mail.org", "yopmail.com", "trashmail.com", "getnada.com", "dispostable.com", "maildrop.cc", "throwawaymail.com",
  "fakeinbox.com", "mailnesia.com", "mintemail.com", "spamgourmet.com", "emailondeck.com", "moakt.com", "tempail.com",
]);
const TEST_DOMAINS = /(^|\.)(example\.(com|org|net)|test|invalid|localhost|test\.com|email\.com|domain\.com)$/i;
const TEST_LOCALS = /^(test|testing|asdf+|qwerty|foo|bar|foobar|abc|abc123|aaa+|xxx+|none|null|noreply|no-reply|fake|sample|user|admin)\d*$/i;

export type EmailCheck = { ok: true; email: string } | { ok: false; reason: string };

export function checkEmail(raw: unknown): EmailCheck {
  const email = String(raw ?? "").trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) return { ok: false, reason: "That doesn't look like an email address." };
  const [local, domain] = email.split("@");
  if (DISPOSABLE.has(domain)) return { ok: false, reason: "Please use a real inbox, not a throwaway address." };
  if (TEST_DOMAINS.test(domain) || TEST_LOCALS.test(local)) return { ok: false, reason: "Please use your real email address." };
  if (/(.)\1{5,}/.test(local)) return { ok: false, reason: "Please use your real email address." };
  return { ok: true, email };
}

export async function emailOwner(subject: string, text: string, replyTo?: string) {
  if (!resend) throw new Error("RESEND_API_KEY is not set");
  const { error } = await resend.emails.send({ from: FROM_EMAIL, to: OWNER_EMAIL, subject, text, replyTo });
  if (error) throw new Error(`Resend: ${error.message}`);
}

export function escapeText(s: unknown, max = 2000) {
  return String(s ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
}
