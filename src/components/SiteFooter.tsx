"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Clocks from "./Clocks";
import { site } from "@/lib/site";

/**
 * The homepage is one fixed viewport and carries its own city row, so the
 * footer belongs to every route except that one.
 *
 * The old viewport width wordmark is gone. It needed its letter spacing
 * recalibrated against whichever typeface was loaded, and at this scale the
 * restraint reads better than the spectacle did.
 */
export default function SiteFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <footer className="gutter pb-10 pt-[var(--space-section)]">
      <hr className="rule" />

      <div className="grid gap-[var(--space-block)] pt-[var(--space-md)] md:grid-cols-12">
        <div className="md:col-span-7">
          <Clocks />
        </div>

        <nav className="md:col-span-3" aria-label="Footer">
          <ul className="flex flex-col gap-2">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="label link hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2">
          <ul className="flex flex-col gap-2">
            <li>
              <a href={site.social.instagram.url} target="_blank" rel="noreferrer" className="label link hover:text-ink">
                Instagram
              </a>
            </li>
            <li>
              <a href={site.social.linkedin.url} target="_blank" rel="noreferrer" className="label link hover:text-ink">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="label link hover:text-ink">
                Email
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-[var(--space-block)] flex flex-wrap items-baseline justify-between gap-4">
        <span className="wordmark text-[clamp(1.6rem,4vw,2.8rem)]">studio arama</span>
        <span className="label">© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
