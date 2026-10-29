"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ImageIcon, Loader2, Search, Upload, X } from "lucide-react";
import { listMedia, uploadMedia, type MediaItem } from "@/app/admin/actions/media";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useToast } from "./toast";

/** Dialog to browse the media library or upload a new image. */
export function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect: (item: MediaItem) => void;
}) {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [q, setQ] = useState("");
  const [loading, startLoading] = useTransition();
  const [uploading, startUpload] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => startLoading(async () => setItems(await listMedia(q))), q ? 250 : 0);
    return () => clearTimeout(t);
  }, [open, q]);

  const onFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    startUpload(async () => {
      const res = (await uploadMedia({ ok: false }, fd)) as Awaited<ReturnType<typeof uploadMedia>>;
      toast(res.message ?? (res.ok ? "Uploaded" : "Upload failed"), res.ok);
      if (res.ok && res.items?.length) {
        setItems((cur) => [...res.items!, ...(cur ?? [])]);
        if (res.items.length === 1) onSelect(res.items[0]);
      }
      if (fileRef.current) fileRef.current.value = "";
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Media library" description="Pick an image or upload a new one (JPG, PNG, WebP — max 10 MB, auto-compressed)." className="max-w-4xl">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by file name or alt text" className="pl-8" />
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
          <Button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="animate-spin" /> : <Upload />} Upload
          </Button>
        </div>
        <div
          className="mt-4 grid min-h-[200px] grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onFiles(e.dataTransfer.files);
          }}
        >
          {items === null || (loading && !items.length) ? (
            <div className="col-span-full flex items-center justify-center py-16 text-sm text-zinc-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : items.length === 0 ? (
            <div className="col-span-full py-16 text-center text-sm text-zinc-500">No images yet — drop files here or click Upload.</div>
          ) : (
            items.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  onSelect(m);
                  onOpenChange(false);
                }}
                className="group overflow-hidden rounded-lg border border-zinc-200 text-left transition hover:border-primary hover:ring-2 hover:ring-primary/20"
              >
                <div className="aspect-square bg-zinc-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.url} alt={m.alt ?? ""} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <p className="truncate px-2 py-1.5 text-[11px] text-zinc-600">{m.alt || m.filename}</p>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Form field: image URL stored in a hidden input, with preview and library picker. */
export function ImageField({
  name,
  defaultValue,
  value: controlled,
  onChange,
  altName,
  defaultAlt,
  className,
  compact,
}: {
  name?: string;
  defaultValue?: string | null;
  value?: string;
  onChange?: (url: string, alt?: string | null) => void;
  altName?: string;
  defaultAlt?: string | null;
  className?: string;
  compact?: boolean;
}) {
  const [inner, setInner] = useState(defaultValue ?? "");
  const [alt, setAlt] = useState(defaultAlt ?? "");
  const [open, setOpen] = useState(false);
  const url = controlled ?? inner;
  const set = (u: string, a?: string | null) => {
    setInner(u);
    onChange?.(u, a);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {name && <input type="hidden" name={name} value={url} />}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-zinc-400 transition hover:border-primary",
            compact ? "h-16 w-24" : "h-24 w-36",
          )}
          aria-label="Choose image"
        >
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-6 w-6" />
          )}
        </button>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex gap-2">
            <Input value={url} onChange={(e) => set(e.target.value)} placeholder="/images/… or https://…" className="text-xs" />
            {url && (
              <Button type="button" variant="ghost" size="icon" onClick={() => set("")} aria-label="Remove image">
                <X />
              </Button>
            )}
          </div>
          {altName && (
            <Input name={altName} value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Alt text (describe the image)" className="text-xs" />
          )}
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
            <ImageIcon /> Choose from library
          </Button>
        </div>
      </div>
      <MediaPickerDialog
        open={open}
        onOpenChange={setOpen}
        onSelect={(m) => {
          set(m.url, m.alt);
          if (altName && m.alt && !alt) setAlt(m.alt);
        }}
      />
    </div>
  );
}
