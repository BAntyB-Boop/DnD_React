// Placeholder content for the contact form + site footer. Original copy — swap for
// real messaging, links and contact details when available.

export interface ContactContent {
  labelId: string;
  /** Bold intro prompt above the form. */
  heading: string;
  /** Placeholder / label text for each field. */
  fields: { name: string; phone: string; email: string };
  cta: string;
}

export const contactContent: ContactContent = {
  labelId: "contact-title",
  heading:
    "The archive-keepers are always indexing new crews. Petition to join a table, and your name may yet be bound among the Seven.",
  fields: { name: "Name", phone: "Discord handle", email: "Email" },
  cta: "Send petition",
};

export interface FooterLink {
  label: string;
  href: string;
  /** External links open in a new tab and get rel="noopener". */
  external?: boolean;
}

export interface FooterNavGroup {
  title: string;
  links: FooterLink[];
}

export interface FooterContent {
  tagline: string;
  labelId: string;
  heading: string;
  cta: FooterLink;
  backToTop: FooterLink;
  linksLabel: string;
  sitemap: FooterNavGroup;
  contact: {
    title: string;
    address: string;
    phone: string;
    email: string;
  };
  social: FooterNavGroup;
  copyright: string;
  credit: string;
}

export const footerContent: FooterContent = {
  tagline: "Bound by the archive-keepers of the Drift.",
  labelId: "footer-title",
  heading: "Ready to bind your name among the Seven?",
  cta: { label: "Petition to join", href: "#contact" },
  backToTop: { label: "Back to top", href: "#top" },
  linksLabel: "Links",
  sitemap: {
    title: "Sitemap",
    links: [
      { label: "Pantheon", href: "/pantheon" },
      { label: "Chronicle", href: "/story" },
      { label: "Bestiary", href: "/bestiary" },
      { label: "Lore", href: "/lore/nova-stellare" },
      { label: "Map", href: "/map/nova-stellare" },
      { label: "One-Shot", href: "/oneshot/nova-arrival" },
    ],
  },
  contact: {
    title: "Contact",
    address: "The Archive Ring, Nova Stellare",
    phone: "Discord only",
    email: "archivist@starboundcodex.gg",
  },
  social: {
    title: "Follow the Codex",
    links: [{ label: "Discord", href: "#", external: true }],
  },
  copyright: "© 2026 The Starbound Codex. All rights reserved.",
  credit: "✦ Bound by the archive-keepers of the Drift ✦",
};
