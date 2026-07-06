import Link from "next/link";
import { SigilIcon } from "@/components/ui/sigil-icon";

// Fixed site header overlaid on the page: a brand pill and a separate links pill on
// the left, and a gold "enter the codex" button on the right — all the same height
// (h-11). Pinned to the viewport (position: fixed) with symmetric insets (top ===
// sides). Ink text works over the dark hero/chain stages; the pills' dark backdrop
// keeps them legible over the parchment sections too. Rendered once near the app
// root — see home.tsx.
export interface SiteNavLink {
  label: string;
  href: string;
}

export interface SiteNavContent {
  brand: string;
  items: SiteNavLink[];
  cta: string;
  ctaHref: string;
}

export interface SiteNavProps extends SiteNavContent {
  /** Accessible name for the <nav> landmark. */
  navLabel?: string;
}

// Shared pill shell — brand and links pills sit in their own rounded plaques.
const PILL =
  "flex h-11 items-center rounded-full border border-gold/20 bg-bg-deep/70 backdrop-blur-md";

export const SiteNav = ({
  brand,
  items,
  cta,
  ctaHref,
  navLabel = "Primary",
}: SiteNavProps) => (
  <header className="fixed inset-x-4 top-4 z-50 flex items-center justify-between gap-4 text-ink md:inset-x-6 md:top-6">
    <div className="flex items-center gap-3">
      <span className={`${PILL} gap-2 px-5 font-medium text-gold`}>
        <SigilIcon />
        {brand}
      </span>
      <nav aria-label={navLabel} className={`${PILL} hidden px-2 md:flex`}>
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-full px-4 py-2 text-sm text-ink/80 hover:text-gold"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
    <Link
      href={ctaHref}
      className="inline-flex h-11 items-center rounded-full bg-gold px-6 text-sm font-medium text-bg-deep shadow-sm hover:bg-gold-bright"
    >
      {cta}
    </Link>
  </header>
);
