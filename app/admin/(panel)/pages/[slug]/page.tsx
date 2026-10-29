import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { pageBySlug } from "@/lib/admin/section-config";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, PageHeader } from "@/components/ui/card";
import { SectionList } from "./section-list";

export const metadata: Metadata = { title: "Page sections" };

export default async function PageSections({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pageBySlug(slug);
  if (!page) notFound();
  const sections = await db.pageSection.findMany({
    where: { page: page.key, locale: "en" },
    orderBy: { order: "asc" },
    select: { id: true, key: true, name: true, heading: true, eyebrow: true, visible: true },
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
      <Card>
        <CardHeader title="Sections" description="Drag to change the order on the page. Toggle to show or hide a section." />
        <SectionList slug={slug} sections={sections} />
      </Card>
    </>
  );
}
