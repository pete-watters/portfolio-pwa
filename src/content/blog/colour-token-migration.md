---
title: "Migrating Colour Tokens from Brown to Ink"
description: "How we renamed an entire design token vocabulary during Leather's rebrand — and why semantic naming matters more than you think."
pubDate: 2023-06-15
tags: ["design-systems", "css", "leather"]
draft: false
---

When Hiro rebranded its wallet to Leather, we didn't just change a logo. The entire colour system needed to change. The old design tokens were named after literal colours — `brown.100`, `brown.200`, `brown.900` — because the Hiro brand was brown. Leather's brand is black and white. We couldn't just swap hex values and call it done.

## The problem with literal colour names

The old token names encoded the brand colour directly:

```typescript
// Old tokens
const colors = {
  'brown.100': '#F5F1EE',
  'brown.200': '#ECE0D8',
  'brown.500': '#74573B',
  'brown.900': '#2B1D11',
};
```

This worked fine when the brand was brown. But now we needed the same semantic scale — light background, subtle border, primary text — in a completely different hue. Renaming `brown.900` to `black.900` would work for the current rebrand but create the same problem for the next one.

## Semantic naming

We renamed the scale to `ink`:

```typescript
// New tokens
const colors = {
  'ink.text-primary': '#0C0C0D',
  'ink.text-subdued': '#525258',
  'ink.border-default': '#DFDFE0',
  'ink.background-primary': '#FFFFFF',
  'ink.background-secondary': '#F5F5F5',
};
```

`ink` is brand-neutral. It describes the role (text, borders, backgrounds) rather than the hue. If Leather rebrands again in two years, the token names stay the same — only the values change.

## The migration

The migration itself was a large find-and-replace across the extension codebase, but it wasn't mindless. We used the rename as an opportunity to audit every colour usage:

| What we found | Action |
|---|---|
| Components using `brown.500` for text | Mapped to `ink.text-primary` |
| Hardcoded hex values that matched brown tokens | Replaced with semantic tokens |
| One-off colours with no token equivalent | Added to the token set or removed |
| Dark mode overrides referencing `brown` | Mapped to `ink` equivalents with dark mode values |

The audit caught a dozen places where hex values had been hardcoded instead of using tokens. Those would have broken silently during any theme change.

## The tooling

We updated the design token package (`@leather-wallet/tokens`) to export the new `ink` scale and marked the old `brown` tokens as deprecated. For a transition period, both existed side by side with a build-time warning:

```
⚠ Deprecated token "brown.500" used in AccountCard.tsx — use "ink.text-primary" instead
```

This let us migrate incrementally across PRs rather than one enormous changeset. Each component owner could update their own files and verify visually.

## What I'd do differently

I'd start with semantic names from day one. Literal colour names (`red`, `brown`, `blue`) feel intuitive when you first set up a design system, but they become an anchor the moment the brand evolves. Naming tokens by role — `text-primary`, `border-default`, `action-primary` — costs nothing upfront and saves a full migration later.

The Leather rebrand rename touched 40+ files across the extension. The diff was mechanical but the review wasn't — every change needed visual verification. Semantic names would have reduced that to a single token value update.
