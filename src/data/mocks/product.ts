// Placeholder content for the product explainer section. Original copy — swap for
// real product messaging (and a real card image) when available.
export interface ProductContent {
  labelId: string;
  heading: string;
  cta: string;
  ctaHref: string;
  description: string;
  cards: {
    grow: { title: string; body: string };
    liquid: { title: string; body: string };
    hands: { title: string; body: string };
  };
}

export const productContent: ProductContent = {
  labelId: "product-title",
  heading: "What is the Codex Table?",
  cta: "Join a session",
  ctaHref: "/oneshot/nova-arrival",
  description:
    "The Codex Table is an AI Dungeon Master that lives in Discord — narrating, tracking combat, and keeping the Drift in sync with a living star-chart viewer, so every session feels bound and indexed like the Sundering itself.",
  cards: {
    grow: {
      title: "A living Drift",
      body: "Scene, hazard, and shrine-favor sync live to a web star-chart viewer as the DM narrates — the table sees what the void sees.",
    },
    liquid: {
      title: "Discord-native play",
      body: "Roll dice, manage cargo, and speak in character with slash commands — no separate app to open.",
    },
    hands: {
      title: "An AI Dungeon Master",
      body: "Fully automated narration and combat tracking, ready whenever the crew gathers — day or night cycle.",
    },
  },
};
