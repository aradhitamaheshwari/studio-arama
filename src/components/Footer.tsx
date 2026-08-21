import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="px-6 py-10 text-sm text-neutral-500">
      © {new Date().getFullYear()} {site.name}
    </footer>
  );
}
