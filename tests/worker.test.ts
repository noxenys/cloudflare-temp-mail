import { describe, expect, it } from "vitest";
import worker from "../src/worker";

const env = {
  APP_NAME: "Lin Mail",
  PUBLIC_BASE_URL: "https://example.workers.dev"
} as Env;

describe("worker api", () => {
  it("returns health payload", async () => {
    const response = await worker.fetch(new Request("https://example.workers.dev/api/health"), env);
    expect(response.status).toBe(200);

    const body = (await response.json()) as { ok: boolean; now: string };
    expect(body.ok).toBe(true);
    expect(typeof body.now).toBe("string");
  });

  it("returns public config payload", async () => {
    const response = await worker.fetch(new Request("https://example.workers.dev/api/config"), env);
    expect(response.status).toBe(200);

    const body = (await response.json()) as { appName: string; publicBaseUrl: string };
    expect(body.appName).toBe("Lin Mail");
    expect(body.publicBaseUrl).toBe("https://example.workers.dev");
  });

  it("returns 404 for unknown api routes", async () => {
    const response = await worker.fetch(new Request("https://example.workers.dev/api/missing"), env);
    expect(response.status).toBe(404);
  });
});
