import Image from "next/image";

/**
 * Stands in for photography that does not exist yet.
 *
 * These are drawn, not grey boxes, so composition, crop rhythm and both colour
 * modes can be judged honestly before a single asset arrives. They read from
 * the same CSS variables as everything else, so they change with day and night.
 *
 * The moment a `src` is supplied, this renders the real optimised image and the
 * generated artwork is never drawn again.
 */

type Props = {
  variant: number;
  src?: string;
  alt: string;
  className?: string;
  /** Set on the first meaningful image of a page. */
  priority?: boolean;
  sizes?: string;
};

const VARIANTS = 6;

export default function ProjectVisual({ variant, src, alt, className, priority, sizes = "100vw" }: Props) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover ${className ?? ""}`}
      />
    );
  }

  const v = ((variant % VARIANTS) + VARIANTS) % VARIANTS;

  return (
    <svg
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      className={`h-full w-full ${className ?? ""}`}
      role="img"
      aria-label={`${alt}. Placeholder artwork.`}
    >
      <rect width="400" height="400" fill="var(--bg-sunk)" />
      <g fill="var(--ink)" stroke="var(--ink)">
        {v === 0 && (
          <>
            {/* A single letterform, cropped past the edges. */}
            <text
              x="200"
              y="330"
              textAnchor="middle"
              fontSize="440"
              fontFamily="var(--font-serif), serif"
              fill="var(--ink)"
              opacity="0.9"
            >
              a
            </text>
            <rect x="0" y="300" width="400" height="14" fill="var(--accent)" stroke="none" />
          </>
        )}

        {v === 1 && (
          <>
            {/* Rhythm of bars, one of them breaking the pattern. */}
            {Array.from({ length: 9 }, (_, i) => (
              <rect
                key={i}
                x={20 + i * 42}
                y={i === 5 ? 40 : 90}
                width="20"
                height={i === 5 ? 320 : 220}
                fill={i === 5 ? "var(--accent)" : "var(--ink)"}
                stroke="none"
                opacity={i === 5 ? 1 : 0.86}
              />
            ))}
          </>
        )}

        {v === 2 && (
          <>
            {/* Concentric arcs, off centre. */}
            {[60, 110, 160, 210].map((r, i) => (
              <circle
                key={r}
                cx="150"
                cy="230"
                r={r}
                fill="none"
                stroke={i === 1 ? "var(--accent)" : "var(--ink)"}
                strokeWidth={i === 1 ? 10 : 2}
                opacity="0.9"
              />
            ))}
            <rect x="270" y="0" width="2" height="400" fill="var(--ink)" stroke="none" opacity="0.5" />
          </>
        )}

        {v === 3 && (
          <>
            {/* A field of points with one loud interruption. */}
            {Array.from({ length: 64 }, (_, i) => {
              const col = i % 8;
              const row = Math.floor(i / 8);
              const hot = i === 27;
              return (
                <circle
                  key={i}
                  cx={40 + col * 46}
                  cy={40 + row * 46}
                  r={hot ? 26 : 6}
                  fill={hot ? "var(--accent)" : "var(--ink)"}
                  stroke="none"
                  opacity={hot ? 1 : 0.7}
                />
              );
            })}
          </>
        )}

        {v === 4 && (
          <>
            {/* Split field. Half solid, half open, one disc across the seam. */}
            <rect x="0" y="0" width="400" height="196" fill="var(--ink)" stroke="none" opacity="0.92" />
            <circle cx="240" cy="196" r="96" fill="var(--accent)" stroke="none" />
            <rect x="0" y="330" width="240" height="3" fill="var(--ink)" stroke="none" />
          </>
        )}

        {v === 5 && (
          <>
            {/* Stacked rules tightening toward the base. */}
            {Array.from({ length: 14 }, (_, i) => (
              <rect
                key={i}
                x="30"
                y={40 + i * i * 1.7}
                width={340 - i * 6}
                height={i === 9 ? 12 : 3}
                fill={i === 9 ? "var(--accent)" : "var(--ink)"}
                stroke="none"
                opacity={i === 9 ? 1 : 0.8}
              />
            ))}
          </>
        )}
      </g>
    </svg>
  );
}
