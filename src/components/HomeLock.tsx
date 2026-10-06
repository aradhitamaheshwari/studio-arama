"use client";

import { useEffect } from "react";

/**
 * Marks the document while the homepage is mounted, so the stylesheet can stop
 * the page scrolling on desktop without affecting any other route.
 *
 * It is an attribute rather than a style so the rule stays in the stylesheet
 * with the media query that limits it to wide screens. Small screens keep
 * scrolling, because the composition is taller than a phone.
 */
export default function HomeLock() {
  useEffect(() => {
    document.documentElement.setAttribute("data-home", "true");
    return () => document.documentElement.removeAttribute("data-home");
  }, []);
  return null;
}
