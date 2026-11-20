import { NextResponse } from "next/server";
import { db, logError } from "@/lib/db";
import { checkEmail, emailOwner, escapeText } from "@/lib/email";
import { ipHash, money, readBody } from "@/lib/http";
import { CATEGORIES } from "@/lib/site";

export async function POST(req: Request) {
  const b = await readBody(req);
  if (b.company_website) return NextResponse.json({ ok: true });
  const title = escapeText(b.title, 200);
  const url = escapeText(b.url, 1000);
  const price = money(b.price);
  if (!title || !/^https?:\/\/[^\s]+\.[^\s]+/i.test(url)) return NextResponse.json({ error: "Add the tool name and a link to the deal." }, { status: 400 });
  if (price === null) return NextResponse.json({ error: "Add the sale price." }, { status: 400 });
  const list_price = money(b.list_price);
  const category = CATEGORIES.some((c) => c.slug === b.category) ? String(b.category) : null;
  let email: string | null = null;
  if (b.email) {
    const c = checkEmail(b.email);
    if (!c.ok) return NextResponse.json({ error: c.reason }, { status: 400 });
    email = c.email;
  }
  const brand = escapeText(b.brand, 60) || null;
  const notes = escapeText(b.notes, 1000) || null;

  let id: number | null = null;
  try {
    const sql = await db();
    if (sql) {
      const [r] = await sql`insert into submissions (title, url, price, list_price, brand, category, notes, email, ip_hash)
        values (${title}, ${url}, ${price}, ${list_price}, ${brand}, ${category}, ${notes}, ${email}, ${ipHash(req)}) returning id`;
      id = r.id as number;
    }
  } catch (e) {
    await logError("submit.db", e);
  }
  try {
    await emailOwner(
      `New deal submission${id ? ` #${id}` : ""}: ${title}`,
      `${title}\n${url}\nSale: $${price}${list_price ? `  Normal: $${list_price}` : ""}\nBrand: ${brand ?? "-"}  Category: ${category ?? "-"}\nNotes: ${notes ?? "-"}\nFrom: ${email ?? "anonymous"}\n\n${id ? `Approve with POST /api/admin/approve {"id": ${id}}` : "Database not connected: this email is the only copy."}`,
      email ?? undefined
    );
  } catch (e) {
    await logError("submit.email", e);
    if (!id) return NextResponse.json({ error: "Couldn't save that right now. Please try again." }, { status: 503 });
  }
  return NextResponse.json({ ok: true, message: "Thanks! It's in the review queue." });
}
