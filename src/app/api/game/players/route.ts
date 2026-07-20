import { z } from "zod";

import { ApiError, handle } from "@/lib/api";
import { hashPasscode } from "@/lib/auth/passcode";
import { createPlayer, findPlayerAuth } from "@/lib/db/game-repository";

// Shared identity fragment — duplicated (not extracted to a shared module)
// across the four game routes per the API convention: lift only once a
// second consumer needs it verbatim from one place. Each route composes it
// differently (players/session omit sceneId/choiceId; advance adds them).
const identity = {
  name: z.string().trim().min(2).max(24),
  passcode: z.string().min(4).max(6).regex(/^[A-Za-z0-9]+$/),
};

const playersSchema = z.object(identity);

export const POST = handle(async (req) => {
  const input = playersSchema.parse(await req.json());
  const nameKey = input.name.toLowerCase();

  if (findPlayerAuth(nameKey)) {
    throw new ApiError(409, "name_taken", "That name is already in use.");
  }

  const { hash, salt } = hashPasscode(input.passcode);
  const { name, save } = createPlayer(input.name, hash, salt);

  return { player: { name }, save };
});
