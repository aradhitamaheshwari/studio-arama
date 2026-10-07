import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBanner, getNextProject, getProject, projects } from "@/lib/projects";

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
  // The banner is chosen for its proportions, so it is not necessarily the
  // cover. Whichever it is, it does not appear twice on the page.
  const opening = getBanner(project);
  const rest = project.images.filter((i) => i.src !== opening.src);

  return (
    <article>
      {/*
        The opening image keeps its own proportions rather than being cut to a
        band. It is capped at the viewport height so a tall picture cannot push
        everything else off the screen, and centred when that cap leaves room.
      */}
      <div className="gutter pt-28 md:pt-32">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={opening.src}
          alt={opening.alt}
          width={opening.w}
          height={opening.h}
          className="mx-auto h-auto max-h-[80svh] w-auto max-w-[72rem]"
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

      {/*
        One centred column, one gap.

        The images used to alternate which edge they hung from, at three
        different widths, which left the page reading ragged and weighted to the
        left. They now share a centre line and a single rhythm, and the pace
        comes from the pictures themselves: a landscape takes the full measure,
        a portrait takes a narrower one, and neither is recropped to get there.
      */}
      <div className="flex flex-col gap-[var(--space-block)] pt-[var(--space-section)]">
        {rest.map((image) => {
          const wide = image.aspect > 1.2;
          return (
            <figure key={image.src} className="gutter reveal">
              <div className={`mx-auto w-full ${wide ? "max-w-[72rem]" : "max-w-[40rem]"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt}
                  width={image.w}
                  height={image.h}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full"
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
