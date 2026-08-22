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
  /**
   * Navigation. Work is a page of its own, the other two are places on the
   * homepage. Editorial labels, never Home / About / Services / Contact.
   */
  nav: [
    { label: "Work", href: "/work" },
    { label: "Capabilities", href: "/#capabilities" },
    { label: "Studio", href: "/#studio" },
  ],
  cta: { label: "Start a Project", href: "/#start" },
  /**
   * The studio's working world. Not a claim of offices, a claim of hours.
   * Ordered west to east, so the row reads as the day travelling.
   * IANA zone names, resolved live by Intl.
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
export const capabilities = [
  {
    group: "Strategy",
    items: ["Brand Strategy", "Digital Strategy", "Creative Direction", "Go To Market"],
  },
  {
    group: "Identity",
    items: ["Brand Identity", "Visual Systems", "Art Direction", "Campaign Identity"],
  },
  {
    group: "Digital",
    items: ["Web Design", "UX Design", "UI Design", "Development", "Digital Experiences"],
  },
  {
    group: "Content",
    items: ["Campaigns", "Photography", "Film", "Social", "Editorial"],
  },
] as const;
