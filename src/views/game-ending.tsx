"use client";

// Result screen for "Trial of the Seven". Cross-references the ending god in
// two places, neither duplicating the other: storyGameContent.endings for the
// game's own epilogue text, and pantheonContent.gods for the god's portrait +
// epithet (matched by slug) — same no-duplication principle god-details.tsx
// uses when it pulls prose from story.ts by chapterId instead of re-authoring it.
import Image from "next/image";
import Link from "next/link";
import { useGameStore } from "@/hooks/use-game-store";
import { storyGameContent } from "@/data/mocks/story-game";
import { pantheonContent } from "@/data/mocks/pantheon";

export interface GameEndingProps {
  lang: "en" | "th";
}

export const GameEnding = ({ lang }: GameEndingProps) => {
  const save = useGameStore((s) => s.save);
  const status = useGameStore((s) => s.status);
  const resetGame = useGameStore((s) => s.resetGame);

  const endingGodSlug = save?.endingGodSlug;
  const ending = storyGameContent.endings.find((e) => e.godSlug === endingGodSlug);
  const god = pantheonContent.gods.find((g) => g.slug === endingGodSlug);

  if (!ending) {
    return (
      <p className="text-center text-ink-mute">
        {lang === "en" ? "No ending recorded yet." : "ยังไม่มีผลลัพธ์"}
      </p>
    );
  }

  const title = lang === "en" ? ending.titleEn : ending.titleTh;
  const epilogue = lang === "en" ? ending.epilogueEn : ending.epilogueTh;

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
      {god ? (
        <div
          className="overflow-hidden rounded-lg border"
          style={{
            borderColor: `${god.accent}4d`,
            boxShadow: `0 32px 64px -32px ${god.accent}59`,
          }}
        >
          <Image
            src={god.portrait}
            alt={`${god.name}, ${god.epithetEn}`}
            width={1086}
            height={1448}
            sizes="(max-width: 768px) 90vw, 320px"
            className="h-auto w-[min(60vw,320px)]"
          />
        </div>
      ) : null}

      {god ? (
        <span
          className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]"
          style={{
            color: god.accent,
            borderColor: `${god.accent}4d`,
            background: `${god.accent}1a`,
          }}
        >
          {lang === "en" ? god.epithetEn : god.epithetTh}
        </span>
      ) : null}

      <h1 className="text-3xl font-medium tracking-wide text-gold sm:text-4xl">{title}</h1>
      <p className="max-w-xl text-lg leading-relaxed text-ink/90">{epilogue}</p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {god ? (
          <Link
            href={`/pantheon/${god.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-bg-deep shadow-sm hover:bg-gold-bright"
          >
            {lang === "en" ? `Read more about ${god.name}` : `อ่านเพิ่มเติมเกี่ยวกับ ${god.name}`}
            <span aria-hidden="true">→</span>
          </Link>
        ) : null}
        <Link
          href="/story"
          className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3 text-sm text-gold hover:bg-gold hover:text-bg-deep"
        >
          {lang === "en" ? "Back to the Chronicle" : "กลับสู่ตำนาน"}
        </Link>
        <button
          type="button"
          onClick={() => void resetGame()}
          disabled={status === "loading"}
          className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3 text-sm text-gold hover:bg-gold hover:text-bg-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {lang === "en" ? "Play again" : "เล่นอีกครั้ง"}
        </button>
      </div>
    </div>
  );
};
