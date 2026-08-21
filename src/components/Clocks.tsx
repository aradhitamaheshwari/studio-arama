"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/lib/site";

/**
 * The studio's working world, told in real time. Not a claim about offices.
 * Real IANA zones through Intl, so daylight saving is handled for us.
 *
 * The clock is an external source rather than component state: the tree
 * subscribes to it, and the server renders placeholders because it has no idea
 * what second it will be by the time this reaches a browser.
 */

const subscribe = (onTick: () => void) => {
  const id = window.setInterval(onTick, 1000);
  return () => window.clearInterval(id);
};

// Whole seconds, so all four cities change on the same tick.
const getSnapshot = () => Math.floor(Date.now() / 1000);
const getServerSnapshot = () => 0;

export default function Clocks() {
  const seconds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const now = seconds ? new Date(seconds * 1000) : null;

  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
      {site.clocks.map(({ city, zone }) => {
        const time = now
          ? new Intl.DateTimeFormat("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
              timeZone: zone,
            }).format(now)
          : "--:--:--";
        return (
          <li key={zone}>
            <div className="label whitespace-nowrap">{city}</div>
            <div
              className="mt-1 text-[0.95rem] tabular-nums"
              style={{ fontVariationSettings: '"wght" 500, "wdth" 100' }}
            >
              <time suppressHydrationWarning>{time}</time>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
