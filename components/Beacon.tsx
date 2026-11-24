"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { VISITOR_COOKIE, isValidVid, newVid } from "@/lib/visitor";

/** Counts a pageview per path per day in our own DB. Sets a first-party anonymous visitor cookie so /go can tell if this visitor loaded a page recently. No third-party analytics. */
function getOrSetVid(): string {
  const m = document.cookie.match(new RegExp(`(?:^|; )${VISITOR_COOKIE}=([^;]*)`));
  const existing = m ? decodeURIComponent(m[1].trim()) : "";
  if (isValidVid(existing)) return existing;
  const vid = newVid();
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${VISITOR_COOKIE}=${encodeURIComponent(vid)}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  return vid;
}

/** Where this visit came from: ?utm_source / ?ref first, else the referrer's host if it's another site. Sent once per browser session. */
function visitSource(): string | null {
  try {
    if (sessionStorage.getItem("ott_src")) return null;
    sessionStorage.setItem("ott_src", "1");
    const q = new URLSearchParams(location.search);
    const utm = q.get("utm_source") || q.get("ref");
    if (utm) return utm.toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 60) || null;
    if (!document.referrer) return "direct";
    const host = new URL(document.referrer).hostname.replace(/^www\./, "");
    if (host === location.hostname.replace(/^www\./, "")) return null;
    return host.slice(0, 60);
  } catch {
    return null;
  }
}

export function Beacon() {
  const path = usePathname();
  useEffect(() => {
    const vid = getOrSetVid();
    const src = visitSource();
    const body = JSON.stringify(src ? { path, vid, src } : { path, vid });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/pv", new Blob([body], { type: "application/json" }));
    else fetch("/api/pv", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true });
  }, [path]);
  return null;
}
