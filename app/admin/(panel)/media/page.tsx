import type { Metadata } from "next";
import { listMedia } from "@/app/admin/actions/media";
import { PageHeader } from "@/components/ui/card";
import { MediaLibrary } from "./media-library";

export const metadata: Metadata = { title: "Media library" };

export default async function MediaPage() {
  const items = await listMedia();
  const driver = process.env.STORAGE_DRIVER === "s3" ? "S3-compatible bucket" : "local uploads folder";
  return (
    <>
      <PageHeader
        title="Media library"
        description={`Upload, describe and remove images. New uploads are resized (max 2400px), compressed to WebP and stored in the ${driver}.`}
      />
      <MediaLibrary initial={items} />
    </>
  );
}
