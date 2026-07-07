"use client";

// "Our Works" — a scroll-driven 3D card stack. The section is pinned (sticky) over
// a tall scroll region; scroll progress advances a float index `f`, and each card
// is transformed in perspective from that index so cards travel bottom-to-top,
// tilting through the focus. The index runs a small fraction past each end so the end
// cards stay near-centred but keep a hint of motion (no dead lead-in, no early exit,
// never a hard freeze) as the section enters and leaves. Motion is a
// react-spring value the shared ticker feeds from scroll position (spring-based,
// ADR-0002). Card media come from content.items (see data/mocks/home.ts), served
// via next/image; the off-focus cards carry a distance-scaled scrim while the focused
// card stays clear.
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { animated, to, useSpring } from "@react-spring/web";
import { subscribeToTicker } from "@/lib/animation/ticker";
import { AnimatedHeading } from "@/components/common/animated-heading";

export interface WorkItem {
  name: string;
  year: string;
  /** Card image (public path). */
  image: string;
}

export interface WorksContent {
  heading: string;
  viewLabel: string;
  /** Where the "view" button sends visitors — the full roster until each work has its own page. */
  viewHref: string;
  items: WorkItem[];
}

export interface WorksProps {
  content: WorksContent;
}

const SCROLL_PER_CARD = 60; // vh of scroll per card
// Cards sit on a vertical cylinder, evenly spaced by arc. Vertical spacing between
// adjacent cards is RADIUS·sin(STEP), and RADIUS is derived live from the actual
// rendered card height (see radiusForCardHeight below) instead of a fixed number —
// the card is `w-[85vw] max-w-[32rem]` at a 3:4 aspect ratio, so its height changes
// across breakpoints. Keeping RADIUS matched to that height means the outgoing/
// incoming cards meet edge-to-edge (no overlap, no gap) at every viewport width,
// reading as one continuous strip (the original 16:10 cards left a ~270px dead gap
// between them; the 3:4 portrait cards + matched spacing close it — ADR-0023).
const STEP = 29; // deg between adjacent cards around the cylinder
const STEP_RAD = (STEP * Math.PI) / 180;
const CARD_MAX_WIDTH = 512; // px — matches `max-w-[32rem]`
const CARD_VW_FRACTION = 0.85; // matches `w-[85vw]`
const CARD_ASPECT = 4 / 3; // matches `aspect-[3/4]` (height / width)

const cardHeightForViewport = (viewportWidth: number) =>
  Math.min(viewportWidth * CARD_VW_FRACTION, CARD_MAX_WIDTH) * CARD_ASPECT;

const radiusForCardHeight = (cardHeight: number) => cardHeight / Math.sin(STEP_RAD);

// Desktop-width fallback — used for SSR and the first client paint, before the
// resize effect below measures the real viewport.
const DEFAULT_RADIUS = radiusForCardHeight(CARD_MAX_WIDTH * CARD_ASPECT);

const pad = (n: number) => String(n).padStart(2, "0");

// Per-frame values for the three animated layers, derived from the float index `v`.
// Kept as plain functions so the first (pre-mount) frame at v=0 can be rendered as a
// static React style — byte-identical on the server and the first client render —
// which avoids react-spring's SSR/client style-serialisation mismatch (full-precision
// vs. rounded floats, numeric vs. string opacity) on these Math.sin/cos transforms.
const backdropFrame = (i: number, v: number) => ({
  opacity: Math.max(0, 1 - Math.abs(i - v)),
  transform: `translateY(${(i - v) * 22}%) scale(1.6)`,
});

const cardFrame = (i: number, v: number, radius: number) => {
  const rel = i - v;
  const rad = rel * STEP_RAD;
  const y = radius * Math.sin(rad);
  const z = radius * Math.cos(rad) - radius; // focus at 0, others recede
  const d = Math.abs(rel);
  return {
    transform: `translate3d(0px, ${y}px, ${z}px) rotateX(${rel * STEP}deg) translate(-50%, -50%)`,
    opacity: d > 3.6 ? 0 : Math.max(0, 1 - d * 0.24),
  };
};

const scrimOpacity = (i: number, v: number) => Math.min(0.35, Math.abs(i - v) * 0.22);

export const Works = ({ content }: WorksProps) => {
  const { items, heading, viewLabel, viewHref } = content;
  const count = items.length;
  const sectionRef = useRef<HTMLElement>(null);
  const currentRef = useRef(0); // manually-lerped follow value (smooths the scroll read)
  const idxRef = useRef(0);
  const indexElRef = useRef<HTMLSpanElement>(null);
  const nameElRef = useRef<HTMLSpanElement>(null);
  // `immediate` — cards follow the manually-smoothed value directly (no spring
  // re-targeting), and nothing calls setState during scroll, so the component never
  // re-renders and the interpolations stay stable → no jitter. The cylinder radius
  // `r` rides in the same spring (not a ref — reading a ref inside a render-created
  // interpolation trips react-hooks/refs) so radius changes re-run the interpolations.
  const [{ f, r }, api] = useSpring(() => ({ f: 0, r: DEFAULT_RADIUS }));

  // Re-measure the card's rendered height on mount and on resize, so the cylinder
  // radius (and therefore inter-card spacing) always matches the real card size at
  // the current breakpoint — otherwise the fixed-radius spacing only lines up at the
  // one viewport width it was tuned for, and every other width shows an overlap or a
  // gap.
  useEffect(() => {
    const updateRadius = () => {
      api.start({
        r: radiusForCardHeight(cardHeightForViewport(window.innerWidth)),
        immediate: true,
      });
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, [api]);

  useEffect(() => {
    const unsubscribe = subscribeToTicker(
      () => {
        const el = sectionRef.current;
        if (!el) return;
        const total = el.offsetHeight - window.innerHeight; // pinned scroll length
        const p = Math.min(
          Math.max(-el.getBoundingClientRect().top / Math.max(1, total), 0),
          1,
        );
        // Map the section's scroll to a card index that runs a SMALL amount past each
        // end (−OVERSCAN → count-1+OVERSCAN). A full card past each end left a dead gap
        // on entry (first card a whole step below centre) and an early exit (last card a
        // whole step gone); a fraction keeps the end cards essentially centred with just
        // a hint of motion, so there's no lead-in gap and the last card doesn't leave
        // early — but neither freezes perfectly still.
        const OVERSCAN = 0.2;
        const target = p * (count - 1 + OVERSCAN * 2) - OVERSCAN;
        // Low-pass the (cross-rAF) scroll read for a smooth follow.
        currentRef.current += (target - currentRef.current) * 0.14;
        api.start({ f: currentRef.current, immediate: true });

        const idx = Math.min(
          count - 1,
          Math.max(0, Math.round(currentRef.current)),
        );
        if (idx !== idxRef.current) {
          idxRef.current = idx;
          if (indexElRef.current) indexElRef.current.textContent = pad(idx + 1);
          if (nameElRef.current) nameElRef.current.textContent = items[idx].name;
        }
      },
      () => 0,
    );
    return unsubscribe;
  }, [api, count, items]);

  return (
    <section
      ref={sectionRef}
      aria-label={heading}
      className="relative bg-card-dark text-white"
      style={{ height: `${100 + (count - 1) * SCROLL_PER_CARD}vh` }}
    >
      <div className="sticky top-0 h-lvh overflow-hidden">
        {/* Blurred backdrop — each card's photo, cross-fading to the focused one and
            drifting bottom-to-top with scroll. Dimmed so the cards + caption stay
            dominant. Sits behind everything (first child). */}
        <div className="absolute inset-0" aria-hidden="true">
          {items.map((item, i) => (
            <animated.div
              key={item.name}
              suppressHydrationWarning
              className="absolute inset-0 [will-change:transform,opacity]"
              style={{
                opacity: f.to((v) => backdropFrame(i, v).opacity),
                transform: f.to((v) => backdropFrame(i, v).transform),
              }}
            >
              <Image
                src={item.image}
                alt=""
                fill
                sizes="60vw"
                quality={30}
                className="object-cover object-top blur-2xl"
              />
            </animated.div>
          ))}
          <div className="absolute inset-0 bg-card-dark/55" />
        </div>

        {/* Soft shadow keeps the pinned heading legible while the taller cards pass
            behind it (they now reach up into the heading band — ADR-0023). */}
        <AnimatedHeading
          as="h2"
          className="absolute inset-x-0 top-24 z-30 text-center text-[2rem] font-light leading-[0.95] tracking-tight [text-shadow:0_2px_24px_rgba(0,0,0,0.85)] sm:text-[2.5rem] lg:text-[4rem]"
        >
          {heading}
        </AnimatedHeading>

        {/* 3D stage — cards on a cylinder; preserve-3d sorts them by depth
            (no animated z-index, which was causing the flicker/jitter). */}
        <div className="absolute inset-0 [perspective:1900px] [transform-style:preserve-3d]">
          {items.map((item, i) => (
            <animated.div
              key={item.name}
              suppressHydrationWarning
              className="absolute left-1/2 top-1/2 aspect-[3/4] w-[85vw] max-w-[32rem] overflow-hidden rounded-3xl bg-card-dark shadow-2xl [backface-visibility:hidden] [will-change:transform]"
              style={{
                transform: to([f, r], (v, radius) => cardFrame(i, v, radius).transform),
                opacity: to([f, r], (v, radius) => cardFrame(i, v, radius).opacity),
              }}
            >
              {/* 3:4 card matches the god portraits' intrinsic 1086×1448 ratio exactly —
                  the full icon shows, nothing is cropped away. */}
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 85vw, 512px"
                className="object-cover"
              />
              {/* Scrim only on the off-focus cards — the centred (focused) card stays
                  clear; neighbours dim with distance so the stack keeps depth. */}
              <animated.div
                aria-hidden="true"
                suppressHydrationWarning
                className="absolute inset-0 bg-black"
                style={{ opacity: f.to((v) => scrimOpacity(i, v)) }}
              />
            </animated.div>
          ))}
        </div>

        {/* Metadata row — index left, name centred, view button right */}
        <div className="pointer-events-none absolute inset-x-4 top-1/2 z-30 grid -translate-y-1/2 grid-cols-[auto_1fr_auto] items-center gap-4 text-sm tracking-wide sm:inset-x-8 sm:gap-6">
          <span className="justify-self-start tabular-nums text-white/50">
            <span ref={indexElRef}>{pad(1)}</span> / {pad(count)}
          </span>
          <span
            ref={nameElRef}
            className="justify-self-center truncate text-lg leading-snug tracking-tight text-white sm:text-2xl"
          >
            {items[0].name}
          </span>
          <Link
            href={viewHref}
            className="pointer-events-auto justify-self-end whitespace-nowrap rounded-full border border-white/25 px-5 py-2.5 text-sm font-medium text-white/80 hover:border-white/60 hover:text-white sm:px-6 sm:py-3"
          >
            {viewLabel}
          </Link>
        </div>
      </div>
    </section>
  );
};
