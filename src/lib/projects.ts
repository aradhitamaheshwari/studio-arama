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
  /** Intrinsic size, so nothing shifts while loading. */
  w: number;
  h: number;
  /** Width over height. The container is built from this, so nothing crops. */
  aspect: number;
};

/**
 * A position in the landing composition: left edge and top edge as percentages
 * of the viewport, and a height in percent of the viewport height.
 *
 * Width is never specified. It comes from the image's own proportions, so the
 * picture decides the shape of its container rather than the other way round.
 */
export type Pos = { x: number; y: number; h: number };

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
  /**
   * Where this project's five images sit when its world takes the screen.
   * Each project has its own arrangement, so moving between them rearranges
   * the whole composition instead of swapping pictures inside fixed frames.
   * Authored, never random, so a project looks the same every time.
   */
  layout: Pos[];
};

/**
 * The resting arrangement, holding one image from each project. Kept clear of
 * the centre so the title always has air.
 */
export const REST_LAYOUT: Pos[] = [
  { x: 3, y: 14, h: 34 },
  { x: 22, y: 59, h: 28 },
  { x: 43, y: 6, h: 23 },
  { x: 63, y: 58, h: 29 },
  { x: 79, y: 16, h: 26 },
];

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
): ProjectImage => ({
  src: `${BASE}/images/${slug}/${file}`,
  thumb: `${BASE}/images/${slug}/thumb/${file}`,
  alt,
  w,
  h,
  aspect: w / h,
});

export const projects: Project[] = [
  {
    slug: "siren",
    name: "Siren",
    category: "Identity, Art Direction, Experiential",
    year: "",
    summary: "A wellness space built to keep people, not process them.",
    overview: [
      "Siren is a movement and wellness space that behaves less like a gym and more like somewhere you arrive and then stay. The brief was a third place rather than a room people enter, exercise in, and leave, so the identity had to carry ritual and escape as much as it carried a timetable.",
      "The identity sits low and still, built on a high contrast serif that holds its nerve at small sizes and reads as architecture at large ones. Deep green and a saturated red do the rest. The red is the unexpected part for this category, and it is what stops the whole thing drifting toward the sterile calm every wellness brand defaults to.",
      "The world is meant to feel immersive and a little sensual. Premium without being clinical, luxurious without becoming a traditional spa, with light doing most of the decorating so the graphic layer can stay out of the way.",
      "The system was drawn to work on a wall before it works on a screen, which is usually the right order for a space people walk into. Our work ran across identity, art direction, the visual system, and the wider experiential world of the place.",
    ],
    disciplines: ["Brand Identity", "Art Direction", "Visual System", "Experiential"],
    images: [
      img("siren", "03.jpg", "The Siren product family, mat, bottle, towel, candle and pouch, lit in red", 1200, 1500),
      img("siren", "01.jpg", "Siren campaign image, a figure lit in warm orange", 1125, 1500),
      img("siren", "02.jpg", "Siren interior in low red light", 1500, 1125),
      img("siren", "04.jpg", "Siren studio interior with the wordmark set into the wall", 1300, 1500),
      img("siren", "05.jpg", "The Siren wordmark cut into stone", 1500, 1141),
    ],
    layout: [
      { x: 52, y: 8, h: 32 },
      { x: 6, y: 14, h: 28 },
      { x: 76, y: 16, h: 22 },
      { x: 20, y: 60, h: 26 },
      { x: 48, y: 62, h: 22 },
    ],
  },
  {
    slug: "alt-five",
    name: "Alt Five",
    category: "Identity, Packaging, Art Direction",
    year: "",
    summary: "Electrolytes for people who actually train, designed to be seen.",
    overview: [
      "Alt Five is an electrolyte brand for runners and people with properly active lives, sold both as cans and as pouches. The identity had to work on a sachet held at arm's length and on a road at speed, which are very different distances.",
      "It sits deliberately between performance, fashion, and contemporary wellness. Metallic surfaces carry the technical, high performance half of that, while a single acid green gives the system its energy and makes it recognisable from across a room. The green runs through everything and acts as a marker: on the road, on the can, on the type.",
      "The photography leans into motion rather than trying to freeze it, so it stays blurred and the graphic layer does the holding. The packaging keeps its information tight and legible while the campaign stays loud, because one is read in a hand and the other is read in public.",
      "The test was whether it could sit in a gym bag, a running kit, a fridge, and a feed without turning into another shouting sports nutrition brand. Our work covered the identity, branding, packaging direction, and the visual system.",
    ],
    disciplines: ["Brand Identity", "Packaging Direction", "Visual System", "Art Direction"],
    images: [
      img("alt-five", "05.jpg", "Alt Five electrolyte pouches, front and back", 1178, 1500),
      img("alt-five", "01.jpg", "The Alt Five wordmark above the product range", 1500, 1125),
      img("alt-five", "02.jpg", "Runners in motion with the Alt Five graphic marking the road", 1202, 1500),
      img("alt-five", "03.jpg", "An Alt Five drink, amber liquid behind the wordmark", 1200, 1500),
      img("alt-five", "04.jpg", "The Alt Five wordmark over a running figure", 1218, 1500),
    ],
    layout: [
      { x: 7, y: 16, h: 31 },
      { x: 29, y: 64, h: 21 },
      { x: 53, y: 61, h: 26 },
      { x: 72, y: 11, h: 28 },
      { x: 3, y: 57, h: 19 },
    ],
  },
  {
    slug: "bar-57",
    name: "Bar 57",
    category: "Identity, Packaging, Art Direction",
    year: "",
    summary: "A late night bar you arrive at for one drink and leave much later.",
    overview: [
      "Bar 57 is a late room, so the identity was drawn for low light. Oxblood on bone, brushed steel, and a wordmark with enough wobble in it to feel hand cut rather than specified.",
      "The idea was somewhere you come for a nightcap and somehow stay longer than you planned. Warm, intimate, a little cinematic, and mysterious without making a performance of it. The colour is built for night, and the materials do as much work as the typography does.",
      "Most of the work lives on small objects. The menu, coasters, matchbooks, and the printed pieces that leave with people and turn up in a coat pocket weeks later. Those details are where the atmosphere actually accumulates.",
      "It is a hospitality identity that assumes the room is already good and the graphics only need to keep up, so the system is embedded into the place rather than applied on top of it. Our work ran across the bar identity, the menu redesign, coasters, matches, printed touchpoints, and the supporting visual elements.",
    ],
    disciplines: ["Bar Identity", "Menu Design", "Printed Touchpoints", "Art Direction"],
    images: [
      img("bar-57", "01.jpg", "A Bar 57 matchbox on brushed steel", 1250, 1500),
      img("bar-57", "02.jpg", "A Bar 57 menu card beside a cocktail", 1200, 1500),
      img("bar-57", "03.jpg", "A Bar 57 cocktail resting on a turntable", 1124, 1500),
      img("bar-57", "04.jpg", "A Bar 57 table setting", 1200, 1500),
      img("bar-57", "05.jpg", "The Bar 57 sign in warm light", 1200, 1500),
      img("bar-57", "06.jpg", "The Bar 57 wordmark in low light", 1199, 1500),
    ],
    layout: [
      { x: 12, y: 58, h: 27 },
      { x: 36, y: 62, h: 24 },
      { x: 58, y: 58, h: 26 },
      { x: 6, y: 12, h: 26 },
      { x: 74, y: 11, h: 28 },
    ],
  },
  {
    slug: "brew-bazaar",
    name: "Brew Bazaar",
    category: "Identity, Packaging, Illustration",
    year: "",
    summary: "Indian coffee, packed like something you keep the box of.",
    overview: [
      "Brew Bazaar is an Indian coffee marketplace built around discovery and the independent coffee culture growing around it. The packaging borrows from the visual culture it comes out of: matchbox labels, tea chest stencils, stamp lithography, printed ephemera, and the tiger and the elephant doing what they have always done on Indian packaging.",
      "India is visually dense. Layered, expressive, full of competing type, colour, symbols, signage and print, and the system was built to take that energy rather than sanitise it into another minimal specialty coffee brand. Every box is a full illustration rather than a logo on a colour.",
      "What holds it together is structure. The typography is disciplined and repeats exactly, which is what lets the palette change completely from one product to the next without the range falling apart.",
      "The harder part was making the references read as current rather than as costume. The drawing is new rather than reproduced, the colour is pushed past its sources, and the layouts are built to modern packaging standards, so it reads as a contemporary Indian brand rather than a reproduction of an older one. Our work covered brand strategy, identity, visual systems, packaging direction, typography, the illustration language, and the wider marketplace world.",
    ],
    disciplines: [
      "Brand Strategy",
      "Brand Identity",
      "Visual Systems",
      "Packaging Direction",
      "Typography",
      "Illustration",
    ],
    images: [
      img("brew-bazaar", "03.jpg", "A Brew Bazaar coffee box, portrait", 1200, 1500),
      img("brew-bazaar", "01.jpg", "Brew Bazaar packaging in red and yellow", 1500, 965),
      img("brew-bazaar", "02.jpg", "Brew Bazaar coffee boxes among hibiscus", 1200, 1500),
      img("brew-bazaar", "04.jpg", "Brew Bazaar burlap sack, product of India", 1323, 1500),
      img("brew-bazaar", "05.jpg", "An Indian chai shop, Brew Bazaar in context", 1200, 1500),
      img("brew-bazaar", "06.jpg", "Brew Bazaar vintage stamp illustrations", 1000, 1500),
    ],
    layout: [
      { x: 38, y: 60, h: 26 },
      { x: 8, y: 14, h: 20 },
      { x: 62, y: 58, h: 27 },
      { x: 70, y: 12, h: 26 },
      { x: 12, y: 58, h: 24 },
    ],
  },
  {
    slug: "akhai-beauty",
    name: "Akhai",
    category: "Identity, Packaging, Art Direction",
    year: "",
    summary: "A Pakistani beauty house, built for a global shelf.",
    overview: [
      "Akhai is a contemporary Pakistani beauty house, bringing Pakistani beauty traditions and ingredients into a global context. The range runs across several treatments, with Gulaab, the rose, carrying the first of them, and the naming stays in its own language rather than translating itself for export.",
      "The formulations lean on ingredients that are familiar at home and largely unfamiliar abroad, ghee among them. The job of the identity was to present those honestly while speaking the language of contemporary beauty fluently enough that the brand reads as current anywhere it lands, rather than as heritage on display.",
      "The visual language is botanical and tactile. Rich greens against soft gold, florals drawn rather than photographed, metallic detail used sparingly, and packaging that is worth the weight it has in a hand. Heritage is treated as something still in use, not as something being remembered.",
      "The art direction was kept close and tactile. Product, skin, light, nothing else competing. Our work covered the identity, packaging, visual direction, and the broader brand world.",
    ],
    disciplines: ["Brand Identity", "Packaging", "Visual Direction", "Brand World"],
    images: [
      img("akhai-beauty", "02.jpg", "The Akhai Gulaab lip treatment, gold tubes and packaging", 1200, 1500),
      img("akhai-beauty", "01.jpg", "An Akhai gift set, gold tubes in a printed box", 1200, 1500),
      img("akhai-beauty", "03.jpg", "The Akhai gold lip treatment trio", 1200, 1500),
      img("akhai-beauty", "04.jpg", "Akhai branding cards in maroon", 844, 1500),
      img("akhai-beauty", "05.jpg", "A model holding the Akhai gold tube", 1200, 1500),
    ],
    layout: [
      { x: 66, y: 10, h: 30 },
      { x: 8, y: 60, h: 24 },
      { x: 30, y: 63, h: 21 },
      { x: 5, y: 14, h: 26 },
      { x: 50, y: 64, h: 19 },
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
