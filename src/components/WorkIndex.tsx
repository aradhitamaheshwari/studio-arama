import Link from "next/link";
import { projects } from "@/lib/projects";

/**
 * The archive, as an index rather than a wall of cards.
 *
 * Every row carries its own image, so the page is image led at rest instead of
 * only rewarding a pointer. The row being looked at holds its weight while the
 * others step back, which is the same idea as the navigation without the blur,
 * because at this size blur would read as a mistake.
 *
 * No cursor follower: the imagery is already on the page, and a second floating
 * copy of it would be decoration rather than information.
 */
export default function WorkIndex() {
  return (
    <div className="index">
      {projects.map((p, i) => {
        const cover = p.images[0];
        return (
          <Link key={p.slug} href={`/work/${p.slug}`} className="index-row">
            <span className="label index-row__num">{String(i + 1).padStart(2, "0")}</span>

            <span className="index-row__thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover.thumb}
                alt={cover.alt}
                width={cover.w}
                height={cover.h}
                loading={i < 2 ? "eager" : "lazy"}
                decoding="async"
              />
            </span>

            <span className="index-row__name">{p.name.toLowerCase()}</span>

            <span className="label index-row__meta">{p.category}</span>

            {p.year && <span className="label index-row__year">{p.year}</span>}
          </Link>
        );
      })}
      <div className="border-t border-line" />
    </div>
  );
}
