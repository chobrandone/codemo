"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  deleteCollectionItem,
  reorderCollection,
  saveCollectionItem,
  toggleCollectionItem,
  type CollectionName,
} from "@/app/admin/actions/collections";
import { Button } from "@/components/ui/button";
import { Badge, Card, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field, Input, NativeSelect, Textarea } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { AdminForm, FieldError, SubmitButton } from "./admin-form";
import { ImageField } from "./media-picker";
import { SortableList } from "./sortable";
import { useToast } from "./toast";

export type CollectionField = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "image" | "select";
  options?: { value: string; label: string }[];
  hint?: string;
  altName?: string;
  required?: boolean;
  placeholder?: string;
};

type Item = { id: string } & Record<string, unknown>;

export function CollectionManager({
  collection,
  title,
  description,
  items: serverItems,
  fields,
  titleKey,
  subtitleKey,
  imageKey,
  fixed = {},
  flag = "published",
  addLabel = "Add item",
}: {
  collection: CollectionName;
  title: string;
  description?: string;
  items: Item[];
  fields: CollectionField[];
  titleKey: string;
  subtitleKey?: string;
  imageKey?: string;
  /** Hidden values submitted with every item (e.g. stat group, nav location). */
  fixed?: Record<string, string>;
  flag?: "published" | "visible";
  addLabel?: string;
}) {
  const [items, setItems] = useState(serverItems);
  useEffect(() => setItems(serverItems), [serverItems]);
  const [editing, setEditing] = useState<Item | "new" | null>(null);
  const [, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  const run = (p: Promise<{ ok: boolean; message?: string }>) =>
    startTransition(async () => {
      const r = await p;
      toast(r.message ?? (r.ok ? "Done" : "Error"), r.ok);
      router.refresh();
    });

  const current = editing && editing !== "new" ? editing : null;
  const str = (v: unknown) => (v == null ? "" : String(v));

  return (
    <Card>
      <CardHeader
        title={title}
        description={description}
        actions={
          <Button size="sm" onClick={() => setEditing("new")}>
            <Plus /> {addLabel}
          </Button>
        }
      />
      {items.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-zinc-500">Nothing here yet.</p>
      ) : (
        <SortableList
          items={items}
          onReorder={(ids) => {
            setItems(ids.map((id) => items.find((i) => i.id === id)!));
            run(reorderCollection(collection, ids));
          }}
          renderItem={(item, handle, i) => {
            const on = Boolean(item[flag]);
            return (
              <div className="flex items-center gap-3 px-3 py-2.5 sm:px-4">
                {handle}
                <span className="w-6 text-xs tabular-nums text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
                {imageKey && (
                  <span className="h-10 w-14 shrink-0 overflow-hidden rounded bg-zinc-100">
                    {item[imageKey] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={str(item[imageKey])} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </span>
                )}
                <button type="button" className="min-w-0 flex-1 text-left" onClick={() => setEditing(item)}>
                  <p className="truncate text-sm font-medium text-zinc-900">
                    {str(item[titleKey])}
                    {item.suffix ? str(item.suffix) : ""}
                  </p>
                  {subtitleKey && item[subtitleKey] ? (
                    <p className="truncate text-xs text-zinc-500">{str(item[subtitleKey])}</p>
                  ) : null}
                </button>
                {!on && <Badge tone="amber">{flag === "visible" ? "Hidden" : "Draft"}</Badge>}
                <Switch
                  checked={on}
                  aria-label={flag === "visible" ? "Visible" : "Published"}
                  onCheckedChange={(v) => {
                    setItems((cur) => cur.map((x) => (x.id === item.id ? { ...x, [flag]: v } : x)));
                    run(toggleCollectionItem(collection, item.id, v));
                  }}
                />
                <Button variant="ghost" size="icon" onClick={() => setEditing(item)} aria-label="Edit">
                  <Pencil />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:bg-red-50"
                  aria-label="Delete"
                  onClick={() => {
                    if (confirm(`Delete “${str(item[titleKey])}”? This cannot be undone.`)) {
                      setItems((cur) => cur.filter((x) => x.id !== item.id));
                      run(deleteCollectionItem(collection, item.id));
                    }
                  }}
                >
                  <Trash2 />
                </Button>
              </div>
            );
          }}
        />
      )}

      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        {editing !== null && (
          <DialogContent title={current ? "Edit item" : addLabel} className="max-w-xl">
            <AdminForm action={saveCollectionItem} onSuccess={() => setEditing(null)} className="space-y-4">
              <input type="hidden" name="_collection" value={collection} />
              <input type="hidden" name="_id" value={current?.id ?? ""} />
              {Object.entries(fixed).map(([k, v]) => (
                <input key={k} type="hidden" name={k} value={v} />
              ))}
              {fields.map((f) => (
                <Field key={f.name} label={f.label + (f.required ? " *" : "")} htmlFor={`cf-${f.name}`} hint={f.hint}>
                  {f.type === "textarea" ? (
                    <Textarea id={`cf-${f.name}`} name={f.name} defaultValue={str(current?.[f.name])} rows={3} placeholder={f.placeholder} />
                  ) : f.type === "image" ? (
                    <ImageField
                      name={f.name}
                      defaultValue={str(current?.[f.name])}
                      altName={f.altName}
                      defaultAlt={f.altName ? str(current?.[f.altName]) : undefined}
                    />
                  ) : f.type === "select" ? (
                    <NativeSelect id={`cf-${f.name}`} name={f.name} defaultValue={str(current?.[f.name])}>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </NativeSelect>
                  ) : (
                    <Input id={`cf-${f.name}`} name={f.name} defaultValue={str(current?.[f.name])} placeholder={f.placeholder} />
                  )}
                  <FieldError name={f.name} />
                </Field>
              ))}
              <label className="flex items-center gap-3 text-sm text-zinc-700">
                <Switch name={flag} defaultChecked={current ? Boolean(current[flag]) : true} />
                {flag === "visible" ? "Visible" : "Published"}
              </label>
              <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <SubmitButton>{current ? "Save changes" : "Create"}</SubmitButton>
              </div>
            </AdminForm>
          </DialogContent>
        )}
      </Dialog>
    </Card>
  );
}
