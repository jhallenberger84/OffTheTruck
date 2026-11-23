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

export function Beacon() {
  const path = usePathname();
  useEffect(() => {
    const vid = getOrSetVid();
    const body = JSON.stringify({ path, vid });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/pv", new Blob([body], { type: "application/json" }));
    else fetch("/api/pv", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true });
  }, [path]);
  return null;
}
