"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Counts a pageview per path per day in our own DB. No cookies, no third-party analytics. */
export function Beacon() {
  const path = usePathname();
  useEffect(() => {
    const body = JSON.stringify({ path });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/pv", new Blob([body], { type: "application/json" }));
    else fetch("/api/pv", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true });
  }, [path]);
  return null;
}
