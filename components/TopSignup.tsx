import { SignupForm } from "./Forms";

/** Small email box near the top of a page (same copy and form as the home hero box). */
export function TopSignup({ source }: { source: string }) {
  return (
    <div className="max-w-md rounded-lg bg-black/45 p-3 ring-1 ring-white/10">
      <p className="mb-2 text-sm font-semibold text-white">Get the 5 best deals in one short email every day. No spam, unsubscribe anytime.</p>
      <SignupForm source={source} />
    </div>
  );
}
