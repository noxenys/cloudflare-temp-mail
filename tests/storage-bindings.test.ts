import { describe, expect, it } from "vitest";
import { getStorageBindings } from "../src/storage/bindings";

describe("storage binding contract", () => {
  it("throws when D1 is missing", () => {
    expect(() =>
      getStorageBindings({
        APP_NAME: "Lin Mail",
        CACHE_KV: {} as KVNamespace,
        MAIL_R2: {} as R2Bucket
      } as Env)
    ).toThrowError("Missing D1 binding: DB");
  });

  it("throws when R2 is missing", () => {
    expect(() =>
      getStorageBindings({
        APP_NAME: "Lin Mail",
        DB: {} as D1Database,
        CACHE_KV: {} as KVNamespace
      } as Env)
    ).toThrowError("Missing R2 binding: MAIL_R2");
  });

  it("throws when KV is missing", () => {
    expect(() =>
      getStorageBindings({
        APP_NAME: "Lin Mail",
        DB: {} as D1Database,
        MAIL_R2: {} as R2Bucket
      } as Env)
    ).toThrowError("Missing KV binding: CACHE_KV");
  });

  it("returns all bindings when present", () => {
    const env = {
      APP_NAME: "Lin Mail",
      DB: {} as D1Database,
      MAIL_R2: {} as R2Bucket,
      CACHE_KV: {} as KVNamespace
    } as Env;

    const bindings = getStorageBindings(env);
    expect(bindings.db).toBe(env.DB);
    expect(bindings.mailR2).toBe(env.MAIL_R2);
    expect(bindings.cacheKv).toBe(env.CACHE_KV);
  });
});
