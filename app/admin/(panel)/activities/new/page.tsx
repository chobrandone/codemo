import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ActivityForm } from "../activity-form";

export const metadata: Metadata = { title: "New activity" };

export default async function NewActivity() {
  const count = await db.activity.count({ where: { locale: "en" } });
  return <ActivityForm nextNumber={String(count + 1).padStart(2, "0")} />;
}
