// Content for the home view — "The Starbound Codex" landing page. Setting:
// a Spelljammer-style D&D-in-space pantheon myth (the Sundering, the Drift,
// Nova Stellare). Replaces the earlier fantasy "Veiled Codex" content — see
// obsidian/meta/decisions-log.md ADR-0022.
import type { HeroContent } from "@/views/hero";
import type { AboutContent } from "@/views/about";
import type { StatsContent } from "@/views/stats";
import type { ShowcaseContent } from "@/views/showcase";
import type { WorksContent } from "@/views/works";
import type { ChainContent } from "@/views/chain";
import type { SiteNavContent } from "@/views/site-nav";
import { siteNav } from "@/data/mocks/site-nav";

export interface HomeContent {
  /** Shared fixed site header (rendered once). */
  nav: SiteNavContent;
  hero: HeroContent;
  logos: {
    label: string;
    /** The seven god names — rendered as one flat muted-bronze mark. */
    items: string[];
  };
  about: AboutContent & { labelId: string };
  stats: StatsContent;
  showcase: ShowcaseContent;
  works: WorksContent;
  chain: ChainContent;
}

export const homeContent: HomeContent = {
  nav: siteNav,
  hero: {
    titleLines: ["The Starbound", "Codex"],
    sectionLabel: "Hero",
    sceneLabel: "Animated cosmic burst — the Sundering",
    cta: siteNav.cta,
    ctaHref: siteNav.ctaHref,
    secondaryCta: "Read the Sundering",
    secondaryCtaHref: "/story",
    insightTitle: "Seven gods, one Sundering.",
    insightBody:
      "One star tore itself into seven lights and a single devouring dark. Now they rule the Drift from Nova Stellare to the Graveyard Belt — worshipped, feared, and sometimes both at once.",
    stats: [
      { value: "VII", label: "Gods Enscribed" },
      { value: "Cycle Zero", label: "Annum" },
      { value: "Nova Stellare", label: "Seal" },
    ],
  },
  logos: {
    label: "The Seven — Pantheon of the Drift",
    items: ["Kestrel", "Ozo", "Ren", "Ashe", "Vahn", "Mirae", "Null"],
  },
  about: {
    labelId: "about-title",
    eyebrow: "The Sundering",
    lead: "One star, torn into seven lights",
    mutedLead: "and a single devouring dark",
  },
  stats: {
    label: "By the Archive",
    brand: "STARBOUND CODEX",
    collab: {
      value: "VII",
      desc: "Gods born from a single Sundering, each ruling what the others cannot touch.",
    },
    commitment: {
      eyebrow: "Voice of the Harbinger",
      value: "Cycle Zero",
      quote:
        "Even light must have an edge — before the Sundering, there was only the star, whole and unafraid.",
    },
    data: {
      label: "Locations charted",
      value: "9",
      desc: "Ports, wrecks, and shrines mapped across the Drift.",
    },
    reach: { label: "Chronicles live", value: "1" },
  },
  chain: {
    heading: "The pantheon endures",
    tagline:
      "Nine ports, seven gods, one Drift — each shrine a different face of the Sundering, each prayer answered by whichever god is listening.",
    aside: "when the light and the dark agree on nothing",
  },
  showcase: {
    heading: "What the Codex holds",
    cta: "Enter the archive",
    ctaHref: "/pantheon",
    items: [
      {
        prefix: "The",
        name: "Sundering",
        image: "/assets/world/shrine-market.png",
      },
      {
        prefix: "The",
        name: "Free Port",
        image: "/assets/world/nova-stellare.png",
      },
      {
        prefix: "The",
        name: "Drift",
        image: "/assets/world/the-drift-map.png",
      },
    ],
  },
  works: {
    heading: "The Seven of the Drift",
    viewLabel: "Read the myth",
    viewHref: "/pantheon",
    items: [
      { name: "Kestrel Ashvane", year: "The Lantern", image: "/assets/gods/kestrel.png" },
      { name: "Ozo Marrow", year: "The Gambler", image: "/assets/gods/ozo.png" },
      { name: "Ren Solheim", year: "The Ember", image: "/assets/gods/ren.png" },
      { name: "Ashe", year: "The Sovereign", image: "/assets/gods/ashe.png" },
      { name: "Vahn Duskrail", year: "The Navigator", image: "/assets/gods/vahn.png" },
      { name: "Mirae Songtide", year: "The Weaver", image: "/assets/gods/mirae.png" },
      { name: "Null", year: "The Harbinger", image: "/assets/gods/null.png" },
    ],
  },
};
