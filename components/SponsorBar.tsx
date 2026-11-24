"use client";
import { useEffect, useState } from "react";

export function SponsorBar({ text, href }: { text: string; href: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(localStorage.getItem("ott_sponsor_closed") !== new Date().toISOString().slice(0, 10));
  }, []);
  if (!open) return null;
  return (
    <div className="relative bg-safety-500 text-black print:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-10 py-1.5 text-center text-sm font-semibold">
        <a href={href} className="underline-offset-2 hover:underline">{text}</a>
      </div>
      <button
        aria-label="Close sponsor bar"
        onClick={() => {
          localStorage.setItem("ott_sponsor_closed", new Date().toISOString().slice(0, 10));
          setOpen(false);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 text-lg leading-none hover:bg-black/10"
      >
        ×
      </button>
    </div>
  );
}
