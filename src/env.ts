export type AppEnv = {
  APP_NAME?: string;
  PUBLIC_BASE_URL?: string;
  ASSETS?: Fetcher;
};

declare global {
  interface Env extends AppEnv {}
}
