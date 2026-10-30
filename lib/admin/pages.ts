import "server-only";
import type { PageKey } from "@prisma/client";
import { db } from "@/lib/db";
import { pageBySlug } from "./section-config";

export type AdminPage = {
  key: PageKey;
  customPageId: string;
  slug: string;
  label: string;
  path: string;
  description: string;
  custom: { id: string; slug: string; title: string; seoTitle: string | null; seoDescription: string | null; published: boolean } | null;
};

/** Admin URL slug → page. Built-in pages use their name ("home"); CMS pages use "custom-{id}". */
export async function resolveAdminPage(slug: string): Promise<AdminPage | null> {
  if (slug.startsWith("custom-")) {
    const p = await db.customPage.findUnique({ where: { id: slug.slice("custom-".length) } });
    if (!p) return null;
    return {
      key: "CUSTOM",
      customPageId: p.id,
      slug,
      label: p.title,
      path: `/${p.slug}`,
      description: `Custom page at /${p.slug}${p.published ? "" : " (draft — not visible on the site)"}.`,
      custom: p,
    };
  }
  const p = pageBySlug(slug);
  return p ? { ...p, customPageId: "", custom: null } : null;
}
