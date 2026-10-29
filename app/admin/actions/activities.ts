"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { revalidateContent } from "@/lib/revalidate";
import { sanitizeRichText } from "@/lib/sanitize";
import { slugify } from "@/lib/utils";
import { bool, imageUrl, jsonArray, locale, optStr, reqStr } from "@/lib/admin/schemas";
import { fail, formToObject, guarded, success, zodErrors, type ActionResult } from "@/lib/admin/result";

const schema = z.object({
  id: z.string().optional(),
  locale,
  title: reqStr("Title", 160),
  slug: z
    .string()
    .trim()
    .max(100)
    .optional()
    .transform((v) => (v ? slugify(v) : "")),
  number: reqStr("Number", 6),
  status: reqStr("Status pill", 80),
  tagline: optStr(300),
  summary: reqStr("Summary", 1200),
  currentCapacity: optStr(160),
  expansionPlan: optStr(160),
  highlightValue: optStr(40),
  highlightLabel: optStr(120),
  coverImage: imageUrl,
  coverAlt: optStr(300),
  heroStats: jsonArray,
  detailSections: jsonArray,
  roadmapEyebrow: optStr(80),
  roadmapTitle: optStr(200),
  roadmap: jsonArray,
  targets: jsonArray,
  gallery: jsonArray,
  showOnHome: bool,
  published: bool,
  seoTitle: optStr(200),
  seoDescription: optStr(400),
});

const nonEmpty = (rows: Record<string, string>[], key: string) => rows.filter((r) => (r[key] ?? "").trim() !== "");
const safeImg = (v?: string) => (v && /^(\/|https?:\/\/)/.test(v) ? v : "");

export async function saveActivity(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser();
    const parsed = schema.safeParse(formToObject(fd));
    if (!parsed.success) return fail("Please fix the highlighted fields.", zodErrors(parsed.error));
    const { id, ...d } = parsed.data;
    const slug = d.slug || slugify(d.title);
    if (!slug) return fail("Please provide a slug.", { slug: "Slug is required." });

    const clash = await db.activity.findFirst({ where: { slug, locale: d.locale, NOT: id ? { id } : undefined } });
    if (clash) return fail("Another activity already uses this slug.", { slug: "This slug is already taken." });

    const data = {
      ...d,
      slug,
      heroStats: nonEmpty(d.heroStats, "value").map(({ value, label }) => ({ value, label: label ?? "" })),
      targets: nonEmpty(d.targets, "value").map(({ value, label, text }) => ({ value, label: label ?? "", text: text ?? "" })),
      roadmap: nonEmpty(d.roadmap, "title").map(({ title, text }) => ({ title, text: text ?? "" })),
      detailSections: nonEmpty(d.detailSections, "heading").map((s) => ({
        heading: s.heading,
        body: sanitizeRichText(s.body) ?? "",
        image: safeImg(s.image),
        alt: s.alt ?? "",
      })),
      gallery: d.gallery.filter((g) => safeImg(g.url)).map((g) => ({ url: g.url, alt: g.alt ?? "" })),
    };

    if (id) {
      await db.activity.update({ where: { id }, data });
      revalidateContent();
      return success("Activity saved");
    }
    const order = await db.activity.count({ where: { locale: d.locale } });
    const created = await db.activity.create({ data: { ...data, order } });
    revalidateContent();
    return success("Activity created", { redirectTo: `/admin/activities/${created.id}` });
  });
}

export async function deleteActivity(id: string): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser();
    await db.activity.delete({ where: { id: z.string().min(1).parse(id) } });
    revalidateContent();
    return success("Activity deleted", { redirectTo: "/admin/activities" });
  });
}

export async function toggleActivity(id: string, published: boolean): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser();
    await db.activity.update({ where: { id }, data: { published: Boolean(published) } });
    revalidateContent();
    return success(published ? "Published" : "Moved to draft");
  });
}

export async function reorderActivities(ids: string[]): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser();
    const list = z.array(z.string().min(1)).max(200).parse(ids);
    await db.$transaction(list.map((id, order) => db.activity.update({ where: { id }, data: { order } })));
    revalidateContent();
    return success("Order saved");
  });
}
