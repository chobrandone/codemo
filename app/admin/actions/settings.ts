"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { revalidateContent } from "@/lib/revalidate";
import { imageUrl, jsonArray, locale, optStr, reqStr } from "@/lib/admin/schemas";
import { fail, formToObject, guarded, success, zodErrors, type ActionResult } from "@/lib/admin/result";

const schema = z.object({
  locale,
  siteName: reqStr("Site name", 200),
  shortName: reqStr("Short name", 40),
  tagline: reqStr("Tagline", 120),
  logoUrl: imageUrl,
  faviconUrl: imageUrl,
  address: reqStr("Address", 200),
  phone: optStr(120),
  email: optStr(160),
  whatsappNumber: z
    .string()
    .trim()
    .max(30)
    .optional()
    .refine((v) => !v || /^\+?[\d\s()-]{6,}$/.test(v), "Use international format, e.g. 237 6XX XXX XXX.")
    .transform((v) => (v ? v.replace(/[^\d]/g, "") : null)),
  whatsappMessage: optStr(300),
  socialLinks: jsonArray,
  seoTitle: reqStr("SEO title", 200),
  seoDescription: reqStr("SEO description", 400),
  ogTitle: optStr(200),
  ogImage: imageUrl,
  themeColor: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex colour like #1F5A36."),
  mapEmbedUrl: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .refine(
      (v) => !v || /^https:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|www\.openstreetmap\.org)/.test(v),
      "Paste a Google Maps or OpenStreetMap embed URL (https://www.google.com/maps/embed?…).",
    )
    .transform((v) => (v ? v : null)),
  footerTagline: optStr(500),
  copyright: optStr(200),
});

export async function saveSettings(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser();
    const raw = formToObject(fd);
    // Accept a full <iframe> snippet and keep only its src.
    const iframeSrc = raw.mapEmbedUrl?.match(/src="([^"]+)"/)?.[1];
    if (iframeSrc) raw.mapEmbedUrl = iframeSrc;
    const parsed = schema.safeParse(raw);
    if (!parsed.success) return fail("Please fix the highlighted fields.", zodErrors(parsed.error));
    const { locale: loc, socialLinks, ...data } = parsed.data;
    const links = socialLinks
      .filter((l) => l.label && l.href && /^https?:\/\//.test(l.href))
      .map((l) => ({ label: l.label, href: l.href }));
    await db.siteSettings.upsert({
      where: { locale: loc },
      create: { locale: loc, ...data, socialLinks: links },
      update: { ...data, socialLinks: links },
    });
    revalidateContent();
    return success("Settings saved");
  });
}
