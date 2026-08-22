import Link from "next/link";

export default function NotFound() {
  return (
    <section className="gutter flex min-h-[70svh] flex-col justify-center py-32">
      <span className="label">404</span>
      <h1 className="display mt-[var(--space-sm)]">nothing here</h1>
      <p className="script mt-[var(--space-md)] max-w-[20ch] text-[clamp(1.4rem,2.6vw,2rem)] text-accent">
        This one does not exist yet.
      </p>
      <div className="mt-[var(--space-block)] flex gap-8">
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
