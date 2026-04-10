# Cloudflare Temp Mail

Cloudflare Temp Mail is the Workers-based successor architecture for Lin Mail.

This repository starts with:

- a Cloudflare Worker HTTP shell
- public and admin static pages
- `/api/health`
- `/api/config`
- automated baseline tests

The old Node/VPS implementation stays separate and unchanged.

## Development

```powershell
npm install
npm run test
npm run typecheck
npm run dev
```
