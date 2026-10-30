-- AlterEnum
ALTER TYPE "PageKey" ADD VALUE 'CUSTOM';

-- DropIndex
DROP INDEX "PageSection_page_key_locale_key";

-- DropIndex
DROP INDEX "PageSection_page_locale_order_idx";

-- AlterTable
ALTER TABLE "PageSection" ADD COLUMN     "customPageId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "type" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "languages" TEXT NOT NULL DEFAULT 'en,fr';

-- CreateTable
CREATE TABLE "CustomPage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "title" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomPage_slug_locale_key" ON "CustomPage"("slug", "locale");

-- CreateIndex
CREATE INDEX "PageSection_page_customPageId_locale_order_idx" ON "PageSection"("page", "customPageId", "locale", "order");

-- CreateIndex
CREATE UNIQUE INDEX "PageSection_page_customPageId_key_locale_key" ON "PageSection"("page", "customPageId", "key", "locale");


-- Existing sections: the renderer type is the old key
UPDATE "PageSection" SET "type" = "key" WHERE "type" = '';
