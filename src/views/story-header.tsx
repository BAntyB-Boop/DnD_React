"use client";

import { AnimatedHeading } from "@/components/common/animated-heading";
import { StoryLanguageToggle } from "@/views/story-language-toggle";
import { useStoryLanguage } from "@/hooks/use-story-language";

export interface StoryHeaderProps {
  eyebrow: string;
  title: string;
  subtitleEn: string;
  subtitleTh: string;
}

export const StoryHeader = ({
  eyebrow,
  title,
  subtitleEn,
  subtitleTh,
}: StoryHeaderProps) => {
  const lang = useStoryLanguage((s) => s.lang);

  return (
    <header className="flex flex-col items-center gap-4 pb-16 pt-40 text-center">
      <span className="text-xs uppercase tracking-[0.35em] text-gold-dim">
        {eyebrow}
      </span>
      <AnimatedHeading
        as="h1"
        className="text-4xl font-medium tracking-wide text-gold sm:text-6xl"
      >
        {title}
      </AnimatedHeading>
      <p className="max-w-xl text-lg text-ink-mute">
        {lang === "en" ? subtitleEn : subtitleTh}
      </p>
      <div className="mt-2">
        <StoryLanguageToggle />
      </div>
    </header>
  );
};
