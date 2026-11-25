import type { Metadata } from "next";
import { getTruckPairs } from "@/lib/pairs";
import { fmtDate } from "@/lib/facts";
import { PrintButton } from "./PrintButton";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Printable flyer for the shop break room",
  description: "A one-page flyer with real truck vs. online prices and a QR code to Off the Truck. Print it and pin it up.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/flyer" },
};
const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default async function Flyer() {
  const pairs = (await getTruckPairs()).filter((p) => p.save > 0).slice(0, 4);
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3 print:hidden">
        <p className="text-sm text-steel-300">Print this and pin it up in the break room or tech school shop. Prices on it are from {pairs[0] ? fmtDate(pairs[0].checked_at) : "today"}.</p>
        <PrintButton />
      </div>
      <div className="mx-auto max-w-[8in] bg-white p-8 text-black print:max-w-none print:p-0">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#e0560a]">Off the Truck</p>
        <h1 className="mt-1 text-4xl font-black leading-tight">Know the price before the truck pulls up.</h1>
        <p className="mt-2 text-lg">Free site that puts online tool deals next to the truck-brand price. Checked every day. One short email a day if you want it.</p>
        <table className="mt-5 w-full border-collapse text-left text-[15px]">
          <thead>
            <tr className="border-b-2 border-black"><th className="py-1">Truck price</th><th className="py-1">Online</th><th className="py-1 text-right">Difference</th></tr>
          </thead>
          <tbody>
            {pairs.map((p) => (
              <tr key={p.slug} className="border-b border-gray-300 align-top">
                <td className="py-2 pr-2">{p.truck_brand} {p.truck_title?.replace(new RegExp(`^${p.truck_brand}\\s*`, "i"), "")}<br /><b>{usd(p.truck_price)}</b></td>
                <td className="py-2 pr-2">{p.title.split(",")[0]} ({p.retailer})<br /><b>{usd(p.sale_price)}</b></td>
                <td className="py-2 text-right font-black">{usd(p.save)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-gray-600">Prices checked {pairs[0] ? fmtDate(pairs[0].checked_at) : ""} on each seller&apos;s own website. They change; check the site for today&apos;s.</p>
        <div className="mt-6 flex flex-wrap items-center gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/flyer-qr.svg" alt="QR code to offthetruckhq.com" className="h-40 w-40" />
          <div>
            <p className="text-2xl font-black sm:text-3xl">offthetruckhq.com</p>
            <p className="mt-1 text-lg">Scan it. Free. No account.</p>
            <p className="mt-1 text-sm text-gray-700">Also there: a tool truck payment calculator, so you can see what &ldquo;$20 a week&rdquo; really adds up to.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
