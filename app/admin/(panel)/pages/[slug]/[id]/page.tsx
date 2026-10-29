import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { db } from "@/lib/db";
import { pageBySlug, sectionConfig, type SectionFieldKey } from "@/lib/admin/section-config";
import { saveSection } from "@/app/admin/actions/sections";
import { Card, CardBody, CardHeader, PageHeader } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { AdminForm, FieldError, SubmitButton } from "@/components/admin/admin-form";
import { ImageField } from "@/components/admin/media-picker";
import { Repeater } from "@/components/admin/repeater";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

export const metadata: Metadata = { title: "Edit section" };

export default async function EditSection({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const page = pageBySlug(slug);
  const s = await db.pageSection.findUnique({ where: { id } });
  if (!page || !s || s.page !== page.key) notFound();
  const cfg = sectionConfig(s.page, s.key);
  const has = (f: SectionFieldKey) => cfg.fields.includes(f);
  const label = (f: SectionFieldKey, fallback: string) => cfg.labels?.[f] ?? fallback;

  const text = (name: keyof typeof s, l: string, hint?: string) => (
    <Field label={l} htmlFor={name} hint={hint}>
      <Input id={name} name={name} defaultValue={(s[name] as string | null) ?? ""} />
      <FieldError name={name} />
    </Field>
  );

  return (
    <AdminForm action={saveSection} className="space-y-6">
      <input type="hidden" name="id" value={s.id} />
      <input type="hidden" name="name" value={s.name} />
      <Link href={`/admin/pages/${slug}`} className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900">
        <ArrowLeft className="h-4 w-4" /> {page.label}
      </Link>
      <PageHeader
        title={s.name}
        description={`${page.label} page · section “${s.key}”`}
        actions={
          <>
            <label className="flex items-center gap-2 text-sm text-zinc-600">
              <Switch name="visible" defaultChecked={s.visible} /> Visible
            </label>
            <SubmitButton />
          </>
        }
      />

      {cfg.managedAt && (
        <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
          {cfg.managedAt.map((m) => (
            <Link key={m.href + m.label} href={m.href} className="mr-4 inline-flex items-center gap-1 hover:underline">
              {m.label} <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          ))}
        </div>
      )}

      <Card>
        <CardHeader title="Text" />
        <CardBody className="grid gap-5 sm:grid-cols-2">
          {has("eyebrow") && text("eyebrow", label("eyebrow", "Eyebrow label"), "Small uppercase label above the heading.")}
          {has("heading") && text("heading", label("heading", "Heading"))}
          {has("headingAccent") &&
            text("headingAccent", label("headingAccent", "Highlighted words (optional)"), cfg.hints?.headingAccent ?? "Words from the heading to show in italic gold.")}
          {has("subheading") && text("subheading", label("subheading", "Subheading"))}
          {has("footnote") && text("footnote", label("footnote", "Footnote"))}
          {has("body") && (
            <Field label={label("body", "Body text")} className="sm:col-span-2">
              <RichTextEditor name="body" defaultValue={s.body} />
            </Field>
          )}
        </CardBody>
      </Card>

      {(has("image") || has("image2")) && (
        <Card>
          <CardHeader title="Images" />
          <CardBody className="grid gap-6 md:grid-cols-2">
            {has("image") && (
              <Field label={label("image", "Image")}>
                <ImageField name="image" defaultValue={s.image} altName="imageAlt" defaultAlt={s.imageAlt} />
              </Field>
            )}
            {has("image2") && (
              <Field label={label("image2", "Second image")}>
                <ImageField name="image2" defaultValue={s.image2} altName="image2Alt" defaultAlt={s.image2Alt} />
              </Field>
            )}
          </CardBody>
        </Card>
      )}

      {(has("primary") || has("secondary")) && (
        <Card>
          <CardHeader title="Buttons & links" description="Leave the label empty to hide a button." />
          <CardBody className="grid gap-5 sm:grid-cols-2">
            {has("primary") && (
              <>
                {text("primaryLabel", label("primary", "Primary button") + " — label")}
                {text("primaryHref", "Link", "e.g. /contact, /#projects or https://…")}
              </>
            )}
            {has("secondary") && (
              <>
                {text("secondaryLabel", label("secondary", "Secondary button") + " — label")}
                {text("secondaryHref", "Link")}
              </>
            )}
          </CardBody>
        </Card>
      )}

      {cfg.items && (
        <Card>
          <CardHeader title={cfg.items.label} description={cfg.items.hint} />
          <CardBody>
            <Repeater name="items" defaultValue={s.items} fields={cfg.items.fields} addLabel={cfg.items.addLabel} />
          </CardBody>
        </Card>
      )}

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </AdminForm>
  );
}
