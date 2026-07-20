"use client";

// Renders the current scene: bilingual title/body paragraphs, then its list
// of choices. The previous turn's narrative (if any) is shown above the
// scene body so a roll's outcome text isn't lost the instant the next scene
// replaces it.
import { GameChoiceButton } from "@/views/game-choice";
import { useGameStore } from "@/hooks/use-game-store";
import type { GameScene } from "@/types/game";

export interface GameSceneViewProps {
  scene: GameScene;
  lang: "en" | "th";
}

export const GameSceneView = ({ scene, lang }: GameSceneViewProps) => {
  const status = useGameStore((s) => s.status);
  const lastNarrative = useGameStore((s) => s.lastNarrative);
  const body = lang === "en" ? scene.bodyEn : scene.bodyTh;
  const title = lang === "en" ? scene.titleEn : scene.titleTh;

  return (
    <section aria-labelledby="game-scene-title" className="flex flex-col gap-8">
      {lastNarrative ? (
        <p className="rounded-lg border border-gold/20 bg-bg-card/60 px-5 py-4 text-sm italic leading-relaxed text-ink-mute">
          {lang === "en" ? lastNarrative.narrativeEn : lastNarrative.narrativeTh}
        </p>
      ) : null}

      <div className="flex flex-col gap-4">
        <h1 id="game-scene-title" className="text-3xl font-medium tracking-wide text-gold sm:text-4xl">
          {title}
        </h1>
        {body.map((p, i) => (
          <p key={i} className="text-base leading-relaxed text-ink/90">
            {p}
          </p>
        ))}
      </div>

      <div className="flex flex-col gap-3" role="group" aria-label={lang === "en" ? "Choices" : "ตัวเลือก"}>
        {scene.choices.map((choice) => (
          <GameChoiceButton
            key={choice.id}
            choice={choice}
            lang={lang}
            disabled={status === "loading" || status === "revealed"}
          />
        ))}
      </div>
    </section>
  );
};
