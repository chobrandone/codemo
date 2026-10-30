"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { LANGUAGE_LABELS, currentTranslation, switchLanguage } from "@/lib/translate";
import { cn } from "@/lib/utils";

/**
 * Language switch (EN | FR …) backed by Google Translate. `compact` is the
 * top-bar segmented control; otherwise a larger version for the mobile menu.
 */
export function LanguageSwitcher({ languages, compact }: { languages: string[]; compact?: boolean }) {
  const source = languages[0];
  const [active, setActive] = useState(source);
  useEffect(() => {
    const t = currentTranslation();
    if (t && languages.includes(t)) setActive(t);
  }, [languages]);

  if (languages.length < 2) return null;

  return (
    <div
      role="group"
      aria-label="Language"
      translate="no"
      className={cn("notranslate flex items-center", compact ? "gap-1.5" : "gap-2")}
    >
      <Globe className={cn("shrink-0 text-gold", compact ? "h-3 w-3" : "h-4 w-4")} aria-hidden />
      {languages.map((lang) => {
        const on = lang === active;
        return (
          <button
            key={lang}
            type="button"
            lang={lang}
            aria-pressed={on}
            title={LANGUAGE_LABELS[lang] ?? lang}
            onClick={() => !on && switchLanguage(source, lang)}
            className={cn(
              "font-semibold uppercase transition-colors",
              compact
                ? "rounded px-1.5 py-0.5 text-[9.5px] tracking-[0.15em]"
                : "rounded border px-3 py-1.5 text-xs tracking-[0.18em]",
              on
                ? compact
                  ? "bg-gold text-ink"
                  : "border-gold bg-gold text-ink"
                : compact
                  ? "text-white/70 hover:text-white"
                  : "border-white/25 text-white/80 hover:border-white hover:text-white",
            )}
          >
            <span className="sr-only">{LANGUAGE_LABELS[lang] ?? lang} — </span>
            {lang}
          </button>
        );
      })}
    </div>
  );
}
