import type { z } from "zod";

export type ActionResult = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string>;
  /** Bumped on every call so client forms can react to repeat results. */
  at?: number;
  redirectTo?: string;
};

export const initialResult: ActionResult = { ok: false };

export function fail(message: string, errors?: Record<string, string>): ActionResult {
  return { ok: false, message, errors, at: Date.now() };
}

export function success(message = "Saved", extra?: Partial<ActionResult>): ActionResult {
  return { ok: true, message, at: Date.now(), ...extra };
}

export function zodErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const k = issue.path.join(".") || "_";
    out[k] ??= issue.message;
  }
  return out;
}

/** Converts FormData into a plain object; checkbox/switch values become booleans via the schema. */
export function formToObject(fd: FormData) {
  const obj: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (typeof v === "string" && !k.startsWith("$ACTION")) obj[k] = v;
  return obj;
}

export async function guarded(fn: () => Promise<ActionResult>): Promise<ActionResult> {
  try {
    return await fn();
  } catch (e) {
    // Let Next.js redirects/notFound propagate.
    if (e && typeof e === "object" && "digest" in e && String((e as { digest: unknown }).digest).startsWith("NEXT_")) throw e;
    console.error("[admin action]", e);
    return fail(e instanceof Error ? e.message : "Something went wrong.");
  }
}
