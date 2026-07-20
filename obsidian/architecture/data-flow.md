---
tags: [architecture, stable]
updated: 2026-07-20
---

# Data Flow

How state, scroll position, and animation data move through the app. Most of the
app is still **client-side UI state** with no server data layer — the one
exception is `/story/game`, which has a real database behind it (see
[[backend/database-schema]], ADR-0026) and is called out separately below.

## Provider hierarchy (fixed order)

The root layout (`src/app/layout.tsx`) wraps everything in this exact order.
**Do not reorder** — see [[decisions-log]].

```
<html> <body>
  <ScrollLayout>        ← Lenis smooth scroll + scroll state store
    <LazyCookie />      ← cookie consent banner + preferences modal
    {children}          ← the routed page
  </ScrollLayout>
</body> </html>
```

## Scroll state — Zustand store

The scroll store (`src/hooks/smooth-scroll/use-scroll.ts`) is the one piece of
global state. Shape:

```ts
{
  lenis: Lenis | null      // the Lenis instance
  setLenis(...)            // setter
  isEnableScroll: boolean  // is scrolling currently allowed?
  start()                  // enable scroll
  stop()                   // disable scroll (e.g. modal open)
}
```

### Flow

```
ScrollController (in ScrollLayout) mounts
   │
   ├─ new Lenis()  →  setLenis(instance)   ──► store.lenis
   │
   ├─ requestAnimationFrame loop  →  lenis.raf(time)   (continuous)
   │
   └─ watches store.isEnableScroll:
         true  → lenis.start() + native scroll on
         false → lenis.stop()  + native scroll locked (html overflow:hidden)
```

Any component reads/writes scroll state through the store:

```ts
const lenis = useScroll((s) => s.lenis)
const [start, stop] = useScroll(useShallow((s) => [s.start, s.stop]))
```

See [[smooth-scroll]] for the full API.

## Animation data flow

Animation values never live in React state — they live in **springs**.

```
Component renders with from / to props
   │
   ▼
@react-spring/web useSpring  →  animated values (outside React render cycle)
   │
   ▼
Trigger source updates the spring:
   ├─ IntersectionObserver   → <Inview>, <Spring>     (enter viewport)
   ├─ scroll position        → <SpringTrigger>        (scroll progress)
   ├─ mouse events           → <Hover>                (pointer enter/leave)
   └─ scroll position        → <TextEngine mode="progress">
   │
   ▼
animated.<tag> applies values directly to the DOM node — no re-render
```

Global animation behaviour (mobile disable, breakpoint) is read from
`src/lib/springs/config.ts` — see [[animation-system]].

## Page data flow

```
app/page.tsx  →  views/home.tsx  →  composed components
```

Per the [[component-conventions]]:
- **No hardcoded content** in components — data comes from props or hooks.
- Placeholder data → `src/data/mocks/<page>.ts`, passed via props.
- Async data → custom hook in `src/hooks/`; component handles `loading` / `error`
  / `empty` with skeleton loaders. See [[components/common]].

## Server / external data flow

External APIs are reached **only** through server code — the browser never
calls a third party directly or holds a secret.

```
Server Component         →  reads data at render time (no client request)
Client Component         →  apiFetch('/api/…')  →  app/api/**/route.ts  →  upstream
app/api/**/route.ts      →  validates (zod) → does the work → { data } | { error }
```

Secrets live in unprefixed env vars, read via `getServerEnv()` inside route
handlers. Full convention: [[api-architecture]].

## Async state in a store — the `/story/game` exception

Every other Zustand store in the app (`useScroll`, `useStoryLanguage`,
`usePreloader`) holds plain synchronous client state — no store action calls the
network. `useGameStore` (`src/hooks/use-game-store.ts`) is the first exception:
its actions (`createPlayer`, `resumeSession`, `submitChoice`, `resetGame`) call
`apiFetch` directly and track `status`/`error` themselves, so `GameShell` and its
children stay presentational (per [[component-conventions]], data-fetching logic
belongs in a hook, never inline in a component).

```
GameChoiceButton click
   │
   ▼
useGameStore.submitChoice()  →  status: "loading"
   │
   ▼
apiFetch('/api/game/advance')  →  app/api/game/advance/route.ts
   │
   ├─ a roll happened  →  hold "loading" for the dice strip's full flicker
   │                       window, then status: "revealed" + pendingAdvance
   │                       (scene does NOT change yet — the player must see
   │                       the landed roll and click Continue)
   │
   └─ no roll (auto choice)  →  commit `save`/`phase` immediately
   │
   ▼
confirmAdvance()  →  commits pendingAdvance.nextSave  →  status: "idle"
```

The "hold, then require confirmation" step exists because the store originally
committed the next scene the instant the response arrived — on a fast
(e.g. local) network that regularly beat the dice-roll animation's own
~750ms flicker, so the roll the player just triggered would be replaced by the
next scene before they could see it land. Caught during manual browser
verification of Phase B, not by lint/build/API tests (all of which passed
regardless, since the bug was purely about UI timing).

## Hash-link scrolling

`ScrollController` watches `usePathname()`. If the path contains a `#hash`, it waits
300 ms then calls `scrollTo(hash, true)` so smooth scroll lands on the target.

## Related

[[system-overview]] · [[smooth-scroll]] · [[animation-system]]
