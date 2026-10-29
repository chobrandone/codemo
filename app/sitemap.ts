import type { MetadataRoute } from "next";
import { getActivities } from "@/lib/content";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const activities = await getActivities().catch(() => []);
  const now = new Date();
  const pages = ["", "/about", "/activities", "/contact"].map((p) => ({
    url: siteUrl(p || "/"),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  return [
    ...pages,
    ...activities.map((a) => ({
      url: siteUrl(`/activities/${a.slug}`),
      lastModified: new Date(a.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
