"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProjectVisual from "./ProjectVisual";
import { projects, type Project } from "@/lib/projects";
import { openProject } from "@/lib/openProject";
import { useSound } from "./SoundProvider";

/**
 * SELECTED WORK
 *
 * A field, not a grid. On desktop the tiles are placed by coordinate, drift at
 * their own rates and answer the cursor at their own depths. On small screens
 * the same tiles recompose as a vertical editorial sequence with alternating
 * alignment and varied widths.
 *
 * The composition stays controlled. Every tile is a real link with a real name,
 * a real index and a visible focus state, so the field is always legible as
 * work rather than decoration.
 */

const ACCENTS: Record<Project["accent"], string> = {
  red: "var(--accent)",
  green: "var(--accent)",
  ink: "var(--ink)",
};

/** Mobile rhythm. Widths and alignment alternate so the column is composed. */
const MOBILE_LAYOUT = [
  { w: "86%", align: "flex-start" },
  { w: "62%", align: "flex-end" },
  { w: "74%", align: "flex-start" },
  { w: "92%", align: "flex-end" },
  { w: "58%", align: "flex-start" },
  { w: "80%", align: "flex-end" },
  { w: "68%", align: "flex-start" },
  { w: "88%", align: "flex-end" },
];

export default function ProjectField() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { blip } = useSound();

  // Cursor parallax. One loop for the whole field, one transform per tile,
  // and it never touches React state.
  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!desktop.matches || calm.matches) return;

    const tiles = Array.from(field.querySelectorAll<HTMLElement>("[data-depth]"));
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      // Normalised to roughly -1 to 1 across the viewport.
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const loop = () => {
      x += (tx - x) * 0.055;
      y += (ty - y) * 0.055;
      for (const tile of tiles) {
        const depth = Number(tile.dataset.depth) || 1;
        tile.style.setProperty("--px", `${x * depth * -14}px`);
        tile.style.setProperty("--py", `${y * depth * -10}px`);
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

  return (
    <div
      ref={fieldRef}
      className="field"
      // Tuned against the coordinates in projects.ts. Tall enough that the
      // composition breathes, tight enough that it never runs out into a gap.
      style={{ ["--field-h" as string]: "300vh" }}
    >
      {projects.map((p, i) => {
        const m = MOBILE_LAYOUT[i % MOBILE_LAYOUT.length];
        return (
          <Link
            key={p.slug}
            href={`/work/${p.slug}`}
            className="tile group"
            data-behaviour={p.behaviour}
            data-cursor="view"
            data-cursor-word="View"
            aria-label={`${p.name}, ${p.types.join(", ")}, ${p.year}`}
            onClick={(e) => {
              const frame = e.currentTarget.querySelector<HTMLElement>(".tile__frame");
              if (!frame || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
              e.preventDefault();
              blip(0.8);
              openProject(frame, p.name, ACCENTS[p.accent], () => router.push(`/work/${p.slug}`));
            }}
            style={{
              ["--x" as string]: `${p.field.x}%`,
              ["--y" as string]: `${p.field.y}%`,
              ["--w" as string]: `${p.field.w}vw`,
              ["--ratio" as string]: String(p.field.ratio),
              ["--m-w" as string]: m.w,
              ["--m-align" as string]: m.align,
            }}
          >
            {/* Parallax wrapper. Drift sits inside it so the two never fight. */}
            <div
              data-depth={p.field.depth}
              style={{ transform: "translate3d(var(--px, 0), var(--py, 0), 0)", willChange: "transform" }}
            >
              <div
                className="tile__frame drift"
                style={{
                  ["--drift-dur" as string]: `${8 + (i % 5) * 1.6}s`,
                  ["--drift-delay" as string]: `${(i % 4) * -1.9}s`,
                  ["--dx" as string]: `${i % 2 ? -7 : 6}px`,
                  ["--dy" as string]: `${i % 3 ? -9 : 7}px`,
                  ["--tilt" as string]: `${i % 2 ? 0.22 : -0.18}deg`,
                }}
              >
                <div className="tile__media">
                  <ProjectVisual
                    variant={p.variant}
                    src={p.cover?.src}
                    alt={p.cover?.alt ?? p.name}
                    sizes="(min-width: 1024px) 30vw, 90vw"
                  />
                </div>
                {/* Second state, for the tiles that swap rather than move. */}
                {p.behaviour === "swap" && (
                  <div className="tile__alt">
                    <ProjectVisual variant={p.variant + 3} alt="" />
                  </div>
                )}
              </div>

              <div className="tile__meta">
                <span className="tile__name">{p.name}</span>
                <span className="label tile__index">
                  {String(i + 1).padStart(2, "0")} / {p.year}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
