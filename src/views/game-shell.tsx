"use client";

// Owns the game's client-side phase switch (auth → playing → ending). Mounted
// once by GameView (a Server Component) so the route stays SSR-able while
// everything interactive lives in this leaf, per hard rule 6.
import { GameAuth } from "@/views/game-auth";
import { GameSceneView } from "@/views/game-scene";
import { GameEnding } from "@/views/game-ending";
import { StoryLanguageToggle } from "@/views/story-language-toggle";
import { useStoryLanguage } from "@/hooks/use-story-language";
import { useGameStore } from "@/hooks/use-game-store";
import type { StoryGameContent } from "@/types/game";

export interface GameShellProps {
  content: StoryGameContent;
}

export const GameShell = ({ content }: GameShellProps) => {
  const lang = useStoryLanguage((s) => s.lang);
  const phase = useGameStore((s) => s.phase);
  const save = useGameStore((s) => s.save);
  const playerName = useGameStore((s) => s.playerName);

  const scene = save ? content.scenes.find((s) => s.id === save.currentSceneId) : null;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 pb-24 pt-32 md:pt-40">
      <header className="flex flex-col items-center gap-4 text-center">
        <span className="text-xs uppercase tracking-[0.35em] text-gold-dim">
          {content.eyebrow}
        </span>
        <h1 className="text-4xl font-medium tracking-wide text-gold sm:text-5xl">
          {content.title}
        </h1>
        {phase === "auth" ? (
          <div className="flex max-w-xl flex-col gap-3 text-ink-mute">
            {(lang === "en" ? content.introEn : content.introTh).map((p, i) => (
              <p key={i} className="text-base leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        ) : null}
        <div className="mt-2 flex items-center gap-4">
          {playerName ? (
            <span className="text-sm text-ink-mute">
              {lang === "en" ? `Drifter: ${playerName}` : `ผู้ล่องลอย: ${playerName}`}
            </span>
          ) : null}
          <StoryLanguageToggle />
        </div>
      </header>

      {phase === "auth" ? <GameAuth lang={lang} /> : null}

      {phase === "playing" && scene ? <GameSceneView scene={scene} lang={lang} /> : null}

      {phase === "ending" ? <GameEnding lang={lang} /> : null}
    </div>
  );
};
