import { NextResponse } from "next/server";
import { logError } from "@/lib/db";
import { resend } from "@/lib/email";
import { readBody } from "@/lib/http";
import { validUnsub } from "@/lib/unsub";

export async function POST(req: Request) {
  const b = await readBody(req);
  const e = String(b.e || "").trim().toLowerCase();
  if (!resend || !validUnsub(e, String(b.t || ""))) return NextResponse.redirect(new URL("/unsubscribe", req.url), 303);
  try {
    const { error } = await resend.contacts.update({ email: e, unsubscribed: true });
    if (error) throw new Error(error.message);
  } catch (err) {
    await logError("unsubscribe", err);
    return NextResponse.json({ error: "Couldn't unsubscribe you right now. Reply to any Off the Truck email and we'll do it by hand." }, { status: 503 });
  }
  return NextResponse.redirect(new URL("/unsubscribe?done=1", req.url), 303);
}
