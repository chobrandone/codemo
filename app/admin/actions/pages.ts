"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { revalidateContent } from "@/lib/revalidate";
import { isReservedSlug } from "@/lib/pages";
import { slugify } from "@/lib/utils";
import { bool, optStr, reqStr } from "@/lib/admin/schemas";
import { fail, formToObject, guarded, success, zodErrors, type ActionResult } from "@/lib/admin/result";

const LOCALE = "en";

const slugField = z
  .string()
  .trim()
  .max(80)
  .optional()
  .transform((v) => (v ? slugify(v) : ""));

async function checkSlug(slug: string, exceptId?: string): Promise<string | null> {
  if (!slug) return "Slug is required.";
  if (isReservedSlug(slug)) return `“${slug}” is used by the site already — choose another.`;
  const clash = await db.customPage.findFirst({ where: { slug, locale: LOCALE, NOT: exceptId ? { id: exceptId } : undefined } });
  return clash ? "Another page already uses this slug." : null;
}

export async function createPage(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser();
    const parsed = z
      .object({ title: reqStr("Title", 120), slug: slugField, addToMenu: bool })
      .safeParse(formToObject(fd));
    if (!parsed.success) return fail("Please fix the highlighted fields.", zodErrors(parsed.error));
    const { title, addToMenu } = parsed.data;
    const slug = parsed.data.slug || slugify(title);
    const slugError = await checkSlug(slug);
    if (slugError) return fail(slugError, { slug: slugError });

    const page = await db.customPage.create({ data: { title, slug, locale: LOCALE } });
    // Start every page with a hero so the transparent header sits on a dark background.
    await db.pageSection.create({
      data: {
        page: "CUSTOM",
        customPageId: page.id,
        locale: LOCALE,
        key: "page-hero",
        type: "page-hero",
        name: "Page hero",
        heading: title,
        image: "/images/moungo-farmland.webp",
        imageAlt: "Farmland in the Moungo region",
        order: 0,
      },
    });
    if (addToMenu) {
      const order = await db.navLink.count({ where: { location: "HEADER", locale: LOCALE } });
      await db.navLink.create({ data: { location: "HEADER", label: title, href: `/${slug}`, order, locale: LOCALE } });
    }
    revalidateContent();
    return success("Page created", { redirectTo: `/admin/pages/custom-${page.id}` });
  });
}

export async function updatePage(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser();
    const parsed = z
      .object({
        id: z.string().min(1),
        title: reqStr("Title", 120),
        slug: slugField,
        seoTitle: optStr(200),
        seoDescription: optStr(400),
        published: bool,
      })
      .safeParse(formToObject(fd));
    if (!parsed.success) return fail("Please fix the highlighted fields.", zodErrors(parsed.error));
    const { id, ...data } = parsed.data;
    const current = await db.customPage.findUnique({ where: { id } });
    if (!current) return fail("Page not found.");
    const slug = data.slug || slugify(data.title);
    const slugError = await checkSlug(slug, id);
    if (slugError) return fail(slugError, { slug: slugError });

    await db.customPage.update({ where: { id }, data: { ...data, slug } });
    // Keep menu links pointing at the page when its slug changes.
    if (slug !== current.slug) {
      await db.navLink.updateMany({ where: { href: `/${current.slug}` }, data: { href: `/${slug}` } });
    }
    revalidateContent();
    return success("Page saved");
  });
}

export async function deletePage(id: string): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser();
    const page = await db.customPage.findUnique({ where: { id: z.string().min(1).parse(id) } });
    if (!page) return fail("Page not found.");
    await db.$transaction([
      db.pageSection.deleteMany({ where: { page: "CUSTOM", customPageId: page.id } }),
      db.navLink.deleteMany({ where: { href: `/${page.slug}` } }),
      db.customPage.delete({ where: { id: page.id } }),
    ]);
    revalidateContent();
    return success("Page deleted", { redirectTo: "/admin/pages" });
  });
}
