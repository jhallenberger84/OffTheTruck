"use client";
import { useState, type FormEvent, type ReactNode } from "react";
import { CATEGORIES } from "@/lib/site";

type State = { status: "idle" | "sending" | "ok" | "error"; msg?: string };

function useForm(endpoint: string) {
  const [state, setState] = useState<State>({ status: "idle" });
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState({ status: "sending" });
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form).entries())) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong. Try again.");
      setState({ status: "ok", msg: json.message });
      form.reset();
    } catch (err) {
      setState({ status: "error", msg: err instanceof Error ? err.message : "Something went wrong." });
    }
  }
  return { state, onSubmit };
}

const input = "w-full rounded-md border border-shop-600 bg-shop-950 px-3 py-2 text-white placeholder:text-steel-400 focus:border-safety-500 focus:outline-none";
const Honeypot = () => (
  <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
);
function Status({ state, okText }: { state: State; okText: string }) {
  if (state.status === "ok") return <p className="text-sm font-semibold text-green-400">{state.msg || okText}</p>;
  if (state.status === "error") return <p className="text-sm font-semibold text-red-400">{state.msg}</p>;
  return null;
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-steel-300">{label}</span>
      {children}
    </label>
  );
}

export function SignupForm({ source = "site", compact = false }: { source?: string; compact?: boolean }) {
  const { state, onSubmit } = useForm("/api/signup");
  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <div className={compact ? "flex gap-2" : "flex flex-col gap-2 sm:flex-row"}>
        <input name="email" type="email" required placeholder="you@shop.com" className={input} aria-label="Email address" />
        <input type="hidden" name="source" value={source} />
        <Honeypot />
        <button disabled={state.status === "sending"} className="shrink-0 rounded-md bg-safety-500 px-4 py-2 font-bold text-black hover:bg-safety-400 disabled:opacity-60">
          {state.status === "sending" ? "Adding…" : "Get the daily email"}
        </button>
      </div>
      <Status state={state} okText="You're on the list. First email lands tomorrow morning." />
    </form>
  );
}

export function SubmitDealForm() {
  const { state, onSubmit } = useForm("/api/submit");
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Field label="Tool name *"><input name="title" required maxLength={200} className={input} placeholder="GearWrench 86830 6 pc GearBox ratcheting wrench set" /></Field>
      <Field label="Link to the deal *"><input name="url" type="url" required className={input} placeholder="https://…" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Sale price *"><input name="price" required inputMode="decimal" className={input} placeholder="138.64" /></Field>
        <Field label="Normal price"><input name="list_price" inputMode="decimal" className={input} placeholder="247.99" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Brand"><input name="brand" maxLength={60} className={input} placeholder="GearWrench" /></Field>
        <Field label="Category">
          <select name="category" className={input} defaultValue="">
            <option value="">Pick one</option>
            {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Anything else? (code, store, ends when)"><textarea name="notes" rows={3} maxLength={1000} className={input} /></Field>
      <Field label="Your email (optional, only used if we have a question)"><input name="email" type="email" className={input} /></Field>
      <Honeypot />
      <button disabled={state.status === "sending"} className="rounded-md bg-safety-500 px-5 py-2.5 font-bold text-black hover:bg-safety-400 disabled:opacity-60">
        {state.status === "sending" ? "Sending…" : "Submit deal"}
      </button>
      <Status state={state} okText="Thanks! It's in the review queue." />
    </form>
  );
}

export function SponsorInquiryForm() {
  const { state, onSubmit } = useForm("/api/sponsor-inquiry");
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Your name *"><input name="name" required maxLength={100} className={input} /></Field>
        <Field label="Company"><input name="company" maxLength={120} className={input} /></Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Email *"><input name="email" type="email" required className={input} /></Field>
        <Field label="Website"><input name="website" maxLength={200} className={input} placeholder="https://" /></Field>
      </div>
      <Field label="What do you want to promote, and which weeks?"><textarea name="message" rows={4} maxLength={2000} className={input} /></Field>
      <Honeypot />
      <button disabled={state.status === "sending"} className="rounded-md bg-safety-500 px-5 py-2.5 font-bold text-black hover:bg-safety-400 disabled:opacity-60">
        {state.status === "sending" ? "Sending…" : "Get in touch"}
      </button>
      <Status state={state} okText="Got it. We'll reply within a day." />
    </form>
  );
}
