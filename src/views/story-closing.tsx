"use client";

import Link from "next/link";
import { Inview } from "@/components/animation/springs/in-view";
import { useStoryLanguage } from "@/hooks/use-story-language";
import type { StoryClosing } from "@/data/mocks/story";

export interface StoryClosingProps {
  closing: StoryClosing;
}

export const StoryClosingSection = ({ closing }: StoryClosingProps) => {
  const lang = useStoryLanguage((s) => s.lang);

  return (
    <Inview
      tag="div"
      mode="once"
      from={{ opacity: 0, y: 24 }}
      to={{ opacity: 1, y: 0 }}
      config={{ tension: 200, friction: 28 }}
      className="flex flex-col items-center gap-6 border-t border-line/60 pt-16 text-center"
    >
      <span aria-hidden="true" className="text-gold-dim">
        ✦ ✦ ✦
      </span>
      <p className="max-w-xl text-xl italic text-ink/90">
        {lang === "en" ? closing.textEn : closing.textTh}
      </p>
      <Link
        href={closing.cta.href}
        className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3 text-sm text-gold hover:bg-gold hover:text-bg-deep"
      >
        {lang === "en" ? closing.cta.labelEn : closing.cta.labelTh}
        <span aria-hidden="true">→</span>
      </Link>
    </Inview>
  );
};
