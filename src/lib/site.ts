/**
 * Site-wide constants. Single source of truth for identity, nav and contact.
 */

export const site = {
  name: "studio arama",
  nameParts: ["studio", "arama"] as const,
  founder: "Aradhita Maheshwari",
  founderRole: "Creative Director",
  description:
    "Studio Arama is a design strategy and digital innovation studio. We work with founders, brands and innovators on work that shapes culture.",
  url: "https://studioarama.com",
  email: "aradhita@studioarama.com",
  social: {
    instagram: { label: "Instagram", handle: "@studioarama", url: "https://www.instagram.com/studioarama" },
    linkedin: { label: "LinkedIn", handle: "Studio Arama", url: "https://www.linkedin.com/company/studio-arama/" },
  },
  /** Navigation. Four routes, each a page of its own. */
  nav: [
    { label: "Work", href: "/work" },
    { label: "Capabilities", href: "/capabilities" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  /**
   * The studio's hours, not a claim of offices. Ordered west to east so the
   * row reads as the day travelling.
   *
   * NOTE: the brief asked for the six cities already on the site. There were
   * four. Rather than invent two more, these are the four that existed.
   * Adding a city is one line here and the row re-spaces itself.
   */
  clocks: [
    { city: "San Francisco", zone: "America/Los_Angeles" },
    { city: "New York", zone: "America/New_York" },
    { city: "London", zone: "Europe/London" },
    { city: "New Delhi", zone: "Asia/Kolkata" },
  ],
} as const;

/**
 * Capabilities, grouped and numbered. Typography carries these, not paragraphs.
 * Title Case throughout, including the acronyms, so the column reads evenly.
 */
/**
 * CAPABILITIES
 *
 * Five groups rather than twenty service cards. The page sets these as a
 * numbered index, so the breadth reads without anything being explained.
 */
export const capabilities = [
  {
    group: "Strategy",
    items: [
      "Brand Strategy",
      "Creative Strategy",
      "Research",
      "Positioning",
      "Cultural and Market Research",
      "Product Strategy",
      "Go to Market Thinking",
      "Experience Strategy",
    ],
  },
  {
    group: "Identity",
    items: [
      "Brand Identity",
      "Visual Systems",
      "Art Direction",
      "Logo Systems",
      "Typography",
      "Colour Systems",
      "Brand Voice",
      "Packaging",
      "Brand Guidelines",
    ],
  },
  {
    group: "Digital",
    items: [
      "Website Concept",
      "Website Design",
      "Website Development",
      "UI and UX",
      "Digital Art Direction",
      "Interactive Experiences",
      "Ecommerce",
      "Digital Product Thinking",
    ],
  },
  {
    group: "Campaigns and Content",
    items: [
      "Campaign Concepts",
      "Creative Direction",
      "Social Campaigns",
      "Short Form Film",
      "Content Strategy",
      "Photography Direction",
      "Videography Direction",
      "Launch Creative",
    ],
  },
  {
    group: "Production and Experience",
    items: [
      "Packaging Development",
      "Print",
      "Physical Touchpoints",
      "Brand Experiences",
      "Creative Production",
      "Special Projects",
    ],
  },
] as const;
