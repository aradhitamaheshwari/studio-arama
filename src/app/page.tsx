import Link from "next/link";
import Opening from "@/components/Opening";
import ProjectRing from "@/components/ProjectRing";
import { capabilities, site } from "@/lib/site";
import { projects } from "@/lib/projects";

export default function Home() {
  return (
    <>
      <Opening />

      {/* ---------------------------------------------------------------
          LANDING
          The work is the hero. No headline competes with it.
          --------------------------------------------------------------- */}
      <section className="flex min-h-[100svh] flex-col justify-center pt-24 md:pt-28">
        <div className="hero-in" style={{ ["--rise-delay" as string]: "0.1s" }}>
          <ProjectRing />
        </div>

        <div
          className="hero-in gutter mt-[var(--space-md)] flex items-end justify-between gap-6"
          style={{ ["--rise-delay" as string]: "0.3s" }}
        >
          <Link href="/work" className="nav-link label" data-cursor="link">
            Selected Work, {String(projects.length).padStart(2, "0")} Projects
          </Link>
          <span className="label hidden whitespace-nowrap sm:block">Drag, hover, or open one</span>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          STUDIO
          Philosophy, not a founder biography.
          --------------------------------------------------------------- */}
      <section id="studio" className="gutter pt-[var(--space-section)]">
        <div className="reveal flex items-baseline gap-4">
          <span className="label">Studio</span>
          <span className="rule flex-1" />
        </div>

        <div className="mt-[var(--space-block)] grid gap-[var(--space-block)] md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7" data-parallax="0.03">
            <p className="reveal lede">
              Studio Arama is a design strategy and digital innovation studio. We bring design,
              creativity, culture, aesthetics, energy, emotion and people together, because none of
              those things actually live apart.
            </p>
            <p
              className="reveal script mt-[var(--space-md)] text-[clamp(2.1rem,4.6vw,3.8rem)] text-accent"
              style={{ ["--reveal-delay" as string]: "0.1s" }}
            >
              We are drawn to ideas that still have somewhere to go.
            </p>
          </div>

          <div className="flex flex-col gap-[var(--space-md)] md:col-span-4 md:col-start-9 md:pt-2" data-parallax="-0.03">
            <p className="reveal body-copy" style={{ ["--reveal-delay" as string]: "0.15s" }}>
              We work across disciplines because the interesting work rarely sits neatly inside one
              of them. Most of what we care about happens in the space between strategy and craft,
              culture and technology, the studio and the people it gathers.
            </p>
            <p className="reveal body-copy" style={{ ["--reveal-delay" as string]: "0.25s" }}>
              The studio is built to grow into something wider. A room where artists, designers,
              filmmakers, photographers, musicians, founders and writers end up in the same
              conversation, and the conversation turns into work.
            </p>
            <p className="reveal body-copy" style={{ ["--reveal-delay" as string]: "0.35s" }}>
              Founded by {site.founder}. The studio works between New York City and New Delhi, and
              takes on clients wherever they are.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          CAPABILITIES
          Numbered, aligned, one column of services per discipline.
          --------------------------------------------------------------- */}
      <section id="capabilities" className="gutter pt-[var(--space-section)]">
        <div className="reveal flex items-baseline gap-4">
          <span className="label">Capabilities</span>
          <span className="rule flex-1" />
        </div>

        <div data-parallax="0.04">
          <h2 className="reveal display mt-[var(--space-md)]">what we do</h2>
        </div>

        <div className="mt-[var(--space-block)]">
          {capabilities.map((group, i) => (
            <div
              key={group.group}
              className="cap reveal grid gap-y-5 border-t border-line py-[var(--space-md)] md:grid-cols-12 md:gap-8"
              style={{ ["--reveal-delay" as string]: `${i * 0.06}s` }}
            >
              <span className="label md:col-span-2">{String(i + 1).padStart(2, "0")} /</span>

              <h3 className="cap__title md:col-span-5 text-[clamp(1.4rem,3vw,2.2rem)] leading-none">
                {group.group}
              </h3>

              <ul className="flex flex-col gap-2 md:col-span-4 md:col-start-9">
                {group.items.map((item) => (
                  <li key={item} className="cap__item text-[clamp(0.9rem,1.05vw,1rem)]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="border-t border-line" />
        </div>
      </section>

      {/* ---------------------------------------------------------------
          WHAT THE STUDIO IS
          Sits after the capabilities, so the breadth above it is already
          established by the time the studio describes itself.
          --------------------------------------------------------------- */}
      <section className="gutter pt-[var(--space-section)]">
        {/* Parallax writes a transform, and so does the reveal. They live on
            separate elements so neither overwrites the other. */}
        <div className="grid md:grid-cols-12" data-parallax="0.05">
          <p className="reveal lede md:col-span-9 md:col-start-3">
            Studio Arama is a creative partner for design, development and innovation. We take on a
            small number of clients at a time and build brands and digital experiences worth
            returning to. The work runs across art, fashion, ecommerce, sport and technology:
            websites, digital experiences and the systems underneath them, made for people who care
            as much about how something performs as how it looks.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          START A PROJECT
          The last confident moment before the footer.
          --------------------------------------------------------------- */}
      <section
        id="start"
        className="gutter pb-[var(--space-section)] pt-[var(--space-section)]"
      >
        <div data-parallax="0.05">
          <h2 className="reveal display max-w-[14ch]">have something interesting?</h2>
        </div>

        <div className="mt-[var(--space-block)] flex flex-col gap-[var(--space-md)] md:flex-row md:items-end md:justify-between">
          {/* Dramatically smaller than the headline, but still spoken aloud. */}
          <p
            className="reveal lede text-[clamp(1.15rem,1.8vw,1.6rem)] text-ink"
            style={{ ["--reveal-delay" as string]: "0.1s" }}
          >
            Then let&rsquo;s make it.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="reveal link text-[clamp(1.15rem,2.2vw,1.8rem)]"
            style={{ ["--reveal-delay" as string]: "0.2s" }}
            data-cursor="link"
          >
            {site.email}
          </a>
        </div>
      </section>
    </>
  );
}
