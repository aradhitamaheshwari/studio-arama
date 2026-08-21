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
    instagram: { label: "IG", handle: "@StudioArama", url: "https://instagram.com/studioarama" },
    linkedin: { label: "LI", handle: "Studio Arama", url: "https://www.linkedin.com/company/studioarama" },
  },
  /** Navigation. Editorial labels, never Home / About / Services / Contact. */
  nav: [
    { label: "Selected Work", href: "/#work" },
    { label: "Studio", href: "/#studio" },
    { label: "Capabilities", href: "/#capabilities" },
  ],
  cta: { label: "Start a Project", href: "/#start" },
  /**
   * The studio's working world. Not a claim of offices, a claim of hours.
   * IANA zone names, resolved live by Intl.
   */
  clocks: [
    { city: "New Delhi", zone: "Asia/Kolkata" },
    { city: "New York", zone: "America/New_York" },
    { city: "London", zone: "Europe/London" },
    { city: "San Francisco", zone: "America/Los_Angeles" },
  ],
} as const;

/** Capabilities, grouped. Typography carries these, not paragraphs. */
export const capabilities = [
  {
    group: "Strategy",
    items: ["Brand strategy", "Digital strategy", "Creative direction", "Go to market"],
  },
  {
    group: "Identity",
    items: ["Brand identity", "Visual systems", "Art direction", "Campaign identity"],
  },
  {
    group: "Digital",
    items: ["Web design", "UX", "UI", "Development", "Digital experiences"],
  },
  {
    group: "Content",
    items: ["Campaigns", "Photography", "Film", "Social", "Editorial"],
  },
] as const;
