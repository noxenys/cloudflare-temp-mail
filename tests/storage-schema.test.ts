import { describe, expect, it } from "vitest";
import { STORAGE_FOUNDATION_TABLES, storageFoundationSchema } from "../src/storage/schema";

describe("storage foundation schema", () => {
  it("lists the expected tables", () => {
    expect(STORAGE_FOUNDATION_TABLES).toEqual([
      "domains",
      "inbound_sources",
      "domain_inbound_bindings",
      "mailboxes",
      "messages",
      "attachments",
      "inbound_events"
    ]);
  });

  it("contains all expected create table statements", () => {
    for (const tableName of STORAGE_FOUNDATION_TABLES) {
      expect(storageFoundationSchema).toContain(`CREATE TABLE IF NOT EXISTS ${tableName}`);
    }
  });

  it("adds a unique address constraint for mailboxes", () => {
    expect(storageFoundationSchema).toContain("address TEXT NOT NULL UNIQUE");
  });

  it("adds a raw object key field for messages", () => {
    expect(storageFoundationSchema).toContain("raw_r2_key TEXT NOT NULL");
  });
});
