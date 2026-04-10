export type AppEnv = {
  APP_NAME?: string;
  PUBLIC_BASE_URL?: string;
  ASSETS?: Fetcher;
  DB?: D1Database;
  MAIL_R2?: R2Bucket;
  CACHE_KV?: KVNamespace;
};

declare global {
  interface Env extends AppEnv {}
}
