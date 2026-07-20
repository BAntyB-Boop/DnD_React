---
tags: [backend, database, stable]
updated: 2026-07-20
---

# Database Schema

The site's only database, added for the `/story/game` feature ("Trial of the
Seven"). ADR: [[decisions-log]] ADR-0026. Scope: **this feature only** — no
other part of the site reads or writes this DB.

## Driver: `better-sqlite3`

A single SQLite file, not a hosted database. Chosen and validated over the
planned `@libsql/client` fallback: `better-sqlite3` installed a **prebuilt**
native binary on the target stack (no `node-gyp` compile step) and worked
under both `next dev` (Turbopack) and `next build && next start` without
requiring changes beyond `serverExternalPackages: ["better-sqlite3"]` in
`next.config.ts` (added defensively for the production/Railway target).

This is why the feature deploys to **Railway with a persistent volume**
rather than Vercel — see the deployment note in [[backend/README]].

## Tables

```sql
CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  name_key TEXT NOT NULL UNIQUE,        -- trim + lowercase of `name`, the real lookup key
  passcode_hash TEXT NOT NULL,
  passcode_salt TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS saves (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL UNIQUE REFERENCES players(id) ON DELETE CASCADE,
  current_scene_id TEXT NOT NULL,       -- "awakening" | a GodSlug | "__ending__"
  affinity_json TEXT NOT NULL,          -- JSON Record<GodSlug, number>
  history_json TEXT NOT NULL,           -- JSON array of past turns
  ended INTEGER NOT NULL DEFAULT 0,
  ending_god_slug TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

One save per player (`player_id UNIQUE`) — a player has exactly one
in-progress or finished playthrough at a time; `/api/game/reset` rewrites it
in place rather than creating a new row.

> [!note] DDL is duplicated, on purpose
> The DDL above (and in `src/lib/db/schema.sql`, the human-readable copy) is
> **inlined as a template string** in `src/lib/db/client.ts`, not read from
> the `.sql` file at runtime — `__dirname` resolves to a Turbopack-virtualized
> path inside route-handler bundles, and reading the file at runtime threw
> `ENOENT`. The two copies must be kept in sync by hand. There is no migration
> framework (v1 limitation, matching the site's otherwise-static content
> model) — a schema change means editing both copies and manually migrating
> any existing `.sqlite` file.

## Identity: name + passcode, not accounts

A player is identified by `name` + a 4–6 character alphanumeric passcode
chosen at creation (`/api/game/players`), letting them resume the same save
from any device via `/api/game/session`. This is deliberately **not** a
general auth system — no cookies/sessions, no login for the rest of the site.

- Passcode hashing: `src/lib/auth/passcode.ts`, Node's built-in `node:crypto`
  `scrypt` + `randomBytes`/`timingSafeEqual` — chosen specifically to avoid
  stacking a second native dependency (bcrypt/argon2) on top of the
  already-native `better-sqlite3`.
- **Known tradeoff:** a 4–6 char alnum passcode has low entropy (as few as
  ~1.7M combinations at 4 chars). Hashing defends the DB-at-rest, not a
  targeted online guessing attack. No rate limiting exists yet on
  `/api/game/session` / `/api/game/advance` — documented follow-up, not
  implemented in v1.

## Access pattern: one repository module, nothing else touches the driver

`src/lib/db/game-repository.ts` is the **only** file that imports the SQLite
driver or writes SQL. Everything above it — API routes, `src/lib/game/engine.ts`
— works only with the `SaveState` shape it exports:

```ts
export interface SaveState {
  currentSceneId: string;
  affinity: Record<GodSlug, number>;
  history: { sceneId: string; choiceId: string; roll?: number; success?: boolean }[];
  ended: boolean;
  endingGodSlug: GodSlug | null;
}

createPlayer(name, passcodeHash, passcodeSalt): { name; save }
findPlayerAuth(nameKey): { id; name; passcodeHash; passcodeSalt } | null
getSave(playerId): SaveState
updateSave(playerId, next): void
resetSave(playerId): SaveState
```

This boundary exists so a future move to a hosted database (Postgres via
Neon, if the feature ever needs to leave Railway) only requires rewriting
`src/lib/db/client.ts` + `game-repository.ts` — no changes to routes, the
game engine, or the client.

## Related

[[backend/README]] · [[api-architecture]] · [[environment-variables]] · [[decisions-log]]
