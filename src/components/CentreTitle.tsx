"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

/**
 * The anchor of the landing screen.
 *
 * Reads "studio arama" at rest and becomes the project name while a project
 * holds the screen. The change is a replacement rather than a swap: the
 * outgoing characters lift and clear, the incoming ones rise into their place,
 * each one a frame or two behind the last.
 *
 * Both states are never in layout at once, so nothing reflows mid transition
 * and the type stays put while the images move around it.
 */

type Phase = "in" | "out" | "waiting";

const DURATION = 330;

export default function CentreTitle({ active }: { active: string | null }) {
  const target = active ?? site.name;
  const [shown, setShown] = useState(target);
  const [phase, setPhase] = useState<Phase>("in");
  const timers = useRef<number[]>([]);
  /**
   * The effect watches the target only. Depending on `shown` as well would
   * mean swapping the text re-runs the effect, whose cleanup would then cancel
   * the timer that is about to bring the new text back in, leaving the title
   * stranded invisible.
   */
  const lastTarget = useRef(target);

  useEffect(() => {
    if (lastTarget.current === target) return;
    lastTarget.current = target;

    let cancelled = false;
    timers.current.forEach(clearTimeout);
    timers.current = [];

    // Clear what is there, put the new text in place while it is invisible,
    // then let it rise. The first step waits a frame so the state change is
    // not raised synchronously from the effect.
    const raf = requestAnimationFrame(() => {
      if (!cancelled) setPhase("out");
    });

    timers.current.push(
      window.setTimeout(() => {
        if (cancelled) return;
        setShown(target);
        setPhase("waiting");
        // One frame on the waiting state, so the browser has somewhere to
        // animate from rather than folding both changes into one paint.
        timers.current.push(
          window.setTimeout(() => {
            if (!cancelled) setPhase("in");
          }, 20),
        );
      }, DURATION),
    );

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [target]);

  return (
    <div className="title">
      <div
        className="title__line wordmark text-[clamp(2.1rem,9vw,8rem)]"
        data-state={phase}
        /* The live name is announced once, rather than character by character. */
        aria-hidden="true"
      >
        {Array.from(shown).map((ch, i) => (
          <span
            key={`${shown}-${i}`}
            className="title__ch"
            style={{ ["--i" as string]: i }}
          >
            {ch}
          </span>
        ))}
      </div>
      <span className="sr-only" aria-live="polite">
        {active ? `Viewing ${active}` : site.name}
      </span>
    </div>
  );
}
