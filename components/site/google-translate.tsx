"use client";

import { useEffect } from "react";
import { currentTranslation } from "@/lib/translate";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate?: { TranslateElement: new (opts: object, id: string) => unknown } };
  }
}

/**
 * Loads Google's website translator only when a non-source language is selected
 * (via the language switch), so visitors reading the original language pay nothing.
 */
export function GoogleTranslate({ source, languages }: { source: string; languages: string[] }) {
  useEffect(() => {
    const target = currentTranslation();
    if (!target || target === source || !languages.includes(target)) return;

    patchDomForTranslation();
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate) return;
      new window.google.translate.TranslateElement(
        { pageLanguage: source, includedLanguages: languages.join(","), autoDisplay: false },
        "google_translate_element",
      );
    };
    if (!document.getElementById("google-translate-script")) {
      const s = document.createElement("script");
      s.id = "google-translate-script";
      s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.async = true;
      document.body.appendChild(s);
    }
  }, [source, languages]);

  return <div id="google_translate_element" className="hidden" aria-hidden="true" />;
}

let patched = false;
/**
 * Google Translate wraps text in <font> elements behind React's back, which can
 * make React throw when it later removes/inserts those nodes. Make those two DOM
 * operations tolerant (the standard workaround, facebook/react#11538).
 */
function patchDomForTranslation() {
  if (patched || typeof Node !== "function") return;
  patched = true;
  const removeChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return removeChild.call(this, child) as T;
  };
  const insertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(this: Node, node: T, ref: Node | null): T {
    if (ref && ref.parentNode !== this) return node;
    return insertBefore.call(this, node, ref) as T;
  };
}
