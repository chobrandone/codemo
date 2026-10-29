export interface StorageDriver {
  readonly name: "local" | "s3";
  /** Store `body` under `key` and return the public URL. */
  put(key: string, body: Buffer, contentType: string): Promise<string>;
  delete(key: string): Promise<void>;
}
