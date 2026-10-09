# oxzoo-vue-vite

Deployed with [ox](https://deploywithox.com): deploy a repo to your own server with one command, no Docker. [Docs](https://deploywithox.com/docs) · [Guide for this stack](https://deploywithox.com/docs/guides/node)

An [ox](https://deploywithox.com) deploy example: a Vue 3 SPA (Vite 5) with an Express 4 API and npm, deployed to your own Ubuntu server. systemd runs Express, and Caddy serves the built SPA with an `index.html` fallback while sending only `/api` and `/health` to Express, so one variable powers both halves of the demo.

## Stack

| Layer | Tool | Version |
| ----- | ---- | ------- |
| Frontend | Vue | 3.5 |
| Bundler | Vite | 5 |
| API | Express | 4 |
| Package manager | npm | `package-lock.json` is committed |
| Runtime | Node.js | 24 (ox's default; mise installs it) |

## ox.toml

```toml
# Express API + Vue 3 SPA with npm.

[app]
health = "/health"

[static]
dir = "dist"
spa = true
api = ["/api", "/health"]
```

ox detects `npm ci` from `package-lock.json`, and `npm run build` and `npm run start` (`node server/index.js`) from `package.json`.

## Environment flow

1. **Run time (API):** `server/index.js` reads `process.env.GREETING_TAG` on every `GET /api/greeting` and returns `hello world oxzoo-vue-vite_<GREETING_TAG>`.
2. **Build time (SPA):** `vite.config.js` sets `envPrefix: ["GREETING_", "VITE_"]`, so `client/src/App.vue` reads `import.meta.env.GREETING_TAG` and Vite bakes it into `dist/`.

ox sets your variables before the build, and changing one with `ox vars set` redeploys, which rebuilds the SPA.

## Deploy with ox

```sh
curl -fsSL https://deploywithox.com/install.sh | sh
ox login
ox new https://github.com/saurav-codes/oxzoo-vue-vite
printf 'GREETING_TAG=demo\n' | ox review oxzoo-vue-vite --from-file - --wait
```

The plan, offline:

```console
$ ox check .
ox check . (manifest: ox.toml)

  app.start                  npm run start                                        detected:package.json
  app.health                 /health                                              declared
  static.dir                 dist                                                 declared
  static.spa                 true                                                 declared
  static.api                 /api, /health                                        declared
  build.install              npm ci                                               detected:package-lock.json
  build.commands[0]          npm run build                                        detected:package.json
  tools.node                 24                                                   default

  Provided by ox: PORT, HOST, OX_ENV, OX_PROJECT, OX_RELEASE, OX_DATA_DIR, PUBLIC_URL, PUBLIC_HOST
  Set on the dashboard before the first deploy: GREETING_TAG

Ready to deploy.
```

## Expected output

```
oxzoo-vue-vite
frontend: hello world oxzoo-vue-vite_<GREETING_TAG>
backend: hello world oxzoo-vue-vite_<GREETING_TAG>
```

## Local development

```sh
npm ci
GREETING_TAG=localtest npm run build
GREETING_TAG=localtest PORT=9103 node server/index.js
```
