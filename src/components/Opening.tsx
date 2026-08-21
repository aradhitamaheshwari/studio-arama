"use client";

import { useCallback } from "react";
import OpeningSequence from "./OpeningSequence";

/**
 * Keeps the opening sequence, which has to be interactive, from turning the
 * whole homepage into a client component. The page underneath stays on the
 * server and the handoff happens through a single attribute on the document.
 */
export default function Opening() {
  const onDone = useCallback(() => {
    const root = document.documentElement;
    root.removeAttribute("data-opening");
    root.setAttribute("data-opened", "true");
  }, []);

  return <OpeningSequence onDone={onDone} />;
}
