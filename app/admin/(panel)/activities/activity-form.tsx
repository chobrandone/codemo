import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Activity } from "@prisma/client";
import { saveActivity } from "@/app/admin/actions/activities";
import { Card, CardBody, CardHeader, PageHeader } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { AdminForm, FieldError, SubmitButton } from "@/components/admin/admin-form";
import { ImageField } from "@/components/admin/media-picker";
import { Repeater } from "@/components/admin/repeater";
import { DeleteActivityButton } from "./delete-button";

/** Create / edit form for an activity (server component composing client fields). */
export function ActivityForm({ activity, nextNumber }: { activity?: Activity; nextNumber?: string }) {
  const a = activity;
  const v = (k: keyof Activity) => (a?.[k] as string | null | undefined) ?? "";

  const text = (name: keyof Activity, label: string, hint?: string, def?: string) => (
    <Field label={label} htmlFor={name} hint={hint}>
      <Input id={name} name={name} defaultValue={v(name) || def} />
      <FieldError name={name} />
    </Field>
  );

  return (
    <AdminForm action={saveActivity} className="space-y-6">
      <input type="hidden" name="id" value={a?.id ?? ""} />
      <input type="hidden" name="locale" value={a?.locale ?? "en"} />
      <Link href="/admin/activities" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900">
        <ArrowLeft className="h-4 w-4" /> Activities
      </Link>
      <PageHeader
        title={a ? a.title : "New activity"}
        description={a ? `/activities/${a.slug}` : "Fill in the essentials — you can add details, targets and a gallery afterwards."}
        actions={
          <>
            {a && (
              <a href={`/activities/${a.slug}`} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
                View page ↗
              </a>
            )}
            <SubmitButton>{a ? "Save changes" : "Create activity"}</SubmitButton>
          </>
        }
      />

      <Card>
        <CardHeader title="Card & overview" description="Used on the home page cards, the activities overview and the page hero." />
        <CardBody className="grid gap-5 sm:grid-cols-2">
          {text("title", "Title *")}
          {text("slug", "URL slug", "Lowercase, hyphenated. Leave empty to generate from the title.")}
          {text("number", "Number *", "Shown as 01, 02… on cards.", nextNumber)}
          {text("status", "Status pill *", "e.g. Operational — expanding")}
          {text("currentCapacity", "Current capacity")}
          {text("expansionPlan", "Expansion plan")}
          <Field label="Summary *" htmlFor="summary" className="sm:col-span-2">
            <Textarea id="summary" name="summary" defaultValue={v("summary")} rows={3} />
            <FieldError name="summary" />
          </Field>
          {text("tagline", "Hero tagline", "One line under the title on the activity page.")}
          <div className="grid grid-cols-2 gap-3">
            {text("highlightValue", "Highlight figure", "Big number on /activities.")}
            {text("highlightLabel", "Highlight label")}
          </div>
          <div className="flex flex-wrap gap-6 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <Switch name="published" defaultChecked={a ? a.published : true} /> Published
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch name="showOnHome" defaultChecked={a ? a.showOnHome : false} /> Show in home page cards
            </label>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Cover image" />
        <CardBody>
          <ImageField name="coverImage" defaultValue={a?.coverImage} altName="coverAlt" defaultAlt={a?.coverAlt} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Key figures strip" description="Up to 3 count-up figures shown under the page hero." />
        <CardBody>
          <Repeater
            name="heroStats"
            defaultValue={a?.heroStats}
            max={4}
            addLabel="Add figure"
            fields={[
              { key: "value", label: "Value", placeholder: "4 or 2,000 kg" },
              { key: "label", label: "Label" },
            ]}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Detail sections" description="Numbered blocks (01 — Overview, 02 — …). Add an image to show it beside the text." />
        <CardBody>
          <Repeater
            name="detailSections"
            defaultValue={a?.detailSections}
            addLabel="Add section"
            fields={[
              { key: "heading", label: "Heading", wide: true },
              { key: "body", label: "Content", type: "richtext" },
              { key: "image", label: "Side image (optional)", type: "image", altKey: "alt" },
            ]}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Development roadmap (optional)" description="Numbered steps shown on a light band. Leave empty to hide." />
        <CardBody className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            {text("roadmapEyebrow", "Eyebrow", undefined, "Development Roadmap")}
            {text("roadmapTitle", "Heading")}
          </div>
          <Repeater
            name="roadmap"
            defaultValue={a?.roadmap}
            addLabel="Add step"
            fields={[
              { key: "title", label: "Step title" },
              { key: "text", label: "Description", type: "textarea" },
            ]}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Future targets" description="Count-up figures in the dark “Where We Are Heading” band." />
        <CardBody>
          <Repeater
            name="targets"
            defaultValue={a?.targets}
            max={6}
            addLabel="Add target"
            fields={[
              { key: "value", label: "Value", placeholder: "100,000" },
              { key: "label", label: "Label" },
              { key: "text", label: "Description", type: "textarea" },
            ]}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Gallery" description="Images with captions. Drag to reorder." />
        <CardBody>
          <Repeater
            name="gallery"
            defaultValue={a?.gallery}
            max={40}
            addLabel="Add image"
            fields={[{ key: "url", label: "Image", type: "image", altKey: "alt" }]}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="SEO" description="Optional — defaults to the title and summary." />
        <CardBody className="grid gap-5 sm:grid-cols-2">
          {text("seoTitle", "Meta title")}
          <Field label="Meta description" htmlFor="seoDescription">
            <Textarea id="seoDescription" name="seoDescription" defaultValue={v("seoDescription")} rows={2} />
          </Field>
        </CardBody>
      </Card>

      <div className="flex items-center justify-between">
        {a ? <DeleteActivityButton id={a.id} title={a.title} /> : <span />}
        <SubmitButton>{a ? "Save changes" : "Create activity"}</SubmitButton>
      </div>
    </AdminForm>
  );
}
