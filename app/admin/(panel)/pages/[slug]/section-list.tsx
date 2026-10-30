"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Pencil, Trash2 } from "lucide-react";
import { deleteSection, duplicateSection, reorderSections, toggleSection } from "@/app/admin/actions/sections";
import { Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SortableList } from "@/components/admin/sortable";
import { useToast } from "@/components/admin/toast";

type S = {
  id: string;
  key: string;
  name: string;
  heading: string | null;
  eyebrow: string | null;
  visible: boolean;
  typeLabel: string;
};

export function SectionList({ slug, sections }: { slug: string; sections: S[] }) {
  const [items, setItems] = useState(sections);
  useEffect(() => setItems(sections), [sections]);
  const [pending, start] = useTransition();
  const toast = useToast();
  const router = useRouter();
  const run = (p: Promise<{ ok: boolean; message?: string }>) =>
    start(async () => {
      const r = await p;
      toast(r.message ?? "Done", r.ok);
      router.refresh();
    });

  if (!items.length)
    return <p className="px-5 py-10 text-center text-sm text-zinc-500">No sections yet — use “Add section” to build this page.</p>;

  return (
    <SortableList
      items={items}
      onReorder={(ids) => {
        setItems(ids.map((id) => items.find((s) => s.id === id)!));
        run(reorderSections(ids));
      }}
      renderItem={(s, handle, i) => (
        <div className="flex items-center gap-2 px-3 py-3 sm:gap-3 sm:px-4">
          {handle}
          <span className="hidden w-6 text-xs tabular-nums text-zinc-400 sm:inline">{String(i + 1).padStart(2, "0")}</span>
          <Link href={`/admin/pages/${slug}/${s.id}`} className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-900">
              {s.name} <span className="ml-1 text-xs font-normal text-zinc-400">· {s.typeLabel}</span>
            </p>
            <p className="truncate text-xs text-zinc-500">{s.heading || s.eyebrow || "—"}</p>
          </Link>
          {!s.visible && <Badge tone="amber">Hidden</Badge>}
          <Switch
            checked={s.visible}
            aria-label={`Show ${s.name}`}
            onCheckedChange={(v) => {
              setItems((cur) => cur.map((x) => (x.id === s.id ? { ...x, visible: v } : x)));
              run(toggleSection(s.id, v));
            }}
          />
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/pages/${slug}/${s.id}`} aria-label={`Edit ${s.name}`} title="Edit">
              <Pencil />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={pending}
            aria-label={`Duplicate ${s.name}`}
            title="Duplicate"
            onClick={() => run(duplicateSection(s.id))}
          >
            <Copy />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-600 hover:bg-red-50"
            disabled={pending}
            aria-label={`Delete ${s.name}`}
            title="Delete"
            onClick={() => {
              if (!confirm(`Delete the section “${s.name}”? This cannot be undone. (To keep it but not show it, switch it off instead.)`)) return;
              setItems((cur) => cur.filter((x) => x.id !== s.id));
              run(deleteSection(s.id));
            }}
          >
            <Trash2 />
          </Button>
        </div>
      )}
    />
  );
}
