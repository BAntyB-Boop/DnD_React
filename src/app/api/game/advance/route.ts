import { z } from "zod";

import { ApiError, handle } from "@/lib/api";
import { verifyPasscode } from "@/lib/auth/passcode";
import { findPlayerAuth, getSave, updateSave } from "@/lib/db/game-repository";
import { ChoiceNotFoundError, resolveChoice, SceneNotFoundError } from "@/lib/game/engine";

const identity = {
  name: z.string().trim().min(2).max(24),
  passcode: z.string().min(4).max(6).regex(/^[A-Za-z0-9]+$/),
};

const advanceSchema = z.object({
  ...identity,
  sceneId: z.string().min(1),
  choiceId: z.string().min(1),
});

export const POST = handle(async (req) => {
  const input = advanceSchema.parse(await req.json());
  const nameKey = input.name.toLowerCase();

  const player = findPlayerAuth(nameKey);
  if (!player) throw new ApiError(404, "not_found", "No drifter found with that name.");

  if (!verifyPasscode(input.passcode, player.passcodeHash, player.passcodeSalt)) {
    throw new ApiError(401, "invalid_passcode", "Incorrect passcode.");
  }

  const save = getSave(player.id);
  if (save.currentSceneId !== input.sceneId) {
    throw new ApiError(409, "scene_mismatch", "Your save has moved on from that scene.");
  }

  let result;
  try {
    result = resolveChoice(input.sceneId, input.choiceId, save.affinity);
  } catch (error) {
    if (error instanceof SceneNotFoundError || error instanceof ChoiceNotFoundError) {
      throw new ApiError(400, "invalid_choice", "That choice is not available.");
    }
    throw error;
  }

  updateSave(player.id, {
    currentSceneId: result.nextSceneId,
    affinity: result.newAffinity,
    history: [
      ...save.history,
      { sceneId: input.sceneId, choiceId: input.choiceId, roll: result.roll, success: result.success },
    ],
    ended: result.ended,
    endingGodSlug: result.endingGodSlug,
  });

  return {
    roll: result.roll,
    success: result.success,
    narrativeEn: result.outcome.narrativeEn,
    narrativeTh: result.outcome.narrativeTh,
    affinityDelta: result.outcome.affinity,
    nextSceneId: result.nextSceneId,
    ended: result.ended,
    endingGodSlug: result.endingGodSlug,
  };
});
