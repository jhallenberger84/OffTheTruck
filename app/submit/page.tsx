import { SubmitDealForm } from "@/components/Forms";

export const metadata = { title: "Submit a deal", description: "Found a good tool deal? Send it in and we'll check it and post it.", alternates: { canonical: "/submit" } };

export default function Submit() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-black text-white">Submit a deal</h1>
      <p className="mb-4 text-sm text-steel-400">Found a real price drop on a quality tool? Send it. Every submission gets checked by hand before it goes live.</p>
      <SubmitDealForm />
    </div>
  );
}
