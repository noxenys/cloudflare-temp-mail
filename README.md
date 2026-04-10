# Cloudflare Temp Mail

Cloudflare Temp Mail is the Cloudflare Workers-based successor architecture for Lin Mail.

## Current Baseline

This repository now includes:

- TypeScript Worker entry and route layer (`src/worker.ts`, `src/router.ts`)
- Public static shells served via assets binding (`public/index.html`, `public/admin.html`, shared JS/CSS)
- API endpoints:
  - `GET /api/health`
  - `GET /api/config`
- Vitest coverage for API routing and static fallback behavior (`tests/worker.test.ts`, `tests/static.test.ts`)
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

## Deploy

```powershell
npm run deploy
```
