import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { Beacon } from "@/components/Beacon";
import { CategoryIcon } from "@/components/Icons";
import { LogoMark } from "@/components/Logo";
import { SponsorBar } from "@/components/SponsorBar";
import { activeSponsor } from "@/lib/sponsor";
import { CATEGORIES, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: mechanic tool deals, checked daily`, template: `%s | ${SITE_NAME}` },
  description: SITE_TAGLINE,
  openGraph: { siteName: SITE_NAME, type: "website", locale: "en_US", url: SITE_URL },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/", types: { "application/rss+xml": "/rss.xml" } },
};

export const viewport: Viewport = { themeColor: "#121416", width: "device-width", initialScale: 1 };
export const revalidate = 300;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const sponsor = await activeSponsor();
  return (
    <html lang="en">
      <head>
        {/* @ts-expect-error impact verification uses a value attribute */}
        <meta name="impact-site-verification" value="8078fe3d-861f-4e9f-9157-bdcb8845d8da" content="8078fe3d-861f-4e9f-9157-bdcb8845d8da" />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <SponsorBar
          text={sponsor ? `Sponsored: ${sponsor.headline || sponsor.sponsor_name}` : "Sponsor Off the Truck: reach techs who buy tools every week"}
          href="/go/sponsor"
        />
        <header className="border-b border-black bg-shop-900 shadow-lg shadow-black/40">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <LogoMark className="h-8 w-8 shrink-0" />
              <span className="hidden text-xl font-black uppercase tracking-tight text-white min-[360px]:inline">Off the <span className="text-safety-500">Truck</span></span>
            </Link>
            <form action="/search" className="ml-auto min-w-0 flex-1 sm:max-w-xs">
              <input name="q" type="search" placeholder="Search deals" aria-label="Search deals" className="w-full rounded-md border border-shop-600 bg-shop-950 px-3 py-1.5 text-sm text-white placeholder:text-steel-400 focus:border-safety-500 focus:outline-none" />
            </form>
            <Link href="/submit" className="hidden rounded-md border border-safety-500 px-3 py-1.5 text-sm font-semibold text-safety-400 hover:bg-safety-500 hover:text-black sm:block">Submit a deal</Link>
          </div>
          <nav className="mx-auto flex max-w-6xl gap-4 overflow-x-auto px-4 pb-2 text-sm text-steel-300 [scrollbar-width:none]">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/c/${c.slug}`} className="inline-flex shrink-0 items-center gap-1.5 hover:text-white">
                <CategoryIcon slug={c.slug} className="h-4 w-4 text-safety-500" />
                {c.name}
              </Link>
            ))}
            <Link href="/brands" className="shrink-0 hover:text-white">Brands</Link>
            <Link href="/submit" className="shrink-0 text-safety-400 sm:hidden">Submit</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-5">{children}</main>
        <footer className="mt-14 bg-shop-900">
          <div className="h-2 hazard" aria-hidden />
          <div className="pegboard">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-steel-300 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2 lg:col-span-1">
                <Link href="/" className="flex items-center gap-2">
                  <LogoMark className="h-9 w-9" />
                  <span className="text-xl font-black uppercase tracking-tight text-white">Off the <span className="text-safety-500">Truck</span></span>
                </Link>
                <p className="mt-3 max-w-xs">Pro tool deals for auto techs, checked by hand, with the truck-brand price next to them when there&apos;s a fair match.</p>
              </div>
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-safety-400">Categories</p>
                <ul className="space-y-2">
                  {CATEGORIES.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/c/${c.slug}`} className="inline-flex items-center gap-2 hover:text-white">
                        <CategoryIcon slug={c.slug} className="h-4 w-4 text-steel-400" />
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-safety-400">The site</p>
                <ul className="space-y-2">
                  <li><Link href="/brands" className="hover:text-white">All brands</Link></li>
                  <li><Link href="/daily" className="hover:text-white">Daily deals</Link> · <a href="/rss.xml" className="hover:text-white">RSS</a></li>
                  <li><Link href="/submit" className="hover:text-white">Submit a deal</Link></li>
                  <li><Link href="/sponsor" className="hover:text-white">Sponsor Off the Truck</Link></li>
                  <li><Link href="/#signup" className="hover:text-white">Get the daily email</Link></li>
                  <li><a href="mailto:offthetruckhq@mail.grokbot.com" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-safety-400">Fine print</p>
                <p className="text-xs leading-relaxed text-steel-400">Some links may earn us a commission at no cost to you. Prices change fast, so always confirm on the store page. Truck-brand prices are list prices from the brand&apos;s own site on the date shown.</p>
              </div>
            </div>
          </div>
          <div className="border-t border-black bg-shop-950 py-3 text-center text-xs text-steel-400">© {new Date().getFullYear()} Off the Truck · offthetruckhq.com</div>
        </footer>
        <Beacon />
      </body>
    </html>
  );
}
