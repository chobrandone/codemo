import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { PAGES } from "@/lib/admin/section-config";
import { Badge, Card, PageHeader } from "@/components/ui/card";
import { NewPageButton } from "./new-page";

export const metadata: Metadata = { title: "Pages" };

function PageCard({
  href,
  path,
  label,
  description,
  meta,
  draft,
}: {
  href: string;
  path: string;
  label: string;
  description: string;
  meta: string;
  draft?: boolean;
}) {
  return (
    <Card className="group relative transition hover:border-primary/40 hover:shadow-md">
      <Link href={href} className="block p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold">
            {label} {draft && <Badge tone="amber">Draft</Badge>}
          </h2>
          <ChevronRight className="h-4 w-4 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
        <p className="mt-4 text-xs text-zinc-400">
          {meta} · <span className="font-mono">{path}</span>
        </p>
      </Link>
      <a href={path} target="_blank" rel="noreferrer" className="absolute bottom-4 right-4 rounded p-1 text-zinc-400 hover:text-primary" aria-label={`View ${label} page`}>
        <ExternalLink className="h-4 w-4" />
      </a>
    </Card>
  );
}

export default async function PagesIndex() {
  const [counts, customPages] = await Promise.all([
    db.pageSection.groupBy({ by: ["page", "customPageId"], where: { locale: "en" }, _count: true }),
    db.customPage.findMany({ where: { locale: "en" }, orderBy: { createdAt: "asc" } }),
  ]);
  const count = (page: string, customPageId = "") =>
    counts.find((c) => c.page === page && c.customPageId === customPageId)?._count ?? 0;

  return (
    <>
      <PageHeader
        title="Pages"
        description="Edit, add, duplicate, hide, reorder or delete the sections of any page — or create a new page."
        actions={<NewPageButton />}
      />
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Site pages</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {PAGES.map((p) => (
          <PageCard
            key={p.key}
            href={`/admin/pages/${p.slug}`}
            path={p.path}
            label={p.label}
            description={p.description}
            meta={`${count(p.key)} sections`}
          />
        ))}
      </div>
      <h2 className="mb-3 mt-10 text-xs font-semibold uppercase tracking-wider text-zinc-400">Your pages</h2>
      {customPages.length === 0 ? (
        <Card className="px-5 py-8 text-center text-sm text-zinc-500">
          No custom pages yet. Use <strong>New page</strong> to create one (e.g. Partners, News, Team).
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {customPages.map((p) => (
            <PageCard
              key={p.id}
              href={`/admin/pages/custom-${p.id}`}
              path={`/${p.slug}`}
              label={p.title}
              description="Custom page built from sections."
              meta={`${count("CUSTOM", p.id)} sections`}
              draft={!p.published}
            />
          ))}
        </div>
      )}
    </>
  );
}
