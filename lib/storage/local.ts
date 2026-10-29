import fs from "node:fs/promises";
import path from "node:path";
import type { StorageDriver } from "./types";

export function uploadRoot() {
  return path.resolve(process.env.UPLOAD_DIR || "./uploads");
}

function resolveKey(key: string) {
  const root = uploadRoot();
  const file = path.resolve(root, key);
  if (!file.startsWith(root + path.sep)) throw new Error("Invalid storage key");
  return file;
}

/** Writes to a persistent directory (Docker volume on the VPS); served at /uploads/*. */
export const localDriver: StorageDriver = {
  name: "local",
  async put(key, body) {
    const file = resolveKey(key);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, body);
    return `/uploads/${key}`;
  },
  async delete(key) {
    await fs.rm(resolveKey(key), { force: true });
  },
};
