import { site } from "@/lib/site";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-4 text-neutral-500">
        Start a project:{" "}
        <a className="underline" href={`mailto:${site.email}`}>
          {site.email}
        </a>
      </p>
    </main>
  );
}
