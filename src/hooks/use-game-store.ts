// Client-side game state for "Trial of the Seven" (/story/game). First store
// in this repo whose actions call the network — everything else under hooks/
// is synchronous local state. Keep the async surface here (status/error) so
// views stay presentational per obsidian/frontend/component-conventions.md.
//
// SaveState is redeclared (not imported) from lib/db/game-repository.ts —
// that module pulls in better-sqlite3 at module scope, so even a type-only
// import risks a server-only module being resolved into the client bundle.
// The shape below must stay in sync with SaveState there.
import { create } from "zustand";

import { apiFetch, ApiClientError } from "@/lib/api-client";
import type { GodSlug } from "@/types/game";

// Must match FLICKER_MS in views/game-dice-roll.tsx — kept as a separate
// constant (not imported) so this hook doesn't depend on a view module.
const ROLL_REVEAL_HOLD_MS = 750;

export interface GameSaveState {
  currentSceneId: string;
  affinity: Record<GodSlug, number>;
  history: { sceneId: string; choiceId: string; roll?: number; success?: boolean }[];
  ended: boolean;
  endingGodSlug: GodSlug | null;
}

interface IdentityResponse {
  player: { name: string };
  save: GameSaveState;
}

interface AdvanceResponse {
  roll?: number;
  success?: boolean;
  narrativeEn: string;
  narrativeTh: string;
  affinityDelta: Partial<Record<GodSlug, number>>;
  nextSceneId: string;
  ended: boolean;
  endingGodSlug?: GodSlug;
}

export type GamePhase = "auth" | "playing" | "ending";
// "revealed" = a roll has landed and is on screen, waiting for the player to
// confirm before the scene advances — see `pendingAdvance` below.
export type GameStatus = "idle" | "loading" | "revealed" | "error";

export interface LastRoll {
  value: number;
  dc: number;
  success: boolean;
}

export interface LastNarrative {
  narrativeEn: string;
  narrativeTh: string;
}

interface GameStoreState {
  phase: GamePhase;
  status: GameStatus;
  error: string | null;
  playerName: string | null;
  /** Kept in memory only — re-sent with every advance/reset call, never persisted. */
  passcode: string | null;
  save: GameSaveState | null;
  lastRoll: LastRoll | null;
  lastNarrative: LastNarrative | null;
  /** Set instead of committing `save` directly when a roll just landed, so the
   *  dice UI can hold the settled number + success/failure on screen until the
   *  player confirms — see `confirmAdvance`. */
  pendingAdvance: { nextSave: GameSaveState } | null;
  createPlayer: (name: string, passcode: string) => Promise<void>;
  resumeSession: (name: string, passcode: string) => Promise<void>;
  /** `dc` is content the client already has (the choice's roll.dc) — the API
   *  doesn't echo it back, so it's threaded through for the dice-roll UI. */
  submitChoice: (choiceId: string, dc?: number) => Promise<void>;
  /** Commits a `pendingAdvance` once the player has seen the roll result. */
  confirmAdvance: () => void;
  resetGame: () => Promise<void>;
}

// Any request without a resolved identity (a stale double-submit, or a call
// racing a session that never finished) is a no-op rather than a thrown error.
function requireIdentity(name: string | null, passcode: string | null) {
  if (!name || !passcode) throw new Error("Not authenticated.");
  return { name, passcode };
}

function messageForError(error: unknown): string {
  if (error instanceof ApiClientError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  phase: "auth",
  status: "idle",
  error: null,
  playerName: null,
  passcode: null,
  save: null,
  lastRoll: null,
  lastNarrative: null,
  pendingAdvance: null,

  createPlayer: async (name, passcode) => {
    set({ status: "loading", error: null });
    try {
      const data = await apiFetch<IdentityResponse>("/api/game/players", {
        method: "POST",
        body: JSON.stringify({ name, passcode }),
      });
      set({
        status: "idle",
        phase: "playing",
        playerName: data.player.name,
        passcode,
        save: data.save,
      });
    } catch (error) {
      set({ status: "error", error: messageForError(error) });
    }
  },

  resumeSession: async (name, passcode) => {
    set({ status: "loading", error: null });
    try {
      const data = await apiFetch<IdentityResponse>("/api/game/session", {
        method: "POST",
        body: JSON.stringify({ name, passcode }),
      });
      set({
        status: "idle",
        phase: data.save.ended ? "ending" : "playing",
        playerName: data.player.name,
        passcode,
        save: data.save,
      });
    } catch (error) {
      set({ status: "error", error: messageForError(error) });
    }
  },

  submitChoice: async (choiceId, dc) => {
    const { save } = get();
    if (!save) return;
    const { name, passcode } = requireIdentity(get().playerName, get().passcode);

    const requestedAt = Date.now();
    set({ status: "loading", error: null });
    try {
      const data = await apiFetch<AdvanceResponse>("/api/game/advance", {
        method: "POST",
        body: JSON.stringify({
          name,
          passcode,
          sceneId: save.currentSceneId,
          choiceId,
        }),
      });

      const nextAffinity = { ...save.affinity };
      for (const [slug, delta] of Object.entries(data.affinityDelta) as [
        GodSlug,
        number,
      ][]) {
        nextAffinity[slug] = (nextAffinity[slug] ?? 0) + delta;
      }

      const nextSave: GameSaveState = {
        currentSceneId: data.nextSceneId,
        affinity: nextAffinity,
        history: [
          ...save.history,
          { sceneId: save.currentSceneId, choiceId, roll: data.roll, success: data.success },
        ],
        ended: data.ended,
        endingGodSlug: data.endingGodSlug ?? null,
      };

      const rolled = "roll" in data && data.roll !== undefined && data.success !== undefined;

      if (rolled) {
        // A fast (e.g. local) response can resolve well inside the dice
        // strip's flicker window — hold "loading" (still flickering, per
        // game-choice.tsx's `rolling` check) for the remainder of that
        // window so the roll the player just triggered is actually visible,
        // instead of jumping straight past it.
        const remaining = ROLL_REVEAL_HOLD_MS - (Date.now() - requestedAt);
        if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));

        set({
          status: "revealed",
          lastRoll: { value: data.roll as number, dc: dc ?? 0, success: data.success as boolean },
          lastNarrative: { narrativeEn: data.narrativeEn, narrativeTh: data.narrativeTh },
          pendingAdvance: { nextSave },
        });
        return;
      }

      set({
        status: "idle",
        save: nextSave,
        phase: data.ended ? "ending" : "playing",
        lastRoll: null,
        lastNarrative: { narrativeEn: data.narrativeEn, narrativeTh: data.narrativeTh },
      });
    } catch (error) {
      set({ status: "error", error: messageForError(error) });
    }
  },

  confirmAdvance: () => {
    const { pendingAdvance } = get();
    if (!pendingAdvance) return;
    const { nextSave } = pendingAdvance;
    set({
      status: "idle",
      save: nextSave,
      phase: nextSave.ended ? "ending" : "playing",
      pendingAdvance: null,
    });
  },

  resetGame: async () => {
    const { name, passcode } = requireIdentity(get().playerName, get().passcode);
    set({ status: "loading", error: null });
    try {
      const data = await apiFetch<IdentityResponse>("/api/game/reset", {
        method: "POST",
        body: JSON.stringify({ name, passcode }),
      });
      set({
        status: "idle",
        phase: "playing",
        playerName: data.player.name,
        save: data.save,
        lastRoll: null,
        lastNarrative: null,
      });
    } catch (error) {
      set({ status: "error", error: messageForError(error) });
    }
  },
}));
