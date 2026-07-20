"use client";

// The bilingual body of a god's detail page: sticky portrait on the left,
// epithet chip + name + facts + origin myth on the right, prev/next circle
// navigation below. Language follows the shared EN/TH store (toggle included);
// prose comes from the god's story chapter (image blocks are skipped — the
// portrait already leads the page). Reveals are one-shot <Inview> springs.
import Image from "next/image";
import Link from "next/link";
import { Inview } from "@/components/animation/springs/in-view";
import { AnimatedHeading } from "@/components/common/animated-heading";
import { StoryLanguageToggle } from "@/views/story-language-toggle";
import { useStoryLanguage } from "@/hooks/use-story-language";
import type { GodProfile } from "@/data/mocks/pantheon";
import type { StoryChapter } from "@/data/mocks/story";

export interface GodDetailsProps {
  god: GodProfile;
  chapter: StoryChapter;
  prev: GodProfile;
  next: GodProfile;
}

const REVEAL = {
  from: { opacity: 0, y: 28 },
  to: { opacity: 1, y: 0 },
  config: { tension: 200, friction: 28 },
};

export const GodDetails = ({ god, chapter, prev, next }: GodDetailsProps) => {
  const lang = useStoryLanguage((s) => s.lang);
  const en = lang === "en";

  const facts = [
    { label: en ? "Domain" : "อาณาเขตอำนาจ", value: en ? god.domainEn : god.domainTh },
    { label: en ? "Symbol" : "สัญลักษณ์", value: en ? god.symbolEn : god.symbolTh },
    { label: en ? "Rites" : "พิธีบูชา", value: en ? god.worshipEn : god.worshipTh },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <nav aria-label={en ? "Breadcrumb" : "เส้นทางหน้า"} className="mb-8 flex items-center justify-between gap-4">
        <Link
          href="/pantheon"
          className="text-sm text-ink-mute hover:text-gold"
        >
          ← {en ? "The Pantheon" : "วิหารเทพ"}
        </Link>
        <StoryLanguageToggle />
      </nav>

      <div className="grid gap-10 md:grid-cols-[minmax(0,26rem)_1fr] md:gap-14">
        <Inview
          tag="figure"
          mode="once"
          from={REVEAL.from}
          to={REVEAL.to}
          config={REVEAL.config}
          className="md:sticky md:top-28 md:self-start"
        >
          <div
            className="overflow-hidden rounded-lg border"
            style={{
              borderColor: `${god.accent}4d`,
              boxShadow: `0 32px 64px -32px ${god.accent}59`,
            }}
          >
            <Image
              src={god.portrait}
              alt={`${god.name}, ${god.epithetEn}`}
              width={1086}
              height={1448}
              sizes="(max-width: 768px) 90vw, 416px"
              priority
              className="h-auto w-full"
            />
          </div>
        </Inview>

        <div className="flex flex-col">
          <span
            className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]"
            style={{
              color: god.accent,
              borderColor: `${god.accent}4d`,
              background: `${god.accent}1a`,
            }}
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: god.accent, boxShadow: `0 0 8px ${god.accent}` }}
            />
            {en ? god.epithetEn : god.epithetTh}
          </span>
          <AnimatedHeading
            as="h1"
            className="mt-4 text-4xl font-medium tracking-wide text-gold sm:text-5xl"
          >
            {god.name}
          </AnimatedHeading>
          <p className="mt-3 text-lg italic text-ink-mute">
            {en ? god.blurbEn : god.blurbTh}
          </p>

          <Inview
            tag="div"
            mode="once"
            from={REVEAL.from}
            to={REVEAL.to}
            config={REVEAL.config}
            className="mt-8 border-y py-6"
            style={{ borderColor: `${god.accent}33` }}
          >
            <dl className="flex flex-col gap-4">
              {facts.map((fact) => (
                <div key={fact.label} className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4">
                  <dt
                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{ color: god.accent }}
                  >
                    {fact.label}
                  </dt>
                  <dd className="text-base leading-relaxed text-ink/90">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Inview>

          <section aria-labelledby="god-myth" className="mt-10">
            <h2
              id="god-myth"
              className="text-2xl font-medium tracking-wide text-gold"
            >
              {en ? "Origin — from The Sundering" : "ต้นกำเนิด — จาก The Sundering"}
            </h2>
            <div className="mt-5 flex flex-col gap-4">
              {chapter.blocks.map((block, i) => {
                if (block.type === "image") return null;
                if (block.type === "list") {
                  const items = en ? block.en : block.th;
                  return (
                    <ul key={i} className="list-disc space-y-1 pl-6 text-base leading-relaxed text-ink/90">
                      {items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={i} className="text-base leading-relaxed text-ink/90">
                    {en ? block.en : block.th}
                  </p>
                );
              })}
            </div>
            <Link
              href="/story"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3 text-sm text-gold hover:bg-gold hover:text-bg-deep"
            >
              {en ? "Read the full chronicle" : "อ่านตำนานฉบับเต็ม"}
              <span aria-hidden="true">→</span>
            </Link>
          </section>
        </div>
      </div>

      <nav
        aria-label={en ? "Other gods" : "เทพองค์อื่น"}
        className="mt-16 flex items-center justify-between gap-4 border-t border-line/60 pt-8"
      >
        <Link
          href={`/pantheon/${prev.slug}`}
          className="group flex flex-col gap-1 text-left"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-ink-mute">
            ← {en ? "Previous" : "องค์ก่อนหน้า"}
          </span>
          <span className="text-lg text-gold group-hover:text-gold-bright">
            {prev.name}
          </span>
        </Link>
        <Link
          href={`/pantheon/${next.slug}`}
          className="group flex flex-col gap-1 text-right"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-ink-mute">
            {en ? "Next" : "องค์ถัดไป"} →
          </span>
          <span className="text-lg text-gold group-hover:text-gold-bright">
            {next.name}
          </span>
        </Link>
      </nav>
    </div>
  );
};
