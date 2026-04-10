import type { AppEnv } from "../env";

export type StorageBindings = {
  db: D1Database;
  mailR2: R2Bucket;
  cacheKv: KVNamespace;
};

export function getStorageBindings(env: AppEnv): StorageBindings {
  if (!env.DB) {
    throw new Error("Missing D1 binding: DB");
  }

  if (!env.MAIL_R2) {
    throw new Error("Missing R2 binding: MAIL_R2");
  }

  if (!env.CACHE_KV) {
    throw new Error("Missing KV binding: CACHE_KV");
  }

  return {
    db: env.DB,
    mailR2: env.MAIL_R2,
    cacheKv: env.CACHE_KV
  };
}
