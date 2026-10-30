"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deletePage, updatePage } from "@/app/admin/actions/pages";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { AdminForm, FieldError, SubmitButton } from "@/components/admin/admin-form";
import { useToast } from "@/components/admin/toast";

type P = { id: string; slug: string; title: string; seoTitle: string | null; seoDescription: string | null; published: boolean };

export function PageSettingsForm({ page }: { page: P }) {
  const [pending, start] = useTransition();
  const toast = useToast();
  const router = useRouter();
  return (
    <AdminForm action={updatePage} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={page.id} />
      <Field label="Page title *" htmlFor="page-title">
        <Input id="page-title" name="title" defaultValue={page.title} />
        <FieldError name="title" />
      </Field>
      <Field label="URL slug" htmlFor="page-slug" hint={`The page lives at /${page.slug}. Menu links are updated if you change it.`}>
        <Input id="page-slug" name="slug" defaultValue={page.slug} />
        <FieldError name="slug" />
      </Field>
      <Field label="Meta title" htmlFor="page-seo-title">
        <Input id="page-seo-title" name="seoTitle" defaultValue={page.seoTitle ?? ""} />
      </Field>
      <Field label="Meta description" htmlFor="page-seo-desc">
        <Textarea id="page-seo-desc" name="seoDescription" rows={2} defaultValue={page.seoDescription ?? ""} />
      </Field>
      <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
        <label className="flex items-center gap-2 text-sm">
          <Switch name="published" defaultChecked={page.published} /> Published (visible on the site)
        </label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="text-red-600 hover:bg-red-50"
            disabled={pending}
            onClick={() => {
              if (!confirm(`Delete the page “${page.title}”, all its sections and its menu links? This cannot be undone.`)) return;
              start(async () => {
                const r = await deletePage(page.id);
                toast(r.message ?? "", r.ok);
                if (r.ok) router.push("/admin/pages");
              });
            }}
          >
            <Trash2 /> Delete page
          </Button>
          <SubmitButton>Save page</SubmitButton>
        </div>
      </div>
    </AdminForm>
  );
}
