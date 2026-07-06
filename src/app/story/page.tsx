import { StoryView } from "@/views/story";
import { storyContent } from "@/data/mocks/story";

export default function StoryPage() {
  return <StoryView content={storyContent} />;
}
