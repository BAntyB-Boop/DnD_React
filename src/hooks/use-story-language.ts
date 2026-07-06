import { create } from "zustand";

export type StoryLang = "en" | "th";

export interface UseStoryLanguage {
  lang: StoryLang;
  setLang: (lang: StoryLang) => void;
}

export const useStoryLanguage = create<UseStoryLanguage>((set) => ({
  lang: "en",
  setLang: (lang) => set({ lang }),
}));
