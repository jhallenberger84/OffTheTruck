import { ImageResponse } from "next/og";
import { getTruckPair, shortTruck } from "@/lib/pairs";

export const alt = "Truck price vs online price, from Off the Truck";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });
const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getTruckPair(slug);
  const max = p ? Math.max(p.truck_price, p.sale_price) : 1;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#1a1d20", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", height: 16, backgroundColor: "#ff6a13" }} />
        <div style={{ display: "flex", flexDirection: "column", padding: "40px 64px", flex: 1 }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 900, color: "#ff8538", letterSpacing: 3 }}>TRUCK PRICE vs. ONLINE</div>
          {p ? (
            <div style={{ display: "flex", flexDirection: "column", marginTop: 26 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, color: "#b9c0c6" }}>
                <span>{clip(shortTruck(p), 58)}</span><span style={{ marginLeft: 20 }}>{usd(p.truck_price)}</span>
              </div>
              <div style={{ display: "flex", height: 30, marginTop: 10, borderRadius: 15, backgroundColor: "#2f3439" }}>
                <div style={{ display: "flex", width: `${(p.truck_price / max) * 100}%`, borderRadius: 15, backgroundColor: "#9aa3ab" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, marginTop: 28 }}>
                <span>{clip(`${p.title.split(",")[0]} (${p.retailer})`, 58)}</span><span style={{ color: "#ff8538", marginLeft: 20 }}>{usd(p.sale_price)}</span>
              </div>
              <div style={{ display: "flex", height: 30, marginTop: 10, borderRadius: 15, backgroundColor: "#2f3439" }}>
                <div style={{ display: "flex", width: `${(p.sale_price / max) * 100}%`, borderRadius: 15, backgroundColor: "#ff6a13" }} />
              </div>
              {p.save > 0 ? (
                <div style={{ display: "flex", marginTop: 34, alignSelf: "flex-start", backgroundColor: "#ff6a13", color: "#000", fontSize: 54, fontWeight: 900, padding: "8px 22px" }}>
                  SAVE {usd(p.save)} ({p.savePct}%)
                </div>
              ) : null}
            </div>
          ) : (
            <div style={{ display: "flex", fontSize: 60, fontWeight: 900, marginTop: 40 }}>Know the price before the truck pulls up.</div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 64px 30px", fontSize: 30 }}>
          <span style={{ fontWeight: 900 }}>OFF THE <span style={{ color: "#ff6a13", marginLeft: 10 }}>TRUCK</span></span>
          <span style={{ color: "#b9c0c6" }}>offthetruckhq.com · prices checked daily</span>
        </div>
      </div>
    ),
    size
  );
}
