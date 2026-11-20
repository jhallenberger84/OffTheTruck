import { NextResponse } from "next/server";
import { db, logError } from "@/lib/db";
import { checkEmail, emailOwner, escapeText } from "@/lib/email";
import { readBody } from "@/lib/http";

export async function POST(req: Request) {
  const b = await readBody(req);
  if (b.company_website) return NextResponse.json({ ok: true });
  const name = escapeText(b.name, 100);
  const c = checkEmail(b.email);
  if (!name) return NextResponse.json({ error: "Add your name." }, { status: 400 });
  if (!c.ok) return NextResponse.json({ error: c.reason }, { status: 400 });
  const company = escapeText(b.company, 120) || null;
  const website = escapeText(b.website, 200) || null;
  const message = escapeText(b.message, 2000) || null;

  let saved = false;
  try {
    const sql = await db();
    if (sql) {
      await sql`insert into sponsor_inquiries (name, company, email, website, message) values (${name}, ${company}, ${c.email}, ${website}, ${message})`;
      saved = true;
    }
  } catch (e) {
    await logError("sponsor.db", e);
  }
  let emailed = false;
  try {
    await emailOwner(
      `Sponsor inquiry: ${company || name}`,
      `Name: ${name}\nCompany: ${company ?? "-"}\nEmail: ${c.email}\nWebsite: ${website ?? "-"}\n\n${message ?? "(no message)"}\n\nReply to this email to answer them directly.`,
      c.email
    );
    emailed = true;
  } catch (e) {
    await logError("sponsor.email", e);
  }
  if (!saved && !emailed) return NextResponse.json({ error: "Couldn't send that right now. Please try again." }, { status: 503 });
  return NextResponse.json({ ok: true, message: "Got it. We'll reply within a day." });
}
