import { NextResponse } from "next/server";
import { db, logError } from "@/lib/db";
import { AUDIENCE_ID, checkEmail, escapeText, resend } from "@/lib/email";
import { readBody } from "@/lib/http";

export async function POST(req: Request) {
  const body = await readBody(req);
  if (body.company_website) return NextResponse.json({ ok: true, message: "You're on the list." }); // honeypot
  const check = checkEmail(body.email);
  if (!check.ok) return NextResponse.json({ error: check.reason }, { status: 400 });
  const email = check.email;
  const source = escapeText(body.source, 40) || "site";

  let contactId: string | null = null;
  let resendOk = false;
  if (resend && AUDIENCE_ID) {
    try {
      const { data, error } = await resend.contacts.create({ email, unsubscribed: false, segments: [{ id: AUDIENCE_ID }] });
      if (error) {
        if (!/exist/i.test(error.message)) throw new Error(error.message);
        const add = await resend.contacts.segments.add({ email, segmentId: AUDIENCE_ID });
        if (add.error) throw new Error(add.error.message);
      }
      contactId = data?.id ?? null;
      resendOk = true;
    } catch (e) {
      await logError("signup.resend", e);
    }
  }
  let dbOk = false;
  try {
    const sql = await db();
    if (sql) {
      await sql`insert into signups (email, source, resend_contact_id) values (${email}, ${source}, ${contactId})
                on conflict (email) do update set resend_contact_id = coalesce(signups.resend_contact_id, excluded.resend_contact_id)`;
      dbOk = true;
    }
  } catch (e) {
    await logError("signup.db", e);
  }
  if (!resendOk && !dbOk) return NextResponse.json({ error: "Couldn't add you right now. Please try again in a minute." }, { status: 503 });
  return NextResponse.json({ ok: true, message: "You're on the list. First email lands Thursday." });
}
