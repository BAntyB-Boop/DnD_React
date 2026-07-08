import { SiteNav } from "@/views/site-nav";
import { StoryHeader } from "@/views/story-header";
import { StoryTimeline } from "@/views/story-timeline";
import { StoryClosingSection } from "@/views/story-closing";
import { siteNav } from "@/data/mocks/site-nav";
import type { StoryContent } from "@/data/mocks/story";

export interface StoryViewProps {
  content: StoryContent;
}

export const StoryView = ({ content }: StoryViewProps) => (
  <>
    <SiteNav {...siteNav} navLabel="Primary" />
    <main className="min-h-lvh bg-bg-deep px-6 text-ink md:px-10 lg:px-page-gutter">
      <StoryHeader
        eyebrow={content.eyebrow}
        title={content.title}
        subtitleEn={content.subtitleEn}
        subtitleTh={content.subtitleTh}
      />

      <StoryTimeline chapters={content.chapters} />

      <div className="mx-auto max-w-3xl pb-24 pt-24">
        <StoryClosingSection closing={content.closing} />
      </div>
    </main>
  </>
);
