import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif } from "next/font/google";
import "./globals.css";
import ModeProvider, { modeScript } from "@/components/ModeProvider";
import SoundProvider from "@/components/SoundProvider";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";
import { site } from "@/lib/site";

/**
 * Two families, both doing real work.
 *
 * Archivo is variable on weight and width, which is what lets the name stretch,
 * condense and breathe rather than sit still. Instrument Serif is the editorial
 * voice, used in italic for the lines that should feel spoken.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
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
      className={`${archivo.variable} ${instrument.variable}`}
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
          </SoundProvider>
        </ModeProvider>
      </body>
    </html>
  );
}
