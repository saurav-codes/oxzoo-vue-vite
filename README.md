# oxzoo-vue-vite

This repo is the official ox example for a Vue 3 SPA built with Vite plus a small Express 4 API on one Ubuntu VPS: ox runs `npm ci` and `npm run build`, starts the API on `127.0.0.1:9103` under systemd, and nginx serves the built `dist/` folder while proxying only `/api` and `/health` to it. One env var, `GREETING_TAG`, flows through the stack twice, once at runtime (Express reads it per request) and once at build time (Vite bakes it into the SPA bundle), so the deployed page demonstrates both env paths ox supports.

## Stack

| Piece | Choice | Where |
|---|---|---|
| Frontend | Vue 3 + Vite 5 | `client/`, built to `dist/` |
| API | Express 4 | `server/index.js` |
| Package manager | npm | `package-lock.json` committed |
| Node | 22 via NodeSource apt source | `[[apt_sources]]` in `ox.toml` |
| Edge | nginx (managed by ox) | serves `dist/`, proxies `/api` and `/health` |

## Environment flow

One variable, two paths:

- **Runtime (API)**: `server/index.js` reads `process.env.GREETING_TAG` on every `GET /api/greeting` and answers `hello world oxzoo-vue-vite_{GREETING_TAG}` as `text/plain`.
- **Build time (SPA)**: `vite.config.js` sets `envPrefix: ["GREETING_", "VITE_"]`, so the same variable is exposed to the app as `import.meta.env.GREETING_TAG` and baked into the bundle when `npm run build` runs. Changing it later requires a rebuild (a redeploy does that).

Set `GREETING_TAG` in the ox Environment editor BEFORE the first deploy, so both the API process and the build see it.

## Deploy with ox

1. Paste the clone URL `https://github.com/saurav-codes/oxzoo-vue-vite.git` into the ox dashboard.
2. In the Environment editor, add `GREETING_TAG` (any short tag, for example `v1`) before the first deploy.
3. Press Deploy. ox installs deps (`npm ci`), builds the SPA (`npm run build`), starts `node server/index.js`, and polls `http://127.0.0.1:9103/health` until ready.

nginx serves `dist/` from the current release with an `index.html` fallback (SPA mode) and proxies only `/api` and `/health` to the Express process.

## Expected output

With `GREETING_TAG=<GREETING_TAG>` set in ox, the page shows the project heading plus:

```
frontend: hello world oxzoo-vue-vite_<GREETING_TAG>
backend: hello world oxzoo-vue-vite_<GREETING_TAG>
```

## Local check

```bash
GREETING_TAG=localtest npm install
GREETING_TAG=localtest npm run build   # bakes the tag into dist/
GREETING_TAG=localtest npm start       # API on http://127.0.0.1:9103
```

The API itself answers only `/api/greeting` and `/health`; serving `dist/` is nginx's job on the VPS.
