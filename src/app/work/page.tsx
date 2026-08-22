import type { Metadata } from "next";
import ProjectField from "@/components/ProjectField";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "selected work",
  description: "Selected work from studio arama.",
  alternates: { canonical: "/work" },
};

/**
 * The archive. The landing ring and this page read from the same project data
 * and point at the same routes, so a project is only ever described once.
 */
export default function WorkPage() {
  return (
    <section className="pt-32 md:pt-40">
      <div className="gutter">
        <div className="reveal flex items-baseline gap-4">
          <span className="label">Selected Work</span>
          <span className="rule flex-1" />
          <span className="label whitespace-nowrap">
            {String(projects.length).padStart(2, "0")} Projects
          </span>
        </div>

        <h1 className="reveal display mt-[var(--space-md)]">selected work</h1>

        <p
          className="reveal body-copy mt-[var(--space-md)] max-w-[46ch]"
          style={{ ["--reveal-delay" as string]: "0.1s" }}
        >
          A working archive. Every project here opens into its own story.
        </p>
      </div>

      <div className="mt-[var(--space-section)]">
        <ProjectField />
      </div>
    </section>
  );
}
