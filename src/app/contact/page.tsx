import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "contact",
  description: "Start a project with Studio Arama.",
  alternates: { canonical: "/contact" },
};

/**
 * No form. A studio this size is reachable by email, and asking someone to
 * fill in ten fields before a conversation is its own kind of statement.
 */
export default function ContactPage() {
  return (
    <article className="gutter flex min-h-[78svh] flex-col justify-center pb-[var(--space-section)] pt-36 md:pt-44">
      <span className="label">Contact</span>

      <p className="lede mt-[var(--space-md)] max-w-[20ch] text-[clamp(1.9rem,5vw,4rem)] leading-[1.1]">
        If you are working on something, tell us about it.
      </p>

      <a
        href={`mailto:${site.email}`}
        className="link mt-[var(--space-block)] inline-block self-start text-[clamp(1.2rem,3vw,2.2rem)]"
      >
        {site.email}
      </a>

      <div className="mt-[var(--space-block)] grid gap-[var(--space-md)] md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="label">Studio</div>
          <p className="body-copy mt-2">New York City and New Delhi, working globally.</p>
        </div>
        <div className="md:col-span-4">
          <div className="label">Elsewhere</div>
          <ul className="mt-2 flex flex-col gap-1">
            <li>
              <a href={site.social.instagram.url} target="_blank" rel="noreferrer" className="link body-copy">
                Instagram
              </a>
            </li>
            <li>
              <a href={site.social.linkedin.url} target="_blank" rel="noreferrer" className="link body-copy">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
}
