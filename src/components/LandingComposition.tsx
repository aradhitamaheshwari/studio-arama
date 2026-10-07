"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { projects, slotImage, REST_LAYOUT } from "@/lib/projects";
import { useMediaQuery } from "@/lib/useMediaQuery";
import CentreTitle from "./CentreTitle";

/**
 * THE LANDING
 *
 * One composed viewport. Five image positions, art directed rather than
 * tiled, holding one image from each project at rest.
 *
 * Pointing at any image turns the whole screen into that project's world:
 * every position swaps to that project's imagery and the centre title becomes
 * the project name. Leaving returns to the mixed state.
 *
 * HOW THE SWAP STAYS SMOOTH
 * Each position mounts one layer per project, all five preloaded at thumbnail
 * size, and the swap is a crossfade between layers already in the document.
 * Nothing is fetched, mounted or measured on hover, so there is no flash, no
 * reflow and no loading state. Only opacity and transform animate.
 *
 * Positions are percentages of the stage, so the composition holds its shape
 * across widths instead of being re-laid out at breakpoints.
 */

/**
 * Mobile keeps one arrangement. A phone has no room to move five pictures
 * around without them colliding, so there the swap changes the imagery and
 * leaves the positions alone. Desktop gets a composition per project, which
 * is where the space to rearrange actually exists.
 */
const MOBILE_SLOTS = [
  { x: 4, y: 11, h: 19 },
  { x: 44, y: 8, h: 18 },
  { x: 71, y: 27, h: 14 },
  { x: 6, y: 62, h: 19 },
  { x: 48, y: 66, h: 18 },
];

/** How far each position drifts from the pointer. Builds depth. */
const DEPTH = [0.5, 1.1, 0.75, 0.95, 0.6];

export default function LandingComposition() {
  // Which project owns the screen. Null is the mixed, resting state.
  const [active, setActive] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Touch devices have no hover, so the first tap opens the project's world
  // and the second opens the project.
  const touch = !useMediaQuery("(hover: hover) and (pointer: fine)");

  const activeProject = active ? projects.find((p) => p.slug === active) : null;

  // Pointer parallax. One loop for the stage, one transform per slot, and it
  // never passes through React state.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const anchors = Array.from(stage.querySelectorAll<HTMLElement>("[data-depth]"));
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, running = false;

    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      // The loop sleeps when the drift has settled, so a still mouse costs
      // nothing at all rather than a style recalculation every frame forever.
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };

    const loop = () => {
      x += (tx - x) * 0.055;
      y += (ty - y) * 0.055;
      for (const a of anchors) {
        const d = Number(a.dataset.depth) || 0;
        // Written straight to transform rather than through custom properties.
        // Going via registered properties cost about three times as much per
        // frame, and put the parallax inside the same calc as the position that
        // is being transitioned.
        a.style.transform = `translate3d(${(x * d * -16).toFixed(2)}px, ${(y * d * -11).toFixed(2)}px, 0)`;
      }
      if (Math.abs(tx - x) < 0.001 && Math.abs(ty - y) < 0.001) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const open = useCallback(
    (slug: string) => router.push(`/work/${slug}`),
    [router],
  );

  /**
   * Which project holds the screen changes when the pointer settles on an
   * image, and is given up only when the pointer leaves the composition.
   *
   * The delay matters. Sweeping across the screen crosses several images, and
   * without it each one started a full rearrangement that cut off the one
   * before it, so the composition never finished a move. Now a pass over an
   * image does nothing and only resting on one commits, which is what makes it
   * feel deliberate rather than nervous.
   *
   * It deliberately does not reset when the pointer slips into the space
   * between images: the images move when a project activates, so the one under
   * the cursor slides away from it, and resetting on that would restore the
   * composition, slide an image back under the cursor, and start over.
   */
  const INTENT_MS = 110;
  const intent = useRef<number | null>(null);

  const cancelIntent = useCallback(() => {
    if (intent.current) {
      window.clearTimeout(intent.current);
      intent.current = null;
    }
  }, []);

  const hold = useCallback(
    (slug: string) => {
      cancelIntent();
      intent.current = window.setTimeout(() => setActive(slug), INTENT_MS);
    },
    [cancelIntent],
  );

  /** Keyboard focus is already a deliberate act, so it commits at once. */
  const holdNow = useCallback(
    (slug: string) => {
      cancelIntent();
      setActive(slug);
    },
    [cancelIntent],
  );

  const releaseAll = useCallback(() => {
    cancelIntent();
    setActive(null);
  }, [cancelIntent]);

  useEffect(() => cancelIntent, [cancelIntent]);

  return (
    <div
      ref={stageRef}
      className="stage"
      data-active={active ?? undefined}
      onPointerLeave={releaseAll}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) releaseAll();
      }}
    >
      {REST_LAYOUT.map((_, i) => {
        // At rest each position belongs to a different project, so the first
        // thing anyone sees is the range of the studio.
        const resting = projects[i % projects.length];
        const owner = activeProject ?? resting;
        const mob = MOBILE_SLOTS[i];

        // Position comes from whichever world currently holds the screen, and
        // the shape comes from the picture that is in it. Between them, moving
        // to another project rearranges the composition rather than swapping
        // pictures inside fixed frames.
        const pos = (activeProject ? activeProject.layout : REST_LAYOUT)[i];
        const shownImage = slotImage(owner, i);

        return (
          <div key={i} className="slot-anchor" data-depth={DEPTH[i]}>
          <Link
            href={`/work/${owner.slug}`}
            className="slot"
            data-active={active === owner.slug ? "true" : undefined}
            aria-label={`${owner.name}. ${owner.category}.`}
            style={
              {
                "--tx": `${pos.x}vw`,
                "--ty": `${pos.y}svh`,
                "--h": `${pos.h}svh`,
                "--aspect": String(shownImage.aspect),
                "--mtx": `${mob.x}vw`,
                "--mty": `${mob.y}svh`,
                "--mh": `${mob.h}svh`,
                "--n": i,
              } as React.CSSProperties
            }
            onPointerEnter={() => !touch && hold(resting.slug)}
            onPointerLeave={() => !touch && cancelIntent()}
            onFocus={() => holdNow(resting.slug)}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey) return;
              // First tap reveals the project world, second opens it.
              if (touch && active !== resting.slug) {
                e.preventDefault();
                setActive(resting.slug);
                return;
              }
              e.preventDefault();
              open(owner.slug);
            }}
          >
            {/* Every project's image for this position, mounted and preloaded.
                Only opacity changes on swap. */}
            {projects.map((p) => {
              const image = slotImage(p, i);
              const shown = activeProject ? p.slug === activeProject.slug : p.slug === resting.slug;
              return (
                <div
                  key={p.slug}
                  className="slot__layer"
                  data-shown={shown ? "true" : undefined}
                  // A short stagger across positions so the swap reads as one
                  // move rather than five simultaneous cuts.
                  style={{ transitionDelay: `${i * 35}ms` }}
                  aria-hidden={!shown}
                >
                  {/* Plain img, because these are already sized and the export
                      build has no optimiser behind it. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.thumb}
                    alt={shown ? image.alt : ""}
                    width={image.w}
                    height={image.h}
                    loading="eager"
                    decoding="async"
                    /*
                      All five project worlds are still fetched up front, so a
                      hover never waits. Only the five actually on screen are
                      worth contending for bandwidth at load though, so the
                      other twenty come down behind them rather than alongside.
                    */
                    fetchPriority={shown ? "high" : "low"}
                    draggable={false}
                  />
                </div>
              );
            })}
          </Link>
          </div>
        );
      })}

      <CentreTitle active={activeProject?.name ?? null} />

      {/* The project names exist in the document whatever the pointer is
          doing, so the composition is navigable and legible without it. */}
      <h1 className="sr-only">
        studio arama. Selected work:{" "}
        {projects.map((p) => `${p.name}, ${p.category}.`).join(" ")}
      </h1>
    </div>
  );
}
