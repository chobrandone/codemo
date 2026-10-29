import type { Metadata } from "next";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/card";
import { CollectionManager } from "@/components/admin/collection-manager";

export const metadata: Metadata = { title: "Rural development points" };

export default async function BulletsAdmin() {
  const items = await db.bulletPoint.findMany({
    where: { locale: "en", group: "rural-development" },
    orderBy: { order: "asc" },
  });
  return (
    <>
      <PageHeader title="Rural development points" description="Check-list shown in the Rural Development section of the home page." />
      <CollectionManager
        collection="bullets"
        title="Bullet points"
        items={items}
        titleKey="text"
        fixed={{ group: "rural-development" }}
        addLabel="Add point"
        fields={[{ name: "text", label: "Text", required: true }]}
      />
    </>
  );
}
