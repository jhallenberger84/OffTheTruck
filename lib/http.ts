import { createHash } from "node:crypto";

export async function readBody(req: Request): Promise<Record<string, unknown>> {
  const ct = req.headers.get("content-type") || "";
  try {
    if (ct.includes("application/json")) return (await req.json()) as Record<string, unknown>;
    const fd = await req.formData();
    return Object.fromEntries(fd.entries());
  } catch {
    return {};
  }
}

export function ipHash(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  return ip ? createHash("sha256").update(ip + (process.env.ADMIN_TOKEN || "")).digest("hex").slice(0, 16) : null;
}

export function money(v: unknown) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(String(v).replace(/[$,\s]/g, ""));
  return Number.isFinite(n) && n >= 0 && n < 100000 ? Math.round(n * 100) / 100 : null;
}
