import type { Metadata, Viewport } from "next";
import { EB_Garamond, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import ModeProvider, { modeScript } from "@/components/ModeProvider";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import RevealObserver from "@/components/RevealObserver";
import ScrollMotion from "@/components/ScrollMotion";
import { site } from "@/lib/site";

/**
 * TWO TYPEFACES
 *
 * The brief asks for JJannon Regular and Public Text Mono. Neither is in the
 * supplied asset folder, installed on this machine, or published on Google
 * Fonts, so rather than fall back to a generic sans each has a stand in chosen
 * from the same lineage:
 *
 *   EB Garamond  stands in for JJannon. JJannon revives Jean Jannon's types,
 *                which is the tradition EB Garamond is drawn from, so the
 *                colour on the page and the old style proportions are close.
 *   IBM Plex Mono stands in for Public Text Mono, covering the functional role:
 *                navigation, metadata, numbers, labels, clocks.
 *
 * To swap in the licensed files, drop them in src/app/fonts, replace these two
 * declarations with next/font/local, and keep the variable names. No component
 * names a typeface directly.
 */
const serif = EB_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif-stack",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-stack",
  display: "swap",
});

/**
 * Canonical and Open Graph URLs resolve against this.
 *
 * studioarama.com is live now, so production says so. It used to fall back to
 * VERCEL_URL, which is the per deployment address: every canonical and every
 * link preview was pointing at a hostname like
 * studio-arama-4xth324q0-aradhitas-projects.vercel.app, which changes on each
 * deploy and should never be the address a search engine records.
 *
 * Preview deployments still describe themselves, so a branch preview cannot
 * claim to be production. NEXT_PUBLIC_SITE_URL overrides everything, which is
 * how the GitHub Pages build points at its own address.
 */
const isProduction =
  !process.env.VERCEL || process.env.VERCEL_ENV === "production";

const resolvedUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (isProduction
    ? site.url
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : site.url);

export const metadata: Metadata = {
  metadataBase: new URL(resolvedUrl),
  title: {
    default: "studio arama",
    template: "%s, studio arama",
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: "studio arama",
    title: "studio arama",
    description: site.description,
    url: resolvedUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "studio arama",
    description: site.description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  // Follows whichever mode is showing, so the browser chrome matches the page.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${mono.variable}`}
      // Tells the router the smooth scrolling is deliberate, so it suppresses
      // it during route changes instead of gliding between pages.
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Paints the chosen mode before first paint, so there is no flash. */}
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
      </head>
      <body>
        <ModeProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Cursor />
          <Nav />
          <main id="main">{children}</main>
          <SiteFooter />
          <RevealObserver />
          <ScrollMotion />
        </ModeProvider>
      </body>
    </html>
  );
}
