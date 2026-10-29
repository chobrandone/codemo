import sanitizeHtml from "sanitize-html";

/** Allow-list for CMS rich text (TipTap output). */
export const RICH_TEXT_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "s", "a", "ul", "ol", "li", "h2", "h3", "h4", "blockquote", "hr"],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        ...(attribs.href && /^https?:/.test(attribs.href) ? { target: "_blank", rel: "noopener noreferrer" } : {}),
      },
    }),
  },
};

export function sanitizeRichText(html: string | null | undefined) {
  if (!html) return null;
  const clean = sanitizeHtml(html, RICH_TEXT_OPTIONS).trim();
  return clean === "" || clean === "<p></p>" ? null : clean;
}
