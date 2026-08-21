"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";

export type Mode = "day" | "night";

const STORAGE_KEY = "arama-mode";

type ModeContext = { mode: Mode; toggle: () => void; setMode: (m: Mode) => void };

const Ctx = createContext<ModeContext>({ mode: "day", toggle: () => {}, setMode: () => {} });

export const useMode = () => useContext(Ctx);

/**
 * Runs before paint so the first frame is already in the right mode.
 * A stored choice wins. Otherwise the system preference decides.
 */
export const modeScript = `(function(){try{var s=localStorage.getItem('${STORAGE_KEY}');var m=s||(window.matchMedia('(prefers-color-scheme: dark)').matches?'night':'day');document.documentElement.setAttribute('data-mode',m);}catch(e){document.documentElement.setAttribute('data-mode','day');}})();`;

/**
 * The attribute on <html> is the single source of truth, since the inline
 * script above sets it before React exists. Rather than keep a second copy in
 * state and try to hold the two in sync, the tree subscribes to the attribute
 * itself.
 */
const subscribe = (onChange: () => void) => {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-mode"] });
  // Keeps two open tabs agreeing with each other.
  window.addEventListener("storage", onChange);
  return () => {
    mo.disconnect();
    window.removeEventListener("storage", onChange);
  };
};

const getSnapshot = (): Mode =>
  (document.documentElement.getAttribute("data-mode") as Mode) || "day";

// The server cannot know. It renders day, then hydration corrects it.
const getServerSnapshot = (): Mode => "day";

export default function ModeProvider({ children }: { children: React.ReactNode }) {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setMode = useCallback((m: Mode) => {
    document.documentElement.setAttribute("data-mode", m);
    try {
      localStorage.setItem(STORAGE_KEY, m);
    } catch {
      // Private mode. The choice still applies for this visit.
    }
  }, []);

  const toggle = useCallback(() => {
    setMode(getSnapshot() === "day" ? "night" : "day");
  }, [setMode]);

  // Follow the system only while the visitor has never chosen for themselves.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem(STORAGE_KEY)) return;
      } catch {
        return;
      }
      document.documentElement.setAttribute("data-mode", e.matches ? "night" : "day");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return <Ctx.Provider value={{ mode, toggle, setMode }}>{children}</Ctx.Provider>;
}
