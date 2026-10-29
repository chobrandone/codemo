"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { revalidateContent } from "@/lib/revalidate";
import { bool, href, imageUrl, locale, optStr, reqStr } from "@/lib/admin/schemas";
import { fail, formToObject, guarded, success, zodErrors, type ActionResult } from "@/lib/admin/result";

type Delegate = {
  create(args: { data: Record<string, unknown> }): Promise<unknown>;
  update(args: { where: { id: string }; data: Record<string, unknown> }): Promise<unknown>;
  delete(args: { where: { id: string } }): Promise<unknown>;
  count(args?: { where?: Record<string, unknown> }): Promise<number>;
};

/** Every simple CMS collection: its validation schema, table and visibility flag. */
const registry = {
  infrastructure: {
    model: () => db.infrastructureItem as unknown as Delegate,
    flag: "published",
    scope: [] as string[],
    schema: z.object({
      title: reqStr("Title", 200),
      description: optStr(600),
      published: bool,
      locale,
    }),
  },
  stats: {
    model: () => db.stat as unknown as Delegate,
    flag: "published",
    scope: ["group"],
    schema: z.object({
      group: z.enum(["HERO_FACT", "COOPERATIVE", "VISION", "ABOUT"]),
      value: reqStr("Value", 80),
      suffix: z.string().max(30).optional().transform((v) => (v ? v : null)),
      label: reqStr("Label", 120),
      description: optStr(400),
      published: bool,
      locale,
    }),
  },
  projects: {
    model: () => db.project as unknown as Delegate,
    flag: "published",
    scope: [] as string[],
    schema: z.object({
      title: reqStr("Title", 160),
      category: reqStr("Category", 60),
      location: reqStr("Location", 80),
      description: reqStr("Description", 1200),
      image: imageUrl,
      imageAlt: optStr(300),
      published: bool,
      locale,
    }),
  },
  bullets: {
    model: () => db.bulletPoint as unknown as Delegate,
    flag: "published",
    scope: ["group"],
    schema: z.object({
      group: z.string().trim().min(1).max(60).default("rural-development"),
      text: reqStr("Text", 300),
      published: bool,
      locale,
    }),
  },
  nav: {
    model: () => db.navLink as unknown as Delegate,
    flag: "visible",
    scope: ["location"],
    schema: z.object({
      location: z.enum(["HEADER", "FOOTER_QUICK", "FOOTER_ACTIVITIES"]),
      label: reqStr("Label", 80),
      href: href.refine((v) => !!v, "Link is required."),
      visible: bool,
      locale,
    }),
  },
} as const;

export type CollectionName = keyof typeof registry;
const nameSchema = z.enum(Object.keys(registry) as [CollectionName, ...CollectionName[]]);

export async function saveCollectionItem(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser();
    const name = nameSchema.parse(fd.get("_collection"));
    const id = String(fd.get("_id") ?? "") || null;
    const cfg = registry[name];
    const parsed = cfg.schema.safeParse(formToObject(fd));
    if (!parsed.success) return fail("Please fix the highlighted fields.", zodErrors(parsed.error));
    const data = parsed.data as Record<string, unknown>;
    const model = cfg.model();
    if (id) {
      await model.update({ where: { id }, data });
    } else {
      const where = Object.fromEntries(cfg.scope.map((k) => [k, data[k]]));
      const order = await model.count({ where: { ...where, locale: data.locale } });
      await model.create({ data: { ...data, order } });
    }
    revalidateContent();
    return success(id ? "Saved" : "Created");
  });
}

export async function deleteCollectionItem(name: CollectionName, id: string): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser();
    await registry[nameSchema.parse(name)].model().delete({ where: { id: z.string().min(1).parse(id) } });
    revalidateContent();
    return success("Deleted");
  });
}

export async function toggleCollectionItem(name: CollectionName, id: string, value: boolean): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser();
    const cfg = registry[nameSchema.parse(name)];
    await cfg.model().update({ where: { id }, data: { [cfg.flag]: Boolean(value) } });
    revalidateContent();
    return success(value ? (cfg.flag === "visible" ? "Shown" : "Published") : cfg.flag === "visible" ? "Hidden" : "Moved to draft");
  });
}

export async function reorderCollection(name: CollectionName, ids: string[]): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser();
    const cfg = registry[nameSchema.parse(name)];
    const list = z.array(z.string().min(1)).max(500).parse(ids);
    const model = cfg.model();
    await db.$transaction(list.map((id, order) => model.update({ where: { id }, data: { order } }) as never));
    revalidateContent();
    return success("Order saved");
  });
}
