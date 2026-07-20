// The only module allowed to talk to the SQLite driver directly for the game
// feature. Everything above this layer (API routes, engine) works with the
// SaveState shape — if the driver ever changes (see Step 0 in the plan), only
// this file's internals need to change.

import type { GodSlug } from "@/types/game";
import { getGameDb } from "./client";

export interface SaveState {
  currentSceneId: string;
  affinity: Record<GodSlug, number>;
  history: { sceneId: string; choiceId: string; roll?: number; success?: boolean }[];
  ended: boolean;
  endingGodSlug: GodSlug | null;
}

const EMPTY_AFFINITY: Record<GodSlug, number> = {
  "kestrel-ashvane": 0,
  "ozo-marrow": 0,
  "ren-solheim": 0,
  ashe: 0,
  "vahn-duskrail": 0,
  "mirae-songtide": 0,
  null: 0,
};

const INITIAL_SCENE_ID = "awakening";

interface SaveRow {
  player_id: number;
  current_scene_id: string;
  affinity_json: string;
  history_json: string;
  ended: number;
  ending_god_slug: string | null;
}

function rowToSaveState(row: SaveRow): SaveState {
  return {
    currentSceneId: row.current_scene_id,
    affinity: JSON.parse(row.affinity_json) as Record<GodSlug, number>,
    history: JSON.parse(row.history_json) as SaveState["history"],
    ended: row.ended === 1,
    endingGodSlug: (row.ending_god_slug as GodSlug | null) ?? null,
  };
}

function insertInitialSave(playerId: number): SaveState {
  const db = getGameDb();
  const initial: SaveState = {
    currentSceneId: INITIAL_SCENE_ID,
    affinity: { ...EMPTY_AFFINITY },
    history: [],
    ended: false,
    endingGodSlug: null,
  };
  db.prepare(
    `INSERT INTO saves (player_id, current_scene_id, affinity_json, history_json, ended, ending_god_slug)
     VALUES (@playerId, @currentSceneId, @affinityJson, @historyJson, 0, NULL)`,
  ).run({
    playerId,
    currentSceneId: initial.currentSceneId,
    affinityJson: JSON.stringify(initial.affinity),
    historyJson: JSON.stringify(initial.history),
  });
  return initial;
}

export function createPlayer(
  name: string,
  passcodeHash: string,
  passcodeSalt: string,
): { name: string; save: SaveState } {
  const db = getGameDb();
  const nameKey = name.trim().toLowerCase();

  const result = db
    .prepare(
      `INSERT INTO players (name, name_key, passcode_hash, passcode_salt)
       VALUES (@name, @nameKey, @passcodeHash, @passcodeSalt)`,
    )
    .run({ name, nameKey, passcodeHash, passcodeSalt });

  const save = insertInitialSave(Number(result.lastInsertRowid));
  return { name, save };
}

export function findPlayerAuth(
  nameKey: string,
): { id: number; name: string; passcodeHash: string; passcodeSalt: string } | null {
  const db = getGameDb();
  const row = db
    .prepare(
      `SELECT id, name, passcode_hash AS passcodeHash, passcode_salt AS passcodeSalt
       FROM players WHERE name_key = ?`,
    )
    .get(nameKey) as { id: number; name: string; passcodeHash: string; passcodeSalt: string } | undefined;
  return row ?? null;
}

export function getSave(playerId: number): SaveState {
  const db = getGameDb();
  const row = db.prepare(`SELECT * FROM saves WHERE player_id = ?`).get(playerId) as SaveRow | undefined;
  if (!row) return insertInitialSave(playerId);
  return rowToSaveState(row);
}

export function updateSave(playerId: number, next: SaveState): void {
  const db = getGameDb();
  db.prepare(
    `UPDATE saves SET
       current_scene_id = @currentSceneId,
       affinity_json = @affinityJson,
       history_json = @historyJson,
       ended = @ended,
       ending_god_slug = @endingGodSlug,
       updated_at = datetime('now')
     WHERE player_id = @playerId`,
  ).run({
    playerId,
    currentSceneId: next.currentSceneId,
    affinityJson: JSON.stringify(next.affinity),
    historyJson: JSON.stringify(next.history),
    ended: next.ended ? 1 : 0,
    endingGodSlug: next.endingGodSlug,
  });
}

export function resetSave(playerId: number): SaveState {
  const db = getGameDb();
  const fresh: SaveState = {
    currentSceneId: INITIAL_SCENE_ID,
    affinity: { ...EMPTY_AFFINITY },
    history: [],
    ended: false,
    endingGodSlug: null,
  };
  db.prepare(
    `UPDATE saves SET
       current_scene_id = @currentSceneId,
       affinity_json = @affinityJson,
       history_json = @historyJson,
       ended = 0,
       ending_god_slug = NULL,
       updated_at = datetime('now')
     WHERE player_id = @playerId`,
  ).run({
    playerId,
    currentSceneId: fresh.currentSceneId,
    affinityJson: JSON.stringify(fresh.affinity),
    historyJson: JSON.stringify(fresh.history),
  });
  return fresh;
}
