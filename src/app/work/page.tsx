import type { Metadata } from "next";
import WorkIndex from "@/components/WorkIndex";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "work",
  description: "Selected work from Studio Arama.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <section className="gutter pt-36 md:pt-44">
      <header className="flex items-baseline justify-between gap-6">
        <span className="label">Selected Work</span>
        <span className="label">{String(projects.length).padStart(2, "0")}</span>
      </header>

      <div className="mt-[var(--space-block)]">
        <WorkIndex />
      </div>
    </section>
  );
}
