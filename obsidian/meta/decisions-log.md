---
tags: [meta, decision]
updated: 2026-07-08
---

# Decisions Log (ADRs)

Architecture Decision Records. Each entry captures a choice, its context, and its
consequences. Use [[templates/adr-note]] for new entries. Newest first.

---

## ADR-0025 — /pantheon: Coming-Soon stub → roster + SSG per-god detail pages

- **Status:** Accepted
- **Date:** 2026-07-08

**Context.** `/pantheon` was the highest-traffic dead end: the nav's first item and the
home Works "Read the myth" CTA both land there, but it was a `ComingSoonView` stub. All
raw material already existed (portraits, epithets, accents, and the origin prose in
`story.ts`).

**Decision.** New `data/mocks/pantheon.ts` (`GodProfile[]`): slug, bilingual epithet/
blurb/domain/symbol/rites (drafted, user-editable), portrait, accent, and a `chapterId`
pointing at the god's chapter in `story.ts` — **the origin myth is not duplicated**;
detail pages pull the chapter prose by id (single source of truth). Routes:
- `/pantheon` (`views/pantheon.tsx` + `views/pantheon-grid.tsx`) — reuses `StoryHeader`
  (h1 + shared EN/TH toggle); a 3-col card grid, `<Inview mode="once">` column-staggered
  reveal + `<Hover>` lift, accent-tinted borders from data (inline style, story-chapter
  pattern). CTA to `/story` below.
- `/pantheon/[god]` (`views/god.tsx` + `views/god-details.tsx`) — SSG via
  `generateStaticParams` (7 pages), per-god `generateMetadata` (portrait as OG image),
  sticky portrait, facts `<dl>`, the chapter prose (image blocks skipped — the portrait
  leads the page), prev/next circle navigation.
- SEO: `ItemList` JSON-LD on the roster, `Person` JSON-LD per god; `sitemap.ts` now
  lists `/story`, `/pantheon`, and the 7 god URLs (stubs stay out).

**Fix uncovered en route: reveal-cascade reset on re-render.** Toggling EN/TH on a god
page blanked the `AnimatedHeading` h1. Root cause: in this project's react-spring build,
ticker-driven spring values (set per-frame via `api.start({ …, immediate: true })`)
**reset to their initial value when the component re-renders** after the driving ticker
unsubscribes — the same build quirk ADR-0015 and the Inview/Hover comments dance around.
`use-reveal-cascade` (components/common — not the protected engine) now exposes a
`finished` flag, and `AnimatedHeading` renders letters statically once the cascade has
played. This also fixes the same latent bug on the `/story` header (and anywhere else
`AnimatedHeading` sits above re-rendering state). Other cascade consumers (hero, About,
bento) still bind to `p` — apply the `finished` path there if they ever gain
post-cascade re-renders.

**Consequences.** The pantheon flow is complete: home → roster → god → chronicle. The
worship-facing copy (domain/symbol/rites) is drafted content awaiting user review, not
canon. Remaining stubs: `/bestiary`, `/lore/*`, `/map/*`, `/oneshot/*`, `/sessions/*`.
Verified via `lint` + `next build` (21 static pages) + Playwright (roster + god pages,
EN/TH toggle, desktop + mobile, no console errors).

## Related

[[decisions-log]] · [[routing]] · [[seo-metadata]] · [[animation-system]]

---

## ADR-0024 — /story chapters: stacked prose sections → Ascent-style scroll-pinned timeline

- **Status:** Accepted
- **Date:** 2026-07-08

**Context.** The user supplied a GetLayers "Roadmap Ascent" source bundle
(`Downloads/time/roadmap-ascent.html` — a self-contained scroll-pinned HTML/CSS/JS
section) and asked for the "slide" part of the site to adopt its presentation with the
existing content unchanged. This was first (mis)applied to the home page's Works card
stack; the user clarified the target is the **/story page**, so the Works port was
reverted (never committed) and the same treatment was rebuilt around the chronicle
chapters instead.

**Decision.** New `views/story-timeline.tsx` (`StoryTimeline`) replaces the stacked
`StoryChapterSection` list inside `StoryView`. The section pins (sticky) over
`100 + (count−1)·85vh`; a spine of chapter markers (full `number` on desktop, `roman`
on mobile) scrolls through a fixed node with a conic progress ring, cross-fading chapter
icons (first `image` block; the Prologue has none and shows a gold ✦), a split-flap
odometer (`01/08`), and a reading panel showing the centred chapter's full bilingual
prose. Rule-compliant conversions from the source HTML, mirroring the earlier Works
study: `rise`/`bob` keyframes → springs, sin-wave glow → looping duration spring, scroll
listener → the shared ticker feeding `useSpring({ f, s }, immediate: true)`, hardcoded
hex → tokens/`color-mix` (chapter `accent` hexes come from data, applied inline — same
pattern `story-chapter.tsx` used). Two deliberate deviations from the Works/ADR-0023
pattern, both because chapters are variable-length bilingual block lists:
- **The active chapter is React state**, set only when the *rounded* index crosses to
  another chapter (≤ 1 re-render per chapter, never per frame) — ref `textContent`
  mutation can't swap a block list, and the EN/TH toggle re-renders anyway.
- **Every chapter stays in the DOM** (`hidden` when not centred) so SSR/SEO keeps the
  full chronicle text; plate/caption lines from `image` blocks are preserved as a small
  italic line above the prose.
The prose container is `overflow-y-auto` with `data-lenis-prevent` (Lenis exemption) as
a safety net for short viewports, with a bottom mask fade + `pb-10` so the last line
never sits inside the fade when fully scrolled. To keep that safety net from ever
*showing* (a native scrollbar appeared mid-panel on ~765px-tall laptops), the desktop
typography is **viewport-height-clamped** — title `clamp(1.6rem,4.2vh,2.5rem)`, prose
`clamp(0.8125rem,1.9vh,1rem)`, odometer `clamp(2.75rem,6.5vh,3.75rem)`, block gap
`clamp(0.65rem,1.6vh,1rem)` — so every chapter fits the pinned viewport, and the
scrollbar itself is hidden (`scrollbar-width:none` + `::-webkit-scrollbar` hidden). The
Ascent's **gold pixel-cube canvas field** is also ported here (same seeded `buildPix`/
`drawPix` drawn in the same ticker callback, colour read from the `--gold` token):
desktop-only, right 42vw, at `PIX_ALPHA = 0.2` — roughly a third of the home-page
study's brightness — so it reads as ambience behind the illustration card and never
competes with the prose.

**Consequences.** `views/story-chapter.tsx` (`StoryChapterSection`) is deleted — the
timeline renders chapters itself. Chapter illustrations survive in three forms: a
**sharp 3:4 portrait card on the desktop right column** (cross-fading with the centred
chapter, accent-tinted border, `aria-hidden` — it duplicates the in-prose figure), the
**in-prose `<figure>`** (image visible on mobile only via `md:hidden`, its
plate/caption `figcaption` visible everywhere), plus the node icon and blurred backdrop
wash. ADR-0019's intrinsic-size/no-crop rule holds on mobile (`width`/`height` from the
block); the desktop card uses `aspect-[3/4]` + `object-cover object-top`, which is the
portraits' exact intrinsic ratio, so cropping is nil. `StoryHeader` (with the EN/TH
toggle) and `StoryClosingSection` are unchanged, before/after the timeline. The home
page Works card stack is untouched (ADR-0023 still describes it). Verified via `lint` +
`next build` + a Playwright scroll pass (desktop EN/TH + mobile, no console errors).

## Related

[[decisions-log]] · [[animation-system]] · [[smooth-scroll]] · [[html-semantics]]

---

## ADR-0021 — Retint the WebGL scenes (hero burst, chain, footer) from blue to gold

- **Status:** Accepted
- **Date:** 2026-07-06

**Context.** ADR-0017 retinted every CSS design token but explicitly left the WebGL scene
colours alone, since they're artwork constants baked into the scene factories, not tokens
(ADR-0014). The user flagged that the home page background was still visibly blue — right,
since the CSS `hero-gradient` utility (already gold) is only a no-WebGL fallback; the
actual visible backdrop comes from `lib/three/gradient-background-scene.ts`, driven by
colours the caller passes in, which were still the original blue/violet values.

**Decision.** Retinted every WebGL colour constant to gold/amber, config-value-for-value
(no structural changes): `plasma-burst-scene.ts`'s `defaultPlasmaConfig` (stageColor,
glowColor, colCore/Inner/Mid/Outer, coreColor, coreHalo) and the fixed `colPink` spark
tint; `chain.tsx` and `footer-scene.tsx`'s local `BASE`/`LIGHT` constants (same values,
kept in sync since both feed the same gradient-background factory); `chain-scene.ts`'s
`defaultChainMaterial.color` (the chrome tint shared by the chain link and footer heart
models, cool lavender-blue → warm champagne-silver). The deepest fix: **two colours were
hardcoded directly in the GLSL fragment shader source** in
`gradient-background-scene.ts` (`navy` for the dark blob mass, `ltblue` for the top-right
glow) — these are *not* uniforms, so changing `defaultPlasmaConfig` alone did not fully
fix the backdrop; the top-right corner stayed blue until the shader source itself was
edited. Both are now warm (dark brown-black / amber glow).

**Consequences.** The whole home page (hero burst, chain, footer) now reads gold/black
end to end, no blue remaining anywhere. The three.js chrome material's `envMapIntensity`/
`roughness`/`metalness` tuning was left untouched — chrome reflects its environment
regardless of base tint, so the model still reads as metal. If a future scene reuses this
gradient-background factory, remember the shader's `navy`/`ltblue` constants are baked in,
not passed through `GradientBackgroundColors`.

## Related

[[decisions-log]] · [[design-system]]

---

## ADR-0023 — Works cards: 16:10 landscape → 3:4 portrait; tighter cylinder step

- **Status:** Accepted (amended 2026-07-07)
- **Date:** 2026-07-06

> [!note] Amendment (2026-07-07)
> The fixed `RADIUS = 1350` described below was superseded upstream: the cylinder radius
> is now **derived live from the rendered card height** (`radiusForCardHeight(
> cardHeightForViewport(window.innerWidth))`, re-measured on resize), so the outgoing and
> incoming cards meet edge-to-edge at *every* viewport width instead of only the one
> width the constant was tuned for. The radius rides in the same react-spring value set
> as the scroll index (`useSpring(() => ({ f, r }))`, combined via `to([f, r], …)`) —
> not a ref, because reading `ref.current` inside a render-created interpolation trips
> the `react-hooks/refs` lint rule. `DEFAULT_RADIUS` (desktop-width) covers SSR/first
> paint.

**Context.** After the god portraits landed (ADR-0022), the Works section's scroll
transitions read as broken: between one card leaving and the next arriving there was a
~270px band of empty backdrop, so the "strip" of cards visibly disconnected. This was a
deliberate constant in the starter (`RADIUS·sin(STEP)` ≈ 730px spacing vs ~460px card
height, chosen so 16:10 cards "never collide"), but with only a name label between
cards it reads as a gap, not breathing room. Separately, the outgoing card slides
through the pinned heading's band, leaving white text over bright artwork.

**Decision.** (1) Cards are now `aspect-[3/4] w-[85vw] max-w-[32rem]` (512×683 on
desktop) — the exact intrinsic ratio of the god portraits (1086×1448), so the full icon
displays with zero cropping and `object-top` is no longer needed on the card image
(kept on the blurred backdrop, where cover-cropping still applies). (2) `STEP` 27→29deg
with `RADIUS` unchanged: spacing ≈ 654px is now slightly *less* than the 683px card
height, so adjacent cards overlap by a sliver mid-transition and read as one continuous
strip. (3) The pinned heading gets a soft `text-shadow` so it stays legible while the
taller cards pass behind it — the pass-behind itself is kept (it's the template's
overlay look), only legibility was fixed.

**Consequences.** The starter's "never collide" spacing guarantee is intentionally
inverted — slight overlap is now the design. If future card content is landscape again,
revisit both the aspect and STEP together (they're tuned as a pair). The `sizes` hint on
the card image tracks the new 32rem max width.

## Related

[[decisions-log]] ADR-0019 · ADR-0022

---

## ADR-0022 — Full setting pivot: "The Veiled Codex" (fantasy) → "The Starbound Codex" (space pantheon)

- **Status:** Accepted
- **Date:** 2026-07-06

**Context.** The user asked to redo the campaign setting entirely as a Spelljammer-style
D&D-in-space myth: seven original gods (not the seven fantasy folio characters), each
ruling a distinct cosmic domain, born from a single world-ending event ("the Sundering").
AI-generated character/world art (painterly, sacred-icon style, gold/void-purple palette)
was supplied externally and brought in wholesale — 7 god portraits (1086×1448, 3:4) and 3
world illustrations (1672×941, 16:9): Nova Stellare (the free port, replacing Porto
Stellare), a star-chart of "the Drift" (replacing Borderland), and a shrine-in-the-market
scene (the new Chronicle-opener). The star-chart image had AI-hallucinated bonus lore baked
into it as rendered text (extra location names, and alternate god epithets — "The Weaver,
Lady of Fates" for Mirae; "The Navigator, Lord of the Crossing" for Vahn; "The Harbinger,
Voice of Unmaking" for Null; "The Sovereign, Crown of Silence" adopted for Ashe; "The
Ember, Daughter of Remains" adapted for Ren). The user chose to canonize these. Three
epithets on the chart (Reckoner, Forge, Hollow) don't map cleanly to any of the seven and
were left as unclaimed background lore — not retconned onto a god, so as not to force a fit.

**Decision.** This was a full content swap, not a new template pattern — every existing
component/section from ADR-0017–0021 was reused as-is, only the data changed:
- **Routes renamed** to match the new world: `/hero` → `/pantheon`, `/lore/porto-stellare`
  → `/lore/nova-stellare`, `/map/porto-stellare` → `/map/nova-stellare`,
  `/oneshot/porto-arrival` → `/oneshot/nova-arrival` (folder renames, not new routes).
- **Branding**: `siteConfig`, `manifest.json`, `package.json` name → "The Starbound Codex."
- **`data/mocks/home.ts`** rewritten: hero/about/stats/chain copy now tells the Sundering
  myth; `logos` marquee lists the 7 god names; `showcase` uses the 3 new world images;
  `works` uses the 7 god portraits with their epithet in the `year` field (repurposed, as
  it already was in ADR-0017/0019).
- **`data/mocks/story.ts`** rewritten from scratch: `/story` is no longer "the party comes
  together" — it's Prologue (the Sundering) + one chapter per god, each a short bilingual
  EN/TH origin myth (why they died, what task they never finished, why mortals worship
  them), reusing the `StoryChapter`/`StoryBlock`/per-chapter `accent` model from
  ADR-0018/0019 unchanged — each god's chapter uses their own portrait as the chapter
  image (intrinsic-sized, no crop, per ADR-0019) and a mood-matched accent hex.
- **Assets**: old fantasy assets deleted outright (`public/assets/characters/`,
  `world/city-borderland.png`, `world/map-borderland.png`, `story/` fantasy chapter
  images) — they have zero reuse value in the new setting. Also deleted the fully-orphaned
  `public/assets/images/` (the original Stride fintech stock photos ADR-0020 stopped
  *referencing* in code but never deleted from disk).

**Consequences.** `works.tsx`'s `object-top` crop fix (ADR-0019) still matters — the new
god portraits are 3:4 portraits forced into the section's 16:10 landscape card, and every
composition happens to have its focal point (face/head) in the upper portion, so the fix
transfers cleanly. Not yet built: an actual `/pantheon` roster page (currently a
`ComingSoonView` stub, same as before), individual per-god detail pages (the old fantasy
site's "folio" pages never got built either — this is a pre-existing gap, not a new one),
and 3 originally-planned bonus world illustrations (the Sundering-as-myth wide shot, a
bazaar scene, a derelict-ship graveyard) that were never generated — no code depends on
them; add them to `showcase`/`works` later if generated.

## Related

[[decisions-log]] · [[design-system]] · [[folder-structure]]

---

## ADR-0020 — QA pass: removed leftover fintech stock imagery; wired dead CTAs

- **Status:** Accepted
- **Date:** 2026-07-06

**Context.** A correctness/readiness audit (full route sweep + Playwright console/network
checks + visual scroll-through) turned up hardcoded image paths inside three view
components that ADR-0017's token-only reskin never touched, because they're not
props-driven content — they were literal `<Image src="...">` calls baked into the
component: `stats.tsx` used `/assets/images/2nd/people.png` (stock photo of people in
sunglasses) as the "collab" bento card's background and four stock headshot avatars
(`/assets/images/2nd/avatars/1-4.png`) under the commitment quote; `product.tsx` used
`/assets/images/6th.png`, a blue 3D render that is literally the old Stride brand's
graphic. Both directly violate [[component-conventions]]'s "no hardcoded content" rule —
they'd been missed because the reskin pass only audited `data/mocks/*.ts`. Separately, the
audit found `showcase.tsx`'s "Enter the archive", `works.tsx`'s "Read folio", and
`product.tsx`'s "Join a session" were plain `<button>`s with no `onClick`/`href` — dead
ends inherited from the original demo, acceptable there but not on a site meant to be
navigable now.

**Decision.** Removed the two hardcoded images outright rather than sourcing replacements —
no group/ensemble or "Codex"-branded 3D render exists yet, so both cards became solid
colour blocks (`bg-card-blue`/`bg-card-gray`, already used elsewhere in the same bentos),
recolouring `stats.tsx`'s collab-card text from `text-black` to `text-ink` since it no
longer sits over a photo+gradient. Converted the three dead buttons to `next/link`
`<Link>`s, each content-driven (`ShowcaseContent.ctaHref`, `WorksContent.viewHref`,
`ProductContent.ctaHref`) rather than hardcoded — pointed at `/hero` (the roster, until
individual folio pages exist) and `/oneshot/porto-arrival` respectively.

**Consequences.** Two false leads were investigated and ruled out during the same pass,
worth recording so they aren't re-litigated: (1) a hard `window.scrollTo()` jump during
headless testing intermittently desynced the Chain section's WebGL canvas paint from the
sticky layout, making the page background show through — confirmed fine under realistic
incremental scroll, not a real bug, an artefact of synthetic test scrolling bypassing
Lenis. (2) The mobile nav links appeared to overflow in a quick screenshot read; computed
`display: none` at 390px viewport confirmed it was correctly hidden — a misread, not a
bug. Known pre-existing, out-of-scope issue: the Cookie banner's "Accept all" button text
clips on narrow (~390px) viewports — untouched by this project's D&D content work,
inherited from the starter's Cookie component.

## Related

[[component-conventions]] · [[design-system]] · [[decisions-log]]

---

## ADR-0019 — Per-chapter accent colors; image crop fixes on Home + Story

- **Status:** Accepted
- **Date:** 2026-07-06

**Context.** User feedback after ADR-0017/0018 landed: (1) every `/story` chapter used the
same flat gold, with no visual distinction between moods; (2) the Home "Showcase" 4-card
grid included a hero portrait (`characters/dermogorgon/card.jpg`) mislabeled as "The
Bestiary" — Dermogorgon is a *folio character*, not a monster, and the site has no real
bestiary imagery yet, so the card was actively misleading; the "Chronicle" card also used
an unclear, out-of-context asset (`kael-climax-bottle.png`); (3) the Works roster cards
(`views/works.tsx`, `aspect-[16/10]` landscape, `object-cover` centered) were cropping
**tall character portraits** (most source images run ~0.5–0.8 width:height, e.g.
`jen/card.jpg` at 280×560) through a horizontal centre slice, cutting faces off; (4) the
`/story` chapter images were forced into a fixed `aspect-[16/9]` box, but the source
images range from portrait (`ch1-tavern.jpg`, 1152×1365) to near-landscape
(`ch4`-`ch6`, 1536×1024) — the portrait ones lost most of their frame to cropping.

**Decision.** (1) Added `accent: string` (hex) per chapter in `data/mocks/story.ts`,
applied via inline `style` (a legitimate "dynamic value" exception to the no-inline-style
rule) to the chapter-number label, roman numeral, and image caption/border in
`story-chapter.tsx` — mood-matched, still within the gothic palette (e.g. ch1 tavern
amber `#c68a45`, ch5 battle-fire orange `#e2652a`, ch6 night-sea blue `#3f6178`). (2)
Removed the Bestiary showcase card entirely and swapped "Chronicle" to a real, relevant
asset (`/assets/story/ch1-tavern.jpg`, now shared between Home and `/story`); dropped the
now-fully-unused `kael-climax-bottle.png`. `showcase.tsx`'s grid changed
`lg:grid-cols-4` → `lg:grid-cols-3` to match (data-coupled by design — see the note
inline). (3) Added `object-top` to both `<Image>`s in `works.tsx` so the crop keeps
faces instead of a random centre slice. (4) `story.ts` image blocks now carry real
`width`/`height`; `story-chapter.tsx` renders them via `next/image` at intrinsic size
(`h-auto w-full`, no `fill`/no forced aspect box) instead of cropping to a fixed ratio —
every chapter image now shows its full frame.

**Consequences.** Story images vary in displayed height per chapter now (by design — no
crop). Showcase is a 3-item grid until a real bestiary asset exists to justify a 4th card;
don't re-add a "Bestiary" pillar with a placeholder image. `object-top` is a blunt fix —
it assumes faces sit in the upper portion of each portrait, true for all six current
Works images but worth revisiting if a future character's card composition differs.

## Related

[[design-system]] · [[decisions-log]]

---

## ADR-0018 — /story built with a bilingual EN/TH block model + a global language store

- **Status:** Accepted
- **Date:** 2026-07-06

**Context.** The source `story.html` (2973 lines) is a heavily bespoke, scroll-scrubbed
"cosmic scale intro" page (an 11-layer pinned zoom sequence, a 3D galaxy canvas, film
grain, starfield) wrapping a prologue + 6 bilingual (EN/TH) narrative chapters. Porting the
intro sequence 1:1 would mean writing a new custom Three.js/scroll-scrub system outside
this template's spring-animation primitives — high effort, low reuse. The user asked for
the page to be rebuilt "using the template" instead of ported verbatim.

**Decision.** Rebuilt `/story` using only this template's existing primitives: `<Inview
mode="once">` for a per-chapter fade/rise reveal, `<AnimatedHeading>` for the per-letter
chapter-title reveal (both already used on `/` — no new animation code). Content shape:
`src/data/mocks/story.ts` exports `StoryContent` with a `StoryChapter[]`, each holding a
`blocks: StoryBlock[]` union (`{type:"p"}` / `{type:"list"}` / `{type:"image"}`) so
prose, bullet lists (ch3, ch6), and inline plates (ch5 has two mid-chapter) all model
naturally without special-casing. Every text block carries both `en` and `th` copy,
switched by a small Zustand store (`src/hooks/use-story-language.ts`, mirroring the
existing `useScroll` store pattern) rather than the original's whole-`<body>` class swap —
`StoryChapterSection` / `StoryHeader` / `StoryClosingSection` are the only client
components (they read the store); `story.tsx` itself stays a Server Component per the
hard rule. The shared `<SiteNav>` header (site-nav content extracted to
`src/data/mocks/site-nav.ts` so `/` and `/story` don't duplicate it) replaces the
original's minimal per-page `.back-link` — full nav is available on every route now, a
deliberate departure from the source's hub-and-spoke pattern.

**Consequences.** Not ported: the cosmic-scale scroll-scrub intro, the 3D galaxy canvas,
film grain/starfield ambience, and the closing 3D paper-ship scene — these were
custom-built for the vanilla site and are out of scope for a template-based rebuild;
revisit only if asked for bespoke WebGL work on this route specifically. All prose is
real content transcribed from `story.html` (not paraphrased/invented) to keep the
narrative accurate. Verified via `next build` + a Playwright pass exercising the EN/TH
toggle (no console errors).

## Related

[[new-page]] · [[animation-system]] · [[folder-structure]]

---

## ADR-0017 — Reskin to "The Veiled Codex" via design tokens only; no component edits

- **Status:** Accepted
- **Date:** 2026-07-06

**Context.** This starter is being repurposed as the frontend for a D&D 5e campaign site
("The Veiled Codex"), migrating content from a separate vanilla HTML/CSS/JS project
(`dnd-dm-agent/src/web/public`). The starter's demo home page (Hero, LogoMarquee, About,
Stats, Showcase, Works, Chain, Product, ContactForm, SiteFooter) ships with fintech
placeholder copy ("Stride", "Northwind", "Ledgerly") for a **different, unrelated brand**.
Rebuilding every section from scratch would throw away a working spring-animation layout;
editing every view's hardcoded Tailwind utility classes (`text-black`, `bg-plum`, etc.) to
reskin colors would be a much larger, riskier diff.

**Decision.** Reskin entirely through `app/globals.css` tokens — repoint the *existing*
token values (`--hero-page`, `--plum`, `--lilac`, `--footer`, `--card-blue/gray/dark`,
`--accent-blue/lime`, `--logo`, `--preloader-from/to`, etc.) from the fintech blue/purple
palette to the Codex's gold/black/parchment palette (`--gold #c9a45c`, `--bg-deep #07070a`,
`--hero-page` repurposed as warm parchment `#ece3ce`), ported from the original site's
recurring `:root` variables. Zero section components were edited for color — only their
content (`src/data/mocks/*.ts`) and the `SiteNav`/`Preloader` (which had a hardcoded brand
name/icon, not a content prop — see below). Fonts switched from local Mulish to
`next/font/google` Cinzel (headings, via `--font-cinzel` + a `h1-h4` base rule) + Cormorant
Garamond (body, `--font-cormorant`), matching the original site. Added a shared `SigilIcon`
(`components/ui/sigil-icon.tsx`) used by both `SiteNav` and `Preloader` — the latter had
"Stride" + a bolt-icon hardcoded inline; it now reads `siteConfig.name` and uses the sigil.
`SiteNav`'s `items` changed from `string[]` (rendered as inert `href="#"`) to
`{label, href}[]` with real `next/link` navigation, since functional nav to the new routes
is required, not cosmetic. Six placeholder routes (`/hero`, `/story`, `/bestiary`,
`/lore/porto-stellare`, `/map/porto-stellare`, `/oneshot/porto-arrival`) were added via a
shared `views/coming-soon.tsx` so the new nav doesn't 404 while those pages are pending.

**Consequences.** The WebGL scene shader colours (`lib/three/plasma-burst-scene.ts`,
`chain-scene.ts`, `gradient-background-scene.ts`) are **artwork constants, not tokens**
(ADR-0014) and were *not* retinted — the hero burst and chain backdrop still render in
blue. Retinting them is a follow-up (real WebGL/shader work, out of scope for a CSS-token
pass). Character/world imagery was copied from the source project into
`public/assets/characters/<slug>/card.jpg` and `public/assets/world/` (one folder per
section, per [[folder-structure]]). The seven folio characters (Aurora, Aython, Kael
Veranth, Anuchit, Kael Vorn, Jen, Dermogorgon) and their confirmed classes were
cross-checked against the source folio HTML files to avoid inventing lore. Still pending:
full migration of `/hero` (roster), `/story` (chronicle), `/bestiary` (dnd5eapi.co-backed),
`/lore/porto-stellare`, `/map/porto-stellare`, `/oneshot/*`, `/sessions/session-1`, the 7
bespoke folio pages, and `game.html`'s live DM dashboard (the one page with a real
stateful backend — see the source survey in this session's transcript for the full page
inventory and API-dependency breakdown).

## Related

[[design-system]] · [[new-page]] · [[folder-structure]]

---

## ADR-0016 — WebGL scenes render only while on-screen (visibility-gated loops + shader precompile)

- **Status:** Accepted
- **Date:** 2026-07-05

**Context.** The page mounts three self-running WebGL scenes — the hero plasma burst
(`lib/three/plasma-burst-scene.ts`, with a bloom `EffectComposer`) and two chrome models
sharing `lib/three/chain-scene.ts` (the chain + the footer heart, each with a PMREM
environment). Each owned an unconditional `requestAnimationFrame` loop that ran from mount to
unmount, so **all three rendered every frame even while scrolled far off-screen** — the main
cause of scroll jank. Separately, three.js compiles a material's GL program lazily on its
**first render**, so a chrome model hitched the moment it scrolled into view.

**Decision.** (1) Gate every render loop on an `IntersectionObserver` over the canvas's
parent section (`rootMargin` ~200–300px so it spins up just before entering view): start the
rAF loop on intersect, `cancelAnimationFrame` + stop on exit. On resume the loops reset their
time/scroll baselines (`lastT`, `lastScroll`) so a paused gap doesn't step `dt` or inject a
spin spike. (2) In `chain-scene.ts`, call `renderer.compile(scene, camera)` right after the
GLB loads (off the scroll path), so the first on-screen frame doesn't JIT-compile the chrome
shader. The one-shot gradient backdrops (`gradient-background-scene.ts`) already render once,
so they were left alone.

**Consequences.** Only the section(s) actually on screen render, freeing the main thread while
the user reads other sections; the model shaders are warm before they appear. Reduced-motion
still draws a single static frame (no loop to gate). Trade-off: a scene is idle (last frame
frozen) while off-screen — invisible in practice thanks to the `rootMargin` lead. These files
are the WebGL subsystem (exempt from ADR-0002), not the spring engine, so no sign-off needed.

---

## ADR-0015 — Hero title per-letter animation via the shared ticker (spring-text-engine unusable)

- **Status:** Accepted
- **Date:** 2026-07-04

**Context.** The home hero title needed a per-letter intro (each letter rising from below
with a soft blur + fade). ADR-0002 mandates that **text** animation go through
**`spring-text-engine`**. In practice that engine does **not** work in this project:
`spring-text-engine@0.1.5` (the latest published — no newer version exists) renders letters
straight to their **end state on mount** under the installed `@react-spring/web@10` — its
spring config is ignored (peer range allows `>=9`, but v10 broke the API the engine uses).
This was never noticed because **nothing in the codebase used TextEngine before.**

Digging further: react-spring's own **self-running** `from→to` springs (`useSpring`/`useTrail`,
declarative or via `enabled`-flip) also don't progress here — they snap to the target. The
**only** animation mechanism that actually runs in this project is driving a spring value
**imperatively every frame from the shared ticker** (`subscribeToTicker` + `api.start({…},
immediate:true)`), which is exactly how the hero shrink, works card stack, and chain scene
animate. (react-spring's frameloop appears not to advance declarative springs in this build.)

**Decision.** Animate the hero title per-letter with the **shared-ticker drive**, not
spring-text-engine. `src/views/hero-title.tsx` (a client leaf) advances one react-spring
value `p` 0→1 over a duration from the ticker; each letter derives its opacity / rise / blur
from `p` with a per-letter stagger and an `easeOutQuart`. The old per-line inverted gradient
is preserved as each letter's **target opacity** (a per-letter alpha ramp — a `bg-clip-text`
gradient can't survive per-letter transforms). Accessibility: the `<h1>` keeps the full
`aria-label`; letters are `aria-hidden`. Reduced motion jumps straight to `p=1`.

This is a **scoped exception** to "text animation uses spring-text-engine" (ADR-0002 hard
rule) — taken only because that engine is non-functional under the pinned react-spring.

**Consequences.** `spring-text-engine` stays effectively unusable until the dependency is
resolved (downgrade react-spring to v9 — risky, the protected vendored engine is built on
v10 — or a v10-compatible engine release). Any future per-letter/word text animation should
use the same ticker-drive pattern (or fix the dep). See [[text-engine]] (warning) and
[[changelog]].

---

## ADR-0014 — Three.js WebGL scene for the home hero

- **Status:** Accepted
- **Date:** 2026-07-01

**Context.** The home hero needed a rich animated "Plasma Burst" — a white-hot core
erupting into curling electric-violet filaments with twinkling sparks. This is a
real-time GPU particle/shader effect (custom GLSL, additive blending, an UnrealBloom
postprocessing chain), which `@react-spring/web` (ADR-0002) does not and should not
express — that engine drives DOM/CSS-property motion, not a WebGL render target.
(The scene originally also had mouse-tilt + click-shock interaction; those were
removed. It turntable-spins and now also has a **cursor magnet** — filament tips lean
toward the pointer, applied in view space in the line vertex shader — plus an **intro**
(fade + scale-up + spin-up) gated on the `started` flag from the [[components/common|preloader
store]], so the burst appears only after the first-load preloader finishes. See [[changelog]].)

**Decision.** Introduce **Three.js (`three`, pinned `0.143.0`)** for canvas/WebGL
artwork, and scope ADR-0002 explicitly:

- **ADR-0002 governs DOM/UI motion.** "All motion is spring-based" means the spring
  system is the only way to animate DOM elements / CSS properties — no
  `framer-motion`, no CSS transitions/keyframes. A `<canvas>` WebGL scene is a
  different medium and is exempt; it owns its own `requestAnimationFrame` loop,
  isolated from the shared spring ticker.
- **Placement.** The heavy, framework-agnostic scene lives in a factory —
  `src/lib/three/plasma-burst-scene.ts` (`createPlasmaBurst(canvas, opts)` →
  `{ dispose }`). A thin `"use client"` leaf, `src/views/plasma-burst.tsx`, only
  mounts/disposes it (feature-specific, so it sits next to the view, not in
  `components/`). `HomeView` stays a Server Component (hard rule #6).
- **Compositing.** The scene renders exactly as designed — additive plasma on pure
  **black** under bloom. Behind it is a **second WebGL layer** — a static fragment
  shader (`gradient-background-scene`) painting a grainy blue gradient with organic
  dark clouds. The burst canvas composites onto it with CSS **`mix-blend-lighten`**,
  so black reads as the backdrop and only the bright burst punches through. This
  keeps additive+bloom on black (where it works) instead of washing out over a
  coloured clear. Scene tuning deviates from the source spec where the composition
  demands it (camera pulled back, bloom threshold raised off 0 and tightened, global
  brightness lowered, core tamed, sparks recoloured to white shades) — see the
  factory header for the annotated deltas. (The backdrop evolved: solid rounded blue
  "card" → full-bleed CSS gradient → the current shader backdrop, with the CSS
  `hero-gradient` kept as a no-WebGL fallback — see [[changelog]].)
- **Design tokens vs scene constants.** The backdrop gradient colours are **design
  tokens** in `globals.css` (`--hero-base`/`--hero-stage`/`--hero-glow`). The scene's
  shader/geometry constants are **artwork parameters**, hardcoded in the factory —
  they are not design tokens and the token rule (ADR-0004/0012) does not apply.
- **Accessibility.** The canvas honours `prefers-reduced-motion` (renders a single
  static frame, no loop), carries `role="img"` + a label, and fails safe (a WebGL
  failure leaves the gradient backdrop visible).
- **Tunability.** The factory is config-driven — `createPlasmaBurst(canvas, {config})`
  plus a live `update(config)` (uniform/bloom/camera changes apply instantly;
  structural changes rebuild geometry in place). `PlasmaConfig` +
  `defaultPlasmaConfig` are exported as the single source of the tuned values. A
  **development-only** controls panel (`src/views/plasma-controls.tsx`) exposes them
  as sliders + colour pickers with a copy-out JSON export; it is gated on
  `NODE_ENV` so it never ships to production. The tuned defaults in
  `defaultPlasmaConfig` are what render in prod.
  - **Reused by the chain model.** `createChainScene` follows the same shape —
    `ChainMaterialConfig` + `defaultChainMaterial` exported, a live `update(material)`
    on the handle, and a dev-only `src/views/chain-controls.tsx` panel (pinned
    top-**left** to clear the Plasma panel top-right) tuning the chrome look
    (tint, metalness, roughness, reflection/`envMapIntensity`, tone-mapping exposure).
    The model's chrome is a **material look**, not a design token — same reasoning as
    the scene constants above. `createChainScene` is a **general chrome-model scene**:
    the caller drives the model's vertical position each frame via `progress`
    (0 above → .5 centre → 1 below) and picks a `spinDirection` (+1/−1). It drives
    both models — the **chain**'s progress is driven off the layered **wrapper's**
    scroll (the pinned section's `rect.top` is frozen at 0 through the pin) in two
    continuous phases: fly-in (`wrap.top` vh→0 maps top-edge → centre) then a slow drift
    (`wrap.top` 0→−pinDist maps centre → out the bottom, `pinDist ≈ Product height`), so
    it gently keeps falling as the Product slides up rather than freezing at centre and
    dropping abruptly. That target is **low-passed** (`fall += (target − fall)·0.12`) so
    it eases in instead of tracking scroll 1:1 (which felt rigid), and it spins with
    **scroll momentum** (`scrollSpin: true`, tuned up via the optional `spinAccel`/`maxSpin`
    overrides) — scrolling visibly speeds up the turn, easing back to idle; the **footer
    heart** (`views/footer-scene.tsx`,
    `heart.glb`) flies in with parallax (progress tied to the footer's scroll position,
    settling at centre) and spins the opposite way (`spinDirection: -1`, scroll-momentum
    spin).

**Consequences.** First 3D dependency (`three` + `@types/three`, both `0.143.0`);
first `src/lib/three/` and `src/data/mocks/`. The starter's `body` flex-centering
(a placeholder for the empty page) was removed so real full-width layouts work.
`@types/three@0.143` lacks `EffectComposer.dispose()` (present at runtime) — called
through a narrow type, not `any`. Turbopack bundles the r0.143 `examples/jsm`
addons without config. See [[tech-stack]] and [[changelog]].

---

## ADR-0013 — `<Inview>` self-observe fix; spring components honour resize

- **Status:** Accepted
- **Date:** 2026-06-07

**Context.** `<Inview>` only animated when an external `trigger` ref was passed.
Without one it never revealed. Root cause: `useDynamicInView` returns its target
attachment as a **callback ref** (`setNode`) in the first tuple slot, but
`in-view.tsx` destructured it as `inViewRef` and wrote `inViewRef.current = node`
in the JSX `ref` callback — assigning `.current` to a function instead of calling
it. `setNode` never ran, the observed `node` stayed `null`, and with no `trigger`
the observer had nothing to watch (`trigger?.current ?? node` → `null`). With a
`trigger` it worked only because `trigger.current` bypassed the dead `node` path.
TypeScript flagged this at build time (`Property 'current' does not exist on type
'TargetRefCallback'`), so the build was already failing.

Separately, `<Inview>`, `<Spring>`, and `<Hover>` tracked `width`
(`useWindowWidth()`) as a `useMemo`/`useEffect` dependency to re-evaluate mobile
gating on resize, but never passed it to `isMobileDisabled()` — so the value was
genuinely unused (ESLint `react-hooks/exhaustive-deps` warning) **and** resize
re-evaluation silently did nothing; the check always read `window.innerWidth` at
call time.

**Decision.** This is the second authorized edit to the `#do-not-modify` engine
(after ADR-0009). Two corrections:
1. In `in-view.tsx`, call the callback ref — `setInViewNode(node)` — instead of
   assigning `.current`, so the component observes itself when no `trigger` is
   given.
2. Pass the React-tracked `width` into every `isMobileDisabled(value, width)`
   call across `in-view.tsx`, `spring.tsx`, and `hover.tsx`. This is the
   documented second parameter of `isMobileDisabled` and makes the `width`
   dependency meaningful, fixing resize re-evaluation and clearing the lint
   warnings.

**Consequences.** `<Inview>` now works standalone (the common case). `yarn build`
and `yarn lint` are both clean (0 errors, 0 warnings). The springs folder remains
`#do-not-modify` by default — these were explicitly signed-off bug fixes.

---

## ADR-0012 — Styling lives in utilities and components, not `globals.css`

- **Status:** Accepted
- **Date:** 2026-05-22

**Context.** ADR-0004 made design tokens the styling currency and ruled that
"new values must be added to `globals.css` first." Combined with the
design-system guidance to *"extract repeated multi-class patterns to
`@layer components`"*, the path of least resistance for any repeated visual
pattern became a named class in `globals.css`. On an animation-heavy,
multi-section marketing site that grows the file without bound — a single
global stylesheet accumulating hundreds of component-specific classes that are
never deleted when their component is. The fix is a placement rule, not a
file-splitting trick: splitting `globals.css` into many files only spreads the
same bloat.

**Decision.** Styling follows a strict placement order; `globals.css` stays
bounded by design.

- One-off styling → **Tailwind utilities** in `className`. Nothing enters CSS.
- A repeated pattern with markup/structure/props → a **React component**
  (`components/ui/`), *not* a CSS class. This is the default answer to "this
  looks repeated" — e.g. an eyebrow label with a `::before` dot is an
  `<Eyebrow>` component, not a `.label-eyebrow` class.
- A repeated pure-utility combo with no structure → a Tailwind v4 `@utility`.
- `@layer components` is reserved **strictly** for what utilities and
  components genuinely cannot express: pseudo-elements (`::before`/`::after`),
  third-party DOM overrides (`!important` on library markup), complex
  descendant/state selectors.
- `globals.css` only ever holds: `@import`, tokens (`:root` + `@theme`), base
  element resets (`@layer base`), and the narrow `@layer components`
  exceptions above. If it grows past that, something was misplaced.
- CSS Modules were considered and **rejected** — a second styling mechanism
  for the rare bespoke-CSS case is not worth the extra mental model when
  motion is spring-based (no keyframes — ADR-0002) and utilities + components
  cover everything else.

**Consequences.** `globals.css` stays a few-hundred-line file indefinitely.
"Repeated thing" pressure now pushes toward React components — which the
project wants anyway. This **amends ADR-0004**: design *tokens* still go in
`globals.css` first, but component-specific *classes* no longer do.
[[design-system]] and [[component-conventions]] updated to match.

---

## ADR-0011 — API layer: `app/api` route handlers, secrets server-side

- **Status:** Accepted
- **Date:** 2026-05-22

**Context.** The starter had no API layer. It needs a convention for reaching
external services that keeps secret keys off the client and gives endpoints a
consistent shape.

**Decision.** External calls go through Next.js Route Handlers —
`src/app/api/<resource>/route.ts`:
- **The handler owns the work** — business logic, multiple upstream calls,
  filtering, and reading secret env vars all live in `route.ts`. No mandatory
  passthrough service layer; extract shared code only when genuinely reused.
- Secrets are safe in handlers because `route.ts` is never bundled to the
  browser. Secret env vars are **unprefixed**; `NEXT_PUBLIC_` only for
  browser-safe values.
- Every endpoint: validates input with `zod`, returns the `{ data }` /
  `{ error }` envelope via the shared `handle()` wrapper (`src/lib/api/`), runs
  on the Node runtime (not Edge).
- `src/env.ts` validates env with zod — `publicEnv` vs `getServerEnv()`.
- Client Components fetch via `apiFetch` (`src/lib/api-client.ts`), same-origin
  only. Render-time data is read in Server Components.
- Added `zod`. The example endpoint is `app/api/contact/route.ts`.
- Codified as **AGENTS.md hard rule #9**.

**Consequences.** A clear, secret-safe API convention (full note:
[[api-architecture]]). Server Actions were considered for mutations but
deferred — for now everything goes through `app/api`. The choice can be
revisited if forms need progressive enhancement. First server dependency
(`zod`) and first server-only env var (`CONTACT_ENDPOINT`) now exist.

---

## ADR-0010 — SEO & performance hardening

- **Status:** Accepted
- **Date:** 2026-05-21

**Context.** A review found gaps that would hurt a production marketing site:
`metadataBase` defaulted to `null` (relative OG/canonical URLs never resolved to
absolute — broken social previews); `themeColor` sat on the deprecated metadata
field; there was no `robots.txt`, `sitemap.xml`, or structured data; the
`next.config.ts` was empty; `ScrollLayout` leaked a `requestAnimationFrame`
loop; the home view was a top-level `"use client"` (violating hard rule #6);
and the animation-heavy starter ignored `prefers-reduced-motion`.

**Decision.**
- **Site config.** `src/lib/site.ts` (`siteConfig`) is the single source of
  truth for SEO, fed by `NEXT_PUBLIC_SITE_URL` (fallback `http://localhost:3000`).
- **Metadata.** `metadataBase` is always set; `themeColor` moved to a
  `generateViewport()` / `viewport` export; dead `keywords` / `other` tags
  dropped; OG dimensions corrected to match the asset.
- **Crawlability.** Added `app/robots.ts`, `app/sitemap.ts`, and a JSON-LD
  `Organization`+`WebSite` helper rendered once in the root layout.
- **App Router files.** Added `loading.tsx` (enables streaming), `error.tsx`,
  `not-found.tsx`.
- **Rendering.** `HomeView` is a Server Component; client-only animation moved
  to the `HomeShowcase` leaf — models hard rule #6 instead of breaking it.
- **Reduced motion.** `<ReducedMotion>` calls react-spring's `useReducedMotion`,
  toggling the global `skipAnimation` — one app-root mount covers every spring
  and `spring-text-engine`. Chosen over per-component handling for its reach.
- **Build config.** `next.config.ts` now sets `removeConsole` (prod),
  AVIF/WebP, `next/image` breakpoints aligned to the adaptive-grid widths, and
  `poweredByHeader: false`. React Compiler is left as a documented opt-in (needs
  `babel-plugin-react-compiler`).
- Fixed the `ScrollLayout` Lenis rAF leak (cancel on unmount).

**Consequences.** Social/SEO metadata is correct in production once
`NEXT_PUBLIC_SITE_URL` is set. The first project env var now exists (see
[[environment-variables]]). `isBot()` stays available but is discouraged — it
opts routes out of static rendering; reduced-motion is the preferred lever (see
[[seo-metadata]]). React Compiler remains opt-in pending a dependency install.

---

## ADR-0009 — Shared animation ticker; authorized engine performance refactor

- **Status:** Accepted
- **Date:** 2026-05-21

**Context.** A performance review of the animation engine found load issues that
scale with the number of animated components on a page:
- `useLoop` started a **private `requestAnimationFrame` loop per hook instance** —
  N scroll-driven components meant N rAF loops, none of which ever stopped.
- `useWindowWidth` attached a **separate debounced `resize` listener per call** —
  one per spring component.
- `useDynamicInView` re-created its `IntersectionObserver` **on every render**
  (effect keyed on an unstable `options` object), and a dead `Proxy` branch
  created observers that were never disconnected.
- `useLoop`'s mount-only effect captured a **stale `onRender`**, so prop changes
  after mount were ignored.
All of this lives under `src/hooks/animation/` and `src/components/animation/springs/`
— `#do-not-modify` (ADR-0002).

**Decision.** With explicit user sign-off, apply a one-time performance refactor
to the protected engine, and introduce a shared, unprotected loop primitive:
- New `src/lib/animation/ticker.ts` — a single app-wide, reference-counted rAF
  loop (`subscribeToTicker`). It starts on the first subscriber, stops on the
  last, and throttles each subscriber independently. **Not** `#do-not-modify` —
  it is the supported extension point.
- `useLoop` now subscribes to the ticker and reads `onRender` / `framerate`
  through refs (fixes the stale-closure bug). Public signature unchanged.
- `useDynamicInView` rewritten without the `Proxy`: one observer, re-created only
  when the observed element or options actually change; exposes a callback ref.
- `use-window-size.ts` (not protected) now serves all three hooks from one
  debounced `resize` listener via `useSyncExternalStore`. The unused
  `debounceDelay` parameter was dropped.
- `mode="forward"` `scroll` listeners in `<Spring>` / `<Inview>` made `passive`.
- Hard rule #2 amended: the engine stays protected by default; changes require
  explicit sign-off.

**Consequences.** A page with N animated components now runs **one** rAF loop and
**one** resize listener instead of N of each, with no observer churn. Public
hook/component APIs are unchanged except `useWindowWidth`/`Height`/`Size`, which
no longer take a `debounceDelay` argument (no caller passed one). This **amends
ADR-0002's** do-not-modify scope.

A follow-up pass then cleared all 13 pre-existing ESLint problems in the engine
(also authorized): `isMobileDisabled` gained an optional `viewportWidth`
argument, missing `disableOnMobile` effect deps were added, a
`trigger.current`-in-cleanup hazard in `<Hover>` was fixed, `<Handle>`'s
transition effects were ref-stabilised, and `useProgressTrigger` now returns
`progress` as a `RefObject<number>` (no consumer affected).

---

## ADR-0008 — Adaptive scaling grid via root font-size

- **Status:** Accepted
- **Date:** 2026-05-21

**Context.** An adaptive scaling system was dropped into `src/components/common/`
to keep a rem-based design proportional across viewports. It shipped as a
`styled-components` implementation (`createGlobalStyle`, a `css` `media` helper,
`rm`/`em` helpers, plus `colors.ts` / `fonts.ts` / `utils.ts`). `styled-components`
is not a project dependency, and global CSS belongs in `globals.css` per ADR-0004.

**Decision.** Keep only the scaling behaviour; rebuild it to the project stack.
- **Scale down** (viewport ≤ largest breakpoint) — `vw`-based `html { font-size }`
  media queries in `globals.css`, inside `@layer base`.
- **Scale up** (viewport > largest breakpoint) — a `<AdaptiveGrid>` client
  component (`useAdaptiveGrid` hook) sets an inline `html` font-size at runtime,
  reusing the existing `useResizeLoop` render loop.
- Breakpoints live in `grid.config.ts` as typed config; the `globals.css` media
  queries mirror them and must be kept in sync (formula in both files).
- The dropped `styled-components` files were deleted, not committed.

**Consequences.** A rem-based layout now scales as one unit on every viewport.
`styled-components` stays out of the dependency tree. The breakpoint set is
duplicated across `grid.config.ts` and `globals.css` by design — the CSS-only
config rule (ADR-0004) forbids generating the media queries from JS.

---

## ADR-0007 — Automate the vault workflow with Claude Code hooks

- **Status:** Accepted
- **Date:** 2026-05-21

**Context.** The "read the vault first, follow the relevant guide, update the docs
after every change" workflow depended on the user reminding the agent each time.
Documentation drifts the moment it relies on memory.

**Decision.** Encode the workflow as Claude Code hooks in `.claude/settings.json`
(committed, team-wide):
- `SessionStart` — injects a pointer to read the vault first.
- `UserPromptSubmit` — on every request, reminds the agent to consult the relevant
  guide and to update docs for any change made.
- `Stop` — at the end of every turn, blocks **once** to confirm the vault was
  updated. A `${TMPDIR}` marker keyed by session id guarantees it blocks at most
  once per turn (no infinite loop).

**Consequences.** The documentation workflow is enforced without user prompting.
`.claude/settings.json` is now a tracked project file. Hooks are reviewable and
disableable via `/hooks`. New hooks take effect on the next session start (or after
opening `/hooks`). See [[ai-agent-guide]].

---

## ADR-0006 — The vault is the single source of truth

- **Status:** Accepted
- **Date:** 2026-05-21

**Context.** ADR-0001 left dense spec files (`project-specs.md`, `text-engine-docs.md`)
at the repo root alongside the vault, creating duplication — the same conventions
existed both as terse specs and as expanded vault notes, which would drift.

**Decision.** The vault is the **only** documentation source.
- `project-specs.md` — deleted; its content was already decomposed into the
  `architecture/` and `frontend/` notes (and `environment-variables.md`).
- `text-engine-docs.md` — moved into the vault as [[text-engine-reference]].
- `generic-layout-prompt.md` — moved into the vault (see ADR via [[changelog]]).
- Root keeps only thin shims: `AGENTS.md` carries the breaking-change warning and
  hard rules and points into the vault; `CLAUDE.md` and `.cursorrules` both
  `@`-import `AGENTS.md`.

**Consequences.** No documentation duplication. Agents bootstrap from `AGENTS.md`
and read vault notes on demand. This **amends ADR-0001** — root files no longer
hold canonical spec content.

---

## ADR-0005 — Use standard `next/link` for navigation

- **Status:** Accepted
- **Date:** 2026-05-21

**Context.** Two conflicting conventions existed: `project-specs.md` specified
standard `next/link` / `useRouter`, while `generic-layout-prompt.md` specified
custom `<AnimLink>` / `useAnimRouter()` wrappers. The custom wrappers were never
built.

**Decision.** Use standard Next.js navigation — `<Link>` from `next/link` and
`useRouter` from `next/navigation`. The `AnimLink` / `useAnimRouter` convention is
dropped. See [[routing]].

**Consequences.** `generic-layout-prompt.md` §5 updated to match. No animated-route-
transition layer exists; if one is needed later, revisit with a new ADR.

---

## ADR-0001 — Adopt an Obsidian vault as the project brain

- **Status:** Accepted — amended by ADR-0006
- **Date:** 2026-05-21

**Context.** Project knowledge was scattered across root markdown files
(`project-specs.md`, `text-engine-docs.md`, `AGENTS.md`). New contributors and AI
agents had no structured map of the system.

**Decision.** Introduce `obsidian/` as an Obsidian vault — a linked, navigable
second brain. Root spec files remain as machine-read sources; the vault expands on
them. See [[ai-agent-guide]].

**Consequences.** Docs must now be maintained alongside code. The vault is the
canonical place to *understand* the project; root files stay canonical for *tooling*.

---

## ADR-0002 — All motion is spring-based (`@react-spring/web`)

- **Status:** Accepted (inherited from starter)
- **Date:** Project baseline

**Context.** Marketing sites need rich, interruptible, physically natural motion.
CSS transitions and keyframes are rigid; competing libraries add weight.

**Decision.** Use `@react-spring/web` for every animation. A custom component layer
(`src/components/animation/springs/`) wraps it. CSS transitions, CSS keyframes, and
`framer-motion` are **banned**.

**Consequences.** All animation goes through the [[animation-system]]. The springs
folder is `#do-not-modify`. Text animation is delegated to [[text-engine]].

---

## ADR-0003 — Routes delegate to Views

- **Status:** Accepted (inherited from starter)
- **Date:** Project baseline

**Context.** Mixing routing concerns with page UI makes `app/` files heavy and hard
to test.

**Decision.** `app/**/page.tsx` files only import and render a component from
`src/views/`. All layout/UI logic lives in the view. See [[routing]].

**Consequences.** Every route is a 3-line file. Views are the real page components.

---

## ADR-0004 — Tailwind v4 with CSS-based config

- **Status:** Accepted (inherited from starter)
- **Date:** Project baseline

**Context.** Tailwind v4 removes `tailwind.config.js` in favour of CSS-native config.

**Decision.** All theme tokens live in `globals.css` under `:root` and `@theme inline`.
No JS config file. Raw values in class names are banned. See [[design-system]].

**Consequences.** Design tokens are the only styling currency. New values must be
added to `globals.css` first.
