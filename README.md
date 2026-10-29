# CODEMO — Website & Admin CMS

Public website and content management system for **CODEMO — Coopérative de Développement du Monde Rural du Moungo**
(Dibombari, Moungo — Littoral, Cameroun). It reproduces the original site's content and design, and every piece of public content can be edited from `/admin`.

- **Stack:** Next.js 15 (App Router, Server Components, Server Actions) · TypeScript (strict) · Tailwind CSS · shadcn/ui-style admin components · PostgreSQL + Prisma · Auth.js v5 (credentials) · TipTap · sharp · Nodemailer · Zod
- **Deploy targets:** Vercel (managed Postgres + S3/R2 media) and a Hostinger VPS (Docker Compose, or Node 20 + PM2 behind Nginx). The code is the same for both; only environment variables change.

---

## Contents

1. [Project structure](#project-structure)
2. [Local setup](#local-setup)
3. [Environment variables](#environment-variables)
4. [Admin guide](#admin-guide)
5. [Deploying to Vercel](#deploying-to-vercel)
6. [Deploying to a Hostinger VPS — Docker](#deploying-to-a-hostinger-vps--docker)
7. [Deploying to a Hostinger VPS — Node 20 + PM2 + Nginx](#deploying-to-a-hostinger-vps--node-20--pm2--nginx)
8. [How content updates go live](#how-content-updates-go-live)
9. [Security notes](#security-notes)
10. [Checklist](#checklist)

---

## Project structure

```
app/
  (site)/                 Public website (Home, About, Activities, Activity detail, Contact)
    contact/actions.ts    Contact form server action (validation, honeypot, rate limit, DB, email)
  admin/
    login/                Sign-in page
    (panel)/              Protected CMS screens (dashboard, pages, activities, media, messages, users…)
    actions/              Admin server actions (all session-checked)
  api/auth/[...nextauth]  Auth.js route
  uploads/[...path]       Serves locally stored media (STORAGE_DRIVER=local)
  sitemap.ts, robots.ts, not-found.tsx
components/
  site/                   Public UI (header, footer, sections, count-up, contact form)
  admin/                  CMS UI (forms, rich-text editor, media picker, repeaters, drag-and-drop)
  ui/                     shadcn/ui-style primitives (admin only)
lib/
  content.ts              Cached public content readers (tag "content")
  storage/                Media storage adapter: local + s3 drivers
  media.ts                Upload pipeline (validate → resize/compress with sharp → store)
  rate-limit.ts           Postgres-backed rate limiter (works on serverless and multi-process)
  mail.ts, sanitize.ts, auth-guard.ts, revalidate.ts
prisma/
  schema.prisma           Data model
  migrations/             SQL migrations
  seed.ts, seed-data.ts   Loads all original site content + first admin
public/images/            Site photography (downloaded from the original site, optimised to WebP)
deploy/nginx/             Nginx configs (host + Docker)
Dockerfile, docker-compose.yml, ecosystem.config.js, deploy.sh, vercel.json
```

## Local setup

Requirements: **Node.js 20.9+** and **PostgreSQL 14+** (local install, Docker, or a free Neon database).

```bash
git clone <your-repo-url> codemo && cd codemo
cp .env.example .env          # then edit DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install                   # also runs `prisma generate`
npx prisma migrate deploy     # create the tables
npm run db:seed               # load the site content + create the first admin
npm run dev                   # http://localhost:3000  ·  admin: http://localhost:3000/admin
```

Quick local Postgres with Docker:

```bash
docker run -d --name codemo-db -p 5432:5432 -e POSTGRES_USER=codemo -e POSTGRES_PASSWORD=codemo -e POSTGRES_DB=codemo postgres:16-alpine
```

Useful scripts:

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / start |
| `npm run lint` · `npm run typecheck` · `npm run format` | ESLint · TypeScript · Prettier |
| `npm run db:migrate` | Create a new migration after editing `schema.prisma` (development) |
| `npm run db:deploy` | Apply migrations (production) |
| `npm run db:seed` | Seed content and the first admin (safe to re-run) |
| `npm run db:studio` | Browse the database |

**Seeding behaviour.** The seed only fills empty tables and missing sections, so re-running it never overwrites edits made in the CMS. To reset all content to the original site: `SEED_FORCE=true npm run db:seed`. To reset the first admin's password to `ADMIN_PASSWORD`: `SEED_RESET_ADMIN_PASSWORD=true npm run db:seed`.

## Environment variables

All variables are listed with comments in [`.env.example`](.env.example).

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `AUTH_SECRET` | ✅ | `openssl rand -base64 32` |
| `AUTH_TRUST_HOST` | VPS | `true` behind Nginx/Docker |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Public URL, used for canonical URLs, sitemap and OG tags |
| `STORAGE_DRIVER` | ✅ | `local` (VPS) or `s3` (Vercel) |
| `UPLOAD_DIR` | local | Persistent folder for uploads (default `./uploads`; `/app/uploads` in Docker) |
| `S3_BUCKET`, `S3_REGION`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_PUBLIC_URL`, `S3_FORCE_PATH_STYLE` | s3 | Any S3-compatible storage (Cloudflare R2, AWS S3, Backblaze B2, MinIO) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | email | Hostinger: `smtp.hostinger.com`, `465`, `true` |
| `CONTACT_RECEIVER_EMAIL` | email | Where contact-form notifications are sent |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | seed | First administrator (password ≥ 10 chars) |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | Docker | Used by `docker-compose.yml` |

If SMTP is not configured, contact messages are still saved and visible in the admin inbox (the dashboard shows a reminder).

## Admin guide

Sign in at **`/admin/login`**. Two roles exist:

- **Administrator** — everything, including user management.
- **Editor** — all content, media and messages; cannot manage users.

| Screen | What you can do |
| --- | --- |
| **Dashboard** | Unread/total messages, activities and projects counts, latest messages, quick links. |
| **Messages** | Every contact-form submission. Filter by status (unread/read) and by “I am contacting you as”, search, open to read (auto-marks read), mark read/unread, delete, bulk actions, **Export CSV**, reply by email. |
| **Page sections** | Choose a page (Home, About, Activities overview, Activity pages (shared blocks), Contact). Drag sections to reorder, toggle to show/hide, click to edit: eyebrow, heading, highlighted (gold italic) words, rich-text body, images + alt text, button labels/links, and section lists (timeline, gallery tiles, contact cards, form options). |
| **Activities** | Create/edit/delete activities and their pages (`/activities/[slug]`): number, status pill, summary, capacity, expansion plan, cover, key figures, numbered detail sections (rich text + optional side image), roadmap steps, future targets, gallery, SEO. Toggle **Published** (draft = hidden) and **Show in home page cards**. Drag to reorder. |
| **Expansion projects** | Cards in the home “#projects” section (category, location, description, image). |
| **Infrastructure** | The numbered list in “A Production Site Built to Scale”. |
| **Stats & figures** | Hero fact strip, Cooperative stats, Vision targets, About stats. Numbers count up on scroll; text values (e.g. “Dibombari”) and ranges (“4,000–5,000”) are shown as typed. |
| **Rural development points** | The check-list in the Rural Development section. |
| **Navigation & footer** | Header menu, footer Quick Links and footer Activities links. |
| **Media library** | Upload (drag & drop, multiple), search, edit alt text, copy URL, delete. Images are resized to max 2400 px and compressed to WebP automatically. |
| **Site settings** | Name, tagline, logo, favicon, address, phone, email, WhatsApp number + prefilled message, social links, footer text, SEO title/description, OG title/image, theme colour, map embed. |
| **Users** | (Admins) create users, change role, enable/disable, reset password, delete. The last active admin cannot be disabled or demoted. |
| **My account** | Change your display name and password. |

Tips:

- Every list (sections, activities, projects, stats, links, repeaters) supports drag-and-drop with the mouse, touch, or keyboard (focus the ⠿ handle, press Space, use arrows, Space again).
- Link fields accept `/path`, `/#anchor`, `https://…`, `mailto:` and `tel:`.
- **Map embed:** in Google Maps, *Share → Embed a map → Copy HTML* and paste the whole `<iframe>`; the URL is extracted automatically.
- **Bilingual-ready:** every content row has a `locale` column (default `en`). A French version can be added later by inserting `fr` rows and adding locale routing — no schema change needed.

## Deploying to Vercel

1. **Database** — create a Postgres database on [Neon](https://neon.tech), [Supabase](https://supabase.com) or Vercel Postgres. Copy the **pooled** connection string (Neon: add `?sslmode=require&pgbouncer=true&connection_limit=1` to the pooled URL if you hit connection limits).
2. **Media bucket** — Vercel has no persistent disk, so use S3-compatible storage. With Cloudflare R2:
   - Create a bucket (e.g. `codemo-media`), enable **Public access** (r2.dev subdomain or a custom domain like `media.example.com`).
   - Create an R2 API token with *Object Read & Write* on that bucket.
   - `S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com`, `S3_REGION=auto`, `S3_PUBLIC_URL=https://media.example.com`.
3. **Import the repository** in Vercel (framework: Next.js). `vercel.json` already sets the build command to `npm run build:vercel` (= `prisma migrate deploy && prisma db seed && next build`), and `postinstall` runs `prisma generate`. The seed only fills empty tables, so it loads the site content on the first deploy and never overwrites CMS edits afterwards.
4. **Environment variables** (Project → Settings → Environment Variables): `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL=https://your-domain`, `STORAGE_DRIVER=s3`, all `S3_*`, `SMTP_*`, `CONTACT_RECEIVER_EMAIL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`. (`S3_PUBLIC_URL` must be present at build time so `next/image` can optimise bucket images.)
5. **Deploy** — `vercel deploy --prod` or push to the main branch.
6. **Content and first admin** are created automatically by the build. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` *before* deploying; if they were missing, add them and redeploy (the admin is created on the next build). The original photography is served from `public/images` (part of the deployment); new uploads go to the bucket.
   > If the live site shows only the header and footer, the database is empty: check that `DATABASE_URL` points to the right database and redeploy.
7. Add your domain in Vercel → Domains.

> On Vercel a single request body is limited to ~4.5 MB, so upload images smaller than that (the VPS accepts up to 10 MB).

## Deploying to a Hostinger VPS — Docker

Tested layout: Ubuntu 22.04/24.04 VPS, Docker Engine + Compose plugin, host Nginx + Certbot for TLS.

```bash
# 1. Server prerequisites
sudo apt update && sudo apt install -y git nginx certbot python3-certbot-nginx
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER && newgrp docker

# 2. Code + configuration
sudo mkdir -p /var/www && sudo chown $USER /var/www
git clone <your-repo-url> /var/www/codemo && cd /var/www/codemo
cp .env.example .env
nano .env      # set POSTGRES_PASSWORD, AUTH_SECRET, NEXT_PUBLIC_SITE_URL=https://your-domain,
               # STORAGE_DRIVER=local, SMTP_*, CONTACT_RECEIVER_EMAIL, ADMIN_EMAIL, ADMIN_PASSWORD
               # (DATABASE_URL is built automatically by docker-compose)

# 3. Build, migrate + seed, start
docker compose up -d --build
docker compose logs -f app     # wait for "Ready"
```

Services: `postgres` (data in the `pgdata` volume), `migrate` (one-off: `prisma migrate deploy` + seed), `app` (Next.js standalone on `127.0.0.1:3000`, uploads in the `uploads` volume).

```bash
# 4. Nginx reverse proxy + HTTPS
sudo cp deploy/nginx/codemo.conf /etc/nginx/sites-available/codemo
sudo sed -i 's/example.com/your-domain.com/g' /etc/nginx/sites-available/codemo
# Docker path: comment out the "location /uploads/" block (the app serves uploads itself),
# or bind-mount the uploads volume to /var/www/codemo/uploads.
sudo ln -s /etc/nginx/sites-available/codemo /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com --redirect
```

Updates: `./deploy.sh docker` (pull → build → migrate → restart).
Backups: `docker compose exec postgres pg_dump -U codemo codemo > backup.sql` and archive the `uploads` volume.
No host Nginx? `docker compose --profile proxy up -d` starts a bundled Nginx on port 80 (`deploy/nginx/docker.conf`); put TLS in front of it (e.g. Cloudflare).

## Deploying to a Hostinger VPS — Node 20 + PM2 + Nginx

```bash
# 1. Prerequisites
sudo apt update && sudo apt install -y git nginx certbot python3-certbot-nginx postgresql
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs
sudo npm install -g pm2

# 2. Database
sudo -u postgres psql -c "CREATE USER codemo WITH PASSWORD 'strong-password';"
sudo -u postgres psql -c "CREATE DATABASE codemo OWNER codemo;"

# 3. Code + configuration
sudo mkdir -p /var/www && sudo chown $USER /var/www
git clone <your-repo-url> /var/www/codemo && cd /var/www/codemo
cp .env.example .env
nano .env   # DATABASE_URL=postgresql://codemo:strong-password@localhost:5432/codemo?schema=public
            # AUTH_SECRET, AUTH_TRUST_HOST=true, NEXT_PUBLIC_SITE_URL=https://your-domain,
            # STORAGE_DRIVER=local, UPLOAD_DIR=/var/www/codemo/uploads, SMTP_*, ADMIN_*

# 4. First deploy: install, migrate, seed, build, start with PM2
chmod +x deploy.sh && ./deploy.sh
pm2 startup systemd    # run the printed command so PM2 restarts on reboot
pm2 save

# 5. Nginx + HTTPS (Let's Encrypt)
sudo cp deploy/nginx/codemo.conf /etc/nginx/sites-available/codemo
sudo sed -i 's/example.com/your-domain.com/g' /etc/nginx/sites-available/codemo
sudo ln -s /etc/nginx/sites-available/codemo /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com --redirect
sudo certbot renew --dry-run   # renewal is automatic via systemd timer
```

`ecosystem.config.js` runs `.next/standalone/server.js` on `127.0.0.1:3000` with variables loaded from `.env`; Nginx serves `/uploads` directly from disk, gzips responses and caches static assets. Updates: `./deploy.sh` (pull → `npm ci` → migrate → build → `pm2 reload`). Logs: `pm2 logs codemo`.

**Hostinger email (SMTP):** create a mailbox in hPanel → Emails, then `SMTP_HOST=smtp.hostinger.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`, `SMTP_USER=<mailbox>`, `SMTP_PASSWORD=<mailbox password>`, `SMTP_FROM="CODEMO <mailbox>"`.

## How content updates go live

Public pages read content through `lib/content.ts`, cached with Next's data cache under the tag `content`. Every admin save calls `revalidateTag("content")` and `revalidatePath("/", "layout")`, so changes are visible on the next page load — no rebuild or redeploy. Builds never need a database connection (pages render on request from the cache), which keeps Docker and CI builds simple.

## Security notes

- `/admin/*` is protected by middleware **and** every admin page/server action re-checks the session against the database (disabled users are locked out immediately). User management is restricted to administrators.
- Passwords are hashed with bcrypt (cost 12). Login is rate-limited per IP and per account; the contact form per IP (5/hour). Limits are stored in Postgres so they hold across serverless instances and PM2/Docker processes.
- Server Actions include Next.js' built-in Origin/Host check (CSRF protection); the login redirect only allows paths inside `/admin`.
- All inputs are validated with Zod. Rich text is sanitised with an allow-list on save and again when rendered. CSV exports neutralise spreadsheet formulas.
- Uploads: type and size checked, re-encoded with sharp (strips metadata), path-traversal-safe storage keys.
- Security headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy (see `next.config.ts`).
- Contact form: honeypot field + minimum fill time + rate limit.

## Checklist

Verified during development against a local PostgreSQL database with the seeded content (✅ = exercised end-to-end in a browser or by script).

**Build & quality**
- ✅ `npm run build` passes · ✅ `npm run typecheck` · ✅ `npm run lint` — no errors or warnings
- ✅ Prisma migration applies cleanly · ✅ seed loads all content and creates the admin (idempotent)

**Public site**
- ✅ Home — hero with gold accent and fact strip, Cooperative (count-up stats), Our Activities (3 cards with status pills), Infrastructure (9 numbered items), Vision (6 count-up targets + footnote), Rural Development (5 bullets + badge), Expansion Projects (`#projects`, 6 cards), Partner CTA
- ✅ Header top bar + main nav + Partner With Us; transparent → solid on scroll; mobile hamburger menu (Esc to close, focus-visible styles, skip link)
- ✅ Footer — logo, tagline, WhatsApp, Quick Links, Activities, Contact block, © current year
- ✅ About — hero, story + stats, journey timeline, resilience, field gallery, CTA
- ✅ Activities overview — five activities in alternating rows with highlight figures
- ✅ Activity pages — `pig-farming`, `pisciculture`, `broiler-production`, `hatchery`, `rural-development` (hero, key figures, numbered detail sections, roadmap where present, targets, gallery, more activities, CTA)
- ✅ Contact — hero, contact cards, form, map embed of Dibombari
- ✅ Custom 404 · `sitemap.xml` · `robots.txt` · meta title/description/OG/theme colour from settings
- ✅ All images served locally from `public/images` (no dependency on base44 hosting) with alt text

**Contact form**
- ✅ Validation errors per field · ✅ success state · ✅ stored in DB · ✅ rate limit (5/hour/IP) · ✅ honeypot · ✅ email notification (tested against a local SMTP server)

**Admin CMS**
- ✅ Login / logout, protected routes, deep-link redirect after login
- ✅ Dashboard counts with unread highlight · ✅ Messages: filter, read/unread, delete, CSV export
- ✅ Page section edit → change visible on the public site immediately (on-demand revalidation)
- ✅ Section show/hide and drag-and-drop reorder (keyboard) reflected on the public page
- ✅ Collections: create → appears on site → delete (infrastructure); publish toggles
- ✅ Activity editor saves all repeaters (figures, detail sections, roadmap, targets, gallery) without data loss
- ✅ Media: upload (3000 px PNG → 2400 px WebP), served from `/uploads`, delete removes the file; path traversal blocked
- ✅ Site settings save → live on the site
- ✅ Users: weak passwords rejected, editor created, editor blocked from Users, disabling a user ends their session immediately, delete

**Lighthouse** (production standalone build, local server)
- Mobile profile: Accessibility 100, Best Practices 100, SEO 100 on all pages; Performance 93–96 on About / Activities / activity pages / Contact, **84 on Home** (LCP is the hero heading waiting for the Fraunces web font on simulated slow 4G)
- Desktop profile, Home: 100 / 100 / 100 / 100

**Deployment**
- `Dockerfile`, `docker-compose.yml`, Nginx configs, `ecosystem.config.js`, `deploy.sh`, `vercel.json` are provided; they have not been run on an actual VPS or Vercel project yet — follow the guides above for the first deploy.
