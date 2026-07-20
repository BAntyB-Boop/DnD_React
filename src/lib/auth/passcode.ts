// Passcode hashing for game players — scrypt via node:crypto, deliberately
// not bcrypt/argon2, to avoid stacking a second native dependency on top of
// the SQLite driver (see decisions-log.md ADR for the DB driver choice).

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

export function hashPasscode(passcode: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(passcode, salt, KEY_LENGTH).toString("hex");
  return { hash, salt };
}

export function verifyPasscode(passcode: string, hash: string, salt: string): boolean {
  const candidate = scryptSync(passcode, salt, KEY_LENGTH);
  const stored = Buffer.from(hash, "hex");
  if (candidate.length !== stored.length) return false;
  return timingSafeEqual(candidate, stored);
}
