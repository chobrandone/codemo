import "server-only";
import { unstable_cache } from "next/cache";
import type { NavLocation, PageKey, StatGroup } from "@prisma/client";
import { db } from "./db";
import { DEFAULT_LOCALE } from "./utils";

/**
 * Public content readers. Results are cached under the "content" tag and
 * invalidated by the CMS (see lib/revalidate.ts) whenever anything is saved,
 * so the public site is served from cache but updates immediately.
 */
export const CONTENT_TAG = "content";
// Vercel's Data Cache outlives deployments; scoping keys per deployment means a
// new deploy (e.g. right after seeding) never serves results cached by an older one.
const DEPLOYMENT = process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "local";
const cached = <A extends unknown[], R>(fn: (...args: A) => Promise<R>, key: string) =>
  unstable_cache(fn, [key, DEPLOYMENT], { tags: [CONTENT_TAG], revalidate: 3600 });

export const getSettings = cached(async (locale: string = DEFAULT_LOCALE) => {
  const s =
    (await db.siteSettings.findUnique({ where: { locale } })) ??
    (await db.siteSettings.findUnique({ where: { locale: DEFAULT_LOCALE } }));
  return (
    s ?? {
      locale,
      siteName: "CODEMO — Coopérative de Développement du Monde Rural du Moungo",
      shortName: "CODEMO",
      tagline: "Moungo · Cameroun",
      logoUrl: null,
      faviconUrl: null,
      address: "Dibombari, Moungo — Littoral, Cameroun",
      phone: null,
      email: null,
      whatsappNumber: null,
      whatsappMessage: null,
      socialLinks: [],
      seoTitle: "CODEMO",
      seoDescription: "",
      ogTitle: null,
      ogImage: null,
      themeColor: "#1F5A36",
      mapEmbedUrl: null,
      footerTagline: null,
      copyright: null,
      updatedAt: new Date(),
    }
  );
}, "settings");

export const getSections = cached(async (page: PageKey, locale: string = DEFAULT_LOCALE) => {
  return db.pageSection.findMany({ where: { page, locale, visible: true }, orderBy: { order: "asc" } });
}, "sections");

export const getStats = cached(async (group: StatGroup, locale: string = DEFAULT_LOCALE) => {
  return db.stat.findMany({ where: { group, locale, published: true }, orderBy: { order: "asc" } });
}, "stats");

export const getActivities = cached(async (locale: string = DEFAULT_LOCALE) => {
  return db.activity.findMany({ where: { locale, published: true }, orderBy: { order: "asc" } });
}, "activities");

export const getActivity = cached(async (slug: string, locale: string = DEFAULT_LOCALE) => {
  return db.activity.findFirst({ where: { slug, locale, published: true } });
}, "activity");

export const getInfrastructure = cached(async (locale: string = DEFAULT_LOCALE) => {
  return db.infrastructureItem.findMany({ where: { locale, published: true }, orderBy: { order: "asc" } });
}, "infrastructure");

export const getProjects = cached(async (locale: string = DEFAULT_LOCALE) => {
  return db.project.findMany({ where: { locale, published: true }, orderBy: { order: "asc" } });
}, "projects");

export const getBullets = cached(async (group: string, locale: string = DEFAULT_LOCALE) => {
  return db.bulletPoint.findMany({ where: { group, locale, published: true }, orderBy: { order: "asc" } });
}, "bullets");

export const getNav = cached(async (location: NavLocation, locale: string = DEFAULT_LOCALE) => {
  return db.navLink.findMany({ where: { location, locale, visible: true }, orderBy: { order: "asc" } });
}, "nav");

export type Section = Awaited<ReturnType<typeof getSections>>[number];
export type Settings = Awaited<ReturnType<typeof getSettings>>;
export type ActivityRecord = NonNullable<Awaited<ReturnType<typeof getActivity>>>;

export function sectionMap(sections: Section[]) {
  return Object.fromEntries(sections.map((s) => [s.key, s])) as Record<string, Section | undefined>;
}
