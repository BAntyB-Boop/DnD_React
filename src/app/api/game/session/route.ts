import { z } from "zod";

import { ApiError, handle } from "@/lib/api";
import { verifyPasscode } from "@/lib/auth/passcode";
import { findPlayerAuth, getSave } from "@/lib/db/game-repository";

const identity = {
  name: z.string().trim().min(2).max(24),
  passcode: z.string().min(4).max(6).regex(/^[A-Za-z0-9]+$/),
};

const sessionSchema = z.object(identity);

export const POST = handle(async (req) => {
  const input = sessionSchema.parse(await req.json());
  const nameKey = input.name.toLowerCase();

  const player = findPlayerAuth(nameKey);
  if (!player) throw new ApiError(404, "not_found", "No drifter found with that name.");

  if (!verifyPasscode(input.passcode, player.passcodeHash, player.passcodeSalt)) {
    throw new ApiError(401, "invalid_passcode", "Incorrect passcode.");
  }

  const save = getSave(player.id);
  return { player: { name: player.name }, save };
});
