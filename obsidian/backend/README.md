---
tags: [backend, stable]
updated: 2026-07-20
---

# Backend

`next16-claude-starter` is frontend-first, but it now has a server **API
layer**: Next.js Route Handlers under `src/app/api/`, and — as of the
`/story/game` feature — a real embedded database and a passcode-based identity
scheme scoped to that one feature.

## What exists

- **API endpoints** — `app/api/**/route.ts` Route Handlers. Convention and
  rules: [[api-architecture]].
- **Env validation** — `src/env.ts` (zod), public vs server-only split.
- **Shared API helpers** — `src/lib/api/` (`handle`, `ApiError`) and the
  client-side `src/lib/api-client.ts`.
- **Database** — SQLite (`better-sqlite3`), scoped to the game feature only.
  Schema, repository pattern, and rationale: [[database-schema]]. ADR-0026.
- **Identity (game only)** — name + short passcode, hashed with `node:crypto`
  scrypt (`src/lib/auth/passcode.ts`). Not a general auth system — no
  sessions/cookies, no login for the rest of the site.

## What does not exist yet

- A general-purpose ORM or auth system (the game's DB/identity layer is
  narrow and purpose-built — see [[database-schema]])
- Server Actions (the project default for mutations is still TBD — currently
  everything goes through `app/api`)

## When more backend is added

Add deps to [[tech-stack]], record an ADR in [[decisions-log]], update
[[data-flow]], add a [[changelog]] entry.

> [!tip] Deployment target — split by feature
> The **main site** targets **Vercel** (Route Handlers on Fluid Compute,
> Node.js runtime, no Edge). The **`/story/game` feature specifically**
> requires a persistent filesystem for its SQLite file — Vercel's serverless
> runtime can't host a writable file across requests/deploys — so it targets
> **Railway with a mounted persistent volume** instead (`GAME_DB_PATH` points
> at the volume; see [[environment-variables]]). This is a per-feature
> exception, not a change to the site's general deployment target: if a
> future feature needs a DB and doesn't need Railway specifically, prefer a
> Vercel-native managed database (e.g. Neon Postgres) over adding another
> file-based store. See ADR-0026 for the full reasoning.

## Related

[[api-architecture]] · [[database-schema]] · [[system-overview]] · [[tech-stack]] · [[environment-variables]]
