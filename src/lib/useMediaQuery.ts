import { useSyncExternalStore } from "react";

/**
 * A media query is external state, so the tree subscribes to it rather than
 * mirroring it into a state variable from an effect. The server answers false,
 * and hydration corrects it.
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
