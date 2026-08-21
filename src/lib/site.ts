// Central place for site-wide constants. Edit here to update everywhere.
export const site = {
  name: "Studio Arama",
  tagline: "A design agency.",
  description: "Studio Arama is a design agency.",
  url: "https://studio-arama.vercel.app",
  email: "hello@studioarama.com",
  nav: [
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
