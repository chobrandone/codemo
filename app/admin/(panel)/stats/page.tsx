import type { Metadata } from "next";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/card";
import { CollectionManager, type CollectionField } from "@/components/admin/collection-manager";

export const metadata: Metadata = { title: "Stats & figures" };

const GROUPS = [
  {
    group: "HERO_FACT",
    title: "Home hero — fact strip",
    description: "Shown under the hero buttons as “Label: Value”.",
    counted: false,
  },
  {
    group: "COOPERATIVE",
    title: "Home — “The Cooperative” stats",
    description: "Count-up figures next to the cooperative text.",
    counted: true,
  },
  {
    group: "VISION",
    title: "Home — “Our Vision” targets",
    description: "Count-up targets in the dark vision section.",
    counted: true,
  },
  { group: "ABOUT", title: "About — story stats", description: "Figures in the “Our Story” section.", counted: true },
] as const;

const fields = (counted: boolean): CollectionField[] => [
  {
    name: "value",
    label: "Value",
    required: true,
    hint: counted
      ? "Numbers animate on scroll (e.g. 2,000 or 20). Text or ranges like “4,000–5,000” are shown as-is."
      : undefined,
  },
  { name: "suffix", label: "Suffix", hint: "Appended directly after the value — include a space if needed, e.g. “ kg”, “+”, “ ha”." },
  { name: "label", label: "Label", required: true },
  ...(counted ? [{ name: "description", label: "Description (optional)", type: "textarea" as const }] : []),
];

export default async function StatsAdmin() {
  const stats = await db.stat.findMany({ where: { locale: "en" }, orderBy: { order: "asc" } });
  return (
    <>
      <PageHeader title="Stats & figures" description="Every number displayed across the site. Drag to reorder within a group." />
      <div className="space-y-6">
        {GROUPS.map((g) => (
          <CollectionManager
            key={g.group}
            collection="stats"
            title={g.title}
            description={g.description}
            items={stats.filter((s) => s.group === g.group)}
            titleKey="value"
            subtitleKey="label"
            fixed={{ group: g.group }}
            addLabel="Add stat"
            fields={fields(g.counted)}
          />
        ))}
      </div>
    </>
  );
}
