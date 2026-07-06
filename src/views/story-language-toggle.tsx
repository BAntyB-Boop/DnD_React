"use client";

import { useStoryLanguage } from "@/hooks/use-story-language";

const OPTION = "rounded-full px-3 py-1 text-xs font-medium uppercase tracking-widest";

export const StoryLanguageToggle = () => {
  const lang = useStoryLanguage((s) => s.lang);
  const setLang = useStoryLanguage((s) => s.setLang);

  return (
    <div
      role="group"
      aria-label="Chronicle language"
      className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-bg-card p-1"
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`${OPTION} ${lang === "en" ? "bg-gold text-bg-deep" : "text-ink-mute hover:text-gold"}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("th")}
        aria-pressed={lang === "th"}
        className={`${OPTION} ${lang === "th" ? "bg-gold text-bg-deep" : "text-ink-mute hover:text-gold"}`}
      >
        TH
      </button>
    </div>
  );
};
