import type { AppEnv } from "./env";
import { handleHealth } from "./handlers/health";
import { handleConfig } from "./handlers/config";
import { handleStatic } from "./handlers/static";
import { json } from "./responses";

export async function route(request: Request, env: AppEnv): Promise<Response> {
  const url = new URL(request.url);

  if (request.method === "GET" && url.pathname === "/api/health") {
    return handleHealth();
  }

  if (request.method === "GET" && url.pathname === "/api/config") {
    return handleConfig(env);
  }

  if (url.pathname.startsWith("/api/")) {
    return json({ error: "Route not found." }, { status: 404 });
  }

  return handleStatic(request, env);
}
