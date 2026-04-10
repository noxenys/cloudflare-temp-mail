import { json } from "../responses";

export function handleHealth(): Response {
  return json({
    ok: true,
    now: new Date().toISOString()
  });
}
