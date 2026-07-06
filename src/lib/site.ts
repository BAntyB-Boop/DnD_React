/**
 * Site-wide configuration — the single source of truth for SEO.
 *
 * Consumed by the metadata generator, `robots.ts`, `sitemap.ts`, and the
 * JSON-LD structured-data helper. Update the placeholder values per project.
 */
import { publicEnv } from "@/env";

export const siteConfig = {
  name: "The Starbound Codex",
  /** Short brand promise — used in the page title, PWA, and JSON-LD slogan. */
  tagline: "A Chronicle of the Drift",
  description:
    "The Starbound Codex is a chronicle of the Drift — seven gods, one Sundering, one unfolding myth, indexed in the archive alongside the creatures, star-charts, and lore of Nova Stellare.",
  /**
   * Public origin, no trailing slash. Drives canonical URLs, OG tags, the
   * sitemap, and JSON-LD. Set `NEXT_PUBLIC_SITE_URL` in production.
   */
  url: publicEnv.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Default Open Graph / Twitter share image (path under `public/`). */
  ogImage: "/open-graph.png",
  twitterHandle: "@starboundcodex",
  author: "The Starbound Codex",
  /** Browser theme-color (address bar / PWA) — the dark cosmic backdrop the page opens on. */
  themeColor: "#07070a",
} as const;
