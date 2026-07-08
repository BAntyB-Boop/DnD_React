"use client";

// The Sundering chronicle as an Ascent-style scroll-pinned timeline (ported from the
// GetLayers "Roadmap Ascent" HTML section — ADR-0024). The section pins (sticky) over a
// tall scroll region; a spine of chapter markers scrolls THROUGH a fixed node — the
// marker at the centre brightens and scales, ticks fade near the node, and a conic
// progress ring around the node fills with overall progress. The node's face cross-fades
// between the chapter icons. The reading panel shows the centred chapter's full prose
// (bilingual via the shared useStoryLanguage store) and swaps with a rise spring; an
// odometer rolls the chapter index. All motion is spring/ticker-driven (ADR-0002):
// scroll feeds a react-spring float index `f` via the shared ticker (no CSS keyframes/
// transitions). Unlike the Works card stack (ADR-0023), the active chapter is React
// state — it changes only on the discrete index step (≤ once per chapter, never per
// frame), because chapters are variable-length bilingual block lists that can't be
// swapped by ref textContent mutation.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animated, to, useSpring } from "@react-spring/web";
import { subscribeToTicker } from "@/lib/animation/ticker";
import { useStoryLanguage } from "@/hooks/use-story-language";
import type { StoryChapter } from "@/data/mocks/story";

export interface StoryTimelineProps {
  chapters: StoryChapter[];
}

const SCROLL_PER_ITEM = 85; // vh of scroll per chapter — prose needs a longer dwell
const EASE = 0.09; // low-pass factor on the scroll read (the Ascent glide)
const MOBILE_WIDTH = 768;
// Vertical gap between adjacent spine markers — derived from the viewport so the ladder
// breathes on tall screens and tightens on short ones (mirrors the Ascent's layout()).
const spacingForViewport = (w: number, h: number) =>
  w < MOBILE_WIDTH
    ? Math.max(52, Math.min(h * 0.09, 84))
    : Math.max(72, Math.min(h * 0.135, 112));
const DEFAULT_SPACING = 104; // SSR / first-paint fallback before the resize measure

const pad = (n: number) => String(n).padStart(2, "0");

// Per-frame values derived from the float index `v` — kept as plain functions so the
// v=0 first frame is byte-identical on server and client (avoids react-spring's SSR
// style-serialisation mismatch).
const labelFrame = (i: number, v: number, sp: number) => {
  const d = i - v;
  const prox = Math.max(0, 1 - Math.abs(d)); // 1 at the node → 0 one row out
  return `translateY(-50%) translate(${(-16 * prox).toFixed(1)}px, ${(d * sp).toFixed(1)}px) scale(${(1 + 0.09 * prox).toFixed(3)})`;
};
const labelOpacity = (i: number, v: number) =>
  Math.max(0.14, 1 - Math.abs(i - v) * 0.32);
const tickOpacity = (i: number, v: number) =>
  Math.max(0, Math.min(1, (Math.abs(i - v) - 0.55) / 0.8)); // ticks vanish near the node
const iconOpacity = (i: number, v: number) => Math.max(0, 1 - Math.abs(i - v));
// Split-flap digit roll: hold the digit until the value is 80% of the way to the next
// integer, then roll across the remaining 20%. Digits are 1em tall, so the strip
// translates in em — no pixel measuring needed.
const digitTransform = (place: number) => (v: number) => {
  const q = (v + 1) / place;
  const frac = q - Math.floor(q);
  const roll = frac > 0.8 ? (frac - 0.8) / 0.2 : 0;
  return `translateY(${(-((Math.floor(q) % 10) + roll)).toFixed(3)}em)`;
};
const PLACES = [10, 1];
const DIGITS = Array.from({ length: 11 }, (_, n) => n % 10);

// Gold pixel-cube field (the Ascent's buildPix) — desktop-only here and much dimmer
// than the home-page study, so it reads as ambience behind the illustration card and
// never competes with the prose.
const PIX_ALPHA = 0.2;

interface PixCell {
  x: number;
  y: number;
  s: number;
  d: number;
  ph: number;
}

const hexToRgb = (hex: string): string => {
  const h = hex.trim().replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

const chapterIcon = (chapter: StoryChapter) => {
  const block = chapter.blocks.find((b) => b.type === "image");
  return block?.type === "image" ? block : null;
};

export const StoryTimeline = ({ chapters }: StoryTimelineProps) => {
  const lang = useStoryLanguage((s) => s.lang);
  const count = chapters.length;
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellsRef = useRef<PixCell[]>([]);
  const goldRef = useRef("201,164,92"); // replaced from the --gold token on mount
  const currentRef = useRef(0); // manually-lerped follow value (smooths the scroll read)
  const idxRef = useRef(0);
  // Active chapter — React state on purpose: it flips only when the rounded index
  // crosses to another chapter, so the section never re-renders per frame while pinned.
  const [idx, setIdx] = useState(0);
  // `immediate` — everything follows the manually-smoothed value directly. The marker
  // spacing `s` rides in the same spring (not a ref — reading a ref inside a
  // render-created interpolation trips react-hooks/refs), same as ADR-0023's radius.
  const [{ f, s }, api] = useSpring(() => ({ f: 0, s: DEFAULT_SPACING }));
  // Rise animation for the reading panel whenever the centred chapter changes.
  const [swap, swapApi] = useSpring(() => ({ opacity: 1, y: 0 }));
  // Gentle idle pulse on the node glow (the Ascent's sin-wave, as a looping spring).
  const glow = useSpring({
    from: { o: 0.7 },
    to: { o: 1 },
    loop: { reverse: true },
    config: { duration: 1700 },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d") ?? null;
    goldRef.current = hexToRgb(
      getComputedStyle(document.documentElement).getPropertyValue("--gold"),
    );

    // Seeded deterministic scatter, densest at the top-right corner.
    const buildPix = () => {
      if (!canvas || !ctx) return;
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = Math.max(11, r.width / 40);
      const cells: PixCell[] = [];
      let seed = 8.31;
      const rnd = () => ((seed = Math.sin(seed * 91.7 + 3) * 43758.5), seed - Math.floor(seed));
      for (let x = 0; x < r.width; x += gap)
        for (let y = 0; y < r.height; y += gap) {
          const d = Math.hypot(1 - x / r.width, y / r.height); // 0 at the top-right corner
          if (rnd() < 1.05 - d * 0.92)
            cells.push({ x, y, s: gap * (0.4 + rnd() * 0.42), d, ph: rnd() * 6.28 });
        }
      cellsRef.current = cells;
    };

    const drawPix = (t: number) => {
      if (!canvas || !ctx) return;
      const r = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      const intensity = 0.3 + 0.7 * (currentRef.current / Math.max(1, count - 1));
      for (const c of cellsRef.current) {
        const fall = Math.max(0, 1 - c.d * 0.82);
        const tw = 0.5 + 0.5 * Math.sin(t * 0.0015 + c.ph + c.d * 4);
        const a = fall * tw * intensity * PIX_ALPHA;
        if (a <= 0.015) continue;
        ctx.fillStyle = `rgba(${goldRef.current},${a.toFixed(3)})`;
        ctx.fillRect(c.x, c.y, c.s, c.s);
      }
    };

    const onResize = () => {
      api.start({
        s: spacingForViewport(window.innerWidth, window.innerHeight),
        immediate: true,
      });
      buildPix();
    };
    onResize();
    window.addEventListener("resize", onResize);

    const unsubscribe = subscribeToTicker(
      (time) => {
        const el = sectionRef.current;
        if (el) {
          const total = el.offsetHeight - window.innerHeight; // pinned scroll length
          const p = Math.min(
            Math.max(-el.getBoundingClientRect().top / Math.max(1, total), 0),
            1,
          );
          const target = p * (count - 1);
          currentRef.current += (target - currentRef.current) * EASE;
          if (Math.abs(target - currentRef.current) < 1e-4)
            currentRef.current = target;
          api.start({ f: currentRef.current, immediate: true });

          const next = Math.min(
            count - 1,
            Math.max(0, Math.round(currentRef.current)),
          );
          if (next !== idxRef.current) {
            idxRef.current = next;
            setIdx(next);
            swapApi.start({
              from: { opacity: 0, y: 14 },
              to: { opacity: 1, y: 0 },
              config: { tension: 210, friction: 26 },
            });
          }
        }
        drawPix(time);
      },
      () => 0,
    );
    return () => {
      window.removeEventListener("resize", onResize);
      unsubscribe();
    };
  }, [api, count, swapApi]);

  const fadeMask =
    "linear-gradient(180deg, transparent 2%, black 26%, black 74%, transparent 98%)";
  const spineGradient =
    "linear-gradient(180deg, transparent, color-mix(in srgb, var(--ink) 16%, transparent) 16%, color-mix(in srgb, var(--ink) 16%, transparent) 84%, transparent)";

  return (
    <section
      ref={sectionRef}
      aria-label={lang === "en" ? "Chronicle chapters" : "บทของตำนาน"}
      className="relative -mx-6 md:-mx-10 lg:-mx-page-gutter"
      style={{ height: `${100 + (count - 1) * SCROLL_PER_ITEM}vh` }}
    >
      <div className="sticky top-0 h-lvh overflow-hidden">
        {/* Blurred backdrop — each chapter's icon, cross-fading to the centred one. */}
        <div className="absolute inset-0" aria-hidden="true">
          {chapters.map((chapter, i) => {
            const icon = chapterIcon(chapter);
            return icon ? (
              <animated.div
                key={chapter.id}
                suppressHydrationWarning
                className="absolute inset-0 [will-change:opacity]"
                style={{ opacity: f.to((v) => iconOpacity(i, v) * 0.5) }}
              >
                <Image
                  src={icon.src}
                  alt=""
                  fill
                  sizes="60vw"
                  quality={30}
                  className="object-cover object-top blur-2xl"
                />
              </animated.div>
            ) : null;
          })}
          <div className="absolute inset-0 bg-bg-deep/80" />
        </div>

        {/* Faint gold pixel-cube field — right half, desktop only, behind the
            illustration card and clear of the prose column. */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 z-[5] hidden h-full w-[42vw] md:block"
        />

        {/* Fixed spine — the ladder of chapter markers scrolls through the node. */}
        <div
          aria-hidden="true"
          className="absolute left-[85%] top-0 z-10 h-full w-px md:left-[24%]"
          style={{ background: spineGradient }}
        />
        <ol
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 list-none"
          style={{ WebkitMask: fadeMask, mask: fadeMask }}
        >
          {chapters.map((chapter, i) => (
            <animated.li
              key={chapter.id}
              suppressHydrationWarning
              className="absolute left-0 top-1/2 w-[calc(85%-1.75rem)] origin-right whitespace-nowrap text-right text-sm font-medium tracking-wide text-ink [will-change:transform,opacity] md:w-[calc(24%-4rem)]"
              style={{
                transform: to([f, s], (v, sp) => labelFrame(i, v, sp)),
                opacity: f.to((v) => labelOpacity(i, v)),
              }}
            >
              <span className="md:hidden">{chapter.roman}</span>
              <span className="hidden md:inline">{chapter.number}</span>
            </animated.li>
          ))}
        </ol>
        <div aria-hidden="true" className="absolute inset-0 z-10">
          {chapters.map((chapter, i) => (
            <animated.span
              key={chapter.id}
              suppressHydrationWarning
              className="absolute left-[85%] top-1/2 h-px w-3.5 bg-ink/30 md:left-[24%]"
              style={{
                transform: to(
                  [f, s],
                  (v, sp) => `translate(-50%, ${((i - v) * sp).toFixed(1)}px)`,
                ),
                opacity: f.to((v) => tickOpacity(i, v)),
              }}
            />
          ))}
        </div>

        {/* Node — conic progress ring around the centred chapter's icon, over a
            softly pulsing gold glow. */}
        <animated.div
          aria-hidden="true"
          suppressHydrationWarning
          className="pointer-events-none absolute left-[85%] top-1/2 z-[15] h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[3px] md:left-[24%] md:h-72 md:w-72"
          style={{
            opacity: glow.o,
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--gold) 38%, transparent) 0%, color-mix(in srgb, var(--gold) 10%, transparent) 36%, transparent 66%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute left-[85%] top-1/2 z-20 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full md:left-[24%] md:h-28 md:w-28"
        >
          <animated.div
            suppressHydrationWarning
            className="absolute inset-0 rounded-full"
            style={{
              background: f.to(
                (v) =>
                  `conic-gradient(var(--gold) ${((v / Math.max(1, count - 1)) * 360).toFixed(1)}deg, color-mix(in srgb, var(--ink) 12%, transparent) 0)`,
              ),
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px))",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px))",
            }}
          />
          <div className="absolute inset-[5px] overflow-hidden rounded-full border border-ink/10 bg-bg-card shadow-2xl">
            {chapters.map((chapter, i) => {
              const icon = chapterIcon(chapter);
              return (
                <animated.div
                  key={chapter.id}
                  suppressHydrationWarning
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ opacity: f.to((v) => iconOpacity(i, v)) }}
                >
                  {icon ? (
                    <Image
                      src={icon.src}
                      alt=""
                      fill
                      sizes="112px"
                      className="object-cover object-top"
                    />
                  ) : (
                    <span className="text-xl text-gold md:text-3xl">✦</span>
                  )}
                </animated.div>
              );
            })}
          </div>
        </div>

        {/* Chapter illustration — a sharp portrait card on the right (desktop only;
            mobile shows the figure inside the prose flow instead), cross-fading with
            the centred chapter. Decorative duplicate of the in-prose figure. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[75%] top-1/2 z-20 hidden aspect-[3/4] w-[min(21vw,320px)] -translate-y-1/2 md:block"
        >
          {chapters.map((chapter, i) => {
            const icon = chapterIcon(chapter);
            return icon ? (
              <animated.div
                key={chapter.id}
                suppressHydrationWarning
                className="absolute inset-0 overflow-hidden rounded-lg border shadow-2xl [will-change:opacity]"
                style={{
                  opacity: f.to((v) => iconOpacity(i, v)),
                  borderColor: `${chapter.accent}4d`,
                }}
              >
                <Image
                  src={icon.src}
                  alt=""
                  fill
                  sizes="21vw"
                  className="object-cover object-top"
                />
              </animated.div>
            ) : null;
          })}
        </div>

        {/* Reading panel — the centred chapter's full prose, swapped with a rise
            spring. Inner scroll (Lenis-exempt) is a safety net for short viewports. */}
        <div className="absolute bottom-[6vh] left-6 right-[22%] top-[10vh] z-20 flex flex-col md:bottom-[8vh] md:left-[32%] md:right-auto md:top-[10vh] md:w-[min(40vw,560px)]">
          {/* Soft dark halo so the prose pops over the backdrop. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-10 -inset-y-8 -z-10"
            style={{
              background:
                "radial-gradient(80% 90% at 40% 50%, color-mix(in srgb, var(--bg-deep) 82%, transparent), transparent 74%)",
            }}
          />
          <animated.div
            suppressHydrationWarning
            className="flex min-h-0 flex-1 flex-col"
            style={{
              opacity: swap.opacity,
              transform: swap.y.to((y) => `translateY(${y}px)`),
            }}
          >
            {/* Every chapter stays in the DOM (SSR/SEO keeps the full chronicle);
                only the centred one is displayed. */}
            {chapters.map((chapter, ci) => (
              <article
                key={chapter.id}
                id={chapter.id}
                suppressHydrationWarning
                className={
                  ci === idx ? "flex min-h-0 flex-1 flex-col" : "hidden"
                }
              >
                <span
                  className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{
                    color: chapter.accent,
                    borderColor: `${chapter.accent}4d`,
                    background: `${chapter.accent}1a`,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background: chapter.accent,
                      boxShadow: `0 0 8px ${chapter.accent}`,
                    }}
                  />
                  {chapter.number}
                </span>
                <h2 className="mt-3 text-2xl font-medium leading-tight tracking-wide text-gold md:text-[clamp(1.6rem,4.2vh,2.5rem)]">
                  {lang === "en" ? chapter.titleEn : chapter.titleTh}
                </h2>
                <div
                  data-lenis-prevent
                  className="mt-4 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-10 pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-[clamp(0.65rem,1.6vh,1rem)]"
                  style={{
                    WebkitMask:
                      "linear-gradient(180deg, black calc(100% - 2rem), transparent 100%)",
                    mask: "linear-gradient(180deg, black calc(100% - 2rem), transparent 100%)",
                  }}
                >
                  {chapter.blocks.map((block, i) => {
                    if (block.type === "image") {
                      return (
                        <figure key={i} className="flex flex-col gap-3">
                          <div
                            className="overflow-hidden rounded-lg border md:hidden"
                            style={{ borderColor: `${chapter.accent}4d` }}
                          >
                            <Image
                              src={block.src}
                              alt={block.alt}
                              width={block.width}
                              height={block.height}
                              sizes="(max-width: 768px) 75vw, 320px"
                              className="h-auto w-full"
                            />
                          </div>
                          <figcaption className="text-xs italic leading-relaxed text-ink-mute">
                            <span className="mr-2 not-italic" style={{ color: chapter.accent }}>
                              {block.plate}
                            </span>
                            {block.caption}
                          </figcaption>
                        </figure>
                      );
                    }
                    if (block.type === "list") {
                      const listItems = lang === "en" ? block.en : block.th;
                      return (
                        <ul key={i} className="list-disc space-y-1 pl-6 text-sm leading-relaxed text-ink/90 md:text-[clamp(0.8125rem,1.9vh,1rem)] md:leading-[1.6]">
                          {listItems.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={i} className="text-sm leading-relaxed text-ink/90 md:text-[clamp(0.8125rem,1.9vh,1rem)] md:leading-[1.6]">
                        {lang === "en" ? block.en : block.th}
                      </p>
                    );
                  })}
                </div>
              </article>
            ))}
          </animated.div>

          {/* Odometer — rolls the chapter index with the scroll. */}
          <div className="mt-4 flex items-baseline gap-3 md:mt-5">
            <div
              aria-hidden="true"
              className="flex text-4xl font-semibold leading-none tracking-tight text-gold-bright tabular-nums md:text-[clamp(2.75rem,6.5vh,3.75rem)]"
            >
              {PLACES.map((place) => (
                <span
                  key={place}
                  className="h-[1em] w-[0.62em] overflow-hidden"
                  style={{
                    WebkitMask:
                      "linear-gradient(180deg, transparent 0, black 24%, black 76%, transparent 100%)",
                    mask: "linear-gradient(180deg, transparent 0, black 24%, black 76%, transparent 100%)",
                  }}
                >
                  <animated.span
                    suppressHydrationWarning
                    className="flex flex-col will-change-transform"
                    style={{ transform: f.to(digitTransform(place)) }}
                  >
                    {DIGITS.map((n, di) => (
                      <span
                        key={di}
                        className="flex h-[1em] items-center justify-center"
                      >
                        {n}
                      </span>
                    ))}
                  </animated.span>
                </span>
              ))}
            </div>
            <span className="text-xl font-light text-ink-mute md:text-3xl">
              / {pad(count)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
