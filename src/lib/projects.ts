/**
 * PROJECT DATA
 *
 * The single source of truth for the work. The landing composition, the work
 * index and the project pages all read from here, so a project is described
 * once and appears everywhere.
 *
 * IMAGES
 * `src` is the full resolution file, used on project pages. `thumb` is the
 * smaller variant the landing composition uses, so all five project worlds can
 * be held in memory at once and hover swaps are instant with nothing to fetch.
 *
 * TO ADD A PROJECT
 *   1. Put images in /public/images/<slug>/ and /public/images/<slug>/thumb/
 *   2. Add an entry below with at least five images
 * Nothing else needs touching. The composition assigns slots automatically.
 *
 * TO FILL IN
 *   `year` is empty on every project because inventing dates for real client
 *   work would be making things up. Set it and it appears in the index and on
 *   the project page. Left empty, it is quietly omitted.
 */

export type ProjectImage = {
  src: string;
  thumb: string;
  alt: string;
  /** CSS object-position. Set it where the subject is not centred. */
  position?: string;
  /** Intrinsic size, so nothing shifts while loading. */
  w: number;
  h: number;
};

export type Project = {
  slug: string;
  name: string;
  /** What the work was. Describes the discipline, never a claimed outcome. */
  category: string;
  /** Optional. Empty until the real dates are filled in. */
  year: string;
  /** One line, used in the index and under the project title. */
  summary: string;
  /** Two or three short paragraphs. */
  overview: string[];
  /** Disciplines, listed on the project page. */
  disciplines: string[];
  images: ProjectImage[];
};

/**
 * Asset paths must carry the deployment's base path. next/link and next/image
 * get it applied for them; a plain img tag does not, and these are plain img
 * tags because a static export has no image optimiser behind it. Applying it
 * here means every consumer gets a correct URL without thinking about it.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const img = (
  slug: string,
  file: string,
  alt: string,
  w: number,
  h: number,
  position?: string,
): ProjectImage => ({
  src: `${BASE}/images/${slug}/${file}`,
  thumb: `${BASE}/images/${slug}/thumb/${file}`,
  alt,
  position,
  w,
  h,
});

export const projects: Project[] = [
  {
    slug: "siren",
    name: "Siren",
    category: "Identity, Spatial, Art Direction",
    year: "",
    summary: "A wellness space built around quiet, weight and green stone.",
    overview: [
      "Siren is a movement and wellness space. The identity sits low and still, built on a high contrast serif that holds its nerve at small sizes and reads as architecture at large ones.",
      "The palette comes out of the rooms themselves. Deep green, wet stone, timber, and very little else. Light does most of the decorating, so the graphic layer stays out of the way.",
      "The system was drawn to work on a wall before it works on a screen, which is usually the right order for a space people walk into.",
    ],
    disciplines: ["Brand Identity", "Art Direction", "Spatial Graphics", "Typography"],
    images: [
      img("siren", "01.jpg", "Siren campaign image, a figure lit in warm orange", 1125, 1500),
      img("siren", "02.jpg", "Siren interior in low red light", 1500, 1125),
      img("siren", "03.jpg", "Siren interior, deep red", 1200, 1500),
      img("siren", "04.jpg", "Siren studio interior with the wordmark set into the wall", 1300, 1500, "center top"),
      img("siren", "05.jpg", "The Siren wordmark cut into stone", 1500, 1141),
    ],
  },
  {
    slug: "alt-five",
    name: "Alt Five",
    category: "Identity, Campaign, Art Direction",
    year: "",
    summary: "Performance nutrition with the volume turned up.",
    overview: [
      "Alt Five is a performance nutrition range built for people who run in groups, at night, in cities. The identity had to work on a sachet held at arm's length and on a road at speed, which are very different distances.",
      "The photography leans into motion rather than trying to freeze it, so it stays blurred and the graphic layer does the holding. A single acid green runs through all of it and acts as a marker: on the road, on the bottle, on the type.",
      "The packaging keeps its information tight and legible while the campaign stays loud, because one is read in a hand and the other is read in public.",
    ],
    disciplines: ["Brand Identity", "Campaign", "Art Direction", "Photography Direction"],
    images: [
      img("alt-five", "01.jpg", "The Alt Five wordmark above the product range", 1500, 1125),
      img("alt-five", "02.jpg", "Runners in motion with the Alt Five graphic marking the road", 1202, 1500),
      img("alt-five", "03.jpg", "An Alt Five drink, amber liquid behind the wordmark", 1200, 1500),
      img("alt-five", "04.jpg", "The Alt Five wordmark over a running figure", 1218, 1500),
      img("alt-five", "05.jpg", "Alt Five sachets, front and back", 1178, 1500),
    ],
  },
  {
    slug: "bar-57",
    name: "Bar 57",
    category: "Identity, Packaging, Art Direction",
    year: "",
    summary: "A bar identity that behaves like something you pocket on the way out.",
    overview: [
      "Bar 57 is a late room, so the identity was drawn for low light. Oxblood on bone, brushed steel, and a wordmark with enough wobble in it to feel hand cut rather than specified.",
      "Most of the work lives on small objects. Matches, coasters, menus, the things that leave with people and turn up in a coat pocket weeks later.",
      "It is a hospitality identity that assumes the room is already good and the graphics only need to keep up.",
    ],
    disciplines: ["Brand Identity", "Packaging", "Art Direction", "Print"],
    images: [
      img("bar-57", "01.jpg", "Bar 57 matchbox on brushed steel", 1250, 1500),
      img("bar-57", "02.jpg", "A Bar 57 menu card beside a cocktail", 1200, 1500),
      img("bar-57", "03.jpg", "A Bar 57 cocktail resting on a turntable", 1124, 1500),
      img("bar-57", "04.jpg", "A Bar 57 table setting", 1200, 1500),
      img("bar-57", "05.jpg", "The Bar 57 sign in warm light", 1200, 1500),
      img("bar-57", "06.jpg", "The Bar 57 wordmark in low light", 1199, 1500),
    ],
  },
  {
    slug: "brew-bazaar",
    name: "Brew Bazaar",
    category: "Identity, Packaging, Illustration",
    year: "",
    summary: "Indian coffee, packed like something you would keep the box of.",
    overview: [
      "Brew Bazaar is an Indian coffee marketplace. The packaging borrows from the visual culture it comes out of: matchbox labels, tea chest stencils, stamp lithography, the tiger and the elephant doing what they have always done on Indian packaging.",
      "Every box is a full illustration rather than a logo on a colour. The range is held together by structure and type, which leaves the colour free to change shelf by shelf.",
      "It is maximal on purpose. Restraint would have been the wrong instinct for a product sold in a market.",
    ],
    disciplines: ["Brand Identity", "Packaging", "Illustration", "Art Direction"],
    images: [
      img("brew-bazaar", "01.jpg", "Brew Bazaar packaging in red and yellow", 1500, 965),
      img("brew-bazaar", "02.jpg", "Brew Bazaar coffee boxes among hibiscus", 1200, 1500),
      img("brew-bazaar", "03.jpg", "Brew Bazaar coffee box, portrait", 1200, 1500),
      img("brew-bazaar", "04.jpg", "Brew Bazaar burlap sack, product of India", 1323, 1500),
      img("brew-bazaar", "05.jpg", "Indian chai shop, Brew Bazaar in context", 1200, 1500),
      img("brew-bazaar", "06.jpg", "Brew Bazaar vintage stamp illustrations", 1000, 1500),
    ],
  },
  {
    slug: "akhai-beauty",
    name: "Akhai",
    category: "Identity, Packaging, Art Direction",
    year: "",
    summary: "Heritage beauty, gold tubes, and a lip treatment named for a rose.",
    overview: [
      "Akhai is a beauty line drawn from Indian heritage ingredients. Gulaab, the rose, carries the first product, and the naming across the range stays in that language rather than translating itself for export.",
      "The packaging is gold, soft and warm rather than metallic and cold, with a script wordmark that keeps the whole thing personal at a shelf distance.",
      "The art direction was kept close and tactile. Product, skin, light, nothing else competing.",
    ],
    disciplines: ["Brand Identity", "Packaging", "Art Direction", "Typography"],
    images: [
      img("akhai-beauty", "01.jpg", "An Akhai gift set, gold tubes in a printed box", 1200, 1500),
      img("akhai-beauty", "02.jpg", "The Akhai range, gold tubes and packaging", 1200, 1500),
      img("akhai-beauty", "03.jpg", "Akhai gold lip treatment trio", 1200, 1500),
      img("akhai-beauty", "04.jpg", "Akhai branding cards in maroon", 844, 1500),
      img("akhai-beauty", "05.jpg", "A model holding the Akhai gold tube", 1200, 1500, "center top"),
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const getNextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};

/** How many image positions the landing composition holds. */
export const SLOT_COUNT = 5;

/**
 * The composition shows one image from each project in its resting state, then
 * swaps every slot to a single project on hover. Each slot therefore needs one
 * image from every project. Projects with more images contribute their first
 * five; a project with fewer would wrap rather than leave a hole.
 */
export const slotImage = (project: Project, slot: number): ProjectImage =>
  project.images[slot % project.images.length];
