import Link from "next/link";

// Placeholder view for Codex sections not yet migrated from the original static
// site (hero roster, chronicle, bestiary, lore, map, one-shot). Each route
// passes its own copy; see obsidian/meta/decisions-log.md ADR-0016.
export interface ComingSoonContent {
  eyebrow: string;
  title: string;
  body: string;
}

export interface ComingSoonViewProps {
  content: ComingSoonContent;
}

export const ComingSoonView = ({ content }: ComingSoonViewProps) => {
  const { eyebrow, title, body } = content;
  return (
    <main className="flex min-h-lvh flex-col items-center justify-center gap-6 bg-bg-deep px-6 text-center text-ink">
      <span className="font-heading text-xs uppercase tracking-[0.3em] text-gold-dim">
        {eyebrow}
      </span>
      <h1 className="font-heading text-4xl font-medium tracking-wide text-gold sm:text-5xl">
        {title}
      </h1>
      <p className="max-w-lg text-lg text-ink-mute">{body}</p>
      <Link
        href="/"
        className="mt-4 rounded-full border border-gold/30 px-6 py-3 text-sm text-gold hover:bg-gold hover:text-bg-deep"
      >
        ← Back to the Codex
      </Link>
    </main>
  );
};
