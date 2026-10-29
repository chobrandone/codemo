import type { Metadata } from "next";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/card";
import { CollectionManager } from "@/components/admin/collection-manager";

export const metadata: Metadata = { title: "Expansion projects" };

export default async function ProjectsAdmin() {
  const items = await db.project.findMany({ where: { locale: "en" }, orderBy: { order: "asc" } });
  return (
    <>
      <PageHeader
        title="Expansion projects"
        description="Cards in the “Building the Next Phase” section (home page, #projects). Drag to reorder."
      />
      <CollectionManager
        collection="projects"
        title="Projects"
        items={items}
        titleKey="title"
        subtitleKey="category"
        imageKey="image"
        addLabel="Add project"
        fields={[
          { name: "title", label: "Title", required: true },
          { name: "category", label: "Category tag", required: true, placeholder: "Aquaculture, Poultry, Livestock…" },
          { name: "location", label: "Location tag", required: true, placeholder: "Dibombari" },
          { name: "description", label: "Description", type: "textarea", required: true },
          { name: "image", label: "Image", type: "image", altName: "imageAlt" },
        ]}
      />
    </>
  );
}
