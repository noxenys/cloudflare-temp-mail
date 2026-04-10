import type { AppEnv } from "./env";
import { handleHealth } from "./handlers/health";
import { handleConfig } from "./handlers/config";
import { handleStatic } from "./handlers/static";
import { json } from "./responses";

export async function route(request: Request, env: AppEnv): Promise<Response> {
  const url = new URL(request.url);
  const isApiRoute = url.pathname === "/api" || url.pathname.startsWith("/api/");

  if (request.method === "GET" && url.pathname === "/api/health") {
    return handleHealth();
  }

  if (request.method === "GET" && url.pathname === "/api/config") {
    return handleConfig(request, env);
  }

  if (isApiRoute) {
    return json({ error: "Route not found." }, { status: 404 });
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return json({ error: "Method not allowed." }, { status: 405 });
  }

  return handleStatic(request, env);
}
