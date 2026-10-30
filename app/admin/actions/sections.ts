"use server";

import { z } from "zod";
import { PageKey as PageKeyEnum, type PageKey } from "@prisma/client";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { revalidateContent } from "@/lib/revalidate";
import { sanitizeRichText } from "@/lib/sanitize";
import { PAGES, SECTION_LIBRARY } from "@/lib/admin/section-config";
import { bool, href, imageUrl, jsonArray, optStr } from "@/lib/admin/schemas";
import { fail, formToObject, guarded, success, zodErrors, type ActionResult } from "@/lib/admin/result";

const schema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(120),
  visible: bool,
  eyebrow: optStr(200),
  heading: optStr(300),
  headingAccent: optStr(120),
  subheading: optStr(300),
  body: z.string().max(50000).optional(),
  image: imageUrl,
  imageAlt: optStr(300),
  image2: imageUrl,
  image2Alt: optStr(300),
  primaryLabel: optStr(80),
  primaryHref: href,
  secondaryLabel: optStr(80),
  secondaryHref: href,
  footnote: optStr(400),
  items: jsonArray,
});

export async function saveSection(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser();
    const raw = formToObject(fd);
    const parsed = schema.safeParse(raw);
    if (!parsed.success) return fail("Please fix the highlighted fields.", zodErrors(parsed.error));
    const { id, body, items, ...rest } = parsed.data;
    const existing = await db.pageSection.findUnique({ where: { id } });
    if (!existing) return fail("Section not found.");

    // Only overwrite fields the form actually submitted (each section type shows a subset).
    const data: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(rest)) if (k in raw || k === "visible") data[k] = v;
    if ("body" in raw) data.body = sanitizeRichText(body);
    if ("items" in raw)
      data.items = items.map((it) =>
        Object.fromEntries(Object.entries(it).map(([k, v]) => [k, k === "image" && v && !/^(\/|https?:\/\/)/.test(v) ? "" : v])),
      );

    await db.pageSection.update({ where: { id }, data });
    revalidateContent();
    return success("Section saved");
  });
}

export async function toggleSection(id: string, visible: boolean): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser();
    await db.pageSection.update({ where: { id: z.string().min(1).parse(id) }, data: { visible: Boolean(visible) } });
    revalidateContent();
    return success(visible ? "Section shown" : "Section hidden");
  });
}

export async function reorderSections(ids: string[]): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser();
    const list = z.array(z.string().min(1)).max(100).parse(ids);
    await db.$transaction(list.map((id, order) => db.pageSection.update({ where: { id }, data: { order } })));
    revalidateContent();
    return success("Order saved");
  });
}

/** Picks a key that is unused on the page: "text", "text-2", "text-3", … */
async function uniqueKey(page: PageKey, customPageId: string, locale: string, base: string) {
  const taken = new Set(
    (await db.pageSection.findMany({ where: { page, customPageId, locale }, select: { key: true } })).map((s) => s.key),
  );
  const root = base.replace(/-\d+$/, "");
  if (!taken.has(root)) return root;
  let n = 2;
  while (taken.has(`${root}-${n}`)) n++;
  return `${root}-${n}`;
}

/** Inserts at `position` by shifting later sections down. */
async function makeRoom(page: PageKey, customPageId: string, locale: string, position: number) {
  await db.pageSection.updateMany({
    where: { page, customPageId, locale, order: { gte: position } },
    data: { order: { increment: 1 } },
  });
}

const createSchema = z.object({
  page: z.nativeEnum(PageKeyEnum),
  customPageId: z.string().max(40).default(""),
  type: z.enum(SECTION_LIBRARY.map((t) => t.type) as [string, ...string[]]),
  name: z.string().trim().min(1, "Give the section a name.").max(120),
});

export async function createSection(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser();
    const parsed = createSchema.safeParse(formToObject(fd));
    if (!parsed.success) return fail("Please fix the highlighted fields.", zodErrors(parsed.error));
    const { page, customPageId, type, name } = parsed.data;
    if ((page === "CUSTOM") !== Boolean(customPageId)) return fail("Invalid page.");
    const locale = "en";
    const order = await db.pageSection.count({ where: { page, customPageId, locale } });
    const created = await db.pageSection.create({
      data: {
        page,
        customPageId,
        locale,
        order,
        type,
        key: await uniqueKey(page, customPageId, locale, type),
        name,
        heading: name,
        visible: false,
      },
    });
    revalidateContent();
    const slug = page === "CUSTOM" ? `custom-${customPageId}` : PAGES.find((p) => p.key === page)?.slug;
    return success("Section added (hidden until you switch it on)", { redirectTo: `/admin/pages/${slug}/${created.id}` });
  });
}

export async function duplicateSection(id: string): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser();
    const src = await db.pageSection.findUnique({ where: { id: z.string().min(1).parse(id) } });
    if (!src) return fail("Section not found.");
    const { id: _id, updatedAt: _u, ...copy } = src;
    void _id;
    void _u;
    await makeRoom(src.page, src.customPageId, src.locale, src.order + 1);
    await db.pageSection.create({
      data: {
        ...copy,
        items: copy.items ?? [],
        key: await uniqueKey(src.page, src.customPageId, src.locale, src.key),
        name: `${src.name} (copy)`,
        order: src.order + 1,
        visible: false,
      },
    });
    revalidateContent();
    return success("Section duplicated (hidden until you switch it on)");
  });
}

export async function deleteSection(id: string): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser();
    await db.pageSection.delete({ where: { id: z.string().min(1).parse(id) } });
    revalidateContent();
    return success("Section deleted");
  });
}
