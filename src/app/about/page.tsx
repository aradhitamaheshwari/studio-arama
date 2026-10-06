import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "about",
  description:
    "Studio Arama is an independent design studio working across identity, digital, strategy, campaigns and creative production.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <article className="gutter pt-36 md:pt-44">
      <header className="grid md:grid-cols-12">
        <div className="md:col-span-9">
          <span className="label">About</span>
          <p className="lede mt-[var(--space-md)] max-w-[30ch] text-[clamp(1.8rem,4.4vw,3.6rem)] leading-[1.14]">
            Studio Arama is an independent design studio working across identity, digital,
            strategy, campaigns and creative production.
          </p>
        </div>
      </header>

      <section className="mt-[var(--space-section)] grid gap-[var(--space-block)] md:grid-cols-12">
        <h2 className="label md:col-span-3">Introduction</h2>
        <div className="flex flex-col gap-[var(--space-md)] md:col-span-7 md:col-start-5">
          <p className="body-copy">
            We work with founders, brands, and people building things worth paying attention to.
            Sometimes that means creating a world from nothing. Sometimes it means finding the thing
            that was already there and making it impossible to miss.
          </p>
          <p className="body-copy">
            Our work moves between business and culture, because the interesting projects rarely sit
            neatly inside one category. We care about what something says, how it works, how it
            feels, and what people remember after they leave.
          </p>
        </div>
      </section>

      <section className="mt-[var(--space-section)] grid gap-[var(--space-block)] md:grid-cols-12">
        <h2 className="label md:col-span-3">Approach</h2>
        <div className="flex flex-col gap-[var(--space-md)] md:col-span-7 md:col-start-5">
          <p className="body-copy">
            The studio is based between contexts rather than attached to one aesthetic. A technology
            company in San Francisco, a fashion label in Europe, a bar in New Delhi, and a cultural
            project in New York should not look like they came from the same template. The point is
            to find the visual and strategic language that belongs to each one.
          </p>
          <p className="lede">
            Good design should have taste. Great design should have a point of view.
          </p>
        </div>
      </section>

      <section className="mt-[var(--space-section)] grid gap-[var(--space-block)] md:grid-cols-12">
        <h2 className="label md:col-span-3">Capabilities</h2>
        <div className="md:col-span-7 md:col-start-5">
          <p className="body-copy">
            Strategy, identity, digital, campaigns, and production. Four of those usually arrive
            together, which is why the studio is built to carry a project from the first argument
            about what it should be through to the thing people actually hold.
          </p>
          <Link
            href="/capabilities"
            className="link label mt-[var(--space-md)] inline-block hover:text-ink"
          >
            Full capabilities
          </Link>
        </div>
      </section>

      <section className="mt-[var(--space-section)] grid gap-[var(--space-block)] md:grid-cols-12">
        <h2 className="label md:col-span-3">Context</h2>
        <div className="md:col-span-7 md:col-start-5">
          <p className="body-copy">
            Recent work runs across wellness, sport, hospitality, coffee and beauty, for clients who
            wanted something with a specific point of view rather than a safe one. The studio is led
            by {site.founder} and works between New York City and New Delhi, with clients wherever
            they happen to be.
          </p>
        </div>
      </section>

      <section className="mt-[var(--space-section)] grid gap-[var(--space-block)] md:grid-cols-12">
        <h2 className="label md:col-span-3">Contact</h2>
        <div className="md:col-span-7 md:col-start-5">
          <p className="lede">If you are working on something, tell us about it.</p>
          <a
            href={`mailto:${site.email}`}
            className="link mt-[var(--space-md)] inline-block text-[clamp(1.1rem,2.2vw,1.6rem)]"
          >
            {site.email}
          </a>
        </div>
      </section>
    </article>
  );
}
