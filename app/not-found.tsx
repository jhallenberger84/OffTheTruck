import Link from "next/link";
export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-black text-white">Not here</h1>
      <p className="mt-2 text-steel-400">That page or deal is gone. <Link href="/" className="text-safety-400 underline">See today&apos;s deals</Link>.</p>
    </div>
  );
}
