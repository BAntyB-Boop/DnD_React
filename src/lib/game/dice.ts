import { randomInt } from "node:crypto";

export function rollD20(): number {
  return randomInt(1, 21);
}
