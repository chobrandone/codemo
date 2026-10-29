import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { StorageDriver } from "./types";

let client: S3Client | null = null;
function s3() {
  if (!client) {
    client = new S3Client({
      region: process.env.S3_REGION || "auto",
      endpoint: process.env.S3_ENDPOINT || undefined,
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
      },
    });
  }
  return client;
}

/** S3-compatible object storage (Cloudflare R2, AWS S3, Backblaze, MinIO…). Used on Vercel. */
export const s3Driver: StorageDriver = {
  name: "s3",
  async put(key, body, contentType) {
    const bucket = process.env.S3_BUCKET;
    const base = process.env.S3_PUBLIC_URL;
    if (!bucket || !base) throw new Error("S3_BUCKET and S3_PUBLIC_URL must be set for the s3 storage driver.");
    await s3().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
    return `${base.replace(/\/$/, "")}/${key}`;
  },
  async delete(key) {
    await s3().send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }));
  },
};
