"use client";
import { useState } from "react";
import { CategoryIcon } from "./Icons";

/** Retailer product photo on a white plate, with a branded placeholder if the image is missing or fails. */
export function ProductImage({ src, alt, category, brand, color }: { src?: string | null; alt: string; category: string; brand: string; color: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 diamond-plate" style={{ color }}>
        <CategoryIcon slug={category} className="h-14 w-14" />
        <span className="text-xs font-bold uppercase tracking-widest text-steel-300">{brand}</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setFailed(true)} className="absolute inset-0 h-full w-full object-contain p-3" />
  );
}
