import type { AppEnv } from "../env";
import { json } from "../responses";

export function handleConfig(request: Request, env: AppEnv): Response {
  const requestOrigin = new URL(request.url).origin;

  return json({
    appName: env.APP_NAME ?? "Lin Mail",
    publicBaseUrl: env.PUBLIC_BASE_URL ?? requestOrigin
  });
}
