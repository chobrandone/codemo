"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { deleteMedia, saveUpload } from "@/lib/media";
import { fail, guarded, success, type ActionResult } from "@/lib/admin/result";

export type MediaItem = { id: string; url: string; alt: string | null; filename: string; width: number | null; height: number | null; size: number; mimeType: string; createdAt: string };

export async function listMedia(query = ""): Promise<MediaItem[]> {
  await requireUser();
  const q = query.trim().slice(0, 100);
  const rows = await db.media.findMany({
    where: q
      ? { OR: [{ filename: { contains: q, mode: "insensitive" } }, { alt: { contains: q, mode: "insensitive" } }] }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 300,
  });
  return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
}

export async function uploadMedia(_prev: ActionResult, fd: FormData): Promise<ActionResult & { items?: MediaItem[] }> {
  return guarded(async () => {
    await requireUser();
    const files = fd.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
    if (files.length === 0) return fail("Choose at least one image.");
    if (files.length > 20) return fail("Upload at most 20 images at a time.");
    const alt = String(fd.get("alt") ?? "") || null;
    const created = [];
    for (const f of files) created.push(await saveUpload(f, alt));
    return success(`${created.length} image${created.length > 1 ? "s" : ""} uploaded`, {
      items: created.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
    } as Partial<ActionResult>);
  });
}

export async function updateMediaAlt(id: string, alt: string): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser();
    const parsed = z.object({ id: z.string().min(1), alt: z.string().max(300) }).parse({ id, alt });
    await db.media.update({ where: { id: parsed.id }, data: { alt: parsed.alt.trim() || null } });
    return success("Alt text saved");
  });
}

export async function removeMedia(id: string): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser();
    await deleteMedia(z.string().min(1).parse(id));
    return success("Image deleted");
  });
}
