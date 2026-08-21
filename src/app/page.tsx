import Link from "next/link";
import Opening from "@/components/Opening";
import ProjectField from "@/components/ProjectField";
import { capabilities, site } from "@/lib/site";
import { projects } from "@/lib/projects";

export default function Home() {
  return (
    <>
      <Opening />

      {/* ---------------------------------------------------------------
          OPENING COMPOSITION
          Where the sequence lands. Asymmetric, edge anchored, mostly air.
          --------------------------------------------------------------- */}
      <section className="gutter flex min-h-[100svh] flex-col justify-between pb-10 pt-24 md:pt-32">
        <div className="hero-in label flex justify-between" style={{ ["--rise-delay" as string]: "0.05s" }}>
          <span>Design strategy</span>
          <span>Digital innovation</span>
        </div>

        <div className="py-10">
          <h1
            className="hero-in wordmark breathe text-[clamp(3.2rem,15.5vw,16rem)]"
            style={{ ["--rise-delay" as string]: "0.15s" }}
          >
            studio arama
          </h1>
          <p
            className="hero-in display-serif mt-6 max-w-[18ch] italic md:ml-auto md:mt-10 md:text-right"
            style={{ ["--rise-delay" as string]: "0.3s" }}
          >
            We make things worth noticing.
          </p>
        </div>

        <div
          className="hero-in flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
          style={{ ["--rise-delay" as string]: "0.45s" }}
        >
          <p className="body-copy max-w-sm">
            A studio working with founders, brands and innovators on the things they want people to
            remember.
          </p>
          <span className="label whitespace-nowrap">Scroll, or wander</span>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          SELECTED WORK
          --------------------------------------------------------------- */}
      <section id="work" className="pt-24 md:pt-32">
        <div className="gutter reveal mb-14 flex items-end justify-between md:mb-24">
          <h2 className="display">selected work</h2>
          <span className="label hidden whitespace-nowrap pb-3 sm:block">
            {String(projects.length).padStart(2, "0")} projects
          </span>
        </div>
        <ProjectField />
      </section>

      {/* ---------------------------------------------------------------
          STUDIO
          Philosophy, not a founder biography. The studio is bigger than
          one person and should read that way.
          --------------------------------------------------------------- */}
      <section id="studio" className="gutter pt-28 md:pt-40">
        <div className="reveal">
          <span className="label">Studio</span>
        </div>

        <div className="mt-8 grid gap-12 md:mt-14 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <p className="reveal lede text-[clamp(1.6rem,4.2vw,3.4rem)] leading-[1.08]">
              Studio Arama is a design strategy and digital innovation studio. We bring design,
              creativity, culture, aesthetics, energy, emotion and people together, because none of
              those things actually live apart.
            </p>
            <p className="reveal display-serif mt-10 italic" style={{ ["--reveal-delay" as string]: "0.1s" }}>
              We like good ideas.
              <br />
              Especially the strange ones.
            </p>
          </div>

          <div className="flex flex-col gap-8 md:col-span-4 md:col-start-9 md:pt-3">
            <p className="reveal body-copy" style={{ ["--reveal-delay" as string]: "0.15s" }}>
              We work across disciplines because the interesting work rarely sits neatly inside one
              of them. Most of what we care about happens in the space between strategy and
              craft, culture and technology, the studio and the people it gathers.
            </p>
            <p className="reveal body-copy" style={{ ["--reveal-delay" as string]: "0.25s" }}>
              The studio is built to grow into something wider. A room where artists, designers,
              filmmakers, photographers, musicians, founders and writers end up in the same
              conversation, and the conversation turns into work.
            </p>
            <p className="reveal label" style={{ ["--reveal-delay" as string]: "0.35s" }}>
              Founded by {site.founder}, {site.founderRole}
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          CAPABILITIES
          Typography carries the breadth. No paragraph per service.
          --------------------------------------------------------------- */}
      <section id="capabilities" className="gutter pt-28 md:pt-40">
        <div className="reveal flex items-end justify-between">
          <h2 className="display">capabilities</h2>
        </div>

        <div className="mt-12 md:mt-20">
          {capabilities.map((group, i) => (
            <div
              key={group.group}
              className="cap reveal grid gap-3 border-t border-line py-6 md:grid-cols-12 md:gap-8 md:py-8"
              style={{ ["--reveal-delay" as string]: `${i * 0.07}s` }}
            >
              <div className="md:col-span-4">
                <span className="cap__title text-[clamp(1.5rem,3.4vw,2.6rem)] leading-none">
                  {group.group}
                </span>
              </div>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 md:col-span-8 md:justify-end">
                {group.items.map((item) => (
                  <li key={item} className="cap__item text-[clamp(0.95rem,1.4vw,1.15rem)]">
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
          START A PROJECT
          Simple on purpose. An email is a lower bar than a form.
          --------------------------------------------------------------- */}
      <section id="start" className="gutter pb-24 pt-28 md:pb-40 md:pt-48">
        <div className="reveal">
          <h2 className="display">
            have something
            <br />
            interesting?
          </h2>
        </div>

        <div className="mt-10 flex flex-col gap-8 md:mt-16 md:flex-row md:items-end md:justify-between">
          <p className="reveal display-serif italic" style={{ ["--reveal-delay" as string]: "0.1s" }}>
            Then let&rsquo;s make it.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="reveal link text-[clamp(1.1rem,2.6vw,2rem)]"
            style={{ ["--reveal-delay" as string]: "0.2s" }}
            data-cursor="link"
          >
            {site.email}
          </a>
        </div>

        <div className="reveal mt-16 flex flex-wrap gap-x-8 gap-y-2">
          <Link href="/#work" className="label link hover:text-ink">
            Selected Work
          </Link>
          <a href={site.social.instagram.url} target="_blank" rel="noreferrer" className="label link hover:text-ink">
            Instagram
          </a>
          <a href={site.social.linkedin.url} target="_blank" rel="noreferrer" className="label link hover:text-ink">
            LinkedIn
          </a>
        </div>
      </section>
    </>
  );
}
