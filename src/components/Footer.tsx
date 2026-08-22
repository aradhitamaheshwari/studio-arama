import Clocks from "./Clocks";
import { site } from "@/lib/site";

/**
 * The footer carries the identity rather than closing the door on it: the
 * studio's hours across four cities, the name at full width, and three ways
 * to reach it.
 */

/** Minimal marks, drawn to sit with the rest of the type rather than shout. */
function IconLinkedIn() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M3.6 5.4H1.2V15h2.4V5.4ZM2.4 1a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8ZM15 9.3c0-2.5-1.3-3.9-3.3-3.9-1.3 0-2 .7-2.4 1.3V5.4H6.9c0 .7 0 9.6 0 9.6h2.4V9.7c0-.2 0-.5.1-.7.2-.5.6-1 1.4-1 1 0 1.5.8 1.5 2V15H15V9.3Z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1.2" y="1.2" width="13.6" height="13.6" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12.1" cy="3.9" r="1" fill="currentColor" />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1" y="3" width="14" height="10" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="m1.8 4.4 6.2 4.3 6.2-4.3" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const LINKS = [
  { label: "LinkedIn", href: site.social.linkedin.url, Icon: IconLinkedIn, external: true },
  { label: "Instagram", href: site.social.instagram.url, Icon: IconInstagram, external: true },
  { label: "Email", href: `mailto:${site.email}`, Icon: IconEmail, external: false },
];

export default function Footer() {
  return (
    <footer className="gutter pb-[var(--space-md)] pt-[var(--space-section)]">
      <hr className="rule" />

      <div className="pt-[var(--space-block)]">
        <Clocks />
      </div>

      {/*
        The name at full width.

        Drawn as SVG rather than set as CSS text on purpose. `textLength` pins
        the word to exactly the width of its box and the viewBox scales it, so
        it fills the line precisely at every viewport and cannot clip or
        overflow. `lengthAdjust="spacing"` moves the tracking only, so the
        letterforms are never stretched to make it fit.
      */}
      <div className="mt-[var(--space-block)]">
        <svg
          className="footer-mark"
          viewBox="0 0 100 15"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={site.name}
        >
          <text
            x="0"
            y="12.4"
            textLength="100"
            lengthAdjust="spacing"
            fontSize="15.5"
            fill="currentColor"
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: '"wght" 600, "SOFT" 30, "WONK" 1, "opsz" 144',
            }}
          >
            studio arama
          </text>
        </svg>
      </div>

      <div className="mt-[var(--space-md)] flex flex-col gap-[var(--space-sm)] border-t border-line pt-[var(--space-sm)] sm:flex-row sm:items-center sm:justify-between">
        <span className="label">
          © {new Date().getFullYear()} {site.name}
        </span>

        <ul className="flex items-center gap-5">
          {LINKS.map(({ label, href, Icon, external }) => (
            <li key={label}>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                aria-label={label}
                title={label}
                className="footer-link flex items-center gap-2"
                data-cursor="link"
              >
                <Icon />
                <span className="label footer-link__text">{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
