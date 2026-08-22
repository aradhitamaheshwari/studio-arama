"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * SCROLL MOTION
 *
 * Anything marked `data-parallax="0.06"` drifts against the scroll at that
 * rate. Positive numbers lag behind the page, negative ones run ahead of it,
 * which is what lets a heading and the paragraph beside it move at different
 * speeds.
 *
 * Two things keep it cheap. An IntersectionObserver holds the set of elements
 * currently near the viewport, so nothing off screen is ever touched. And each
 * frame reads every rect before writing any transform, so the browser is never
 * forced to recalculate layout in the middle of the loop.
 *
 * It writes transforms only, and it does nothing at all under reduced motion.
 */
export default function ScrollMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const live = new Set<HTMLElement>();
    let raf = 0;
    let queued = false;

    const frame = () => {
      queued = false;
      const vh = window.innerHeight;
      const mid = vh / 2;

      // Read first.
      const work: { el: HTMLElement; y: number }[] = [];
      live.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const speed = Number(el.dataset.parallax) || 0;
        // How far this element sits from the middle of the screen, as a
        // fraction of the viewport. Zero as it passes the centre.
        const offset = (rect.top + rect.height / 2 - mid) / vh;
        work.push({ el, y: offset * speed * vh });
      });

      // Then write.
      for (const { el, y } of work) {
        el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      }
    };

    const schedule = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) live.add(el);
          else live.delete(el);
        }
        schedule();
      },
      // Start moving slightly before it arrives, so nothing snaps into place.
      { rootMargin: "25% 0px 25% 0px" },
    );

    const collect = () => {
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        el.style.willChange = "transform";
        io.observe(el);
      });
      schedule();
    };
    collect();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    // Sections that mount later, such as the page behind the opening sequence.
    const mo = new MutationObserver(collect);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  return null;
}
