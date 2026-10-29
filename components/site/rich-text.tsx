import "server-only";
import sanitizeHtml from "sanitize-html";
import { cn } from "@/lib/utils";
import { RICH_TEXT_OPTIONS } from "@/lib/sanitize";

export function RichText({ html, className }: { html?: string | null; className?: string }) {
  if (!html) return null;
  return (
    <div className={cn("rich", className)} dangerouslySetInnerHTML={{ __html: sanitizeHtml(html, RICH_TEXT_OPTIONS) }} />
  );
}
