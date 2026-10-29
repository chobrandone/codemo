"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, NativeSelect, Textarea } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ImageField } from "./media-picker";
import { RichTextEditor } from "./rich-text-editor";
import { SortableList } from "./sortable";

export type RepeaterFieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "richtext" | "image" | "select";
  options?: { value: string; label: string }[];
  placeholder?: string;
  /** Span both columns in the item grid. */
  wide?: boolean;
  /** For image fields: key that stores the alt text. */
  altKey?: string;
};

type Row = Record<string, string> & { __id: string };
let seq = 0;
const withId = (r: Record<string, string>): Row => ({ ...r, __id: `r${Date.now()}${seq++}` });

/**
 * Editable list of small objects (stats, gallery images, timeline entries, …),
 * serialised as JSON into a hidden input named `name`. Reorder by drag or arrows.
 */
export function Repeater({
  name,
  fields,
  defaultValue,
  addLabel = "Add item",
  itemLabel,
  max = 50,
}: {
  name: string;
  fields: RepeaterFieldDef[];
  defaultValue?: unknown;
  addLabel?: string;
  itemLabel?: (row: Record<string, string>, index: number) => string;
  max?: number;
}) {
  const [rows, setRows] = useState<Row[]>(() =>
    (Array.isArray(defaultValue) ? (defaultValue as Record<string, string>[]) : []).map(withId),
  );
  const json = useMemo(() => JSON.stringify(rows.map(({ __id, ...rest }) => (void __id, rest))), [rows]);

  const update = (id: string, patch: Record<string, string>) =>
    setRows((rs) => rs.map((r) => (r.__id === id ? { ...r, ...patch } : r)));
  const move = (i: number, d: number) =>
    setRows((rs) => {
      const j = i + d;
      if (j < 0 || j >= rs.length) return rs;
      const next = [...rs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const items = rows.map((r) => ({ ...r, id: r.__id }) as Row & { id: string });

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={json} />
      {rows.length === 0 && <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-500">No items yet.</p>}
      {rows.length > 0 && (
        <SortableList
          items={items}
          className="divide-y-0 space-y-3"
          onReorder={(ids) => setRows((rs) => ids.map((id) => rs.find((r) => r.__id === id)!))}
          renderItem={(row, handle, i) => (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50/50">
              <div className="flex items-center gap-2 border-b border-zinc-100 px-2 py-1.5">
                {handle}
                <span className="truncate text-xs font-medium text-zinc-600">
                  {itemLabel?.(row, i) ?? `#${i + 1} ${row[fields[0].key] ? "— " + row[fields[0].key].replace(/<[^>]+>/g, "").slice(0, 60) : ""}`}
                </span>
                <span className="ml-auto flex items-center">
                  <Button type="button" variant="ghost" size="icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                    <ArrowUp />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" onClick={() => move(i, 1)} disabled={i === rows.length - 1} aria-label="Move down">
                    <ArrowDown />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => setRows((rs) => rs.filter((r) => r.__id !== row.id))}
                    aria-label="Remove item"
                  >
                    <Trash2 />
                  </Button>
                </span>
              </div>
              <div className="grid gap-3 p-3 sm:grid-cols-2">
                {fields.map((f) => {
                  const id = `${row.id}-${f.key}`;
                  const val = row[f.key] ?? "";
                  const wide = f.wide || f.type === "richtext" || f.type === "image" || f.type === "textarea";
                  return (
                    <div key={f.key} className={cn("space-y-1", wide && "sm:col-span-2")}>
                      <Label htmlFor={id} className="text-xs">
                        {f.label}
                      </Label>
                      {f.type === "textarea" ? (
                        <Textarea id={id} value={val} rows={2} placeholder={f.placeholder} onChange={(e) => update(row.id, { [f.key]: e.target.value })} />
                      ) : f.type === "richtext" ? (
                        <RichTextEditor defaultValue={val} minimal onChange={(html) => update(row.id, { [f.key]: html })} />
                      ) : f.type === "image" ? (
                        <div className="space-y-2">
                          <ImageField
                            compact
                            value={val}
                            onChange={(url, alt) =>
                              update(row.id, { [f.key]: url, ...(f.altKey && alt && !row[f.altKey] ? { [f.altKey]: alt } : {}) })
                            }
                          />
                          {f.altKey && (
                            <Input
                              value={row[f.altKey] ?? ""}
                              placeholder="Alt text / caption"
                              onChange={(e) => update(row.id, { [f.altKey!]: e.target.value })}
                            />
                          )}
                        </div>
                      ) : f.type === "select" ? (
                        <NativeSelect id={id} value={val} onChange={(e) => update(row.id, { [f.key]: e.target.value })}>
                          <option value="">—</option>
                          {f.options?.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </NativeSelect>
                      ) : (
                        <Input id={id} value={val} placeholder={f.placeholder} onChange={(e) => update(row.id, { [f.key]: e.target.value })} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        />
      )}
      {rows.length < max && (
        <Button type="button" variant="outline" size="sm" onClick={() => setRows((rs) => [...rs, withId({})])}>
          <Plus /> {addLabel}
        </Button>
      )}
    </div>
  );
}
