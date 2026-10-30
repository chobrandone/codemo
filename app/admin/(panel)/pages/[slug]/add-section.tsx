"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { PageKey } from "@prisma/client";
import { createSection } from "@/app/admin/actions/sections";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field, Input } from "@/components/ui/form";
import { AdminForm, FieldError, SubmitButton } from "@/components/admin/admin-form";
import { cn } from "@/lib/utils";

type BlockType = { type: string; label: string; description: string };

/** "Add section" button + dialog: pick a block type from the library and name it. */
export function AddSection({ page, customPageId, library }: { page: PageKey; customPageId: string; library: BlockType[] }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(library[0]?.type ?? "text");
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus /> Add section
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <DialogContent title="Add a section" description="New sections start hidden — fill them in, then switch them on." className="max-w-2xl">
            <AdminForm action={createSection} onSuccess={() => setOpen(false)} className="space-y-5">
              <input type="hidden" name="page" value={page} />
              <input type="hidden" name="customPageId" value={customPageId} />
              <input type="hidden" name="type" value={type} />
              <fieldset>
                <legend className="text-[13px] font-medium text-zinc-700">Block type</legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2" role="radiogroup">
                  {library.map((b) => (
                    <button
                      key={b.type}
                      type="button"
                      role="radio"
                      aria-checked={type === b.type}
                      onClick={() => setType(b.type)}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-left transition",
                        type === b.type ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-zinc-200 hover:border-zinc-300",
                      )}
                    >
                      <span className="block text-sm font-medium text-zinc-900">{b.label}</span>
                      <span className="mt-0.5 block text-xs text-zinc-500">{b.description}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
              <Field label="Section name" htmlFor="new-section-name" hint="Shown in the admin list and used as the starting heading.">
                <Input id="new-section-name" name="name" required placeholder="e.g. Our partners" />
                <FieldError name="name" />
              </Field>
              <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <SubmitButton>Add section</SubmitButton>
              </div>
            </AdminForm>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
