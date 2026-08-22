import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectVisual from "@/components/ProjectVisual";
import { getNextProject, getProject, projects, type Media } from "@/lib/projects";

/**
 * A project reads as an editorial story: images carry it, the writing stays
 * short and quiet underneath them, and the proportions keep changing so the
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
  const description = project.placeholder
    ? `${project.name}. Placeholder project, ${project.types.join(", ")}.`
    : project.overview.slice(0, 155);
  return {
    title: project.name.toLowerCase(),
    description,
    openGraph: { title: `${project.name}, studio arama`, description },
    alternates: { canonical: `/work/${project.slug}` },
    // Sample entries stay out of the index until they hold real work.
    robots: project.placeholder ? { index: false, follow: true } : undefined,
  };
}

function MediaFrame({ media, variant, priority }: { media: Media; variant: number; priority?: boolean }) {
  return (
    <figure>
      <div className={`media media--${media.kind}`}>
        <ProjectVisual
          variant={variant}
          src={media.src}
          alt={media.alt}
          priority={priority}
          sizes={media.kind === "full" ? "100vw" : "(min-width: 768px) 70vw, 92vw"}
        />
      </div>
      {media.caption && <figcaption className="label mt-3">{media.caption}</figcaption>}
    </figure>
  );
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const next = getNextProject(project.slug);
  const [opening, ...rest] = project.media;

  // Consecutive pairs share a row. Everything else stands alone, and its
  // alignment alternates so the page never settles into a column.
  const blocks: { kind: "single" | "pair"; items: Media[] }[] = [];
  for (let i = 0; i < rest.length; i++) {
    const m = rest[i];
    if (m.kind === "pair" && rest[i + 1]?.kind === "pair") {
      blocks.push({ kind: "pair", items: [m, rest[i + 1]] });
      i++;
    } else {
      blocks.push({ kind: "single", items: [m] });
    }
  }

  return (
    <article>
      {/* Opening image, full bleed. */}
      <div className="rise media media--full h-[62svh] w-full md:h-[82svh]">
        <ProjectVisual
          variant={project.variant}
          src={opening?.src}
          alt={opening?.alt ?? project.name}
          priority
          sizes="100vw"
        />
      </div>

      {/* Title and metadata. */}
      <header className="gutter pt-10 md:pt-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="rise display" style={{ ["--rise-delay" as string]: "0.1s" }}>
            {project.name.toLowerCase()}
          </h1>
          {project.placeholder && (
            <span className="label border border-line px-2 py-1">Placeholder project</span>
          )}
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-6 md:mt-14 md:grid-cols-4">
          {[
            ["Client", project.client],
            ["Year", project.year],
            ["Timeline", project.timeline],
            ["Capabilities", project.types.join(", ")],
          ].map(([term, value]) => (
            <div key={term}>
              <dt className="label">{term}</dt>
              <dd className="mt-1.5 text-[0.95rem] leading-snug">{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* Overview. Short, and given room. */}
      <section className="gutter grid pt-14 md:grid-cols-12 md:pt-24">
        <p className="reveal lede md:col-span-7 md:col-start-4">{project.overview}</p>
      </section>

      {/* The rhythm. */}
      <div className="flex flex-col gap-16 pt-16 md:gap-28 md:pt-28">
        {blocks.map((block, i) => {
          if (block.kind === "pair") {
            return (
              <div key={i} className="gutter reveal grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-8">
                {block.items.map((m, j) => (
                  <MediaFrame key={j} media={m} variant={project.variant + i + j + 1} />
                ))}
              </div>
            );
          }
          const m = block.items[0];
          // Full bleed breaks the gutter. Everything else sits inside it and
          // alternates which edge it hangs from.
          const align = i % 2 === 0 ? "md:mr-auto" : "md:ml-auto";
          return (
            <div key={i} className={m.kind === "full" ? "reveal" : "gutter reveal"}>
              <div className={m.kind === "full" ? "" : `flex ${align}`}>
                <MediaFrame media={m} variant={project.variant + i + 1} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Closing thought. */}
      {project.closing && (
        <section className="gutter pt-20 md:pt-32">
          <p className="reveal script max-w-[26ch] text-[clamp(1.5rem,3vw,2.4rem)] text-accent">
            {project.closing}
          </p>
        </section>
      )}

      {/* Next project. The work keeps going. */}
      <section className="gutter pb-8 pt-24 md:pt-40">
        <hr className="rule" />
        <Link
          href={`/work/${next.slug}`}
          className="group flex items-end justify-between gap-6 pt-8"
          data-cursor="view"
          data-cursor-word="Next"
        >
          <div>
            <span className="label">Next project</span>
            <span className="display mt-3 block">{next.name.toLowerCase()}</span>
          </div>
          <span className="label hidden whitespace-nowrap pb-4 sm:block">{next.year}</span>
        </Link>
      </section>

      <div className="gutter pb-4">
        <Link href="/#work" className="label link hover:text-ink">
          All work
        </Link>
      </div>
    </article>
  );
}
