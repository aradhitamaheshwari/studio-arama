"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * THE FIRST THREE SECONDS
 *
 * Colour with momentum. Seven fields of light sweep across the screen on their
 * own paths, gather toward the centre, then blast outward through the frame and
 * leave the homepage behind them.
 *
 * It is one CSS animation per field, transform and opacity only, so the whole
 * sequence runs on the compositor. No per frame JavaScript, no canvas, no
 * library. JavaScript here does four things: start on the first painted frame,
 * end after three seconds, let any input cut it short, and stay out of the way
 * of anyone who asked for reduced motion.
 *
 * The brand red and the neon green are seeded into the spectrum on purpose, so
 * the opening belongs to this studio rather than to any site.
 */

/**
 * Where each field starts, where it sweeps to, the angle it travels at, and
 * what colour it carries. The angles are what stop this reading as a gradient:
 * every streak crosses the frame on its own line.
 */
const FIELDS = [
  { c: "#e5231b", x0: "-46vw", y0: "-34vh", x1: "20vw", y1: "24vh", r: "-28deg", d: "0s", s: 1.1 },
  { c: "#ff7a00", x0: "52vw", y0: "-40vh", x1: "-24vw", y1: "18vh", r: "34deg", d: "0.05s", s: 0.9 },
  { c: "#ffd400", x0: "-54vw", y0: "36vh", x1: "26vw", y1: "-22vh", r: "18deg", d: "0.1s", s: 0.8 },
  { c: "#b8ff00", x0: "48vw", y0: "40vh", x1: "-28vw", y1: "-26vh", r: "-42deg", d: "0.15s", s: 1 },
  { c: "#00c2a8", x0: "0vw", y0: "-52vh", x1: "22vw", y1: "28vh", r: "62deg", d: "0.2s", s: 0.85 },
  { c: "#2b6cff", x0: "-50vw", y0: "10vh", x1: "30vw", y1: "-16vh", r: "-14deg", d: "0.25s", s: 1.05 },
  { c: "#b14bff", x0: "52vw", y0: "6vh", x1: "-26vw", y1: "20vh", r: "48deg", d: "0.3s", s: 0.75 },
];

const DURATION = 3000;
const SESSION_KEY = "arama-opened";

export default function OpeningSequence({ onDone }: { onDone: () => void }) {
  const [playing, setPlaying] = useState(false);
  const [calm, setCalm] = useState(false);
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
    setPlaying(false);
    document.body.style.removeProperty("overflow");
    onDone();
  }, [onDone]);

  useEffect(() => {
    // Once it has run, it has run. Guards against a remount replaying it.
    if (finished.current) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // Storage unavailable. Treat it as a first visit.
    }

    if (seen) {
      finished.current = true;
      onDone();
      return;
    }

    setCalm(reduced);
    document.documentElement.setAttribute("data-opening", "true");
    document.body.style.overflow = "hidden";

    /**
     * Everything starts on the first painted frame, never before it.
     *
     * A background tab pauses rAF but keeps firing timers. Scheduling the end
     * up front would let the sequence run itself out while nothing was on
     * screen. Tying both to the same frame means a tab opened in the background
     * simply waits, and the visitor sees it from the beginning when they arrive.
     */
    raf.current = requestAnimationFrame(() => {
      if (finished.current) return;
      setPlaying(true);
      // Reduced motion gets a still field of colour and a quick, calm exit.
      timers.current.push(window.setTimeout(finish, reduced ? 900 : DURATION));
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

  return (
    <div data-sequence="" className="seq" data-calm={calm ? "true" : undefined} aria-hidden="true">
      <div className="seq__stage">
        {FIELDS.map((f, i) => (
          <span
            key={i}
            className="seq__field"
            style={{
              background: `radial-gradient(closest-side, ${f.c} 0%, ${f.c}cc 42%, transparent 72%)`,
              ["--x0" as string]: f.x0,
              ["--y0" as string]: f.y0,
              ["--x1" as string]: f.x1,
              ["--y1" as string]: f.y1,
              ["--rot" as string]: f.r,
              ["--s" as string]: String(f.s),
              animationDelay: f.d,
            }}
          />
        ))}
      </div>
      {/* The moment the colour leaves through the frame. */}
      <div className="seq__flash" />
    </div>
  );
}
