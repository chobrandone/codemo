import "server-only";
import { headers } from "next/headers";
import { db } from "./db";

/**
 * Fixed-window rate limiter backed by Postgres so it works across serverless
 * instances (Vercel) and multiple PM2/Docker processes alike.
 * Returns true when the request is allowed.
 */
export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowSeconds * 1000);
  const rows = await db.$queryRaw<{ count: number }[]>`
    INSERT INTO "RateLimit" ("key", "count", "resetAt")
    VALUES (${key}, 1, ${resetAt})
    ON CONFLICT ("key") DO UPDATE SET
      "count"   = CASE WHEN "RateLimit"."resetAt" < ${now} THEN 1 ELSE "RateLimit"."count" + 1 END,
      "resetAt" = CASE WHEN "RateLimit"."resetAt" < ${now} THEN ${resetAt} ELSE "RateLimit"."resetAt" END
    RETURNING "count"`;
  // Opportunistic cleanup of expired windows (~1% of calls)
  if (Math.random() < 0.01) await db.rateLimit.deleteMany({ where: { resetAt: { lt: now } } }).catch(() => {});
  return (rows[0]?.count ?? 0) <= limit;
}

export async function resetRateLimit(key: string) {
  await db.rateLimit.delete({ where: { key } }).catch(() => {});
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "unknown"
  );
}
