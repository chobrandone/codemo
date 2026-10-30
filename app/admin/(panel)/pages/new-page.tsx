"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { createPage } from "@/app/admin/actions/pages";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field, Input } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { AdminForm, FieldError, SubmitButton } from "@/components/admin/admin-form";
import { slugify } from "@/lib/utils";

export function NewPageButton() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [touched, setTouched] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus /> New page
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <DialogContent title="Create a page" description="The page starts with a hero; add more sections after creating it.">
            <AdminForm action={createPage} onSuccess={() => setOpen(false)} className="space-y-4">
              <Field label="Title *" htmlFor="np-title">
                <Input
                  id="np-title"
                  name="title"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!touched) setSlug(slugify(e.target.value));
                  }}
                  placeholder="e.g. Our Partners"
                />
                <FieldError name="title" />
              </Field>
              <Field label="URL" htmlFor="np-slug" hint={slug ? `The page will be at /${slug}` : "Lowercase words separated by hyphens."}>
                <Input
                  id="np-slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => {
                    setTouched(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="our-partners"
                />
                <FieldError name="slug" />
              </Field>
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <Switch name="addToMenu" defaultChecked /> Add a link to the header menu
              </label>
              <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <SubmitButton>Create page</SubmitButton>
              </div>
            </AdminForm>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
