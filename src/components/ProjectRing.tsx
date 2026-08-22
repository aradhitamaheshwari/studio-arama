"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProjectVisual from "./ProjectVisual";
import { projects } from "@/lib/projects";
import { openProject } from "@/lib/openProject";
import { useSound } from "./SoundProvider";

/**
 * THE LANDING FIELD
 *
 * Eight projects travelling a bent ring. The path is an ellipse seen almost
 * edge on, with a second bend folded through it, so the tiles rise and fall as
 * well as passing left and right.
 *
 * Depth is drawn rather than rendered: scale, opacity and stacking order come
 * from where a tile sits on the path. That keeps the whole field on ordinary
 * 2D transforms, with no 3D layers, no perspective and no library, and it
 * avoids the rotating-cube look that makes these things feel like a demo.
 *
 * The ring slows to a stop whenever a tile is hovered or focused, because a
 * moving target is a hostile one. The cursor's horizontal position leans the
 * rotation one way or the other.
 *
 * Mobile does not get a squeezed ring. It gets a rail: the same tiles, the same
 * data, recomposed as a horizontal sequence that can be thumbed through.
 */

const ACCENTS: Record<string, string> = {
  red: "var(--accent)",
  green: "var(--accent)",
  ink: "var(--ink)",
};

const TAU = Math.PI * 2;

export default function ProjectRing() {
  const stage = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { blip } = useSound();
  const [rail, setRail] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // The rail is a different composition, not a smaller ring.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const apply = () => setRail(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (rail) return;
    const el = stage.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tiles = Array.from(el.querySelectorAll<HTMLElement>("[data-orbit-item]"));
    if (!tiles.length) return;

    let angle = 0;
    let speed = reduced ? 0 : 1;
    let targetSpeed = speed;
    let lean = 0;
    let targetLean = 0;
    let last = performance.now();
    let raf = 0;

    // The path is measured from the stage, not from the tiles. Percentages in
    // a transform resolve against the element's own box, which would collapse
    // the whole ring into the middle.
    let W = 0;
    let H = 0;
    const measure = () => {
      const r = el.getBoundingClientRect();
      W = r.width;
      H = r.height;
    };
    measure();
    window.addEventListener("resize", measure);

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      // Minus 1 to 1 across the stage. Leaning the cursor left or right
      // pushes the ring that way.
      targetLean = ((e.clientX - r.left) / r.width - 0.5) * 2;
    };
    const onLeave = () => {
      targetLean = 0;
    };

    // Pausing on approach is what makes the tiles clickable.
    const hold = () => {
      targetSpeed = 0;
    };
    const release = () => {
      targetSpeed = reduced ? 0 : 1;
    };
    el.addEventListener("pointerenter", hold);
    el.addEventListener("pointerleave", () => {
      release();
      onLeave();
    });
    el.addEventListener("focusin", hold);
    el.addEventListener("focusout", release);
    el.addEventListener("pointermove", onMove, { passive: true });

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      speed += (targetSpeed - speed) * 0.06;
      lean += (targetLean - lean) * 0.05;
      // Base drift, plus whichever way the cursor is leaning.
      angle += dt * (0.085 * speed + lean * 0.14 * speed);

      const n = tiles.length;
      for (let i = 0; i < n; i++) {
        const t = angle + (i / n) * TAU;
        const sin = Math.sin(t);
        const cos = Math.cos(t);
        // cos runs 1 at the front to -1 at the back. Everything reads from it.
        const depth = (cos + 1) / 2;
        const x = sin * W * 0.35;
        // The ellipse, plus a second bend folded through it. The first term is
        // what makes the path read as curved rather than as a row.
        const y = (cos * 0.17 + Math.sin(t * 2) * 0.06) * H;
        const scale = 0.62 + depth * 0.5;
        const el2 = tiles[i];
        el2.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px), 0) scale(${scale.toFixed(3)})`;
        el2.style.opacity = (0.34 + depth * 0.66).toFixed(3);
        el2.style.zIndex = String(Math.round(depth * 100));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      el.removeEventListener("pointerenter", hold);
      el.removeEventListener("focusin", hold);
      el.removeEventListener("focusout", release);
      el.removeEventListener("pointermove", onMove);
    };
  }, [rail]);

  const tile = (p: (typeof projects)[number], i: number) => (
    <Link
      key={p.slug}
      href={`/work/${p.slug}`}
      data-orbit-item={rail ? undefined : ""}
      className={rail ? "rail__item" : "orbit__item"}
      data-behaviour={p.behaviour}
      data-cursor="view"
      data-cursor-word="View"
      aria-label={`${p.name}, ${p.types.join(", ")}, ${p.year}`}
      onMouseEnter={() => setActive(p.slug)}
      onMouseLeave={() => setActive(null)}
      onFocus={() => setActive(p.slug)}
      onBlur={() => setActive(null)}
      onClick={(e) => {
        const frame = e.currentTarget.querySelector<HTMLElement>(".tile__frame");
        if (!frame || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        blip(0.8);
        openProject(frame, p.name, ACCENTS[p.accent], () => router.push(`/work/${p.slug}`));
      }}
      style={
        rail
          ? { ["--rail-w" as string]: `${[74, 58, 66, 80, 54, 70, 62, 76][i % 8]}vw`,
              ["--rail-shift" as string]: i % 2 ? "2.5rem" : "0rem" }
          : undefined
      }
    >
      <div
        className="tile__frame"
        style={{ ["--ratio" as string]: String(p.field.ratio) }}
      >
        <ProjectVisual
          variant={p.variant}
          src={p.cover?.src}
          alt={p.cover?.alt ?? p.name}
          // The first few are what the visitor sees immediately.
          priority={i < 3}
          loading={i < 3 ? undefined : "lazy"}
          sizes="(max-width: 900px) 80vw, 28vw"
        />
      </div>
      <div className="orbit__meta" data-shown={active === p.slug ? "true" : undefined}>
        <span className="tile__name">{p.name}</span>
        <span className="label">{p.year}</span>
      </div>
    </Link>
  );

  if (rail) {
    return (
      <div className="rail" role="list">
        {projects.map((p, i) => (
          <div role="listitem" key={p.slug} className="contents">
            {tile(p, i)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={stage} className="orbit">
      {projects.map(tile)}
    </div>
  );
}
