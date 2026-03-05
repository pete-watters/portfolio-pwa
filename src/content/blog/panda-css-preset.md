---
title: "Creating a Panda CSS Preset for a Design System"
description: "How I extracted a wallet extension's theme configuration into a reusable Panda CSS preset package — consolidating tokens, recipes, and semantic styles into a single installable dependency."
pubDate: 2026-03-03
tags: ["open-source", "css", "design-system", "leather"]
draft: false
---

The [Leather](https://leather.io) wallet extension had a growing theme directory — breakpoints, colours, keyframes, semantic tokens, typography, and a set of Panda CSS recipes for buttons and links. All defined locally in the extension repo, all tightly coupled to the app.

When the monorepo arrived and a mobile app joined the family, this theme needed to be shared. I extracted it into a standalone Panda CSS preset package.

## What's a Panda CSS preset?

[Panda CSS](https://panda-css.com) is a build-time CSS-in-JS framework. A preset is a shareable configuration bundle — tokens, semantic tokens, recipes, keyframes, and utilities — that any Panda project can install and extend.

Think of it like a Tailwind preset or a styled-components theme, but with Panda's type-safe API and zero-runtime approach.

## Before: local theme files

The extension's theme lived in a `theme/` directory:

```
theme/
├── breakpoints.ts
├── colors.ts
├── keyframes.ts
├── recipes/
│   ├── button-recipe.ts    # 176 lines
│   └── link-recipe.ts      # 164 lines
├── semantic-tokens.ts
├── tokens.ts
└── typography.ts
```

The `panda.config.ts` imported each file individually:

```typescript
import { breakpoints } from './theme/breakpoints';
import { colors } from './theme/colors';
import { keyframes } from './theme/keyframes';
import { buttonRecipe } from './theme/recipes/button-recipe';
import { linkRecipe } from './theme/recipes/link-recipe';
import { semanticTokens } from './theme/semantic-tokens';
import { tokens } from './theme/tokens';
import { typography } from './theme/typography';
```

Every app that wanted the Leather look needed to duplicate these files.

## After: one preset, one line

The preset package ([`@leather-wallet/panda-preset`](https://www.npmjs.com/package/@leather-wallet/panda-preset)) bundles everything. The extension's `panda.config.ts` collapsed from 18+ lines of imports to:

```typescript
import { pandaPreset } from '@leather-wallet/panda-preset';

export default defineConfig({
  presets: [pandaPreset],
});
```

All theme files deleted from the extension. All tokens, recipes, and keyframes now live in the monorepo's shared packages and are published to npm.

## What the preset includes

- **Design tokens** — colours, spacing, font sizes, radii, all mapping to the Figma design system
- **Semantic tokens** — context-aware tokens like `ink.text-primary` that resolve differently per theme
- **Recipes** — multi-variant component styles for buttons, links, and other primitives
- **Keyframes** — shared animations
- **Breakpoints** — consistent responsive behaviour across extension popup, popout, and full-page views
- **Typography** — font stacks and text style presets

## Why a preset over a shared config file?

A Panda preset is more than a config object. It's a proper package with:

- **Versioning** — consumers pin to a version and upgrade deliberately
- **Type safety** — Panda generates types from the preset, so your IDE autocompletes token names
- **Composition** — multiple presets can be layered (Panda's base preset + Leather preset + app overrides)
- **Publishing** — the monorepo's auto-publish pipeline handles npm releases on merge

## The numbers

[PR #5429](https://github.com/leather-io/extension/pull/5429) on the extension side was +759/-556 across 11 files — mostly deletions, since the theme files moved to the mono repo. The actual preset package was built in [leather-wallet/mono#151](https://github.com/leather-wallet/mono/pull/151).

The best refactors are the ones where you delete more than you add.
