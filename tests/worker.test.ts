import { describe, expect, it } from "vitest";
import worker from "../src/worker";

const baseEnv = {
  APP_NAME: "Lin Mail"
} as Env;

const envWithPublicBaseUrl = {
  ...baseEnv,
  PUBLIC_BASE_URL: "https://override.workers.dev"
} as Env;

describe("worker api", () => {
  it("returns health payload", async () => {
    const response = await worker.fetch(new Request("https://example.workers.dev/api/health"), baseEnv);
    expect(response.status).toBe(200);

    const body = (await response.json()) as { ok: boolean; now: string };
    expect(body.ok).toBe(true);
    expect(typeof body.now).toBe("string");
  });

  it("returns request origin as publicBaseUrl by default", async () => {
    const response = await worker.fetch(new Request("https://local.dev/api/config"), baseEnv);
    expect(response.status).toBe(200);

    const body = (await response.json()) as { appName: string; publicBaseUrl: string };
    expect(body.appName).toBe("Lin Mail");
    expect(body.publicBaseUrl).toBe("https://local.dev");
  });

  it("returns PUBLIC_BASE_URL when explicitly provided", async () => {
    const response = await worker.fetch(
      new Request("https://local.dev/api/config"),
      envWithPublicBaseUrl
    );
    expect(response.status).toBe(200);

    const body = (await response.json()) as { appName: string; publicBaseUrl: string };
    expect(body.publicBaseUrl).toBe("https://override.workers.dev");
  });

  it("returns 404 for unknown api routes", async () => {
    const response = await worker.fetch(new Request("https://example.workers.dev/api/missing"), baseEnv);
    expect(response.status).toBe(404);
  });
});
