# Cloudflare Temp Mail

Cloudflare Temp Mail is the Workers-based successor architecture for Lin Mail.

Current status (Task 1 bootstrap only):

- repository initialized for the new Workers codebase
- TypeScript, Wrangler, and Vitest toolchain dependencies
- npm scripts scaffolded for `dev`, `deploy`, `test`, and `typecheck`

The old Node/VPS implementation stays separate and unchanged.

## Bootstrap

```powershell
npm install
```

## Next Tasks

`/api/health`, `/api/config`, Worker routing, static shells, and automated tests are implemented in follow-up tasks.
