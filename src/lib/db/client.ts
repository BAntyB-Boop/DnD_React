// Singleton better-sqlite3 connection for the "Trial of the Seven" game DB.
// Cached on `globalThis` (same pattern as a singleton Prisma client) so
// Turbopack HMR re-evaluating this module in dev doesn't open a second file
// handle on every edit.
//
// The DDL is inlined (not read from schema.sql at runtime) because
// `__dirname` resolves to a Turbopack-virtualized path inside route-handler
// bundles, not the real filesystem location — reading the .sql file at
// runtime threw ENOENT in dev. schema.sql is kept alongside as the
// human-readable copy of this same DDL; keep the two in sync by hand.

import path from "node:path";
import fs from "node:fs";
import Database from "better-sqlite3";

import { getServerEnv } from "@/env";

const globalForGameDb = globalThis as unknown as {
  gameDb?: Database.Database;
};

const SCHEMA_DDL = `
CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  name_key TEXT NOT NULL UNIQUE,
  passcode_hash TEXT NOT NULL,
  passcode_salt TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS saves (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL UNIQUE REFERENCES players(id) ON DELETE CASCADE,
  current_scene_id TEXT NOT NULL,
  affinity_json TEXT NOT NULL,
  history_json TEXT NOT NULL,
  ended INTEGER NOT NULL DEFAULT 0,
  ending_god_slug TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

function createConnection(): Database.Database {
  const { GAME_DB_PATH } = getServerEnv();
  const dbPath = GAME_DB_PATH ?? path.join(process.cwd(), "data", "trial-of-seven.sqlite");

  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.exec(SCHEMA_DDL);

  return db;
}

export function getGameDb(): Database.Database {
  globalForGameDb.gameDb ??= createConnection();
  return globalForGameDb.gameDb;
}
