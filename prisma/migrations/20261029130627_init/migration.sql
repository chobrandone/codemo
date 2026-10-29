-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "PageKey" AS ENUM ('HOME', 'ABOUT', 'ACTIVITIES', 'CONTACT', 'ACTIVITY_DETAIL');

-- CreateEnum
CREATE TYPE "StatGroup" AS ENUM ('HERO_FACT', 'COOPERATIVE', 'VISION', 'ABOUT');

-- CreateEnum
CREATE TYPE "NavLocation" AS ENUM ('HEADER', 'FOOTER_QUICK', 'FOOTER_ACTIVITIES');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EDITOR',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "locale" TEXT NOT NULL DEFAULT 'en',
    "siteName" TEXT NOT NULL,
    "shortName" TEXT NOT NULL DEFAULT 'CODEMO',
    "tagline" TEXT NOT NULL,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "address" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "whatsappNumber" TEXT,
    "whatsappMessage" TEXT,
    "socialLinks" JSONB NOT NULL DEFAULT '[]',
    "seoTitle" TEXT NOT NULL,
    "seoDescription" TEXT NOT NULL,
    "ogTitle" TEXT,
    "ogImage" TEXT,
    "themeColor" TEXT NOT NULL DEFAULT '#1F5A36',
    "mapEmbedUrl" TEXT,
    "footerTagline" TEXT,
    "copyright" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("locale")
);

-- CreateTable
CREATE TABLE "PageSection" (
    "id" TEXT NOT NULL,
    "page" "PageKey" NOT NULL,
    "key" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "eyebrow" TEXT,
    "heading" TEXT,
    "headingAccent" TEXT,
    "subheading" TEXT,
    "body" TEXT,
    "image" TEXT,
    "imageAlt" TEXT,
    "image2" TEXT,
    "image2Alt" TEXT,
    "primaryLabel" TEXT,
    "primaryHref" TEXT,
    "secondaryLabel" TEXT,
    "secondaryHref" TEXT,
    "footnote" TEXT,
    "items" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "tagline" TEXT,
    "summary" TEXT NOT NULL,
    "currentCapacity" TEXT,
    "expansionPlan" TEXT,
    "highlightValue" TEXT,
    "highlightLabel" TEXT,
    "coverImage" TEXT,
    "coverAlt" TEXT,
    "heroStats" JSONB NOT NULL DEFAULT '[]',
    "detailSections" JSONB NOT NULL DEFAULT '[]',
    "roadmapEyebrow" TEXT,
    "roadmapTitle" TEXT,
    "roadmap" JSONB NOT NULL DEFAULT '[]',
    "targets" JSONB NOT NULL DEFAULT '[]',
    "gallery" JSONB NOT NULL DEFAULT '[]',
    "showOnHome" BOOLEAN NOT NULL DEFAULT true,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InfrastructureItem" (
    "id" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InfrastructureItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stat" (
    "id" TEXT NOT NULL,
    "group" "StatGroup" NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "value" TEXT NOT NULL,
    "suffix" TEXT,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "imageAlt" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BulletPoint" (
    "id" TEXT NOT NULL,
    "group" TEXT NOT NULL DEFAULT 'rural-development',
    "locale" TEXT NOT NULL DEFAULT 'en',
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BulletPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavLink" (
    "id" TEXT NOT NULL,
    "location" "NavLocation" NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "driver" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "alt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "inquiryType" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimit" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "resetAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "PageSection_page_locale_order_idx" ON "PageSection"("page", "locale", "order");

-- CreateIndex
CREATE UNIQUE INDEX "PageSection_page_key_locale_key" ON "PageSection"("page", "key", "locale");

-- CreateIndex
CREATE INDEX "Activity_locale_published_order_idx" ON "Activity"("locale", "published", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_slug_locale_key" ON "Activity"("slug", "locale");

-- CreateIndex
CREATE INDEX "InfrastructureItem_locale_order_idx" ON "InfrastructureItem"("locale", "order");

-- CreateIndex
CREATE INDEX "Stat_group_locale_order_idx" ON "Stat"("group", "locale", "order");

-- CreateIndex
CREATE INDEX "Project_locale_order_idx" ON "Project"("locale", "order");

-- CreateIndex
CREATE INDEX "BulletPoint_group_locale_order_idx" ON "BulletPoint"("group", "locale", "order");

-- CreateIndex
CREATE INDEX "NavLink_location_locale_order_idx" ON "NavLink"("location", "locale", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Media_storageKey_key" ON "Media"("storageKey");

-- CreateIndex
CREATE INDEX "Message_read_createdAt_idx" ON "Message"("read", "createdAt");

-- CreateIndex
CREATE INDEX "Message_inquiryType_idx" ON "Message"("inquiryType");
