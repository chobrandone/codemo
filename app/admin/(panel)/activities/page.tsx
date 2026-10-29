import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, PageHeader } from "@/components/ui/card";
import { ActivityList } from "./activity-list";

export const metadata: Metadata = { title: "Activities" };

export default async function ActivitiesAdmin() {
  const activities = await db.activity.findMany({
    where: { locale: "en" },
    orderBy: { order: "asc" },
    select: { id: true, title: true, slug: true, number: true, status: true, coverImage: true, published: true, showOnHome: true },
  });
  return (
    <>
      <PageHeader
        title="Activities"
        description="Each activity has its own page at /activities/[slug]. Activities marked “Home” appear in the home page cards."
        actions={
          <Button asChild>
            <Link href="/admin/activities/new">
              <Plus /> New activity
            </Link>
          </Button>
        }
      />
      <Card>
        <CardHeader title="All activities" description="Drag to reorder (affects the activities page, footer order is managed in Navigation)." />
        <ActivityList activities={activities} />
      </Card>
    </>
  );
}
