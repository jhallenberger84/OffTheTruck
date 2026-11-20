import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { Beacon } from "@/components/Beacon";
import { SponsorBar } from "@/components/SponsorBar";
import { activeSponsor } from "@/lib/sponsor";
import { CATEGORIES, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: mechanic tool deals, checked daily`, template: `%s | ${SITE_NAME}` },
  description: SITE_TAGLINE,
  openGraph: { siteName: SITE_NAME, type: "website", locale: "en_US", url: SITE_URL },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#121416", width: "device-width", initialScale: 1 };
export const revalidate = 300;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const sponsor = await activeSponsor();
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <SponsorBar
          text={sponsor ? `Sponsored: ${sponsor.headline || sponsor.sponsor_name}` : "Sponsor Off the Truck: reach techs who buy tools every week"}
          href="/go/sponsor"
        />
        <header className="border-b border-shop-700 bg-shop-900">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="tread inline-block h-6 w-6 rounded-sm" aria-hidden />
              <span className="text-lg font-black uppercase tracking-tight text-white">Off the <span className="text-safety-500">Truck</span></span>
            </Link>
            <form action="/search" className="ml-auto flex-1 sm:max-w-xs">
              <input name="q" type="search" placeholder="Search deals" aria-label="Search deals" className="w-full rounded-md border border-shop-600 bg-shop-950 px-3 py-1.5 text-sm text-white placeholder:text-steel-400 focus:border-safety-500 focus:outline-none" />
            </form>
            <Link href="/submit" className="hidden rounded-md border border-safety-500 px-3 py-1.5 text-sm font-semibold text-safety-400 hover:bg-safety-500 hover:text-black sm:block">Submit a deal</Link>
          </div>
          <nav className="mx-auto flex max-w-6xl gap-4 overflow-x-auto px-4 pb-2 text-sm text-steel-300 [scrollbar-width:none]">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/c/${c.slug}`} className="shrink-0 hover:text-white">{c.name}</Link>
            ))}
            <Link href="/brands" className="shrink-0 hover:text-white">Brands</Link>
            <Link href="/submit" className="shrink-0 text-safety-400 sm:hidden">Submit</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-5">{children}</main>
        <footer className="mt-10 border-t border-shop-700 bg-shop-900">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 text-sm text-steel-400 sm:grid-cols-3">
            <div>
              <p className="font-bold text-white">Off the Truck</p>
              <p>Quality tool deals for auto techs, checked by hand. Prices change fast, so always confirm on the store page.</p>
            </div>
            <div className="space-y-1">
              <Link href="/submit" className="block hover:text-white">Submit a deal</Link>
              <Link href="/sponsor" className="block hover:text-white">Sponsor</Link>
              <Link href="/brands" className="block hover:text-white">All brands</Link>
            </div>
            <p className="text-xs">Some links may earn us a commission at no cost to you. Truck-brand prices are list prices from the brand&apos;s own site on the date shown.</p>
          </div>
        </footer>
        <Beacon />
      </body>
    </html>
  );
}
