"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { projects, slotImage } from "@/lib/projects";
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

type Slot = {
  /** Horizontal position and vertical position, as percentages of the stage. */
  x: number;
  y: number;
  /**
   * Height, in percent of the stage height. Width is derived from it and the
   * ratio.
   *
   * Sizing from the height rather than the width is what keeps the
   * composition honest: the slots are positioned down the screen in percent of
   * height, so if they were sized from the width they would grow relative to a
   * short viewport and collide. Driving both from the same axis means the
   * composition holds its shape at any proportion.
   */
  h: number;
  /** Height divided by width. Above one is a portrait crop. */
  ratio: number;
  /** How far this position drifts from the pointer. Builds depth. */
  depth: number;
};

/**
 * The composition. Asymmetric, weighted left and right of a clear central
 * band so the title always has air, with nothing crossing the type.
 */
const SLOTS: Slot[] = [
  { x: 3, y: 15, h: 34, ratio: 1.3, depth: 0.5 },
  { x: 21.5, y: 60, h: 27, ratio: 1.25, depth: 1.1 },
  { x: 42, y: 6, h: 22, ratio: 0.82, depth: 0.75 },
  { x: 62.5, y: 60, h: 27, ratio: 1.2, depth: 0.95 },
  { x: 79, y: 17, h: 25, ratio: 0.85, depth: 0.6 },
];

/**
 * Mobile recomposes rather than shrinking: five smaller images, three above
 * the title and two below, with the same clear band kept through the middle.
 */
const MOBILE_SLOTS: Slot[] = [
  { x: 4, y: 11, h: 19, ratio: 1.25, depth: 0 },
  { x: 44, y: 8, h: 18, ratio: 1.3, depth: 0 },
  { x: 71, y: 27, h: 14, ratio: 1.2, depth: 0 },
  { x: 6, y: 62, h: 19, ratio: 1.2, depth: 0 },
  { x: 48, y: 66, h: 18, ratio: 1.25, depth: 0 },
];

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

    const slots = Array.from(stage.querySelectorAll<HTMLElement>("[data-depth]"));
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const loop = () => {
      x += (tx - x) * 0.055;
      y += (ty - y) * 0.055;
      for (const s of slots) {
        const d = Number(s.dataset.depth) || 0;
        s.style.setProperty("--px", `${x * d * -16}px`);
        s.style.setProperty("--py", `${y * d * -11}px`);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
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
   * Leaving an image returns the screen to the mixed state, but moving from
   * one image to the next should not flicker through it on the way. The clear
   * is therefore scheduled a beat ahead and cancelled by whichever image the
   * pointer arrives at next.
   */
  const clearTimer = useRef<number | null>(null);

  const hold = useCallback((slug: string) => {
    if (clearTimer.current) {
      window.clearTimeout(clearTimer.current);
      clearTimer.current = null;
    }
    setActive(slug);
  }, []);

  const release = useCallback(() => {
    if (clearTimer.current) window.clearTimeout(clearTimer.current);
    clearTimer.current = window.setTimeout(() => setActive(null), 90);
  }, []);

  useEffect(() => {
    return () => {
      if (clearTimer.current) window.clearTimeout(clearTimer.current);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="stage"
      data-active={active ?? undefined}
      onPointerLeave={() => setActive(null)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setActive(null);
      }}
    >
      {SLOTS.map((slot, i) => {
        // At rest each position belongs to a different project, so the first
        // thing anyone sees is the range of the studio.
        const resting = projects[i % projects.length];
        const owner = activeProject ?? resting;
        const mob = MOBILE_SLOTS[i];

        return (
          <Link
            key={i}
            href={`/work/${owner.slug}`}
            className="slot"
            data-depth={slot.depth}
            data-active={active === owner.slug ? "true" : undefined}
            aria-label={`${owner.name}. ${owner.category}.`}
            style={
              {
                "--x": `${slot.x}%`,
                "--y": `${slot.y}%`,
                "--h": `${slot.h}%`,
                "--ratio": String(slot.ratio),
                "--mx": `${mob.x}%`,
                "--my": `${mob.y}%`,
                "--mh": `${mob.h}%`,
                "--mratio": String(mob.ratio),
                "--n": i,
              } as React.CSSProperties
            }
            onPointerEnter={() => !touch && hold(resting.slug)}
            onPointerLeave={() => !touch && release()}
            onFocus={() => hold(resting.slug)}
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
                    draggable={false}
                    style={{ objectPosition: image.position ?? "center" }}
                  />
                </div>
              );
            })}
          </Link>
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
