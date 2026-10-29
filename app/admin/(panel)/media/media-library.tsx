"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2, Search, Trash2, Upload } from "lucide-react";
import { removeMedia, updateMediaAlt, uploadMedia, type MediaItem } from "@/app/admin/actions/media";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/form";
import { useToast } from "@/components/admin/toast";
import { cn } from "@/lib/utils";

const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

export function MediaLibrary({ initial }: { initial: MediaItem[] }) {
  const [items, setItems] = useState(initial);
  useEffect(() => setItems(initial), [initial]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [alt, setAlt] = useState("");
  const [uploading, startUpload] = useTransition();
  const [saving, startSave] = useTransition();
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const router = useRouter();

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return s ? items.filter((m) => m.filename.toLowerCase().includes(s) || (m.alt ?? "").toLowerCase().includes(s)) : items;
  }, [items, q]);

  const upload = (files: FileList | null) => {
    if (!files?.length) return;
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    startUpload(async () => {
      const r = (await uploadMedia({ ok: false }, fd)) as Awaited<ReturnType<typeof uploadMedia>>;
      toast(r.message ?? "", r.ok);
      if (r.ok && r.items) setItems((cur) => [...r.items!, ...cur]);
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    });
  };

  const select = (m: MediaItem) => {
    setSelected(m);
    setAlt(m.alt ?? "");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            upload(e.dataTransfer.files);
          }}
          className={cn(
            "mb-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white px-6 py-8 text-center transition",
            drag ? "border-primary bg-primary/5" : "border-zinc-200",
          )}
        >
          <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => upload(e.target.files)} />
          <Upload className="h-6 w-6 text-zinc-400" />
          <p className="mt-2 text-sm text-zinc-600">Drag & drop images here, or</p>
          <Button className="mt-3" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="animate-spin" /> : <Upload />} Choose files
          </Button>
          <p className="mt-2 text-xs text-zinc-400">JPG, PNG, WebP, AVIF, GIF · up to 10 MB each</p>
        </div>

        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${items.length} images…`} className="pl-8" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {filtered.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => select(m)}
              className={cn(
                "overflow-hidden rounded-lg border bg-white text-left transition hover:shadow-md",
                selected?.id === m.id ? "border-primary ring-2 ring-primary/30" : "border-zinc-200",
              )}
            >
              <div className="aspect-square bg-zinc-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.alt ?? ""} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="px-2 py-1.5">
                <p className="truncate text-xs text-zinc-700">{m.filename}</p>
                <p className={cn("truncate text-[11px]", m.alt ? "text-zinc-400" : "text-amber-600")}>{m.alt || "No alt text"}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Card className="h-fit lg:sticky lg:top-6">
        {selected ? (
          <div className="space-y-4 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selected.url} alt={selected.alt ?? ""} className="w-full rounded-lg border border-zinc-100" />
            <div className="space-y-1 text-xs text-zinc-500">
              <p className="break-all font-medium text-zinc-800">{selected.filename}</p>
              <p>
                {selected.width && selected.height ? `${selected.width}×${selected.height} · ` : ""}
                {kb(selected.size)} · {selected.mimeType}
              </p>
            </div>
            <div className="flex gap-2">
              <Input readOnly value={selected.url} className="text-xs" />
              <Button
                variant="outline"
                size="icon"
                aria-label="Copy URL"
                onClick={() => navigator.clipboard.writeText(selected.url).then(() => toast("URL copied"))}
              >
                <Copy />
              </Button>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="alt">Alt text</Label>
              <Input id="alt" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the image for screen readers" />
              <Button
                size="sm"
                disabled={saving}
                onClick={() =>
                  startSave(async () => {
                    const r = await updateMediaAlt(selected.id, alt);
                    toast(r.message ?? "", r.ok);
                    if (r.ok) setItems((cur) => cur.map((x) => (x.id === selected.id ? { ...x, alt } : x)));
                  })
                }
              >
                Save alt text
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full text-red-600 hover:bg-red-50"
              onClick={() => {
                if (!confirm("Delete this image? Pages using it will show no image.")) return;
                startSave(async () => {
                  const r = await removeMedia(selected.id);
                  toast(r.message ?? "", r.ok);
                  if (r.ok) {
                    setItems((cur) => cur.filter((x) => x.id !== selected.id));
                    setSelected(null);
                  }
                });
              }}
            >
              <Trash2 /> Delete image
            </Button>
          </div>
        ) : (
          <p className="p-6 text-center text-sm text-zinc-500">Select an image to edit its alt text, copy its URL or delete it.</p>
        )}
      </Card>
    </div>
  );
}
