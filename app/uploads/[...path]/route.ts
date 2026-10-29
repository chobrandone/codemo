import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { uploadRoot } from "@/lib/storage/local";

// Serves files written by the "local" storage driver (VPS). In production Nginx
// can serve /uploads directly from the volume; this route is the fallback.
const TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
};

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await params;
  const root = uploadRoot();
  const file = path.resolve(root, ...parts);
  if (!file.startsWith(root + path.sep)) return new NextResponse("Not found", { status: 404 });
  try {
    const data = await fs.readFile(file);
    const type = TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream";
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        ...(type === "image/svg+xml" ? { "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'" } : {}),
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
