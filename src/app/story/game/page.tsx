import { GameView } from "@/views/game";
import { storyGameContent } from "@/data/mocks/story-game";
import { generateMetadata } from "@/utils/seo/generate-page-metadata";

export const metadata = generateMetadata({
  title: "Trial of the Seven — The Starbound Codex",
  description:
    "Wake in the wreckage and choose your way through seven trials, one per god of the Drift. Your choices decide which god claims you.",
  url: "/story/game",
});

export default function StoryGamePage() {
  return <GameView content={storyGameContent} />;
}
