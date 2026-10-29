import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ActivityForm } from "../activity-form";

export const metadata: Metadata = { title: "Edit activity" };

export default async function EditActivity({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const activity = await db.activity.findUnique({ where: { id } });
  if (!activity) notFound();
  return <ActivityForm key={activity.updatedAt.toISOString()} activity={activity} />;
}
