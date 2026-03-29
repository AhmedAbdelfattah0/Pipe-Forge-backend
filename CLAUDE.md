# PipeForge Backend

## Status
Fully implemented — Phases 1–7 complete.

## Stack
- Node.js 20 + Express 4 + TypeScript (ES2022, NodeNext modules)
- Handlebars (.hbs) templates for Azure DevOps pipeline YAML/JSON generation
- JSZip for ZIP bundle generation
- Supabase (Auth JWT verification + PostgreSQL + RLS)
- Zod for env var and request body validation
- Railway for hosting (via Dockerfile)

## Available Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with nodemon + tsx hot-reload |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm test` | Run Jest unit tests |
| `npm test:watch` | Jest in watch mode |
| `npm start` | Run compiled server (`node dist/index.js`) |
| `npm run start:prod` | Same but forces `NODE_ENV=production` |

## Structure

```
src/
  config/
    cors.ts                  — CORS options (reads FRONTEND_URL)
    env.ts                   — Zod-validated env vars; process exits on invalid config
    supabase.ts              — Supabase client (anon) + admin client (service role)
  database/
    migrations/              — Raw SQL files (001–005); run manually via Supabase dashboard
    types/
      database.types.ts      — Auto-generated Supabase DB type definitions
  features/
    auth/
      middleware/auth.middleware.ts   — Verifies Supabase JWT, attaches user to req
      models/auth.model.ts
      routes/auth.routes.ts           — GET /api/auth/me
    billing/
      middleware/plan-limiter.middleware.ts  — Enforces free-tier run limits
      repositories/subscription.repository.ts
      routes/billing.routes.ts              — GET /api/billing/subscription
    health/
      routes/health.routes.ts         — GET /api/health → {status, timestamp, environment}
    history/
      repositories/history.repository.ts
      routes/history.routes.ts        — GET /api/history, DELETE /api/history/:id
    pipelines/
      middleware/validate-config.middleware.ts  — Zod schema for GeneratorConfig
      models/
        generator-config.model.ts
        template-context.model.ts
      repositories/pipeline-run.repository.ts
      routes/pipeline.routes.ts       — POST /api/pipelines/generate
      services/
        combination.service.ts        — Builds all deploy-target combinations
        pipeline-generator.service.ts — Orchestrates template rendering per combination
        pipeline-zip.service.ts       — Packages rendered files into a ZIP buffer
        template.service.ts           — Loads/caches .hbs templates at startup via __dirname
      templates/                      — .hbs source files (copied to dist/ at Docker build time)
        build-pipeline.yaml.hbs
        build-pipeline.json.hbs
        release-appservice.json.hbs
        release-storage.json.hbs
        release-swa.json.hbs
        readme.md.hbs
  shared/
    middleware/
      error.middleware.ts      — Global Express error handler
      request-logger.middleware.ts
    types/
      express.d.ts             — Augments Express Request with `user` property
    utils/
      app-error.ts             — AppError class (message, statusCode, isOperational)
      async-handler.ts         — Wraps async route handlers to forward errors
  index.ts                     — Express app bootstrap; rate limiting; route mounting
tests/
  fixtures/                    — Shared test data
  unit/                        — Jest unit tests
```

## Key Architecture Decisions

- **Feature-based structure** — each domain (auth, pipelines, billing, history) is self-contained under `src/features/`.
- **Template resolution** — `template.service.ts` uses `__dirname` so templates must exist at `dist/features/pipelines/templates/` at runtime. The Dockerfile explicitly `COPY`s the `.hbs` files there after the TS compile step.
- **Fail-fast env validation** — `config/env.ts` calls `process.exit(1)` if any required env var is missing or malformed. This is imported first in `index.ts`.
- **Auth** — every route except `/api/health` is protected by `authMiddleware`, which verifies the Supabase JWT and attaches the `AuthUser` to `req.user`.
- **Rate limiting** — global 100 req/min on `/api`, plus tighter 10 req/min limits on `/api/pipelines/generate` and `/api/history`.
- **Error handling** — all async route handlers are wrapped in `asyncHandler`; unhandled errors bubble to `errorMiddleware` which distinguishes `AppError` (operational, returns HTTP status) from unexpected errors (returns 500).

## Environment Variables

All variables are validated by Zod at startup (`src/config/env.ts`).

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3001` | TCP port the server listens on |
| `NODE_ENV` | No | `development` | `development` / `production` / `test` |
| `SUPABASE_URL` | Yes | — | Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | — | Supabase anonymous (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | — | Supabase service-role key (admin ops) |
| `FRONTEND_URL` | No | `http://localhost:4200` | Allowed CORS origin |

## Deployment

- **Platform**: Railway
- **Config**: `railway.json` (Dockerfile builder, `/api/health` healthcheck, restart on failure)
- **Docker**: Multi-stage build — builder compiles TS; runner copies `dist/`, `node_modules`, `package.json`, and `.hbs` templates
- **CI**: GitHub Actions at `../.github/workflows/backend-ci.yml` (triggers on `PipeForge-backend/**` path changes)

## Key References
- PRD: ../PipeForge-Frontend/PRD.md
- Backend plan: ../.claude/plans/backend-plan.md
- Frontend GeneratorConfig type: ../PipeForge-Frontend/src/app/features/generator/models/
