import { site } from "@/lib/site";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-5xl flex-1 flex-col justify-center px-6 py-24">
      <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
        {site.name}
      </h1>
      <p className="mt-6 max-w-xl text-lg text-neutral-500">{site.tagline}</p>
    </main>
  );
}
