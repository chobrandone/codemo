/**
 * Returns DATABASE_URL adjusted for transaction-mode connection poolers
 * (Prisma Postgres "pooled.db.prisma.io", Supabase/Neon poolers, PgBouncer).
 * Without `pgbouncer=true` Prisma's prepared statements break on these and
 * queries fail with "Server has closed the connection".
 */
export function databaseUrl(raw = process.env.DATABASE_URL): string | undefined {
  if (!raw) return raw;
  try {
    const url = new URL(raw);
    const pooled =
      url.hostname.startsWith("pooled.") ||
      url.hostname.includes("-pooler.") ||
      url.hostname.includes("pooler.supabase.com") ||
      url.port === "6543";
    if (pooled && !url.searchParams.has("pgbouncer")) url.searchParams.set("pgbouncer", "true");
    if (!url.searchParams.has("connect_timeout")) url.searchParams.set("connect_timeout", "30");
    return url.toString();
  } catch {
    return raw;
  }
}
