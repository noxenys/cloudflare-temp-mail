import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import worker from "../src/worker";

const assetResponse = (body: string, contentType: string) =>
  new Response(body, {
    status: 200,
    headers: { "content-type": contentType }
  });

const env = {
  APP_NAME: "Lin Mail",
  PUBLIC_BASE_URL: "https://example.workers.dev",
  ASSETS: {
    fetch(request: Request) {
      const url = new URL(request.url);
      if (url.pathname === "/" || url.pathname === "/index.html") {
        return Promise.resolve(assetResponse("<html><body>public shell</body></html>", "text/html; charset=utf-8"));
      }

      if (url.pathname === "/admin.html") {
        return Promise.resolve(assetResponse("<html><body>admin shell</body></html>", "text/html; charset=utf-8"));
      }

      return Promise.resolve(new Response("missing", { status: 404 }));
    }
  }
} as Env;

describe("worker static routes", () => {
  it("returns 404 for /api boundary path", async () => {
    const response = await worker.fetch(new Request("https://example.workers.dev/api"), env);
    expect(response.status).toBe(404);
  });

  it("serves the public shell from assets", async () => {
    const response = await worker.fetch(new Request("https://example.workers.dev/"), env);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("public shell");
  });

  it("serves the admin shell from assets", async () => {
    const response = await worker.fetch(new Request("https://example.workers.dev/admin.html"), env);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("admin shell");
  });

  it("does not use static fallback for non-GET/HEAD requests", async () => {
    let assetFetchCalls = 0;
    const envWithCounter = {
      ...env,
      ASSETS: {
        fetch() {
          assetFetchCalls += 1;
          return Promise.resolve(new Response("unexpected", { status: 200 }));
        }
      }
    } as Env;

    const response = await worker.fetch(new Request("https://example.workers.dev/", { method: "POST" }), envWithCounter);
    expect(response.status).toBe(405);
    expect(assetFetchCalls).toBe(0);
  });
});

describe("static shell files", () => {
  it("index.html exists and references shared assets", async () => {
    const indexHtml = await readFile(new URL("../public/index.html", import.meta.url), "utf-8");
    expect(indexHtml).toContain('href="/styles.css"');
    expect(indexHtml).toContain('src="/app.js"');
  });

  it("admin.html exists and references shared assets", async () => {
    const adminHtml = await readFile(new URL("../public/admin.html", import.meta.url), "utf-8");
    expect(adminHtml).toContain('href="/styles.css"');
    expect(adminHtml).toContain('src="/app.js"');
  });
});
