"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Pencil } from "lucide-react";
import { reorderActivities, toggleActivity } from "@/app/admin/actions/activities";
import { Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SortableList } from "@/components/admin/sortable";
import { useToast } from "@/components/admin/toast";

type A = {
  id: string;
  title: string;
  slug: string;
  number: string;
  status: string;
  coverImage: string | null;
  published: boolean;
  showOnHome: boolean;
};

export function ActivityList({ activities }: { activities: A[] }) {
  const [items, setItems] = useState(activities);
  useEffect(() => setItems(activities), [activities]);
  const [, start] = useTransition();
  const toast = useToast();
  const router = useRouter();
  const run = (p: Promise<{ ok: boolean; message?: string }>) =>
    start(async () => {
      const r = await p;
      toast(r.message ?? "Done", r.ok);
      router.refresh();
    });

  if (!items.length) return <p className="px-5 py-10 text-center text-sm text-zinc-500">No activities yet.</p>;

  return (
    <SortableList
      items={items}
      onReorder={(ids) => {
        setItems(ids.map((id) => items.find((a) => a.id === id)!));
        run(reorderActivities(ids));
      }}
      renderItem={(a, handle) => (
        <div className="flex items-center gap-3 px-3 py-3 sm:px-4">
          {handle}
          <span className="h-12 w-16 shrink-0 overflow-hidden rounded bg-zinc-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {a.coverImage && <img src={a.coverImage} alt="" className="h-full w-full object-cover" />}
          </span>
          <Link href={`/admin/activities/${a.id}`} className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-900">
              <span className="mr-2 text-zinc-400">{a.number}</span>
              {a.title}
            </p>
            <p className="truncate text-xs text-zinc-500">
              /activities/{a.slug} · {a.status}
            </p>
          </Link>
          {a.showOnHome && <Badge tone="blue">Home</Badge>}
          {!a.published && <Badge tone="amber">Draft</Badge>}
          <Switch
            checked={a.published}
            aria-label={`Publish ${a.title}`}
            onCheckedChange={(v) => {
              setItems((cur) => cur.map((x) => (x.id === a.id ? { ...x, published: v } : x)));
              run(toggleActivity(a.id, v));
            }}
          />
          <Button variant="ghost" size="icon" asChild>
            <a href={`/activities/${a.slug}`} target="_blank" rel="noreferrer" aria-label="View page">
              <ExternalLink />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/activities/${a.id}`} aria-label={`Edit ${a.title}`}>
              <Pencil />
            </Link>
          </Button>
        </div>
      )}
    />
  );
}
