import type { Metadata } from "next";
import Link from "next/link";
import { capabilities, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "capabilities",
  description:
    "Strategy, identity, digital, campaigns and production. What Studio Arama does, and how the four fit together.",
  alternates: { canonical: "/capabilities" },
};

/**
 * A numbered index rather than a grid of service cards. The numbering carries
 * the structure, the serif carries the group, and the mono lists what is
 * actually in it.
 */
export default function CapabilitiesPage() {
  return (
    <article className="gutter pt-36 md:pt-44">
      <header className="grid md:grid-cols-12">
        <div className="md:col-span-9">
          <span className="label">Capabilities</span>
          <p className="lede mt-[var(--space-md)] max-w-[22ch] text-[clamp(1.8rem,4.4vw,3.6rem)] leading-[1.14]">
            We work from the idea outward.
          </p>
        </div>
        <div className="mt-[var(--space-md)] flex flex-col gap-[var(--space-sm)] md:col-span-5 md:col-start-8 md:mt-0 md:pt-3">
          <p className="body-copy">
            Strategy gives the work somewhere to go. Identity gives it a language. Digital gives
            people somewhere to experience it. Campaigns put it into the world.
          </p>
          <p className="body-copy body-quiet">
            Studio Arama works across all four, which means the thinking does not disappear when
            execution begins.
          </p>
        </div>
      </header>

      <section className="mt-[var(--space-section)]">
        {capabilities.map((group, i) => (
          <div
            key={group.group}
            className="grid gap-[var(--space-sm)] border-t border-line py-[var(--space-md)] md:grid-cols-12 md:gap-[var(--space-block)]"
          >
            <div className="label whitespace-nowrap md:col-span-2">
              {String(i + 1).padStart(2, "0")} /
            </div>

            <h2 className="heading md:col-span-4 md:col-start-3">{group.group}</h2>

            <ul className="flex flex-col gap-1.5 md:col-span-6 md:col-start-7">
              {group.items.map((item) => (
                <li key={item} className="label text-ink">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="border-t border-line" />
      </section>

      <section className="mt-[var(--space-section)] grid gap-[var(--space-md)] md:grid-cols-12">
        <div className="md:col-span-7 md:col-start-5">
          <p className="lede">Not every project needs all of it. Most need more than one.</p>
          <div className="mt-[var(--space-md)] flex flex-wrap gap-x-8 gap-y-2">
            <Link href="/work" className="label link hover:text-ink">
              Selected work
            </Link>
            <a href={`mailto:${site.email}`} className="label link hover:text-ink">
              {site.email}
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}
