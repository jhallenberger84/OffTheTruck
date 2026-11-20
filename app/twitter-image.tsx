import { ImageResponse } from "next/og";

export const alt = "Off the Truck: mechanic tool deals, checked daily";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#1a1d20", padding: 70, justifyContent: "space-between" }}>
        <div style={{ display: "flex", height: 24, width: "100%", backgroundImage: "repeating-linear-gradient(135deg, #ff6a13 0 24px, #111 24px 48px)" }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 110, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: -3 }}>
            Off the&nbsp;<span style={{ color: "#ff6a13" }}>Truck</span>
          </div>
          <div style={{ display: "flex", fontSize: 44, color: "#b9c0c6", marginTop: 10 }}>Pro tool deals for auto techs, checked daily.</div>
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#9aa3ab" }}>Tekton · GearWrench · Milwaukee · Knipex · Wera · Sunex · Capri vs. the truck price</div>
      </div>
    ),
    size
  );
}
