import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { resolveAdminPage } from "@/lib/admin/pages";
import { SECTION_LIBRARY, sectionTypeLabel } from "@/lib/admin/section-config";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, PageHeader } from "@/components/ui/card";
import { SectionList } from "./section-list";
import { AddSection } from "./add-section";
import { PageSettingsForm } from "./page-settings";

export const metadata: Metadata = { title: "Page sections" };

export default async function PageSections({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await resolveAdminPage(slug);
  if (!page) notFound();
  const sections = await db.pageSection.findMany({
    where: { page: page.key, customPageId: page.customPageId, locale: "en" },
    orderBy: { order: "asc" },
    select: { id: true, key: true, type: true, name: true, heading: true, eyebrow: true, visible: true },
  });

  return (
    <>
      <Link href="/admin/pages" className="mb-3 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900">
        <ArrowLeft className="h-4 w-4" /> All pages
      </Link>
      <PageHeader
        title={page.label}
        description={page.description}
        actions={
          <Button variant="outline" asChild>
            <a href={page.path} target="_blank" rel="noreferrer">
              <ExternalLink /> View page
            </a>
          </Button>
        }
      />
      <div className="space-y-6">
        {page.custom && (
          <Card>
            <CardHeader title="Page settings" />
            <CardBody>
              <PageSettingsForm page={page.custom} />
            </CardBody>
          </Card>
        )}
        <Card>
          <CardHeader
            title="Sections"
            description="Drag to reorder · switch to show/hide · duplicate or delete with the buttons."
            actions={<AddSection page={page.key} customPageId={page.customPageId} library={SECTION_LIBRARY} />}
          />
          <SectionList
            slug={slug}
            sections={sections.map(({ type, ...s }) => ({ ...s, typeLabel: sectionTypeLabel(type || s.key) }))}
          />
        </Card>
      </div>
    </>
  );
}
