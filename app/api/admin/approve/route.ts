import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin, noDb, unauthorized } from "@/lib/admin";
import { readBody } from "@/lib/http";
import { cleanDeal } from "@/lib/dealInput";

/**
 * POST /api/admin/approve
 * { "id": 12 }                                   approve submission 12 as a live deal (uses its fields)
 * { "id": 12, "deal": { "retailer": "Amazon", ...overrides } }
 * { "id": 12, "action": "reject" }
 */
export async function POST(req: Request) {
  if (!isAdmin(req)) return unauthorized();
  const sql = await db();
  if (!sql) return noDb();
  const b = await readBody(req);
  const id = Number(b.id);
  const [s] = await sql`select * from submissions where id = ${id}`;
  if (!s) return NextResponse.json({ error: "submission not found" }, { status: 404 });
  if (b.action === "reject") {
    await sql`update submissions set status = 'rejected', reviewed_at = now() where id = ${id}`;
    return NextResponse.json({ ok: true, id, status: "rejected" });
  }
  let retailer = "";
  try { retailer = new URL(String(s.url)).hostname.replace(/^www\./, ""); } catch {}
  const merged = {
    title: s.title, url: s.url, sale_price: s.price, list_price: s.list_price, brand: s.brand, category: s.category, retailer,
    ...((b.deal as Record<string, unknown>) || {}),
  };
  const c = cleanDeal(merged);
  if (!c.ok) return NextResponse.json({ error: `can't approve yet: ${c.error}. Pass the missing fields in "deal".` }, { status: 400 });
  const [entry] = await sql`insert into entries ${sql(c.value as never)} returning id, slug`;
  await sql`update submissions set status = 'approved', entry_id = ${entry.id}, reviewed_at = now() where id = ${id}`;
  return NextResponse.json({ ok: true, id, entry });
}
