import { SiteNav } from "@/views/site-nav";
import { StoryHeader } from "@/views/story-header";
import { StoryChapterSection } from "@/views/story-chapter";
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

      <div className="mx-auto max-w-3xl pb-24">
        {content.chapters.map((chapter) => (
          <StoryChapterSection key={chapter.id} chapter={chapter} />
        ))}
        <div className="pt-4">
          <StoryClosingSection closing={content.closing} />
        </div>
      </div>
    </main>
  </>
);
