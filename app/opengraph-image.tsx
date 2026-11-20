import { ImageResponse } from "next/og";

export const alt = "Off the Truck: mechanic tool deals, checked daily";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
          backgroundColor: "#24282c",
          backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 3px, transparent 3px 26px), repeating-linear-gradient(-45deg, rgba(0,0,0,0.25) 0 3px, transparent 3px 26px)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", padding: "64px 70px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <svg viewBox="0 0 32 32" width="120" height="120">
              <rect width="32" height="32" rx="7" fill="#ff6a13" />
              <path d="M5 11h13v10H5z" fill="#121416" />
              <path d="M18 14h5l4 4.2V21h-9z" fill="#121416" />
              <circle cx="10" cy="22.5" r="2.6" fill="#121416" stroke="#ff6a13" strokeWidth="1.4" />
              <circle cx="22.5" cy="22.5" r="2.6" fill="#121416" stroke="#ff6a13" strokeWidth="1.4" />
              <path d="M2 7.5H30" stroke="#121416" strokeWidth="2" strokeDasharray="3 2.2" />
            </svg>
            <div style={{ display: "flex", fontSize: 104, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: -3 }}>
              Off the&nbsp;<span style={{ color: "#ff6a13" }}>Truck</span>
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 50, fontWeight: 800, color: "#ffffff", marginTop: 34 }}>Know the price before the truck pulls up.</div>
          <div style={{ display: "flex", fontSize: 32, color: "#b9c0c6", marginTop: 14 }}>Tool deals for auto techs, checked daily, next to the truck-brand price.</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: 14, padding: "0 70px 36px" }}>
            {[["GEARWRENCH", "#1b1b1b", "#ff7a1a"], ["MILWAUKEE", "#c8102e", "#fff"], ["DEWALT", "#febd17", "#111"], ["TEKTON", "#0b4f8a", "#fff"], ["KNIPEX", "#d0021b", "#fff"], ["WERA", "#78b928", "#111"]].map(([n, bg, fg]) => (
              <div key={n} style={{ display: "flex", background: bg, color: fg, fontSize: 26, fontWeight: 900, padding: "8px 16px", letterSpacing: 2 }}>{n}</div>
            ))}
          </div>
          <div style={{ display: "flex", height: 30, width: "100%", backgroundImage: "repeating-linear-gradient(135deg, #ff6a13 0 28px, #111 28px 56px)" }} />
        </div>
      </div>
    ),
    size
  );
}
