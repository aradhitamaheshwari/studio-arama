import type { Metadata, Viewport } from "next";
import { Fraunces, Sora, Pinyon_Script } from "next/font/google";
import "./globals.css";
import ModeProvider, { modeScript } from "@/components/ModeProvider";
import SoundProvider from "@/components/SoundProvider";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";
import ScrollMotion from "@/components/ScrollMotion";
import { site } from "@/lib/site";

/**
 * THREE TYPEFACES, THREE JOBS
 *
 * Fraunces is the primary voice: headings, the name, project titles. It is
 * variable on optical size, weight, softness and WONK, so the display type can
 * shift character with scale instead of being one frozen shape.
 *
 * Sora is the secondary voice: body copy, navigation, metadata, buttons.
 * Geometric and quiet, so it never competes with Fraunces.
 *
 * The accent is used sparingly, for the few moments that want a human hand.
 *
 * NOTE ON THE ACCENT FACE
 * The brief asks for Cordier Script. It is not on Google Fonts and no licensed
 * file exists in this project, so Pinyon Script stands in at the same size and
 * role. To swap it, drop the licensed file in src/app/fonts, replace this one
 * declaration with a localFont pointing at it, and keep the CSS variable name.
 * Nothing else in the site refers to the accent face by name.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const accent = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
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
    url: site.url,
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
      className={`${fraunces.variable} ${sora.variable} ${accent.variable}`}
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
          <SoundProvider>
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <Cursor />
            <Nav />
            <main id="main">{children}</main>
            <Footer />
            <div className="grain" aria-hidden="true" />
            <RevealObserver />
            <ScrollMotion />
          </SoundProvider>
        </ModeProvider>
      </body>
    </html>
  );
}
