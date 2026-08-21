"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { useMode } from "./ModeProvider";
import { useSound } from "./SoundProvider";

/** Day and night, written out. A creative control, not a moon icon. */
function ModeToggle() {
  const { mode, setMode } = useMode();
  return (
    <div className="label flex items-center gap-1.5" role="group" aria-label="Colour mode">
      {(["day", "night"] as const).map((m, i) => (
        <span key={m} className="flex items-center gap-1.5">
          {i === 1 && <span aria-hidden="true" className="opacity-40">/</span>}
          <button
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className="transition-colors duration-300 hover:text-ink"
            style={{ color: mode === m ? "var(--accent-text)" : undefined }}
          >
            {m}
          </button>
        </span>
      ))}
    </div>
  );
}

/** Sound is off until it is asked for. The control says which state it is in. */
function SoundToggle() {
  const { enabled, toggle } = useSound();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      className="label flex items-center gap-2 transition-colors duration-300 hover:text-ink"
    >
      <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-[2px] bg-current"
            style={{
              height: enabled ? undefined : "3px",
              animation: enabled ? `sound-bar ${0.7 + i * 0.22}s var(--ease-soft) infinite alternate` : "none",
              background: enabled ? "var(--accent)" : "currentColor",
            }}
          />
        ))}
      </span>
      Sound {enabled ? "on" : "off"}
    </button>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // An open menu should never leave the page scrolling underneath it.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <style>{`@keyframes sound-bar{from{height:3px}to{height:12px}}`}</style>

      <header
        className="fixed inset-x-0 top-0 z-[100] transition-colors duration-500"
        style={{
          backgroundColor: scrolled ? "color-mix(in srgb, var(--bg) 82%, transparent)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <nav className="gutter flex items-center justify-between py-4" aria-label="Primary">
          <Link
            href="/"
            className="wordmark text-[clamp(0.95rem,1.5vw,1.15rem)]"
            style={{ ["--wm-wght" as string]: 700 }}
            onMouseEnter={(e) => e.currentTarget.style.setProperty("--wm-wdth", "118")}
            onMouseLeave={(e) => e.currentTarget.style.setProperty("--wm-wdth", "100")}
          >
            studio arama
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {site.nav.map((item) => (
              <Link key={item.href} href={item.href} className="label link hover:text-ink">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <SoundToggle />
            <ModeToggle />
            <Link
              href={site.cta.href}
              className="label border border-line px-3 py-2 transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              {site.cta.label}
            </Link>
          </div>

          {/* Compact on small screens, and it opens a composed menu rather than
              a stack of the desktop links. */}
          <button
            type="button"
            className="label md:hidden"
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </header>

      <div
        id="menu"
        className="fixed inset-0 z-[99] flex flex-col justify-between bg-bg px-[var(--gutter)] pb-10 pt-24 md:hidden"
        style={{
          transform: open ? "translateY(0)" : "translateY(-101%)",
          transition: "transform 0.7s var(--ease-out)",
          visibility: open ? "visible" : "hidden",
        }}
        aria-hidden={!open}
      >
        <ul className="flex flex-col gap-2">
          {[...site.nav, site.cta].map((item, i) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="display block text-[clamp(2.4rem,11vw,4rem)]"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.5s var(--ease-out) ${0.12 + i * 0.06}s, transform 0.7s var(--ease-out) ${0.12 + i * 0.06}s`,
                }}
              >
                {item.label.toLowerCase()}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between">
          <SoundToggle />
          <ModeToggle />
        </div>
      </div>
    </>
  );
}
