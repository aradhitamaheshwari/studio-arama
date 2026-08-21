import type { Metadata } from "next";
import ProjectField from "@/components/ProjectField";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "selected work",
  description: "Selected work from studio arama.",
  alternates: { canonical: "/work" },
};

/**
 * The same field the homepage holds, given its own page and its own address.
 */
export default function WorkPage() {
  return (
    <section className="pt-28 md:pt-36">
      <div className="gutter mb-14 flex items-end justify-between md:mb-24">
        <h1 className="display">selected work</h1>
        <span className="label hidden whitespace-nowrap pb-3 sm:block">
          {String(projects.length).padStart(2, "0")} projects
        </span>
      </div>
      <ProjectField />
    </section>
  );
}
