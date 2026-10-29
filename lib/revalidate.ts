import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { CONTENT_TAG } from "./content";

/** Publish CMS changes immediately: drop the content cache and every rendered page. */
export function revalidateContent() {
  revalidateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
}
