import Link from "next/link";

export default function NotFound() {
  return (
    <section className="gutter flex min-h-[70svh] flex-col justify-center py-32">
      <span className="label">404</span>
      <h1 className="display mt-4">nothing here</h1>
      <p className="display-serif mt-6 max-w-[20ch] italic">
        This one does not exist yet.
      </p>
      <div className="mt-12 flex gap-8">
        <Link href="/" className="label link hover:text-ink">
          Back to the studio
        </Link>
        <Link href="/#work" className="label link hover:text-ink">
          Selected work
        </Link>
      </div>
    </section>
  );
}
