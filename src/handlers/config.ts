import type { AppEnv } from "../env";
import { json } from "../responses";

export function handleConfig(env: AppEnv): Response {
  return json({
    appName: env.APP_NAME ?? "Lin Mail",
    publicBaseUrl: env.PUBLIC_BASE_URL ?? ""
  });
}
