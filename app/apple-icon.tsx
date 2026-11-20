import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ff6a13" }}>
        <svg viewBox="0 0 32 32" width="150" height="150">
          <path d="M5 11h13v10H5z" fill="#121416" />
          <path d="M18 14h5l4 4.2V21h-9z" fill="#121416" />
          <circle cx="10" cy="22.5" r="2.6" fill="#121416" stroke="#ff6a13" strokeWidth="1.4" />
          <circle cx="22.5" cy="22.5" r="2.6" fill="#121416" stroke="#ff6a13" strokeWidth="1.4" />
          <path d="M2 7.5H30" stroke="#121416" strokeWidth="2" strokeDasharray="3 2.2" />
          <path d="M7 16.5h4M13 16.5h2" stroke="#ff6a13" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size
  );
}
