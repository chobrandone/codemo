import "server-only";
import { localDriver } from "./local";
import { s3Driver } from "./s3";
import type { StorageDriver } from "./types";

/** Selects the media storage backend from STORAGE_DRIVER ("local" | "s3"). */
export function getStorage(name = process.env.STORAGE_DRIVER || "local"): StorageDriver {
  return name === "s3" ? s3Driver : localDriver;
}

export type { StorageDriver };
