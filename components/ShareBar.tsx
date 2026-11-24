"use client";
import { useState } from "react";

/**
 * "Send this to a coworker" bar. Every button opens the visitor's own app (texts, email, Facebook, X, Reddit)
 * with the link filled in; nothing is sent by us. Links carry ?utm_source=share-<channel> so /api/admin/stats topSources shows which ones get used.
 */
export function ShareBar({ path, text, title = "Send this to a coworker", source }: { path: string; text: string; title?: string; source: string }) {
  const [copied, setCopied] = useState(false);
  const base = `https://offthetruckhq.com${path}`;
  const link = (ch: string) => `${base}${path.includes("?") ? "&" : "?"}utm_source=share-${ch}&utm_campaign=${encodeURIComponent(source)}`;
  const enc = encodeURIComponent;
  const btn = "inline-flex items-center justify-center rounded-md border border-shop-600 bg-shop-950 px-3 py-2 text-sm font-semibold text-white hover:border-safety-500 hover:text-safety-400";
  async function copy() {
    const url = link("copy");
    try {
      if (navigator.share) {
        await navigator.share({ title: "Off the Truck", text, url });
        return;
      }
    } catch {
      return;
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  }
  return (
    <div className="my-6 rounded-xl border border-shop-700 bg-shop-900 p-4" data-share-bar={source}>
      <p className="mb-1 text-sm font-black uppercase tracking-widest text-safety-400">{title}</p>
      <p className="mb-3 text-sm text-steel-300">Know a tech who&apos;s about to buy off the truck? Send them this.</p>
      <div className="flex flex-wrap gap-2">
        <a className={btn} href={`sms:?&body=${enc(`${text} ${link("sms")}`)}`}>Text it</a>
        <a className={btn} href={`mailto:?subject=${enc("Saw this, thought of you")}&body=${enc(`${text}\n\n${link("email")}`)}`}>Email it</a>
        <a className={btn} target="_blank" rel="noopener" href={`https://www.facebook.com/sharer/sharer.php?u=${enc(link("facebook"))}`}>Facebook</a>
        <a className={btn} target="_blank" rel="noopener" href={`https://x.com/intent/post?text=${enc(text)}&url=${enc(link("x"))}`}>X</a>
        <a className={btn} target="_blank" rel="noopener" href={`https://www.reddit.com/submit?url=${enc(link("reddit"))}&title=${enc(text)}`}>Reddit</a>
        <button type="button" onClick={copy} className={btn}>{copied ? "Copied" : "Copy link"}</button>
      </div>
    </div>
  );
}
