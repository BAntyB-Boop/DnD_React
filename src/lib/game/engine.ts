// Pure game logic — no DB, no HTTP. Route handlers call resolveChoice and
// persist the result via game-repository; this module only knows about
// content (storyGameContent) and the rules for advancing through it.

import { storyGameContent } from "@/data/mocks/story-game";
import type { GameChoiceOutcome, GodSlug } from "@/types/game";
import { rollD20 } from "./dice";

export const ENDING_SENTINEL = "__ending__";

export class SceneNotFoundError extends Error {
  constructor(sceneId: string) {
    super(`Scene not found: ${sceneId}`);
    this.name = "SceneNotFoundError";
  }
}

export class ChoiceNotFoundError extends Error {
  constructor(sceneId: string, choiceId: string) {
    super(`Choice not found: ${choiceId} (scene ${sceneId})`);
    this.name = "ChoiceNotFoundError";
  }
}

export interface ResolveChoiceResult {
  roll?: number;
  success?: boolean;
  outcome: GameChoiceOutcome;
  nextSceneId: string;
  newAffinity: Record<GodSlug, number>;
  ended: boolean;
  endingGodSlug: GodSlug | null;
}

function mergeAffinity(
  base: Record<GodSlug, number>,
  delta: Partial<Record<GodSlug, number>>,
): Record<GodSlug, number> {
  const next = { ...base };
  for (const [slug, value] of Object.entries(delta) as [GodSlug, number][]) {
    next[slug] = (next[slug] ?? 0) + value;
  }
  return next;
}

function resolveEndingGodSlug(affinity: Record<GodSlug, number>): GodSlug {
  let winner: GodSlug = storyGameContent.endings[0].godSlug;
  let winnerScore = affinity[winner] ?? 0;

  for (const ending of storyGameContent.endings) {
    const score = affinity[ending.godSlug] ?? 0;
    if (score > winnerScore) {
      winner = ending.godSlug;
      winnerScore = score;
    }
  }

  return winner;
}

export function resolveChoice(
  currentSceneId: string,
  choiceId: string,
  affinitySoFar: Record<GodSlug, number>,
): ResolveChoiceResult {
  const scene = storyGameContent.scenes.find((s) => s.id === currentSceneId);
  if (!scene) throw new SceneNotFoundError(currentSceneId);

  const choice = scene.choices.find((c) => c.id === choiceId);
  if (!choice) throw new ChoiceNotFoundError(currentSceneId, choiceId);

  let roll: number | undefined;
  let success: boolean | undefined;
  let outcome: GameChoiceOutcome;

  if (choice.type === "roll") {
    roll = rollD20();
    success = roll >= choice.roll.dc;
    outcome = success ? choice.roll.success : choice.roll.failure;
  } else {
    outcome = choice.outcome;
  }

  const newAffinity = mergeAffinity(affinitySoFar, outcome.affinity);
  const ended = choice.nextSceneId === ENDING_SENTINEL;
  const endingGodSlug = ended ? resolveEndingGodSlug(newAffinity) : null;

  return {
    roll,
    success,
    outcome,
    nextSceneId: choice.nextSceneId,
    newAffinity,
    ended,
    endingGodSlug,
  };
}
