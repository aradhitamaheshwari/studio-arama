"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { useMode } from "./ModeProvider";
import { useSound } from "./SoundProvider";

/**
 * THE HEADER
 *
 * Three parts, evenly weighted: the name, the navigation, the controls.
 *
 * Hovering any one of them softens the others. It is a small amount of blur
 * and a drop in opacity, enough that attention follows the cursor without the
 * interface appearing to break. Focus does the same thing, so the effect is
 * not reserved for people using a mouse.
 */

/**
 * Bars that stand up and move when sound is on, and lie flat under a slash
 * when it is off. The slash is what makes the off state unambiguous: four
 * short bars on their own just read as dots.
 */
function SoundIcon({ on }: { on: boolean }) {
  const heights = on ? [7, 13, 9, 15] : [3, 3, 3, 3];
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="overflow-visible">
      {heights.map((h, i) => (
        <rect
          key={i}
          x={2 + i * 4}
          y={9 - h / 2}
          width="2"
          height={h}
          rx="1"
          fill="currentColor"
          style={{
            transition: "y 0.35s var(--ease-out), height 0.35s var(--ease-out)",
            animation: on ? `sound-bar ${0.62 + i * 0.19}s var(--ease-soft) infinite alternate` : "none",
            transformOrigin: "center",
          }}
        />
      ))}
      <line
        x1="2"
        y1="15"
        x2="16"
        y2="3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{
          // Drawn from one end rather than faded, so it reads as a gesture.
          strokeDasharray: 19,
          strokeDashoffset: on ? 19 : 0,
          transition: "stroke-dashoffset 0.4s var(--ease-out)",
        }}
      />
    </svg>
  );
}

/**
 * A disc that a second disc slides across. Full circle for day, bitten into a
 * crescent for night. One shape, one movement, no icon set.
 */
function ModeIcon({ night }: { night: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <defs>
        <mask id="arama-mode-mask">
          <rect width="18" height="18" fill="#fff" />
          <circle
            cx={night ? 13 : 22}
            cy={night ? 5 : 0}
            r="7.5"
            fill="#000"
            style={{ transition: "cx 0.5s var(--ease-out), cy 0.5s var(--ease-out)" }}
          />
        </mask>
      </defs>
      <circle cx="9" cy="9" r="5.5" fill="currentColor" mask="url(#arama-mode-mask)" />
    </svg>
  );
}

function ControlButton({
  label,
  pressed,
  onClick,
  children,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      aria-label={label}
      title={label}
      className="grid h-8 w-8 place-items-center transition-colors duration-300"
      style={{ color: pressed ? "var(--accent-text)" : "var(--ink-soft)" }}
    >
      {children}
    </button>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  /** Which header region currently has attention, if any. */
  const [focus, setFocus] = useState<string | null>(null);
  const { mode, toggle: toggleMode } = useMode();
  const { enabled, toggle: toggleSound } = useSound();

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

  // Marks a region so the CSS can tell the attended one from the rest.
  const region = (id: string) => ({
    "data-hdr-el": "",
    "data-active": focus === id ? "true" : undefined,
    onMouseEnter: () => setFocus(id),
    onFocus: () => setFocus(id),
  });

  return (
    <>
      <header
        className="hdr fixed inset-x-0 top-0 z-[100] transition-colors duration-500"
        data-dim={focus ? "true" : undefined}
        onMouseLeave={() => setFocus(null)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocus(null);
        }}
        style={{
          backgroundColor: scrolled ? "color-mix(in srgb, var(--bg) 80%, transparent)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
        }}
      >
        <nav
          className="gutter flex items-center justify-between gap-8 py-5"
          aria-label="Primary"
        >
          {/* Left: the name. */}
          <Link
            href="/"
            className="wordmark wordmark-link shrink-0 text-[clamp(1rem,1.4vw,1.2rem)]"
            {...region("name")}
          >
            studio arama
          </Link>

          {/* Right: where to go, then the two controls, quietly. */}
          <div className="hidden items-center gap-8 md:flex">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link text-[0.78rem] tracking-[0.02em]"
                {...region(item.href)}
              >
                {item.label}
              </Link>
            ))}

            <span className="h-3 w-px bg-line" aria-hidden="true" />

            <div className="flex items-center gap-1" {...region("controls")}>
              <ControlButton
                label={enabled ? "Turn sound off" : "Turn sound on"}
                pressed={enabled}
                onClick={toggleSound}
              >
                <SoundIcon on={enabled} />
              </ControlButton>
              <ControlButton
                label={mode === "night" ? "Switch to day" : "Switch to night"}
                pressed={mode === "night"}
                onClick={toggleMode}
              >
                <ModeIcon night={mode === "night"} />
              </ControlButton>
            </div>
          </div>

          {/* Small screens keep both controls reachable without the menu. */}
          <div className="flex items-center gap-1 md:hidden">
            <ControlButton
              label={enabled ? "Turn sound off" : "Turn sound on"}
              pressed={enabled}
              onClick={toggleSound}
            >
              <SoundIcon on={enabled} />
            </ControlButton>
            <ControlButton
              label={mode === "night" ? "Switch to day" : "Switch to night"}
              pressed={mode === "night"}
              onClick={toggleMode}
            >
              <ModeIcon night={mode === "night"} />
            </ControlButton>
            <button
              type="button"
              className="label ml-2 py-2"
              aria-expanded={open}
              aria-controls="menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </nav>
      </header>

      <div
        id="menu"
        className="fixed inset-0 z-[99] flex flex-col justify-between bg-bg px-[var(--gutter)] pb-12 pt-28 md:hidden"
        style={{
          transform: open ? "translateY(0)" : "translateY(-101%)",
          transition: "transform 0.7s var(--ease-out)",
          visibility: open ? "visible" : "hidden",
        }}
        aria-hidden={!open}
      >
        <ul className="flex flex-col gap-3">
          {site.nav.map((item, i) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="heading block"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.5s var(--ease-out) ${0.1 + i * 0.06}s, transform 0.7s var(--ease-out) ${0.1 + i * 0.06}s`,
                }}
              >
                {item.label.toLowerCase()}
              </Link>
            </li>
          ))}
        </ul>
        <a href={`mailto:${site.email}`} className="label link" tabIndex={open ? 0 : -1}>
          {site.email}
        </a>
      </div>
    </>
  );
}
