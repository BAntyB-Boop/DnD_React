import { SiteNav } from "@/views/site-nav";
import { GodDetails } from "@/views/god-details";
import { siteNav } from "@/data/mocks/site-nav";
import type { GodProfile } from "@/data/mocks/pantheon";
import type { StoryChapter } from "@/data/mocks/story";

// /pantheon/[god] — one god's page: portrait, facts (domain / symbol / rites),
// and the origin myth (the god's chapter from story.ts — single prose source),
// with prev/next navigation around the circle of seven.
export interface GodViewProps {
  god: GodProfile;
  chapter: StoryChapter;
  prev: GodProfile;
  next: GodProfile;
}

export const GodView = ({ god, chapter, prev, next }: GodViewProps) => (
  <>
    <SiteNav {...siteNav} navLabel="Primary" />
    <main className="min-h-lvh bg-bg-deep px-6 pb-24 pt-32 text-ink md:px-10 md:pt-40 lg:px-page-gutter">
      <GodDetails god={god} chapter={chapter} prev={prev} next={next} />
    </main>
  </>
);
