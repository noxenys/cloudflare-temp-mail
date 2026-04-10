import type { AppEnv } from "../env";

export async function handleStatic(request: Request, env: AppEnv): Promise<Response> {
  if (!env.ASSETS) {
    return new Response("Assets binding is not configured.", { status: 500 });
  }

  return env.ASSETS.fetch(request);
}
