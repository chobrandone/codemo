import "server-only";
import crypto from "node:crypto";
import sharp from "sharp";
import { db } from "./db";
import { getStorage } from "./storage";
import { slugify } from "./utils";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const RASTER = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
const PASSTHROUGH = ["image/x-icon", "image/vnd.microsoft.icon"];

/**
 * Validates, resizes (max 2400px) and compresses an uploaded image to WebP,
 * then stores it through the configured storage driver.
 */
export async function saveUpload(file: File, alt?: string | null) {
  if (file.size === 0) throw new Error("The file is empty.");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Images must be smaller than 10 MB.");
  if (![...RASTER, ...PASSTHROUGH].includes(file.type)) throw new Error("Only JPG, PNG, WebP, AVIF, GIF or ICO images are allowed.");

  const input = Buffer.from(await file.arrayBuffer());
  const base = slugify(file.name.replace(/\.[^.]+$/, "")).slice(0, 60) || "image";
  const id = crypto.randomBytes(5).toString("hex");
  const month = new Date().toISOString().slice(0, 7);

  let body: Buffer;
  let mimeType: string;
  let ext: string;
  let width: number | undefined;
  let height: number | undefined;

  if (RASTER.includes(file.type) && file.type !== "image/gif") {
    const img = sharp(input, { failOn: "error" }).rotate();
    const meta = await img.metadata();
    if (!meta.width || !meta.height) throw new Error("Unreadable image.");
    const out = await img
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer({ resolveWithObject: true });
    body = out.data;
    width = out.info.width;
    height = out.info.height;
    mimeType = "image/webp";
    ext = "webp";
  } else {
    // GIF (keep animation) and ICO are stored as-is after a signature check.
    const meta = file.type === "image/gif" ? await sharp(input, { animated: true }).metadata() : null;
    width = meta?.width;
    height = meta?.pageHeight ?? meta?.height;
    body = input;
    mimeType = file.type;
    ext = file.type === "image/gif" ? "gif" : "ico";
  }

  const storage = getStorage();
  const key = `media/${month}/${base}-${id}.${ext}`;
  const url = await storage.put(key, body, mimeType);
  return db.media.create({
    data: {
      url,
      storageKey: key,
      driver: storage.name,
      filename: file.name.slice(0, 200),
      mimeType,
      size: body.length,
      width,
      height,
      alt: alt?.slice(0, 300) || null,
    },
  });
}

export async function deleteMedia(id: string) {
  const m = await db.media.findUnique({ where: { id } });
  if (!m) return;
  if (m.driver === "local" || m.driver === "s3") {
    await getStorage(m.driver).delete(m.storageKey).catch((e) => console.error("[media] delete failed", e));
  }
  await db.media.delete({ where: { id } });
}
