import type { Metadata } from "next";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/card";
import { CollectionManager } from "@/components/admin/collection-manager";

export const metadata: Metadata = { title: "Infrastructure" };

export default async function InfrastructureAdmin() {
  const items = await db.infrastructureItem.findMany({ where: { locale: "en" }, orderBy: { order: "asc" } });
  return (
    <>
      <PageHeader
        title="Production infrastructure"
        description="The numbered list in the “A Production Site Built to Scale” section on the home page. Drag to reorder."
      />
      <CollectionManager
        collection="infrastructure"
        title="Infrastructure items"
        items={items}
        titleKey="title"
        subtitleKey="description"
        addLabel="Add item"
        fields={[
          { name: "title", label: "Title", required: true, placeholder: "e.g. 4 Pig-Rearing Buildings" },
          { name: "description", label: "Description", type: "textarea" },
        ]}
      />
    </>
  );
}
