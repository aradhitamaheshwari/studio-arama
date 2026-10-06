import type { NextConfig } from "next";

/**
 * GitHub Pages serves the site from /studio-arama, as a folder of static files
 * with no Node server behind it. That needs a different build to the default
 * one, so it is switched on by an environment variable the Pages workflow sets
 * and nothing else does.
 *
 * Keeping it conditional means `npm run dev` and a plain `npm run build` are
 * completely unchanged, so moving to Vercel later needs no edits here: Vercel
 * simply builds without GITHUB_PAGES and gets the normal server-rendered app,
 * image optimisation included.
 */
const isPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = isPages
  ? {
      output: "export",
      basePath: "/studio-arama",
      // Pages has no image optimiser, so next/image serves the files as they
      // are. Only relevant once real photography replaces the drawn artwork.
      images: { unoptimized: true },
      // Every route becomes a folder with an index.html, which is how a static
      // host resolves /work/siren without a rewrite rule.
      trailingSlash: true,
      /**
       * Next rewrites basePath into next/link and next/image on its own, but
       * not into a plain <img src>. The project imagery is served through
       * ordinary img tags, because there is no optimiser behind a static
       * export, so the prefix has to reach them some other way. Exposing it
       * here lets the project data build correct paths in one place.
       */
      env: { NEXT_PUBLIC_BASE_PATH: "/studio-arama" },
    }
  : {};

export default nextConfig;
