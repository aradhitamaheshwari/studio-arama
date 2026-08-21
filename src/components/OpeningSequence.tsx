"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ProjectVisual from "./ProjectVisual";

/**
 * THE FIRST FIVE SECONDS
 *
 * Not a hero. Not a loading screen. The identity assembling itself in front of
 * the visitor: the name jumping between typefaces, widths and scales while
 * fragments of work cross the frame, resolving into the composition the page
 * actually holds.
 *
 * Shape of it: explosion, then composition, then rhythm. The last beat is long
 * and smooth on purpose, so the sequence lands rather than stops.
 *
 * It never holds anyone hostage. Any input finishes it immediately, it plays
 * once per session, and it does not run at all for reduced motion.
 */

type Beat = {
  /** How long this beat holds, in milliseconds. */
  d: number;
  font: "grotesk" | "serif" | "serif-italic";
  size: string;
  wght: number;
  wdth: number;
  track: string;
  x?: string;
  y?: string;
  accent?: boolean;
  outline?: boolean;
  /** Hard cut with no transition. Used like a film cut. */
  cut?: boolean;
  /** Which fragments are on screen. */
  frags?: number[];
  wipe?: boolean;
};

const BEATS: Beat[] = [
  // A quiet start. Almost nothing.
  { d: 260, font: "serif", size: "clamp(0.9rem, 2vw, 1.5rem)", wght: 400, wdth: 100, track: "0.34em" },
  // Enormous, condensed, immediate.
  { d: 170, font: "grotesk", size: "clamp(4rem, 19vw, 17rem)", wght: 800, wdth: 62, track: "-0.04em", cut: true, frags: [0] },
  // Serif italic, thrown left.
  { d: 190, font: "serif-italic", size: "clamp(3rem, 12vw, 10rem)", wght: 400, wdth: 100, track: "-0.02em", x: "-14%", cut: true, frags: [0, 1] },
  // Stretched wide, and the red arrives.
  { d: 170, font: "grotesk", size: "clamp(2.6rem, 13vw, 11rem)", wght: 700, wdth: 125, track: "0.02em", accent: true, cut: true, frags: [1, 2] },
  // Microscopic, pushed into a corner, while the work piles up.
  { d: 210, font: "grotesk", size: "0.7rem", wght: 500, wdth: 100, track: "0.42em", x: "-36%", y: "-32%", cut: true, frags: [0, 1, 2, 3] },
  // Vast and outlined.
  { d: 230, font: "grotesk", size: "clamp(5rem, 23vw, 21rem)", wght: 900, wdth: 80, track: "-0.05em", outline: true, cut: true, frags: [2, 3] },
  // The wipe.
  { d: 250, font: "grotesk", size: "clamp(3.5rem, 16vw, 14rem)", wght: 700, wdth: 100, track: "-0.03em", accent: true, cut: true, wipe: true, frags: [3, 4] },
  // Settle. Long, smooth, and it lands on the composition.
  { d: 760, font: "grotesk", size: "clamp(2.4rem, 9vw, 7rem)", wght: 700, wdth: 100, track: "-0.03em", x: "0%", y: "0%" },
];

/** Where fragments sit while they cross the frame. */
const FRAGMENTS = [
  { x: "8%", y: "12%", w: "23vw", ratio: "3 / 4", from: "-8%, 6%", variant: 0 },
  { x: "62%", y: "20%", w: "27vw", ratio: "4 / 3", from: "10%, -6%", variant: 2 },
  { x: "28%", y: "42%", w: "31vw", ratio: "16 / 10", from: "0%, 12%", variant: 4 },
  { x: "58%", y: "58%", w: "25vw", ratio: "1 / 1", from: "8%, 8%", variant: 1 },
  { x: "10%", y: "56%", w: "21vw", ratio: "3 / 4", from: "-10%, -4%", variant: 5 },
];

const SESSION_KEY = "arama-opened";

export default function OpeningSequence({ onDone }: { onDone: () => void }) {
  const [beat, setBeat] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timers = useRef<number[]>([]);
  const raf = useRef<number | null>(null);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (raf.current) cancelAnimationFrame(raf.current);
    // Recorded on completion, never on the decision to play. Writing it up
    // front would make the effect non idempotent: a remount would read the
    // flag it had just written and skip the sequence it never showed.
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Storage unavailable. The sequence simply plays again next time.
    }
    setLeaving(true);
    // Let the overlay clear before handing the page over.
    window.setTimeout(() => {
      setPlaying(false);
      document.body.style.removeProperty("overflow");
      onDone();
    }, 420);
  }, [onDone]);

  useEffect(() => {
    // Once it has run, it has run. Guards against a remount replaying it.
    if (finished.current) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // Storage unavailable. Treat it as a first visit.
    }

    if (calm || seen) {
      finished.current = true;
      onDone();
      return;
    }

    // The page underneath holds its entrance until the sequence lands. Both of
    // these are set from script, so a browser without JS simply shows the page.
    document.documentElement.setAttribute("data-opening", "true");
    document.body.style.overflow = "hidden";

    /**
     * Everything starts on the first painted frame, never before it.
     *
     * A background tab pauses rAF but keeps firing timers. Scheduling the beats
     * up front would let the timeline run itself out while nothing was on
     * screen, and the overlay would then mount, after the end, with no timers
     * left to clear it. Tying both to the same frame means a tab opened in the
     * background simply waits, and the visitor sees the sequence from its first
     * beat whenever they arrive.
     */
    raf.current = requestAnimationFrame(() => {
      if (finished.current) return;
      setPlaying(true);

      let elapsed = 0;
      BEATS.forEach((b, i) => {
        if (i === 0) return;
        elapsed += BEATS[i - 1].d;
        timers.current.push(window.setTimeout(() => setBeat(i), elapsed));
      });
      timers.current.push(window.setTimeout(finish, elapsed + BEATS[BEATS.length - 1].d));
    });

    // Anyone who wants in early gets in early.
    const skip = () => finish();
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchstart", skip, { passive: true });

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      timers.current.forEach(clearTimeout);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
      document.body.style.removeProperty("overflow");
      // Leaving mid sequence must never strand the page in its hidden state.
      document.documentElement.removeAttribute("data-opening");
    };
  }, [finish, onDone]);

  if (!playing) return null;

  const b = BEATS[beat];
  const active = b.frags ?? [];

  return (
    <div
      data-sequence=""
      data-beat={beat}
      className="fixed inset-0 z-[120] overflow-hidden bg-bg"
      style={{ opacity: leaving ? 0 : 1, transition: "opacity 0.42s var(--ease-out)" }}
      aria-hidden="true"
    >
      {/* Fragments of work, crossing. */}
      {FRAGMENTS.map((f, i) => {
        const on = active.includes(i);
        return (
          <div
            key={i}
            className="absolute overflow-hidden"
            style={{
              left: f.x,
              top: f.y,
              width: f.w,
              aspectRatio: f.ratio,
              opacity: on ? 1 : 0,
              transform: on ? "translate(0, 0) scale(1)" : `translate(${f.from}) scale(0.94)`,
              transition: "opacity 0.28s linear, transform 0.7s var(--ease-out)",
            }}
          >
            <ProjectVisual variant={f.variant} alt="" />
          </div>
        );
      })}

      {/* The red pass across the frame. */}
      <div
        className="absolute inset-0 bg-accent"
        style={{
          clipPath: b.wipe ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
          transition: b.wipe ? "clip-path 0.34s var(--ease-snap)" : "clip-path 0.5s var(--ease-out)",
        }}
      />

      {/* The name. */}
      <div className="absolute inset-0 grid place-items-center px-[var(--gutter)]">
        <span
          className={b.font === "grotesk" ? "wordmark" : ""}
          style={{
            fontFamily:
              b.font === "grotesk" ? "var(--font-grotesk)" : "var(--font-serif)",
            fontStyle: b.font === "serif-italic" ? "italic" : "normal",
            fontSize: b.size,
            letterSpacing: b.track,
            lineHeight: 0.82,
            textTransform: "lowercase",
            whiteSpace: "nowrap",
            fontVariationSettings: `"wght" ${b.wght}, "wdth" ${b.wdth}`,
            color: b.outline ? "transparent" : b.wipe ? "var(--accent-ink)" : b.accent ? "var(--accent)" : "var(--ink)",
            WebkitTextStroke: b.outline ? "2px var(--ink)" : undefined,
            transform: `translate(${b.x ?? "0%"}, ${b.y ?? "0%"})`,
            transition: b.cut
              ? "none"
              : "font-variation-settings 0.7s var(--ease-out), font-size 0.7s var(--ease-out), transform 0.7s var(--ease-out), letter-spacing 0.7s var(--ease-out), color 0.4s linear",
          }}
        >
          studio arama
        </span>
      </div>
    </div>
  );
}
