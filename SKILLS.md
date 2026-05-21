# Animation Skill — petewatters.ie

How animations are decided, written, and reviewed in this project. The
patterns documented here match what's actually shipped in the codebase
today (see `src/pages/index.astro` for live examples).

## Philosophy

The site's visual identity is restrained: system fonts, a monochrome
palette with one orange accent (`#F7931A`), generous whitespace, no
visual noise. Animation supports that — it does not perform.

The bar is: *every animation has to earn its place*. If you can remove
the animation and the UX is unchanged, remove it.

Concretely:

- **CSS-first.** No animation libraries. No `framer-motion`, no `gsap`,
  no `react-spring`. The current stack is plain CSS keyframes +
  IntersectionObserver. If a future Astro upgrade lands View Transitions,
  use the platform feature, not a wrapper.
- **Performance-first.** Animate only `opacity`, `transform`, `filter`,
  and `box-shadow`. Never animate layout properties (`width`, `height`,
  `top`, `left`, `padding`, `margin`) — they trigger paint/layout and
  drop frames on mobile.
- **Accessibility-first.** Every animation has a
  `prefers-reduced-motion: reduce` fallback that disables it.

---

## Decision tree

Reach for these defaults before going deeper into the rules table. If
you can answer the four questions below, you have your easing.

1. **Is the element entering or exiting the screen?** → **`ease-out`**
   (mount, reveal, dismiss, scroll-into-view)
2. **Is an on-screen element moving from one position to another?** → **`ease-in-out`**
   (drag, repositioning, slider thumb, accordion expand)
3. **Is this a hover or colour transition?** → **`ease`**
   (button hover, link colour, focus ring)
4. **Will users see this 100+ times a day?** → **don't animate it**
   (nav links, scrollbar, cursor itself)

The current implementation predates this tree and uses
`cubic-bezier(0.16, 1, 0.3, 1)` (a strong ease-out) for hovers too —
acceptable for now, but new animations should follow the tree, and the
existing hovers are a follow-up to align.

---

## Hard rules

| Rule | Value | Why |
|---|---|---|
| Duration — micro (hover, focus) | **0.25 – 0.3s** | Below 0.2s feels instant (no perceived motion); above 0.35s feels sluggish for a hover |
| Duration — medium (mount, reveal) | **0.5 – 0.6s** | Long enough to read the motion, short enough to not delay reading |
| Duration — ambient loops (pulse, etc) | **2 – 3s** | Slow enough to register as "background life", not as something demanding attention |
| Duration — hard cap on one-shots | **0.7s** | Above this, the user is waiting for animation to finish before they can interact |
| Easing — entering / exiting | **`ease-out`** (or `var(--ease-out-soft)` for the smoother variant) | Matches the decision tree |
| Easing — on-screen movement | **`ease-in-out`** | Natural for back-and-forth (pulse, slider, drag) |
| Easing — hover / colour transitions | **`ease`** | The plain default — soft on both ends, not overly opinionated |
| Properties allowed | `opacity`, `transform`, `filter`, `box-shadow` | GPU-composited; no layout cost |
| `prefers-reduced-motion` | **Required** on every animation | Honour user setting |
| No JS animation libraries | Pure CSS + `IntersectionObserver` | Bundle size, no runtime overhead |

---

## When to animate — yes

- **State transitions** — hover, focus, active. Subtle feedback that the
  element is interactive.
- **Mount / enter** — first appearance of content (page load fade-up,
  scroll-reveal fade-in).
- **Feedback** — loading indicators, success states, "saved" toasts.
- **Ambient status** — slowly pulsing dot on availability badge signals
  "this is live data" without demanding attention.

## When to animate — no

- **Anything users see more than ~100×/day.** The first 10 times it's
  delightful; the 100th it's a tax. Examples: nav links, the cursor
  itself, scrollbar behaviour.
- **Anything on the critical reading path.** Don't animate paragraph text
  appearing while the user is mid-sentence.
- **Decorative animation that doesn't serve UX.** Background particles,
  random floaters, "look at me" effects.
- **Anything that delays interactivity by more than 0.3s.** If the user
  has to wait for your animation to finish before they can click, the
  animation is too slow.

---

## Named primitives in this project

These already exist. Reuse before inventing.

### `--ease-out-soft`

```css
.homepage {
  --ease-out-soft: cubic-bezier(0.16, 1, 0.3, 1);
}
```

The default easing token. Use everywhere unless you have a documented
reason not to.

### `data-reveal` — scroll-triggered fade-up

```html
<element data-reveal>...</element>
```

```css
[data-reveal] {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.6s var(--ease-out-soft),
              transform 0.6s var(--ease-out-soft);
}
[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

Wired up via `IntersectionObserver` in the inline script in
`src/pages/index.astro`. Supports per-group staggering via `data-stagger`
attribute (set in JS).

### `@keyframes badge-pulse` — ambient status indicator

```css
.badge-dot {
  animation: badge-pulse 2.5s ease-in-out infinite;
}
@keyframes badge-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(247, 147, 26, 0.4); }
  50%      { opacity: 0.6; box-shadow: 0 0 0 6px rgba(247, 147, 26, 0); }
}
```

Used on the availability badge dot. The ring expands outward then fades
— signals "live" without flashing.

### `@keyframes hero-word-up` — staggered enter

```css
@keyframes hero-word-up {
  to { opacity: 1; transform: translateY(0); }
}
```

Per-element animation delays drive the stagger
(`animation-delay: 0.35s` … `0.75s`).

### Hover transforms

Established pattern: `translateY(-2px)` to `translateY(-3px)` lift on
cards, `translateX(4px)` on arrow icons inside links. Always paired with
a colour or border transition for parallel feedback.

---

## Checklist for adding a new animation

Before merging, confirm each:

1. [ ] **UX purpose** — what does this animation tell the user that the
       absence wouldn't? If you can't answer in one sentence, don't add it.
2. [ ] **Duration ≤ 0.7s** for one-shots? Loops between 2–3s? If not,
       justify in the PR description.
3. [ ] **Easing** is `var(--ease-out-soft)`, or there's a documented
       reason for a different curve (e.g. `ease-in-out` for a loop).
4. [ ] **Properties** are limited to `opacity`, `transform`, `filter`,
       `box-shadow`. No layout properties.
5. [ ] **`prefers-reduced-motion: reduce`** fallback in place — animation
       or transition disabled, element rendered in its final state.
6. [ ] **Tested on a low-end device** (or DevTools 6× CPU throttle) — no
       dropped frames on the animation.
7. [ ] **Add a visual regression scenario** — *aspirational, no infra yet.*
       When visual regression infrastructure lands (Playwright snapshot
       or similar), add a scenario covering the new animation's start
       and end states. Until then, note "no visual regression coverage"
       in the PR.

---

## Forward-looking — what isn't here yet

This project deliberately ships without:

- A JS animation library (no `framer-motion` etc.)
- An animation testing framework (no visual regression)
- View Transitions (Astro supports them but they're not adopted here)
- Page-level scroll-based effects (parallax, sticky-section transitions)

If any of these become useful, add a new section to this file documenting
the decision, the primitive added, and the rule for when to reach for it.

The hardest constraint to maintain over time is **restraint** — every
contributor will be tempted to add "just one more cool animation".
This document exists to make that conversation explicit.
