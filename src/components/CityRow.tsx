"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/lib/site";

/**
 * The bottom row of the landing screen. The studio's hours, spread evenly
 * across the width, set in the mono so it reads as information rather than
 * as a statement.
 *
 * The clock is an external source rather than component state, and the server
 * renders placeholders because it cannot know what second it will be by the
 * time the page arrives.
 */

const subscribe = (onTick: () => void) => {
  const id = window.setInterval(onTick, 1000);
  return () => window.clearInterval(id);
};
const getSnapshot = () => Math.floor(Date.now() / 60000);
const getServerSnapshot = () => 0;

export default function CityRow() {
  const minutes = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const now = minutes ? new Date(minutes * 60000) : null;

  return (
    <ul className="cities label" style={{ ["--n" as string]: site.clocks.length }}>
      {site.clocks.map(({ city, zone }) => {
        const time = now
          ? new Intl.DateTimeFormat("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
              timeZone: zone,
            }).format(now)
          : "--:--";
        return (
          <li key={zone} className="flex gap-2 whitespace-nowrap">
            <span>{city}</span>
            <time suppressHydrationWarning className="text-ink">
              {time}
            </time>
          </li>
        );
      })}
    </ul>
  );
}
