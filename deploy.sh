#!/usr/bin/env bash
# CODEMO — deploy / update on the VPS.
#
#   ./deploy.sh          # PM2 (Node 20) path
#   ./deploy.sh docker   # Docker Compose path
#
# Steps: pull → install → migrate (+ idempotent seed) → build → restart.
set -euo pipefail

cd "$(dirname "$0")"
MODE="${1:-pm2}"
BRANCH="${DEPLOY_BRANCH:-main}"

echo "▸ Pulling latest code ($BRANCH)…"
git fetch --all --prune
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

if [[ "$MODE" == "docker" ]]; then
  echo "▸ Building images and applying migrations…"
  docker compose build
  docker compose up -d postgres
  docker compose run --rm migrate
  echo "▸ Restarting app…"
  docker compose up -d app
  docker image prune -f >/dev/null
  echo "✓ Deployed with Docker."
  exit 0
fi

[[ -f .env ]] || { echo "✗ .env is missing — copy .env.example and fill it in."; exit 1; }

echo "▸ Installing dependencies…"
npm ci --no-audit --no-fund

echo "▸ Applying database migrations…"
npx prisma migrate deploy
npx prisma db seed   # only fills empty tables / creates the first admin

echo "▸ Building…"
npm run build
# The standalone server needs the static assets and public folder next to it.
cp -r public .next/standalone/
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/
mkdir -p uploads logs

echo "▸ Restarting PM2…"
if pm2 describe codemo >/dev/null 2>&1; then
  pm2 reload ecosystem.config.js --update-env
else
  pm2 start ecosystem.config.js
  pm2 save
fi
echo "✓ Deployed with PM2."
