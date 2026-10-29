import type { Metadata } from "next";
import { db } from "@/lib/db";
import { saveSettings } from "@/app/admin/actions/settings";
import { Card, CardBody, CardHeader, PageHeader } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/form";
import { AdminForm, FieldError, SubmitButton } from "@/components/admin/admin-form";
import { ImageField } from "@/components/admin/media-picker";
import { Repeater } from "@/components/admin/repeater";

export const metadata: Metadata = { title: "Site settings" };

export default async function SettingsPage() {
  const s = await db.siteSettings.findUnique({ where: { locale: "en" } });
  const v = (k: keyof NonNullable<typeof s>) => (s?.[k] as string | null | undefined) ?? "";

  const text = (name: keyof NonNullable<typeof s>, label: string, hint?: string, placeholder?: string) => (
    <Field label={label} htmlFor={name} hint={hint}>
      <Input id={name} name={name} defaultValue={v(name)} placeholder={placeholder} />
      <FieldError name={name} />
    </Field>
  );

  return (
    <AdminForm action={saveSettings} className="space-y-6">
      <input type="hidden" name="locale" value="en" />
      <PageHeader title="Site settings" description="Global information used in the header, footer, contact page and search engines." actions={<SubmitButton />} />

      <Card>
        <CardHeader title="Identity" />
        <CardBody className="grid gap-5 sm:grid-cols-2">
          {text("siteName", "Full site name *")}
          {text("shortName", "Short name / logo text *")}
          {text("tagline", "Tagline under logo *", undefined, "Moungo · Cameroun")}
          <Field label="Theme colour *" htmlFor="themeColor" hint="Browser UI colour on mobile.">
            <Input id="themeColor" name="themeColor" defaultValue={v("themeColor") || "#1F5A36"} />
            <FieldError name="themeColor" />
          </Field>
          <Field label="Logo image (optional)" hint="Leave empty to use the built-in CODEMO leaf mark.">
            <ImageField name="logoUrl" defaultValue={v("logoUrl")} />
          </Field>
          <Field label="Favicon" hint="Square PNG or ICO, at least 48×48.">
            <ImageField name="faviconUrl" defaultValue={v("faviconUrl")} />
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Contact details" description="Shown in the top bar, footer and contact page. Any text is allowed (e.g. “Phone: available on request”)." />
        <CardBody className="grid gap-5 sm:grid-cols-2">
          {text("address", "Address *")}
          {text("phone", "Phone")}
          {text("email", "Email")}
          {text("whatsappNumber", "WhatsApp number", "International format without + (e.g. 237600000000). Leave empty to hide WhatsApp links.")}
          <Field label="WhatsApp prefilled message" htmlFor="whatsappMessage" className="sm:col-span-2">
            <Input id="whatsappMessage" name="whatsappMessage" defaultValue={v("whatsappMessage")} />
          </Field>
          <Field
            label="Map embed URL"
            htmlFor="mapEmbedUrl"
            className="sm:col-span-2"
            hint="Google Maps → Share → Embed a map → copy the iframe (the src is extracted automatically)."
          >
            <Textarea id="mapEmbedUrl" name="mapEmbedUrl" defaultValue={v("mapEmbedUrl")} rows={2} />
            <FieldError name="mapEmbedUrl" />
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Footer" />
        <CardBody className="grid gap-5">
          <Field label="Footer description" htmlFor="footerTagline">
            <Textarea id="footerTagline" name="footerTagline" defaultValue={v("footerTagline")} rows={3} />
          </Field>
          {text("copyright", "Copyright holder", "Displayed as “© {year} …”.")}
          <Field label="Social links" hint="Optional buttons next to WhatsApp in the footer.">
            <Repeater
              name="socialLinks"
              defaultValue={s?.socialLinks}
              addLabel="Add social link"
              fields={[
                { key: "label", label: "Label", placeholder: "Facebook" },
                { key: "href", label: "URL", placeholder: "https://facebook.com/…" },
              ]}
            />
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="SEO defaults" description="Used for the home page and as fallbacks everywhere else." />
        <CardBody className="grid gap-5 sm:grid-cols-2">
          {text("seoTitle", "Meta title *")}
          {text("ogTitle", "Open Graph title")}
          <Field label="Meta description *" htmlFor="seoDescription" className="sm:col-span-2">
            <Textarea id="seoDescription" name="seoDescription" defaultValue={v("seoDescription")} rows={3} />
            <FieldError name="seoDescription" />
          </Field>
          <Field label="Open Graph image" hint="1200×630 recommended." className="sm:col-span-2">
            <ImageField name="ogImage" defaultValue={v("ogImage")} />
          </Field>
        </CardBody>
      </Card>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </AdminForm>
  );
}
