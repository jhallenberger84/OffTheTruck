import { NextResponse } from "next/server";
import { db, logError } from "@/lib/db";
import { isInternal } from "@/lib/internal";
import { isValidVid, vidFromCookieHeader, visitorSetCookie } from "@/lib/visitor";

const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor/i;

export async function POST(req: Request) {
  if (isInternal(req.headers) || BOT.test(req.headers.get("user-agent") || "")) return new NextResponse(null, { status: 204 });
  let path = "/";
  let vid: string | null = null;
  let src: string | null = null;
  try {
    const body = (await req.json()) as { path?: string; vid?: string; src?: string };
    if (typeof body.src === "string" && /^[a-z0-9._-]{1,60}$/.test(body.src)) src = body.src;
    path = String(body.path || "/").slice(0, 200);
    if (isValidVid(body.vid)) vid = body.vid;
  } catch {}
  if (!vid) vid = vidFromCookieHeader(req.headers.get("cookie"));
  if (!path.startsWith("/") || path.startsWith("/api")) return new NextResponse(null, { status: 204 });
  try {
    const sql = await db();
    if (sql) {
      await sql`insert into pageviews (path, day, views) values (${path}, (now() at time zone 'America/Chicago')::date, 1)
                on conflict (path, day) do update set views = pageviews.views + 1`;
      if (src) {
        await sql`insert into traffic_sources (source, day, views) values (${src}, (now() at time zone 'America/Chicago')::date, 1)
                  on conflict (source, day) do update set views = traffic_sources.views + 1`;
      }
      if (vid) {
        await sql`insert into visitor_seen (vid, last_seen_at) values (${vid}, now())
                  on conflict (vid) do update set last_seen_at = now()`;
      }
    }
  } catch (e) {
    await logError("pv", e);
  }
  const res = new NextResponse(null, { status: 204 });
  if (vid) {
    const secure = new URL(req.url).protocol === "https:";
    res.headers.set("Set-Cookie", visitorSetCookie(vid, secure));
  }
  return res;
}
