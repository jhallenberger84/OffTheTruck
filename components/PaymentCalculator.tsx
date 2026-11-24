"use client";
import { useMemo, useState } from "react";

export type CalcPair = { slug: string; label: string; truck: number; online: number; retailer: string };

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

/** Week-by-week payoff of a truck balance at a given APR. Returns null if the payment never covers the interest. */
export function payoff(price: number, weekly: number, apr: number) {
  if (!(price > 0) || !(weekly > 0)) return null;
  const i = apr / 100 / 52;
  if (weekly <= price * i) return null;
  let bal = price;
  let paid = 0;
  let weeks = 0;
  while (bal > 0.005 && weeks < 5200) {
    bal += bal * i;
    const pay = Math.min(weekly, bal);
    bal -= pay;
    paid += pay;
    weeks++;
  }
  if (weeks >= 5200) return null;
  return { weeks, paid, interest: paid - price };
}

function Field({ label, value, onChange, prefix, suffix, step = "1" }: { label: string; value: string; onChange: (v: string) => void; prefix?: string; suffix?: string; step?: string }) {
  return (
    <label className="block text-sm text-steel-300">
      <span className="mb-1 block font-semibold text-white">{label}</span>
      <span className="flex items-center rounded-md border border-shop-600 bg-shop-950 focus-within:border-safety-500">
        {prefix ? <span className="pl-3 text-steel-400">{prefix}</span> : null}
        <input inputMode="decimal" type="number" min="0" step={step} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent px-2 py-2 font-mono text-white focus:outline-none" />
        {suffix ? <span className="pr-3 text-steel-400">{suffix}</span> : null}
      </span>
    </label>
  );
}

export function PaymentCalculator({ pairs, defaultApr }: { pairs: CalcPair[]; defaultApr: number }) {
  const first = pairs[0];
  const [truck, setTruck] = useState(first ? String(first.truck) : "500");
  const [online, setOnline] = useState(first ? String(first.online) : "");
  const [weekly, setWeekly] = useState("20");
  const [apr, setApr] = useState(String(defaultApr));
  const r = useMemo(() => payoff(Number(truck), Number(weekly), Number(apr) || 0), [truck, weekly, apr]);
  const onlineN = Number(online);
  const gap = r && onlineN > 0 ? r.paid - onlineN : null;

  return (
    <div className="rounded-xl border border-shop-700 bg-shop-900 p-5">
      {pairs.length ? (
        <div className="mb-4">
          <p className="mb-2 text-xs font-black uppercase tracking-widest text-steel-400">Start from a real price pair</p>
          <div className="flex flex-wrap gap-2">
            {pairs.map((p) => (
              <button key={p.slug} type="button" onClick={() => { setTruck(String(p.truck)); setOnline(String(p.online)); }} className="rounded-md border border-shop-600 bg-shop-950 px-3 py-1.5 text-xs text-steel-300 hover:border-safety-500 hover:text-white">
                {p.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Truck price" value={truck} onChange={setTruck} prefix="$" step="0.01" />
        <Field label="Your weekly payment" value={weekly} onChange={setWeekly} prefix="$" />
        <Field label="Interest rate (APR)" value={apr} onChange={setApr} suffix="%" step="0.1" />
        <Field label="Same kind of tool online (optional)" value={online} onChange={setOnline} prefix="$" step="0.01" />
      </div>
      <div className="mt-5 rounded-lg bg-shop-950 p-4" aria-live="polite">
        {r ? (
          <div className="space-y-1.5 text-steel-300">
            <p className="text-2xl font-black text-white">{r.weeks} weeks <span className="text-base font-semibold text-steel-400">(about {(r.weeks / 52 * 12).toFixed(1)} months)</span></p>
            <p>Total paid: <span className="font-mono font-bold text-white">{usd(r.paid)}</span>{r.interest > 0.5 ? <> · interest <span className="font-mono text-amber-300">{usd(r.interest)}</span></> : null}</p>
            {gap !== null ? (
              gap > 0 ? (
                <p className="text-lg font-black text-safety-400">Buying it online instead keeps {usd(gap)} in your pocket.</p>
              ) : (
                <p className="font-semibold text-amber-300">The truck works out {usd(-gap)} cheaper here.</p>
              )
            ) : null}
          </div>
        ) : (
          <p className="font-semibold text-amber-300">That weekly payment doesn&apos;t cover the interest, so the balance never goes down. Raise the payment.</p>
        )}
      </div>
      <p className="mt-3 text-xs text-steel-400">Simple weekly math for a guide only. Your truck account&apos;s real rate, fees and minimum payment can differ; ask your dealer for the terms in writing.</p>
    </div>
  );
}
