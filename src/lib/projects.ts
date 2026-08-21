/**
 * PROJECT DATA
 *
 * Everything about the work lives here. Project pages, the homepage field and
 * all metadata are generated from this array, so adding real work means adding
 * an object, never building a new page.
 *
 * The entries below are PLACEHOLDERS. They carry `placeholder: true`, neutral
 * names and no client names, because nothing here is real studio work yet.
 *
 * TO ADD A REAL PROJECT
 *   1. Drop images in /public/images/<slug>/
 *   2. Set `cover.src` and give each `media` entry a `src`
 *   3. Write the real `overview` (seven or eight lines)
 *   4. Remove `placeholder: true`
 * Any entry without a `src` renders generated artwork in its place, so the
 * layout is designed and testable before the photography exists.
 */

/** How a piece of media sits on the page. Drives the editorial rhythm. */
export type MediaKind =
  | "full" // edge to edge, full bleed
  | "wide" // large, inset
  | "portrait" // tall, offset
  | "square"
  | "narrow" // small, lots of air around it
  | "pair"; // two side by side

export type Media = {
  kind: MediaKind;
  /** Omit while the real asset does not exist yet. */
  src?: string;
  alt: string;
  caption?: string;
};

export type Project = {
  slug: string;
  name: string;
  /** Real client name once the work is real. "Sample" while placeholder. */
  client: string;
  year: string;
  /** Capabilities used. Doubles as project page metadata. */
  types: string[];
  timeline: string;
  /** Seven to eight lines of editorial prose. */
  overview: string;
  /** A closing line for the project page. */
  closing?: string;
  cover?: { src: string; alt: string };
  media: Media[];
  /** Accent used for this project's transition and page details. */
  accent: "red" | "green" | "ink";
  /** Which generated artwork to draw while there is no photography. 0 to 5. */
  variant: number;
  /** How the tile behaves on hover. Curated per project, never uniform. */
  behaviour: "zoom" | "swap" | "expand" | "slide";
  /** Desktop field composition. x/y are % of the field, w is vw. */
  field: { x: number; y: number; w: number; depth: number; ratio: number };
  placeholder?: boolean;
};

const PLACEHOLDER_OVERVIEW =
  "Placeholder overview. This is the slot where the story of the project goes, written as seven or eight lines of plain editorial prose. Enough room to say what the work was, who it was for, and what it had to do. Short sentences carry more weight here than long ones. Specific detail beats description. The images do most of the talking on this page, so the writing can stay quiet and precise underneath them. Replace this text in src/lib/projects.ts when the real work is ready to show.";

const placeholderMedia = (name: string): Media[] => [
  { kind: "full", alt: `${name}, opening image` },
  { kind: "pair", alt: `${name}, detail` },
  { kind: "pair", alt: `${name}, detail` },
  { kind: "portrait", alt: `${name}, portrait format image` },
  { kind: "wide", alt: `${name}, wide format image`, caption: "Caption sits here, small and quiet." },
  { kind: "narrow", alt: `${name}, small detail` },
  { kind: "full", alt: `${name}, closing image` },
];

export const projects: Project[] = [
  {
    slug: "project-one",
    name: "Project One",
    client: "Sample",
    year: "2026",
    types: ["Brand identity", "Art direction", "Web design"],
    timeline: "Twelve weeks",
    overview: PLACEHOLDER_OVERVIEW,
    closing: "A closing thought goes here. One line. Then the next project.",
    media: placeholderMedia("Project One"),
    accent: "red",
    variant: 0,
    behaviour: "zoom",
    field: { x: 5, y: 0, w: 30, depth: 0.55, ratio: 0.78 },
    placeholder: true,
  },
  {
    slug: "project-two",
    name: "Project Two",
    client: "Sample",
    year: "2026",
    types: ["Digital experience", "Development"],
    timeline: "Eight weeks",
    overview: PLACEHOLDER_OVERVIEW,
    closing: "A closing thought goes here. One line. Then the next project.",
    media: placeholderMedia("Project Two"),
    accent: "ink",
    variant: 1,
    behaviour: "swap",
    field: { x: 42, y: 6, w: 15, depth: 1.2, ratio: 1 },
    placeholder: true,
  },
  {
    slug: "project-three",
    name: "Project Three",
    client: "Sample",
    year: "2025",
    types: ["Campaign", "Film", "Creative direction"],
    timeline: "Six weeks",
    overview: PLACEHOLDER_OVERVIEW,
    closing: "A closing thought goes here. One line. Then the next project.",
    media: placeholderMedia("Project Three"),
    accent: "green",
    variant: 2,
    behaviour: "expand",
    field: { x: 70, y: 2, w: 26, depth: 0.7, ratio: 1.4 },
    placeholder: true,
  },
  {
    slug: "project-four",
    name: "Project Four",
    client: "Sample",
    year: "2025",
    types: ["Brand strategy", "Visual systems"],
    timeline: "Sixteen weeks",
    overview: PLACEHOLDER_OVERVIEW,
    closing: "A closing thought goes here. One line. Then the next project.",
    media: placeholderMedia("Project Four"),
    accent: "red",
    variant: 3,
    behaviour: "slide",
    field: { x: 78, y: 26, w: 30, depth: 0.5, ratio: 0.85 },
    placeholder: true,
  },
  {
    slug: "project-five",
    name: "Project Five",
    client: "Sample",
    year: "2025",
    types: ["UX", "UI", "Development"],
    timeline: "Ten weeks",
    overview: PLACEHOLDER_OVERVIEW,
    closing: "A closing thought goes here. One line. Then the next project.",
    media: placeholderMedia("Project Five"),
    accent: "ink",
    variant: 4,
    behaviour: "zoom",
    field: { x: 8, y: 34, w: 22, depth: 1, ratio: 1.5 },
    placeholder: true,
  },
  {
    slug: "project-six",
    name: "Project Six",
    client: "Sample",
    year: "2024",
    types: ["Editorial", "Photography"],
    timeline: "Four weeks",
    overview: PLACEHOLDER_OVERVIEW,
    closing: "A closing thought goes here. One line. Then the next project.",
    media: placeholderMedia("Project Six"),
    accent: "green",
    variant: 5,
    behaviour: "swap",
    field: { x: 33, y: 47, w: 13, depth: 0.9, ratio: 0.75 },
    placeholder: true,
  },
  {
    slug: "project-seven",
    name: "Project Seven",
    client: "Sample",
    year: "2024",
    types: ["Digital strategy", "Go to market"],
    timeline: "Nine weeks",
    overview: PLACEHOLDER_OVERVIEW,
    closing: "A closing thought goes here. One line. Then the next project.",
    media: placeholderMedia("Project Seven"),
    accent: "red",
    variant: 1,
    behaviour: "expand",
    field: { x: 55, y: 60, w: 31, depth: 0.75, ratio: 1.6 },
    placeholder: true,
  },
  {
    slug: "project-eight",
    name: "Project Eight",
    client: "Sample",
    year: "2024",
    types: ["Creative technology", "Digital experience"],
    timeline: "Seven weeks",
    overview: PLACEHOLDER_OVERVIEW,
    closing: "A closing thought goes here. One line. Then the next project.",
    media: placeholderMedia("Project Eight"),
    accent: "ink",
    variant: 3,
    behaviour: "slide",
    field: { x: 6, y: 76, w: 25, depth: 0.6, ratio: 0.9 },
    placeholder: true,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/** Wraps around, so the end of the work loops back into the beginning. */
export const getNextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return projects[0];
  return projects[(i + 1) % projects.length];
};
