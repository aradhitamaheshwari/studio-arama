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
      // host resolves /work/project-one without a rewrite rule.
      trailingSlash: true,
    }
  : {};

export default nextConfig;
