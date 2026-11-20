import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin, noDb, unauthorized } from "@/lib/admin";
import { readBody } from "@/lib/http";
import { cleanDeal } from "@/lib/dealInput";

export const dynamic = "force-dynamic";

/** GET ?status=active|expired|all */
export async function GET(req: Request) {
  if (!isAdmin(req)) return unauthorized();
  const sql = await db();
  if (!sql) return noDb();
  const status = new URL(req.url).searchParams.get("status") || "active";
  const rows = status === "all" ? await sql`select * from entries order by checked_at desc` : await sql`select * from entries where status = ${status} order by checked_at desc`;
  return NextResponse.json({ count: rows.length, deals: rows });
}

/** POST: add a deal (title, brand, category, retailer, url, sale_price, list_price required). */
export async function POST(req: Request) {
  if (!isAdmin(req)) return unauthorized();
  const sql = await db();
  if (!sql) return noDb();
  const c = cleanDeal(await readBody(req));
  if (!c.ok) return NextResponse.json({ error: c.error }, { status: 400 });
  try {
    const [row] = await sql`insert into entries ${sql(c.value as never)} returning *`;
    return NextResponse.json({ ok: true, deal: row }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 409 });
  }
}

/** PATCH: { slug, ...fields } update a deal. Re-checking a price? send sale_price + checked_at. Expire with { slug, status: "expired" }. */
export async function PATCH(req: Request) {
  if (!isAdmin(req)) return unauthorized();
  const sql = await db();
  if (!sql) return noDb();
  const b = await readBody(req);
  const slug = String(b.slug || "");
  const { slug: _s, ...rest } = b;
  void _s;
  const c = cleanDeal(rest, true);
  if (!c.ok) return NextResponse.json({ error: c.error }, { status: 400 });
  if (!Object.keys(c.value).length) return NextResponse.json({ error: "nothing to update" }, { status: 400 });
  const [row] = await sql`update entries set ${sql(c.value as never)}, updated_at = now() where slug = ${slug} returning *`;
  return row ? NextResponse.json({ ok: true, deal: row }) : NextResponse.json({ error: "not found" }, { status: 404 });
}

/** DELETE ?slug=... expires the deal (kept for history, hidden from the site). */
export async function DELETE(req: Request) {
  if (!isAdmin(req)) return unauthorized();
  const sql = await db();
  if (!sql) return noDb();
  const slug = new URL(req.url).searchParams.get("slug") || "";
  const [row] = await sql`update entries set status = 'expired', updated_at = now() where slug = ${slug} returning slug, status`;
  return row ? NextResponse.json({ ok: true, deal: row }) : NextResponse.json({ error: "not found" }, { status: 404 });
}
