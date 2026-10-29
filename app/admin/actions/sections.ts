"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { revalidateContent } from "@/lib/revalidate";
import { sanitizeRichText } from "@/lib/sanitize";
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
