import { z } from "zod";

/** Optional trimmed string: "" → null. */
export const optStr = (max = 500) =>
  z
    .string()
    .max(max)
    .optional()
    .transform((v) => (v && v.trim() !== "" ? v.trim() : null));

export const reqStr = (label: string, max = 500) => z.string().trim().min(1, `${label} is required.`).max(max);

export const bool = z
  .string()
  .optional()
  .transform((v) => v === "on" || v === "true");

/** Link targets: relative paths, anchors, http(s), mailto and tel only. */
export const href = z
  .string()
  .trim()
  .max(500)
  .optional()
  .refine((v) => !v || /^(\/|#|https?:\/\/|mailto:|tel:)/i.test(v), "Use a path like /contact or a full https:// URL.")
  .transform((v) => (v ? v : null));

/** Image URLs: site-relative or http(s). */
export const imageUrl = z
  .string()
  .trim()
  .max(1000)
  .optional()
  .refine((v) => !v || /^(\/|https?:\/\/)/i.test(v), "Invalid image URL.")
  .transform((v) => (v ? v : null));

/** JSON array submitted from a repeater's hidden input. */
export const jsonArray = z
  .string()
  .optional()
  .transform((v, ctx) => {
    if (!v) return [] as Record<string, string>[];
    try {
      const parsed = JSON.parse(v);
      if (!Array.isArray(parsed)) throw new Error();
      return parsed.map((row) => {
        const clean: Record<string, string> = {};
        for (const [k, val] of Object.entries(row ?? {})) if (typeof val === "string") clean[k] = val.slice(0, 20000);
        return clean;
      });
    } catch {
      ctx.addIssue({ code: "custom", message: "Invalid list data." });
      return z.NEVER;
    }
  });

export const locale = z.string().regex(/^[a-z]{2}$/).default("en");
