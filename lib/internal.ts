/** Our own test traffic: User-Agent contains "OTT" (e.g. OTTKeeper, OTT-Bot) or header X-OTT-Internal: 1. Never counted in stats. */
export function isInternal(h: Pick<Headers, "get">): boolean {
  return (h.get("user-agent") || "").includes("OTT") || h.get("x-ott-internal") === "1";
}
