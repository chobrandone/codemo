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
const CACHE_VERSION = "v2";

/** Thrown inside the cache so empty results are returned but never stored. */
class EmptyResult<R> extends Error {
  constructor(readonly value: R) {
    super("empty content result");
  }
}
const isEmpty = (v: unknown) => v == null || (Array.isArray(v) && v.length === 0);

/**
 * Caches non-empty results only: an empty table (e.g. a request made before
 * the database was seeded) is re-queried on every request until content exists,
 * instead of being served from cache for an hour.
 */
const cached = <A extends unknown[], R>(fn: (...args: A) => Promise<R>, key: string) => {
  const store = unstable_cache(
    async (...args: A) => {
      const value = await fn(...args);
      if (isEmpty(value)) throw new EmptyResult(value);
      return value;
    },
    [CACHE_VERSION, key, DEPLOYMENT],
    { tags: [CONTENT_TAG], revalidate: 3600 },
  );
  return async (...args: A): Promise<R> => {
    try {
      return await store(...args);
    } catch (e) {
      if (e instanceof EmptyResult) return e.value as R;
      throw e;
    }
  };
};

const getStoredSettings = cached(async (locale: string) => {
  return (
    (await db.siteSettings.findUnique({ where: { locale } })) ??
    (await db.siteSettings.findUnique({ where: { locale: DEFAULT_LOCALE } }))
  );
}, "settings");

/** Site settings, or built-in defaults while the database has none (defaults are not cached). */
export const getSettings = async (locale: string = DEFAULT_LOCALE) => {
  const s = await getStoredSettings(locale);
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
};

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
