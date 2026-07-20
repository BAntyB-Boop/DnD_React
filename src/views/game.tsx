import { SiteNav } from "@/views/site-nav";
import { GameShell } from "@/views/game-shell";
import { siteNav } from "@/data/mocks/site-nav";
import type { StoryGameContent } from "@/types/game";

// /story/game — "Trial of the Seven". Server Component per hard rule 6: only
// the SiteNav shell is static, the entire game (auth/playing/ending) lives in
// the GameShell client leaf below it.
export interface GameViewProps {
  content: StoryGameContent;
}

export const GameView = ({ content }: GameViewProps) => (
  <>
    <SiteNav {...siteNav} navLabel="Primary" />
    <main className="min-h-lvh bg-bg-deep px-6 text-ink md:px-10 lg:px-page-gutter">
      <GameShell content={content} />
    </main>
  </>
);
