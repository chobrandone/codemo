import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { PAGES } from "@/lib/admin/section-config";
import { Card, PageHeader } from "@/components/ui/card";

export const metadata: Metadata = { title: "Page sections" };

export default async function PagesIndex() {
  const counts = await db.pageSection.groupBy({ by: ["page"], where: { locale: "en" }, _count: true });
  return (
    <>
      <PageHeader title="Page sections" description="Edit text, images and buttons of every page. Reorder or hide sections with drag-and-drop." />
      <div className="grid gap-4 sm:grid-cols-2">
        {PAGES.map((p) => (
          <Card key={p.key} className="group relative transition hover:border-primary/40 hover:shadow-md">
            <Link href={`/admin/pages/${p.slug}`} className="block p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">{p.label}</h2>
                <ChevronRight className="h-4 w-4 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <p className="mt-1 text-sm text-zinc-500">{p.description}</p>
              <p className="mt-4 text-xs text-zinc-400">
                {counts.find((c) => c.page === p.key)?._count ?? 0} sections · <span className="font-mono">{p.path}</span>
              </p>
            </Link>
            <a href={p.path} target="_blank" rel="noreferrer" className="absolute bottom-4 right-4 rounded p-1 text-zinc-400 hover:text-primary" aria-label={`View ${p.label} page`}>
              <ExternalLink className="h-4 w-4" />
            </a>
          </Card>
        ))}
      </div>
    </>
  );
}
