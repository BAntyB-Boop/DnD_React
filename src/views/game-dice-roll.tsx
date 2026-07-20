"use client";

// The d20 display for a "roll" choice. Reuses story-timeline.tsx's split-flap
// digit technique (DIGITS/digitTransform/PLACES) instead of react-spring's
// declarative animation, which does not self-run in this codebase (ADR-0002/
// ADR-0015) — the strip's transform is written every frame from the shared
// ticker via `api.start({ value }, { immediate: true })`.
//
// On `rolling`, flickers through random 1-20 values for ~750ms, then eases
// onto `result` and holds. Once landed, `finished` flips true and the digits
// render as static spans — this build resets ticker-driven spring values to 0
// on a re-render after the ticker unsubscribes (see use-reveal-cascade.ts /
// animated-heading.tsx), and the EN/TH toggle triggers exactly that re-render,
// so a still-`animated` digit would blank out on a language switch mid-hold.
import { useEffect, useRef, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { subscribeToTicker } from "@/lib/animation/ticker";

export interface GameDiceRollProps {
  /** True while the /advance request is in flight — drives the flicker. */
  rolling: boolean;
  /** The server's real roll (1-20) — arrives once the request resolves. */
  result: number | null;
  dc: number;
  success: boolean | null;
}

const FLICKER_MS = 750;
const FLICKER_STEP_MS = 70;
const PLACES = [10, 1];
const DIGITS = Array.from({ length: 11 }, (_, n) => n % 10);

const digitTransform = (place: number) => (v: number) => {
  const q = v / place;
  return `translateY(${(-(Math.floor(q) % 10)).toFixed(3)}em)`;
};

export const GameDiceRoll = ({ rolling, result, dc, success }: GameDiceRollProps) => {
  const [{ value }, api] = useSpring(() => ({ value: 1 }));
  const [finished, setFinished] = useState(false);
  const [displayValue, setDisplayValue] = useState(1);
  const settledOnRef = useRef<number | null>(null);

  useEffect(() => {
    if (!rolling) return;

    setFinished(false);
    settledOnRef.current = null;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      // No flicker — jump straight to a neutral hold; the settle effect below
      // lands on the real result the instant it arrives.
      api.start({ value: 1, immediate: true });
      setDisplayValue(1);
      return;
    }

    let t0: number | null = null;
    let lastStep = 0;
    const unsubscribe = subscribeToTicker((time) => {
      if (t0 === null) t0 = time;
      const elapsed = time - t0;
      if (elapsed >= FLICKER_MS) {
        unsubscribe();
        return;
      }
      if (time - lastStep < FLICKER_STEP_MS) return;
      lastStep = time;
      const roll = 1 + Math.floor(Math.random() * 20);
      api.start({ value: roll, immediate: true });
      setDisplayValue(roll);
    }, () => 0);

    return () => unsubscribe();
  }, [rolling, api]);

  useEffect(() => {
    if (rolling || result === null || settledOnRef.current === result) return;
    settledOnRef.current = result;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      api.start({ value: result, immediate: true });
      setDisplayValue(result);
      setFinished(true);
      return;
    }

    let done = false;
    const unsubscribe = subscribeToTicker(() => {
      if (done) return;
      done = true;
      api.start({ value: result, immediate: true });
      setDisplayValue(result);
      setFinished(true);
      unsubscribe();
    }, () => 0);
    return () => unsubscribe();
  }, [rolling, result, api]);

  const successLabel =
    success === null ? null : success ? "Success" : "Failure";

  return (
    <div className="flex flex-col items-center gap-2" role="status" aria-live="polite">
      <div
        className="flex text-4xl font-semibold leading-none tracking-tight text-gold-bright tabular-nums"
        aria-hidden="true"
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
            {finished ? (
              <span
                className="flex h-[1em] items-center justify-center"
                style={{ transform: `translateY(0em)` }}
              >
                {Math.floor(displayValue / place) % 10}
              </span>
            ) : (
              <animated.span
                suppressHydrationWarning
                className="flex flex-col will-change-transform"
                style={{ transform: value.to(digitTransform(place)) }}
              >
                {DIGITS.map((n, di) => (
                  <span key={di} className="flex h-[1em] items-center justify-center">
                    {n}
                  </span>
                ))}
              </animated.span>
            )}
          </span>
        ))}
      </div>
      <span className="text-xs uppercase tracking-[0.2em] text-ink-mute">
        {`DC ${dc}`}
        {successLabel && finished ? ` — ${successLabel}` : ""}
      </span>
    </div>
  );
};
