// Shared fixed site header content — used by every route's <SiteNav>.
import type { SiteNavContent } from "@/views/site-nav";

export const siteNav: SiteNavContent = {
  brand: "The Starbound Codex",
  items: [
    { label: "Pantheon", href: "/pantheon" },
    { label: "Chronicle", href: "/story" },
    { label: "Bestiary", href: "/bestiary" },
    { label: "Lore", href: "/lore/nova-stellare" },
    { label: "Map", href: "/map/nova-stellare" },
    { label: "One-Shot", href: "/oneshot/nova-arrival" },
  ],
  cta: "Enter the Codex",
  ctaHref: "/pantheon",
};
