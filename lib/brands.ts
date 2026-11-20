/** Brand chip colors: approximations of each brand's trade dress, used on styled text chips (no logos). */
const BRAND_COLORS: Record<string, { bg: string; fg: string }> = {
  milwaukee: { bg: "#c8102e", fg: "#ffffff" },
  dewalt: { bg: "#febd17", fg: "#111111" },
  gearwrench: { bg: "#1b1b1b", fg: "#ff7a1a" },
  tekton: { bg: "#0b4f8a", fg: "#ffffff" },
  knipex: { bg: "#d0021b", fg: "#ffffff" },
  wera: { bg: "#78b928", fg: "#111111" },
  stahlwille: { bg: "#0a3f7a", fg: "#ffffff" },
  hazet: { bg: "#0057a8", fg: "#ffffff" },
  gedore: { bg: "#1f3d7a", fg: "#ffffff" },
  capri: { bg: "#e4572e", fg: "#111111" },
  "capri-tools": { bg: "#e4572e", fg: "#111111" },
  sunex: { bg: "#1d4ea0", fg: "#ffffff" },
  koken: { bg: "#b0001f", fg: "#ffffff" },
  ancel: { bg: "#1f6fd1", fg: "#ffffff" },
  icon: { bg: "#c41230", fg: "#ffffff" },
};
const FALLBACK = { bg: "#3d434a", fg: "#ffffff" };

export function brandColor(slug: string) {
  return BRAND_COLORS[slug] ?? FALLBACK;
}
