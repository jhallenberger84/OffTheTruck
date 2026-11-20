import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

export function isAdmin(req: Request) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return false;
  const got = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(got);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export function noDb() {
  return NextResponse.json({ error: "database not configured (DATABASE_URL missing)", db: false }, { status: 503 });
}
