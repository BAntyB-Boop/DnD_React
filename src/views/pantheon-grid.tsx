"use client";

// The pantheon roster grid — one card per god, revealed once on scroll with a
// column-staggered rise (<Inview>), lifted on hover (<Hover>). Card text follows
// the shared EN/TH store; accents come from each god's data (inline styles, same
// pattern as the story chapters). Below the grid, a bilingual CTA back to the
// full chronicle.
import Image from "next/image";
import Link from "next/link";
import { Inview } from "@/components/animation/springs/in-view";
import { Hover } from "@/components/animation/springs/hover";
import { useStoryLanguage } from "@/hooks/use-story-language";
import type { GodProfile } from "@/data/mocks/pantheon";

export interface PantheonGridProps {
  gods: GodProfile[];
  chronicleCtaEn: string;
  chronicleCtaTh: string;
}

const REVEAL = {
  from: { opacity: 0, y: 36 },
  to: { opacity: 1, y: 0 },
  config: { tension: 200, friction: 28 },
};

export const PantheonGrid = ({
  gods,
  chronicleCtaEn,
  chronicleCtaTh,
}: PantheonGridProps) => {
  const lang = useStoryLanguage((s) => s.lang);

  return (
    <div className="mx-auto max-w-6xl pb-24">
      <ol className="grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {gods.map((god, i) => (
          <Inview
            key={god.slug}
            tag="li"
            mode="once"
            from={REVEAL.from}
            to={REVEAL.to}
            config={REVEAL.config}
            delayIn={(i % 3) * 90}
            className="h-full"
          >
            <Hover
              tag="div"
              from={{ y: 0 }}
              to={{ y: -8 }}
              config={{ tension: 260, friction: 22 }}
              className="h-full"
            >
              <Link
                href={`/pantheon/${god.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-lg border bg-bg-card"
                style={{
                  borderColor: `${god.accent}4d`,
                  boxShadow: `0 0 0 0 transparent, 0 24px 48px -24px ${god.accent}40`,
                }}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={god.portrait}
                    alt={`${god.name}, ${god.epithetEn}`}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                    className="object-cover object-top"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1/3"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent, color-mix(in srgb, var(--bg-card) 92%, transparent))",
                    }}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{ color: god.accent }}
                  >
                    {lang === "en" ? god.epithetEn : god.epithetTh}
                  </span>
                  <h2 className="text-2xl font-medium tracking-wide text-gold group-hover:text-gold-bright">
                    {god.name}
                  </h2>
                  <p className="text-sm leading-relaxed text-ink-mute">
                    {lang === "en" ? god.blurbEn : god.blurbTh}
                  </p>
                </div>
              </Link>
            </Hover>
          </Inview>
        ))}
      </ol>

      <div className="mt-16 text-center">
        <Link
          href="/story"
          className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3 text-sm text-gold hover:bg-gold hover:text-bg-deep"
        >
          {lang === "en" ? chronicleCtaEn : chronicleCtaTh}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
};
