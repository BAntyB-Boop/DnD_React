"use client";

// One choice control inside a GameScene. "auto" choices are a single button;
// "roll" choices show the d20 strip once clicked — the flicker plays locally
// while /advance is in flight, then eases onto the server's real roll.
import { useState } from "react";
import { GameDiceRoll } from "@/views/game-dice-roll";
import { useGameStore } from "@/hooks/use-game-store";
import type { GameChoice } from "@/types/game";

export interface GameChoiceProps {
  choice: GameChoice;
  lang: "en" | "th";
  disabled: boolean;
}

export const GameChoiceButton = ({ choice, lang, disabled }: GameChoiceProps) => {
  const status = useGameStore((s) => s.status);
  const submitChoice = useGameStore((s) => s.submitChoice);
  const confirmAdvance = useGameStore((s) => s.confirmAdvance);
  const lastRoll = useGameStore((s) => s.lastRoll);
  const [armed, setArmed] = useState(false);

  const rolling = armed && status === "loading";
  const revealed = armed && status === "revealed";
  const label = lang === "en" ? choice.labelEn : choice.labelTh;

  const handleClick = () => {
    if (disabled) return;
    if (choice.type === "roll") setArmed(true);
    void submitChoice(choice.id, choice.type === "roll" ? choice.roll.dc : undefined);
  };

  if (choice.type === "roll" && armed) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-gold/30 bg-bg-card p-6">
        <p className="text-center text-sm text-ink/90">{label}</p>
        <GameDiceRoll
          rolling={rolling}
          result={lastRoll?.value ?? null}
          dc={choice.roll.dc}
          success={lastRoll?.success ?? null}
        />
        {revealed ? (
          <button
            type="button"
            onClick={() => confirmAdvance()}
            className="rounded-full bg-gold px-6 py-2 text-sm font-medium text-bg-deep hover:bg-gold-bright"
          >
            {lang === "en" ? "Continue" : "ไปต่อ"}
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="w-full rounded-lg border border-gold/30 bg-bg-card px-5 py-4 text-left text-sm text-ink/90 transition-colors hover:border-gold/60 hover:bg-bg-card-2 hover:text-gold disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
      {choice.type === "roll" ? (
        <span className="ml-2 text-xs uppercase tracking-[0.2em] text-ink-mute">
          {lang === "en" ? `Roll — DC ${choice.roll.dc}` : `ทอยลูกเต๋า — DC ${choice.roll.dc}`}
        </span>
      ) : null}
    </button>
  );
};
