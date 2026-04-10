import { describe, expect, it } from "vitest";
import worker from "../src/worker";

const htmlFiles = import.meta.glob("../public/*.html", {
  eager: true,
  query: "?raw",
  import: "default"
}) as Record<string, string>;

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
    const response = await worker.fetch(new Request("https://example.workers.dev/", { method: "POST" }), env);
    expect(response.status).toBe(405);
  });
});

describe("static shell files", () => {
  it("index.html exists and references shared assets", async () => {
    const indexHtml = htmlFiles["../public/index.html"];
    expect(indexHtml).toBeDefined();
    expect(indexHtml).toContain('href="/styles.css"');
    expect(indexHtml).toContain('src="/app.js"');
  });

  it("admin.html exists and references shared assets", async () => {
    const adminHtml = htmlFiles["../public/admin.html"];
    expect(adminHtml).toBeDefined();
    expect(adminHtml).toContain('href="/styles.css"');
    expect(adminHtml).toContain('src="/app.js"');
  });
});
