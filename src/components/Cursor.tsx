"use client";

import { useEffect, useRef } from "react";

/**
 * The cursor is part of the art direction, but it never replaces a cue.
 * Underlines, focus rings and hit areas all still exist without it.
 * Touch devices and anyone asking for reduced motion get nothing from here.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Touch and reduced motion never activate it. The element stays in the
    // document, invisible and inert, rather than toggling through state.
    if (!fine || calm) return;

    document.body.classList.add("has-cursor");

    const el = ref.current;
    if (!el) return;

    // Target follows the pointer exactly. Rendered position eases toward it,
    // which is what gives the cursor weight.
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let raf = 0;
    let seen = false;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!seen) {
        seen = true;
        x = tx;
        y = ty;
        el.dataset.hidden = "false";
      }

      const target = e.target as HTMLElement | null;
      const hit = target?.closest<HTMLElement>("[data-cursor], a, button");
      const state = hit?.dataset.cursor ?? (hit ? "link" : "default");
      if (el.dataset.state !== state) {
        el.dataset.state = state;
        if (word.current) word.current.textContent = hit?.dataset.cursorWord ?? "";
      }
    };

    const onLeave = () => {
      el.dataset.hidden = "true";
    };
    const onEnter = () => {
      el.dataset.hidden = "false";
    };

    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      document.body.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div ref={ref} className="cursor" data-state="default" data-hidden="true" aria-hidden="true">
      <span ref={word} className="cursor__word" />
    </div>
  );
}
