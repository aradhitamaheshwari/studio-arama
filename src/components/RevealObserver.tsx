"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Watches for anything carrying `.reveal` and lets it in when it is actually
 * looked at. Nothing animates off screen, so the page stays cheap.
 *
 * Living here rather than in each section keeps the content components on the
 * server, where they belong.
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".reveal, .line-mask").forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target); // Reveal once. It is not a toy.
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    const observe = () => {
      document.querySelectorAll(".reveal:not(.is-in), .line-mask:not(.is-in)").forEach((el) => io.observe(el));
    };
    observe();

    // Sections that mount later, such as the page behind the opening sequence.
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
