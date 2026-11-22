import { SignupForm } from "./Forms";
import { MailIcon } from "./Icons";

export function SignupBlock({ source }: { source: string }) {
  return (
    <section className="relative my-10 overflow-hidden rounded-2xl border border-safety-600/60 pegboard">
      <div className="h-2 hazard" aria-hidden />
      <div className="grid items-center gap-6 p-6 sm:grid-cols-[auto_1fr] sm:p-8">
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-safety-500 text-black shadow-xl shadow-black/50 ring-4 ring-black/70 sm:h-28 sm:w-28" aria-hidden>
          <MailIcon className="h-14 w-14 sm:h-16 sm:w-16" />
          <span className="absolute -right-3 -top-3 rounded-full bg-white px-2 py-0.5 text-xs font-black text-black ring-2 ring-black">DAILY</span>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-safety-400">The daily email</p>
          <h2 className="mt-1 text-2xl font-black leading-tight text-white sm:text-3xl">The 5 best tool deals, before the truck shows up.</h2>
          <ul className="mb-4 mt-2 space-y-1 text-sm text-steel-300">
            <li>• 5 hand-picked deals with the truck-brand price next to them</li>
            <li>• One short email every day</li>
            <li>• No spam, unsubscribe anytime</li>
          </ul>
          <SignupForm source={source} />
        </div>
      </div>
    </section>
  );
}
