import { SiteNav } from "@/views/site-nav";
import { StoryHeader } from "@/views/story-header";
import { PantheonGrid } from "@/views/pantheon-grid";
import { siteNav } from "@/data/mocks/site-nav";
import type { PantheonContent } from "@/data/mocks/pantheon";

// /pantheon — the roster of the seven gods. Reuses StoryHeader (eyebrow + h1 +
// bilingual subtitle + the shared EN/TH toggle); each card links to the god's
// detail page at /pantheon/[god].
export interface PantheonViewProps {
  content: PantheonContent;
}

export const PantheonView = ({ content }: PantheonViewProps) => (
  <>
    <SiteNav {...siteNav} navLabel="Primary" />
    <main className="min-h-lvh bg-bg-deep px-6 text-ink md:px-10 lg:px-page-gutter">
      <StoryHeader
        eyebrow={content.eyebrow}
        title={content.title}
        subtitleEn={content.subtitleEn}
        subtitleTh={content.subtitleTh}
      />
      <PantheonGrid
        gods={content.gods}
        chronicleCtaEn={content.chronicleCtaEn}
        chronicleCtaTh={content.chronicleCtaTh}
      />
    </main>
  </>
);
