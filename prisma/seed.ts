/**
 * Seeds the database with the content of the reference site and creates the
 * first admin user from ADMIN_EMAIL / ADMIN_PASSWORD.
 *
 * Safe to run repeatedly: existing content is left untouched unless
 * SEED_FORCE=true, in which case all CMS content is reset to the defaults.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";
import * as data from "./seed-data";
import { databaseUrl } from "../lib/database-url";

const db = new PrismaClient({ datasourceUrl: databaseUrl() });
const FORCE = process.env.SEED_FORCE === "true";
const LOCALE = "en";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn("⚠  ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user.");
    return;
  }
  if (password.length < 10) throw new Error("ADMIN_PASSWORD must be at least 10 characters.");
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    if (process.env.SEED_RESET_ADMIN_PASSWORD === "true") {
      await db.user.update({
        where: { email },
        data: { passwordHash: await bcrypt.hash(password, 12), active: true, role: "ADMIN" },
      });
      console.log(`✓ Admin password reset for ${email}`);
    } else console.log(`• Admin ${email} already exists`);
    return;
  }
  await db.user.create({
    data: { email, name: "Administrator", role: "ADMIN", passwordHash: await bcrypt.hash(password, 12) },
  });
  console.log(`✓ Admin created: ${email}`);
}

async function seedSettings() {
  const exists = await db.siteSettings.findUnique({ where: { locale: LOCALE } });
  if (exists && !FORCE) return;
  await db.siteSettings.upsert({
    where: { locale: LOCALE },
    create: data.settings,
    update: data.settings,
  });
  console.log("✓ Site settings");
}

/**
 * A page's default sections are created only while that page has none, so
 * sections deleted in the CMS are not re-created by later builds.
 */
async function seedSections() {
  const pages = [...new Set(data.sections.map((s) => s.page))];
  let seeded = 0;
  for (const page of pages) {
    const where = { page, customPageId: "", locale: LOCALE };
    if ((await db.pageSection.count({ where })) > 0 && !FORCE) continue;
    if (FORCE) await db.pageSection.deleteMany({ where });
    const rows = data.sections.filter((s) => s.page === page);
    for (const [order, s] of rows.entries()) {
      await db.pageSection.create({ data: { ...s, type: s.key, locale: LOCALE, order, items: s.items ?? [] } });
      seeded++;
    }
  }
  if (seeded) console.log(`✓ Page sections (${seeded})`);
}

/** Seed a collection only when it is empty (or when forced). */
async function seedCollection<T>(
  name: string,
  count: () => Promise<number>,
  wipe: () => Promise<unknown>,
  rows: T[],
  create: (row: T, order: number) => Promise<unknown>,
) {
  if ((await count()) > 0 && !FORCE) return;
  await wipe();
  for (const [i, row] of rows.entries()) await create(row, i);
  console.log(`✓ ${name} (${rows.length})`);
}

async function seedMedia() {
  if ((await db.media.count()) > 0 && !FORCE) return;
  await db.media.deleteMany({ where: { driver: "static" } });
  const root = path.join(process.cwd(), "public", "images");
  if (!fs.existsSync(root)) return;
  const walk = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = path.join(dir, e.name);
      return e.isDirectory() ? walk(p) : /\.(webp|png|jpe?g)$/i.test(e.name) ? [p] : [];
    });
  // Alt text lookup from the seeded content
  const alts = new Map<string, string>();
  for (const s of data.sections) {
    if (s.image && s.imageAlt) alts.set(s.image, s.imageAlt);
    if (s.image2 && s.image2Alt) alts.set(s.image2, s.image2Alt);
  }
  for (const a of data.activities) {
    if (a.coverImage) alts.set(a.coverImage, a.coverAlt);
    for (const g of a.gallery) alts.set(g.url, g.alt);
  }
  const files = walk(root);
  for (const file of files) {
    const rel = "/" + path.relative(path.join(process.cwd(), "public"), file).split(path.sep).join("/");
    const stat = fs.statSync(file);
    const ext = path.extname(file).slice(1).toLowerCase();
    await db.media.create({
      data: {
        url: rel,
        storageKey: `static:${rel}`,
        driver: "static",
        filename: path.basename(file),
        mimeType: ext === "webp" ? "image/webp" : ext === "png" ? "image/png" : "image/jpeg",
        size: stat.size,
        alt: alts.get(rel) ?? null,
      },
    });
  }
  console.log(`✓ Media library (${files.length} files)`);
}

async function main() {
  await seedAdmin();
  await seedSettings();
  await seedSections();

  await seedCollection(
    "Stats",
    () => db.stat.count(),
    () => db.stat.deleteMany(),
    data.stats,
    (row) => {
      const order = data.stats.filter((s) => s.group === row.group).indexOf(row);
      return db.stat.create({ data: { ...row, order, locale: LOCALE } });
    },
  );
  await seedCollection(
    "Activities",
    () => db.activity.count(),
    () => db.activity.deleteMany(),
    data.activities,
    (row, order) => db.activity.create({ data: { ...row, order, locale: LOCALE } }),
  );
  await seedCollection(
    "Infrastructure",
    () => db.infrastructureItem.count(),
    () => db.infrastructureItem.deleteMany(),
    data.infrastructure,
    (row, order) => db.infrastructureItem.create({ data: { ...row, order, locale: LOCALE } }),
  );
  await seedCollection(
    "Projects",
    () => db.project.count(),
    () => db.project.deleteMany(),
    data.projects,
    (row, order) => db.project.create({ data: { ...row, order, locale: LOCALE } }),
  );
  await seedCollection(
    "Rural development bullets",
    () => db.bulletPoint.count(),
    () => db.bulletPoint.deleteMany(),
    data.ruralBullets,
    (text, order) => db.bulletPoint.create({ data: { text, order, group: "rural-development", locale: LOCALE } }),
  );
  await seedCollection(
    "Navigation links",
    () => db.navLink.count(),
    () => db.navLink.deleteMany(),
    data.navLinks,
    (row) => {
      const order = data.navLinks.filter((n) => n.location === row.location).indexOf(row);
      return db.navLink.create({ data: { ...row, order, locale: LOCALE } });
    },
  );
  await seedMedia();
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
