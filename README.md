# Cloudflare Temp Mail

Cloudflare Temp Mail is the Cloudflare Workers-based successor architecture for Lin Mail.

## Current Baseline

This repository now includes:

- TypeScript Worker entry and route layer (`src/worker.ts`, `src/router.ts`)
- Public static shells served via assets binding (`public/index.html`, `public/admin.html`, shared JS/CSS)
- API endpoints:
  - `GET /api/health`
  - `GET /api/config`
- Worker storage foundation:
  - D1 binding (`DB`)
  - R2 binding (`MAIL_R2`)
  - KV binding (`CACHE_KV`)
  - initial D1 schema asset (`migrations/0001_storage_foundation.sql`)
  - deterministic R2 and KV key builders (`src/storage/keys.ts`)
- Vitest coverage for API routing, static fallback behavior, and storage foundation helpers
- Local scripts for development, deployment, tests, and type checking

The old Node/VPS implementation remains separate and unchanged.

## Local Development

Install dependencies:

```powershell
npm install
```

Run local Worker dev server:

```powershell
npm run dev
```

By default Wrangler serves the Worker locally (usually at `http://127.0.0.1:8787`).

## Verification Commands

Run automated tests:

```powershell
npm run test
```

Run TypeScript type check:

```powershell
npm run typecheck
```

## Storage Notes

- `PUBLIC_BASE_URL` is optional; when omitted, `/api/config` falls back to the request origin.
- D1 / R2 / KV bindings are part of the runtime contract now, but mailbox, message, and admin CRUD APIs land in later plans.
- `migrations/0001_storage_foundation.sql` is the first storage asset and should remain aligned with `src/storage/schema.ts`.

## Deploy

```powershell
npm run deploy
```
