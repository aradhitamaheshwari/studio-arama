import Link from "next/link";
import { site } from "@/lib/site";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-5">
      <Link href="/" className="font-semibold tracking-tight">
        {site.name}
      </Link>
      <nav className="flex gap-6 text-sm text-neutral-500">
        {site.nav.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-neutral-900 dark:hover:text-neutral-100">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
