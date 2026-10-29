import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DEFAULT_LOCALE = "en";
export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export function siteUrl(path = "") {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  return `${base}${path}`;
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function whatsappLink(number?: string | null, message?: string | null) {
  const digits = (number || "").replace(/[^\d]/g, "");
  if (!digits) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}

/**
 * Split a stat value like "2,000 kg" or "20+" into a numeric part that can be
 * animated and the surrounding text. Values without a leading number
 * ("Dibombari", "4,000–5,000") are returned as non-animatable.
 */
export function parseCountValue(value: string): { number: number; decimals: number; prefix: string; suffix: string } | null {
  const match = value.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, num, suffix] = match;
  // Ranges such as "4,000–5,000" or "30–60 m³" are shown as-is.
  if (/^\s*[–-]\s*\d/.test(suffix)) return null;
  const clean = num.replace(/,/g, "");
  const decimals = clean.includes(".") ? clean.split(".")[1].length : 0;
  return { number: Number(clean), decimals, prefix, suffix };
}

export function formatDate(d: Date | string) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(d));
}

export type JsonItem = {
  title?: string;
  text?: string;
  image?: string;
  alt?: string;
  value?: string;
  label?: string;
  heading?: string;
  body?: string;
  url?: string;
};

export function asItems(value: unknown): JsonItem[] {
  return Array.isArray(value) ? (value as JsonItem[]) : [];
}
