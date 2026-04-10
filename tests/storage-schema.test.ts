import { describe, expect, it } from "vitest";
import migrationSqlAsset from "../migrations/0001_storage_foundation.sql?raw";
import { STORAGE_FOUNDATION_TABLES, storageFoundationSchema } from "../src/storage/schema";

function normalizeSql(sql: string): string {
  return sql.replace(/\r\n/g, "\n").trim();
}

type SmokeTestDatabase = {
  exec(sql: string): Array<{ values: unknown[][] }>;
  run(sql: string): void;
};

type SqlJsModule = {
  Database: new () => SmokeTestDatabase;
};

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

  it("keeps the schema source aligned with the SQL migration asset", () => {
    expect(normalizeSql(storageFoundationSchema)).toBe(normalizeSql(migrationSqlAsset));
  });

  it("executes the SQL migration asset and enforces the mailbox address uniqueness constraint", async () => {
    // @ts-expect-error sql.js does not ship bundled TS declarations; runtime coverage lives in this smoke test.
    const initSqlJs = (await import("sql.js")).default as () => Promise<SqlJsModule>;
    const SQL = await initSqlJs();
    const db = new SQL.Database();

    db.exec(migrationSqlAsset);

    const tables = db.exec(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
      ORDER BY name
    `);

    expect(tables[0]?.values.map((row) => String(row[0]))).toEqual([...STORAGE_FOUNDATION_TABLES].sort());

    db.run(`
      INSERT INTO mailboxes (
        id,
        alias,
        domain_id,
        address,
        token_hash,
        status,
        source_type,
        created_at,
        updated_at,
        expires_at
      ) VALUES (
        'mbx_1',
        'alpha',
        'dom_1',
        'alpha@example.com',
        'hash_1',
        'active',
        'system',
        '2026-04-11T00:00:00.000Z',
        '2026-04-11T00:00:00.000Z',
        '2026-04-12T00:00:00.000Z'
      )
    `);

    expect(() =>
      db.run(`
        INSERT INTO mailboxes (
          id,
          alias,
          domain_id,
          address,
          token_hash,
          status,
          source_type,
          created_at,
          updated_at,
          expires_at
        ) VALUES (
          'mbx_2',
          'beta',
          'dom_1',
          'alpha@example.com',
          'hash_2',
          'active',
          'system',
          '2026-04-11T00:00:00.000Z',
          '2026-04-11T00:00:00.000Z',
          '2026-04-12T00:00:00.000Z'
        )
      `)
    ).toThrow(/UNIQUE constraint failed: mailboxes\.address/);
  });
});
