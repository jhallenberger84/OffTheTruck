"use client";
export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="rounded-md bg-safety-500 px-4 py-2 text-sm font-black uppercase tracking-wide text-black hover:bg-safety-400">
      Print it
    </button>
  );
}
