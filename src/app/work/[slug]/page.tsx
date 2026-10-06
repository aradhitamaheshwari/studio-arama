import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNextProject, getProject, projects } from "@/lib/projects";

/**
 * A project reads as an editorial story. The images carry it, the writing sits
 * underneath them and stays short, and the proportions keep changing so the
 * page has rhythm instead of a stack of identical rectangles.
 */

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name.toLowerCase(),
    description: project.summary,
    openGraph: {
      title: `${project.name}, studio arama`,
      description: project.summary,
      images: [{ url: project.images[0].src }],
    },
    alternates: { canonical: `/work/${project.slug}` },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const next = getNextProject(project.slug);
  const [opening, ...rest] = project.images;

  return (
    <article>
      {/* Opening image, full bleed. */}
      <div className="relative h-[72svh] w-full overflow-hidden bg-bg-sunk md:h-[86svh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={opening.src}
          alt={opening.alt}
          width={opening.w}
          height={opening.h}
          className="h-full w-full object-cover"
          style={{ objectPosition: opening.position ?? "center" }}
          fetchPriority="high"
        />
      </div>

      <header className="gutter pt-[var(--space-block)]">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h1 className="display">{project.name.toLowerCase()}</h1>
          {project.year && <span className="label">{project.year}</span>}
        </div>
        <p className="lede mt-[var(--space-md)] max-w-[34ch]">{project.summary}</p>

        <dl className="mt-[var(--space-block)] grid grid-cols-2 gap-6 border-t border-line pt-[var(--space-sm)] md:grid-cols-4">
          <div>
            <dt className="label">Disciplines</dt>
            <dd className="label mt-2 text-ink">{project.disciplines.join(", ")}</dd>
          </div>
          <div>
            <dt className="label">Category</dt>
            <dd className="label mt-2 text-ink">{project.category}</dd>
          </div>
        </dl>
      </header>

      {/* Overview. Short, and given room. */}
      <section className="gutter grid pt-[var(--space-section)] md:grid-cols-12">
        <div className="flex flex-col gap-[var(--space-md)] md:col-span-7 md:col-start-4">
          {project.overview.map((para, i) => (
            <p key={i} className="body-copy">
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* The rhythm. Proportions alternate so nothing settles into a column. */}
      <div className="flex flex-col gap-[var(--space-block)] pt-[var(--space-section)]">
        {rest.map((image, i) => {
          // Every third image runs full bleed. The rest sit inside the gutter
          // and alternate which edge they hang from.
          const full = i % 3 === 2;
          const right = i % 2 === 1;
          return (
            <figure key={image.src} className={full ? "reveal" : "gutter reveal"}>
              <div
                className={
                  full
                    ? "relative aspect-[16/9] w-full overflow-hidden bg-bg-sunk"
                    : `relative w-full overflow-hidden bg-bg-sunk md:w-[62%] ${right ? "md:ml-auto" : ""}`
                }
                style={full ? undefined : { aspectRatio: `${image.w} / ${image.h}` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt}
                  width={image.w}
                  height={image.h}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: image.position ?? "center" }}
                />
              </div>
            </figure>
          );
        })}
      </div>

      <section className="gutter pt-[var(--space-section)]">
        <hr className="rule" />
        <Link href={`/work/${next.slug}`} className="flex items-baseline justify-between gap-6 pt-[var(--space-md)]">
          <span className="label">Next</span>
          <span className="display">{next.name.toLowerCase()}</span>
        </Link>
      </section>

      <div className="gutter pt-[var(--space-md)]">
        <Link href="/work" className="label link hover:text-ink">
          All work
        </Link>
      </div>
    </article>
  );
}
