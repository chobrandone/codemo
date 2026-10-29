import type { Metadata } from "next";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/card";
import { CollectionManager } from "@/components/admin/collection-manager";

export const metadata: Metadata = { title: "Navigation" };

const LOCATIONS = [
  { location: "HEADER", title: "Header menu", description: "Main navigation. The “Partner With Us” button always links to /contact." },
  { location: "FOOTER_QUICK", title: "Footer — Quick Links", description: "First link column in the footer." },
  { location: "FOOTER_ACTIVITIES", title: "Footer — Activities", description: "Second link column in the footer." },
] as const;

export default async function NavigationAdmin() {
  const links = await db.navLink.findMany({ where: { locale: "en" }, orderBy: { order: "asc" } });
  return (
    <>
      <PageHeader title="Navigation & footer links" description="Use paths like /about, anchors like /#projects, or full https:// URLs." />
      <div className="space-y-6">
        {LOCATIONS.map((l) => (
          <CollectionManager
            key={l.location}
            collection="nav"
            flag="visible"
            title={l.title}
            description={l.description}
            items={links.filter((n) => n.location === l.location)}
            titleKey="label"
            subtitleKey="href"
            fixed={{ location: l.location }}
            addLabel="Add link"
            fields={[
              { name: "label", label: "Label", required: true },
              { name: "href", label: "Link", required: true, placeholder: "/contact" },
            ]}
          />
        ))}
      </div>
    </>
  );
}
