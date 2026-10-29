# syntax=docker/dockerfile:1.7
# CODEMO website — multi-stage production image (Next.js standalone output).

ARG NODE_VERSION=20-alpine

# ── 1. Dependencies ──────────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci --no-audit --no-fund

# ── 2. Build ─────────────────────────────────────────────────────────────────
# This stage keeps the full toolchain, so docker-compose also uses it for the
# one-off "migrate" job (prisma migrate deploy + seed).
FROM node:${NODE_VERSION} AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# NEXT_PUBLIC_* values are inlined at build time.
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG S3_PUBLIC_URL=
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL S3_PUBLIC_URL=$S3_PUBLIC_URL
RUN npx prisma generate && npm run build

# ── 3. Runtime ───────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS runner
RUN apk add --no-cache libc6-compat openssl tini
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    UPLOAD_DIR=/app/uploads

RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs \
 && mkdir -p /app/uploads && chown nextjs:nodejs /app/uploads

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000
VOLUME ["/app/uploads"]
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/robots.txt >/dev/null || exit 1
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
