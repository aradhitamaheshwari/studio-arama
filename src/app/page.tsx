import type { Metadata } from "next";
import LandingComposition from "@/components/LandingComposition";
import CityRow from "@/components/CityRow";
import HomeLock from "@/components/HomeLock";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * THE HOMEPAGE
 *
 * One viewport: navigation, the project composition, the centre title, the
 * city row. Nothing underneath it. The work is the landing experience rather
 * than something found by scrolling past an introduction.
 */
export default function Home() {
  return (
    <>
      <HomeLock />

      <div className="relative flex h-[100svh] flex-col">
        <LandingComposition />

        <div className="city-bar pointer-events-none absolute inset-x-0 bottom-0 z-[4] px-[var(--gutter)] pb-5">
          <CityRow />
        </div>
      </div>
    </>
  );
}
