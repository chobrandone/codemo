/** Client-side helpers for the Google Translate language switch. */

export const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  pt: "Português",
  de: "Deutsch",
  ar: "العربية",
  zh: "中文",
};

export function parseLanguages(value?: string | null): string[] {
  const list = (value ?? "")
    .split(",")
    .map((l) => l.trim().toLowerCase())
    .filter((l) => /^[a-z]{2}(-[a-z]{2})?$/.test(l));
  return [...new Set(list)];
}

/** Target language from Google's "googtrans" cookie (e.g. "/en/fr" → "fr"), or null. */
export function currentTranslation(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
  const target = m ? decodeURIComponent(m[1]).split("/")[2] : null;
  return target || null;
}

function cookieDomains() {
  const host = location.hostname;
  const parts = host.split(".");
  const domains = ["", host, `.${host}`];
  if (parts.length > 2) domains.push(`.${parts.slice(-2).join(".")}`);
  return domains;
}

/** Sets (or clears, when `lang` is the source language) the translation cookie and reloads. */
export function switchLanguage(source: string, lang: string) {
  const expire = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  for (const d of cookieDomains()) {
    document.cookie = `googtrans=; ${expire}; path=/${d ? `; domain=${d}` : ""}`;
  }
  if (lang !== source) {
    const value = `/${source}/${lang}`;
    document.cookie = `googtrans=${value}; path=/; max-age=31536000; SameSite=Lax`;
    document.cookie = `googtrans=${value}; path=/; domain=${location.hostname}; max-age=31536000; SameSite=Lax`;
  }
  location.reload();
}
