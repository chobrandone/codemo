/** URL slugs a CMS page cannot use (existing routes and system paths). */
export const RESERVED_SLUGS = [
  "about",
  "activities",
  "contact",
  "admin",
  "api",
  "uploads",
  "images",
  "_next",
  "sitemap.xml",
  "robots.txt",
  "favicon.ico",
];

export const isReservedSlug = (slug: string) => RESERVED_SLUGS.includes(slug.toLowerCase());
