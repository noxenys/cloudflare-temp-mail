import type { AppEnv } from "./env";
import { route } from "./router";

export default {
  async fetch(request: Request, env: AppEnv): Promise<Response> {
    return route(request, env);
  }
};
