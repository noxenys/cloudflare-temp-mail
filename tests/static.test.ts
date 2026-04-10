import { describe, expect, it } from "vitest";
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
});
