"use client";

// One chronicle chapter — a numbered header (roman numeral + bilingual title,
// per-letter reveal via <AnimatedHeading>), then prose/list/image blocks in
// reading order, switching language with the shared useStoryLanguage store.
// The whole section soft-reveals once on scroll via <Inview> (no CSS keyframes,
// per the animation-system hard rule).
import Image from "next/image";
import { Inview } from "@/components/animation/springs/in-view";
import { AnimatedHeading } from "@/components/common/animated-heading";
import { useStoryLanguage } from "@/hooks/use-story-language";
import type { StoryChapter } from "@/data/mocks/story";

export interface StoryChapterProps {
  chapter: StoryChapter;
}

const REVEAL = {
  from: { opacity: 0, y: 28 },
  to: { opacity: 1, y: 0 },
  config: { tension: 200, friction: 28 },
};

export const StoryChapterSection = ({ chapter }: StoryChapterProps) => {
  const lang = useStoryLanguage((s) => s.lang);
  const title = lang === "en" ? chapter.titleEn : chapter.titleTh;
  const accent = chapter.accent;

  return (
    <Inview
      tag="section"
      id={chapter.id}
      mode="once"
      from={REVEAL.from}
      to={REVEAL.to}
      config={REVEAL.config}
      style={{ borderTopColor: `${accent}4d` }}
      className="relative border-t py-16 first:border-t-0 first:pt-0"
    >
      <div className="mb-8 flex items-baseline justify-between gap-6">
        <div>
          <span
            className="block text-xs uppercase tracking-[0.35em]"
            style={{ color: accent }}
          >
            {chapter.number}
          </span>
          <AnimatedHeading
            as="h2"
            className="mt-2 text-3xl font-medium tracking-wide text-gold sm:text-4xl"
          >
            {title}
          </AnimatedHeading>
        </div>
        <span
          aria-hidden="true"
          className="font-heading text-5xl sm:text-7xl"
          style={{ color: `${accent}55` }}
        >
          {chapter.roman}
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {chapter.blocks.map((block, i) => {
          if (block.type === "image") {
            return (
              <figure
                key={i}
                className="my-2 overflow-hidden rounded-lg border"
                style={{ borderColor: `${accent}4d` }}
              >
                <Image
                  src={block.src}
                  alt={block.alt}
                  width={block.width}
                  height={block.height}
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="h-auto w-full"
                />
                <figcaption className="border-t bg-bg-card px-5 py-3 text-sm text-ink-mute" style={{ borderColor: `${accent}4d` }}>
                  <span className="mr-2" style={{ color: accent }}>{block.plate}</span>
                  {block.caption}
                </figcaption>
              </figure>
            );
          }
          if (block.type === "list") {
            const items = lang === "en" ? block.en : block.th;
            return (
              <ul key={i} className="list-disc space-y-1 pl-6 text-lg leading-relaxed text-ink/90">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          }
          return (
            <p key={i} className="text-lg leading-relaxed text-ink/90">
              {lang === "en" ? block.en : block.th}
            </p>
          );
        })}
      </div>
    </Inview>
  );
};
