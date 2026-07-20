// Shared content/domain types for "Trial of the Seven" — the choice-based
// mini-game at /story/game. Consumed by the content file
// (data/mocks/story-game.ts), the DB repository, the engine, and the API
// routes, so it lives in types/ rather than colocated with any one of them.

export type GodSlug =
  | "kestrel-ashvane"
  | "ozo-marrow"
  | "ren-solheim"
  | "ashe"
  | "vahn-duskrail"
  | "mirae-songtide"
  | "null";

export interface GameChoiceOutcome {
  narrativeEn: string;
  narrativeTh: string;
  affinity: Partial<Record<GodSlug, number>>;
}

export interface GameRoll {
  dc: number;
  success: GameChoiceOutcome;
  failure: GameChoiceOutcome;
}

export type GameChoice =
  | {
      id: string;
      labelEn: string;
      labelTh: string;
      type: "auto";
      outcome: GameChoiceOutcome;
      nextSceneId: string;
    }
  | {
      id: string;
      labelEn: string;
      labelTh: string;
      type: "roll";
      roll: GameRoll;
      nextSceneId: string;
    };

export interface GameScene {
  id: string;
  godSlug?: GodSlug;
  titleEn: string;
  titleTh: string;
  bodyEn: string[];
  bodyTh: string[];
  choices: GameChoice[];
}

export interface GameEnding {
  godSlug: GodSlug;
  titleEn: string;
  titleTh: string;
  epilogueEn: string;
  epilogueTh: string;
}

export interface StoryGameContent {
  eyebrow: string;
  title: string;
  introEn: string[];
  introTh: string[];
  scenes: GameScene[];
  endings: GameEnding[];
}
