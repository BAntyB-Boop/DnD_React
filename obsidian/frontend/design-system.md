---
tags: [frontend, design-system, stable]
updated: 2026-07-04
---

# Design System — Tailwind v4

Styling uses **Tailwind CSS v4**, configured entirely in CSS. There is **no
`tailwind.config.js`**. ADR: [[decisions-log]] ADR-0004.

## Where config lives

`src/app/globals.css` is the single config file:

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-onest);
}
```

Extra CSS layers can be split into `src/style/index.css` and imported.

## Design tokens

All colours, spacing, font sizes, radii, and shadows are **tokens** declared under
`:root` (raw values) and `@theme inline` (Tailwind bindings).

Once a token is in `@theme`, it becomes a utility automatically:

| Token | Generated utilities |
|-------|--------------------|
| `--color-brand` | `bg-brand`, `text-brand`, `border-brand` |
| `--radius-card` | `rounded-card` |
| `--spacing-section` | `pt-section`, `mt-section`, … |

> [!important] The token rule
> **Never** hardcode hex values, pixel spacing, or named colours in `className` or
> inline styles. If a value doesn't exist as a token, **add it to `globals.css`
> first** — with a comment noting where it came from (e.g. a Figma frame).

## CSS layers

Every custom style goes inside a layer — never outside one:

```css
@layer base {        /* element resets & defaults: h1, p, a … */ }
@layer components {  /* pseudo-elements & 3rd-party overrides only — see below */ }
@layer utilities {   /* single-purpose helpers: .scrollbar-none … */ }
```

## Where a style goes (ADR-0012)

`globals.css` is **not** a place to park component styles — it holds tokens and
base resets and stays a few hundred lines forever. Follow this order; the first
match wins:

| Situation | Goes where |
|-----------|-----------|
| One-off styling | Tailwind utilities in `className` — nothing in CSS |
| Repeated pattern with markup / structure / props | a **React component** in `components/ui/` |
| Repeated *pure-utility* combo, no structure | a Tailwind v4 `@utility` |
| Pseudo-elements, 3rd-party DOM overrides, complex selectors | `@layer components` — the genuine exceptions |
| A new colour / spacing / radius value | a **token** in `:root` + `@theme` |

> [!important] The default answer to "this looks repeated" is a **React
> component**, not a CSS class. An eyebrow label with a `::before` dot is an
> `<Eyebrow>` component — not a `.label-eyebrow` global class. `@layer
> components` is for what utilities and components genuinely *cannot* express.

There are **no CSS Modules** in this project — utilities + components cover
every case (motion is spring-based, so there are no keyframes to co-locate).

## Current theme state

**Retinted for "The Veiled Codex" (ADR-0017, 2026-07-06)** — the token *names* and every
component that consumes them are unchanged; only the hex *values* in `:root` were swapped,
gold/black/parchment replacing the original fintech blue/purple. New base tokens:
`--gold #c9a45c`, `--gold-dim #8a6f3a`, `--gold-bright #f6efd2`, `--gold-deep #5a4622`,
`--bg-deep #07070a`, `--bg-paper #0e0e13`, `--bg-card #15151c`, `--line #2a2a35`,
`--ink #e8e0d0`, `--ink-mute #7a7461`, `--blood #8c2222` — ported from the original static
site's recurring `:root` palette. `background` / `foreground` (default Tailwind
light/dark-mode vars) are unchanged and still flip via `@media (prefers-color-scheme: dark)`.

Home-hero tokens (`--hero-base`, `--hero-stage`, `--hero-glow`) now alias `--bg-deep`,
`--gold-deep`, `--gold` respectively, feeding the same `@utility hero-gradient` no-WebGL
fallback (gold glows over black instead of cyan-over-blue). The dev controls panel still
tints `--hero-stage`/`--hero-glow` live. Note: the WebGL hero's *scene* colours are artwork
constants baked into the scene factory, **not** tokens — they were retinted gold/amber
separately, config-value-for-value, in ADR-0021 (`lib/three/plasma-burst-scene.ts`,
`chain.tsx`, `footer-scene.tsx`, `chain-scene.ts`'s chrome tint, and two colours baked
directly into `gradient-background-scene.ts`'s GLSL source) — none of this is reachable
from `globals.css`. See [[decisions-log]] ADR-0014, ADR-0017, ADR-0021.

Home-page section tokens, retinted in place (same names, new values): `--hero-page`
(was white, now warm parchment `#ece3ce` — the card gap when the hero shrinks, and the
Showcase/Product section backgrounds), `--logo` (was light-grey, now muted bronze
`#6b5e3f` for the folio-name marquee), `--accent-blue` / `--accent-lime` (about-heading
icon chips, now gold / blood-red), `--muted` (de-emphasised heading words), `--card-blue`
/ `--card-gray` / `--card-dark` (stats bento cards, now gold-deep / parchment / near-black),
`--plum` / `--lilac` / `--paper` (product explainer bento, now dark ink / parchment card /
parchment section — no longer purple), and the **site-footer** set `--footer` /
`--footer-fg` / `--footer-muted` (now black / parchment-ink / gold-dim instead of navy /
white / cool-grey). The **preloader** bar gradient `--preloader-from` / `--preloader-to`
is now a gold sweep (`--gold-bright` → `--gold`) instead of pale-to-royal blue. Utility
class names are all unchanged (`bg-hero-page`, `text-plum`, `bg-footer`, etc.) — see
[[decisions-log]] ADR-0017 for why a full reskin needed zero component edits.
`--spacing-page-gutter` (`120px` → `px-page-gutter`) is unchanged.

## Typography

**"The Veiled Codex" reskin (ADR-0017, 2026-07-06):** the starter's Mulish font was
replaced. Body copy is **Cormorant Garamond** (`next/font/google`, variable
`--font-cormorant`, weights 400/500/600 + italic); headings (`h1`-`h4`, base layer rule)
are **Cinzel** (`--font-cinzel`, weights 400/500/600). Both loaded in
`src/app/layout.tsx` and exposed on `<body>`; `globals.css` sets
`body { font-family: var(--font-cormorant) … }` directly and binds
`--font-sans: var(--font-cormorant)` / `--font-heading: var(--font-cinzel)` in `@theme`.
`src/app/fonts/` (the old local Mulish `.ttf` files) was removed — fonts are Google-hosted
via `next/font/google` now, no local files to keep in sync.

## Buttons

One shared button shape across the site (the hero primary is the reference), applied
as inline utilities:

- **Base:** `rounded-full px-6 py-3 text-sm font-medium` — normal case (no `uppercase`),
  no tracking overrides, no icon/arrow.
- **Filled:** add a solid fill + contrasting text — `bg-black text-white hover:bg-black/90`
  on light sections; the hero's on-dark primary is `bg-white text-black`.
- **Outline:** same base but `border` + transparent fill, inheriting/among the section's
  text colour (e.g. `border-black/30 text-black hover:bg-black hover:text-hero-page`;
  on dark sections `border-white/25` / `border-footer-fg/40`).

**Exceptions:** the fixed header pill (`site-nav`) keeps its own `h-11` sizing; the hero
secondary "Learn more" is a plain underlined text link, not a pill.

## Styling rules

- Use utilities in JSX `className`; keep class strings short and readable.
- Extract a repeated pattern to a **React component** — not a `@layer
  components` class. See *Where a style goes* above (ADR-0012).
- Mobile-first responsive: `sm:` / `md:` / `lg:` / `xl:` prefixes.
- Dark mode: `dark:` prefix or token overrides in a `prefers-color-scheme` block.
- No inline `style` except for dynamic values (e.g. spring-animated values).

## Related

[[component-conventions]] · [[animation-system]] · [[new-page]]
