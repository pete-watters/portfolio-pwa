---
title: "Migrating a Design System: Stacks UI to Panda CSS"
description: "Incrementally removing a design system across 500+ files in a production crypto wallet"
pubDate: 2023-11-15
tags: ["code"]
draft: false
---

The Leather extension was built with `@stacks/ui`. When the wallet rebranded from Hiro to Leather and expanded to Bitcoin, the Stacks-branded design system had to go. The migration to Panda CSS touched 500+ files.

The choice of Panda CSS was made by the team's design systems lead before I joined the migration effort. The reasoning made sense: Panda CSS generates styles at build time (zero runtime overhead), supports design tokens natively, and its API is close enough to styled-components that the migration path from Stacks UI wasn't a complete rewrite of every component. Tailwind was considered but the team wanted something with stronger TypeScript integration for token definitions. Vanilla-extract was another contender, but Panda's recipe and pattern APIs mapped more naturally onto the component variants we already had.

The six-part removal strategy was already loosely planned when I picked it up, but the exact boundaries of each PR were mine to figure out. The approach was simple: group related components, replace their Stacks UI imports with Panda equivalents, verify nothing visually broke, and ship. The most tedious part was the sheer repetitiveness of it. Hundreds of files needed the same kind of mechanical change -- swap a `<Box>` for a `<styled.div>`, replace `color="ink.text-primary"` with the equivalent Panda token, adjust spacing props to the new scale. Each individual change was trivial. Doing it 500 times while keeping the UI pixel-perfect was not.

There were also the inevitable visual regressions. Stacks UI had implicit defaults -- a `<Stack>` component applied both `flexDirection: column` and a default gap, for instance -- that weren't always obvious until they disappeared. I'd remove a Stacks UI component, replace it with a Panda equivalent, and suddenly a settings page had no spacing between its items. These were easy to fix once spotted but hard to catch systematically, especially in less-visited corners of the app.

## Stacks UI Removal (6-part series, Oct-Nov 2023)

The removal was split into reviewable chunks:

- [#4504 - Parts 4+5](https://github.com/leather-io/extension/pull/4504) (+790/-685, 122 files)
- [#4515 - Part 6 (final)](https://github.com/leather-io/extension/pull/4515) (+254/-1,753, 26 files) -- a satisfying net negative
- [#4511 - Part 2](https://github.com/leather-io/extension/pull/4511) (+533/-531, 39 files)

## Panda CSS Preset

The replacement wasn't just swapping one library for another. We built a Panda CSS preset as a shareable package:

- [mono#151](https://github.com/leather-io/mono/pull/151) (+503/-124, 18 files) - the preset itself
- [#5429](https://github.com/leather-io/extension/pull/5429) (+759/-556, 11 files) - integrate into extension

Design tokens as a package meant any app could `npm install` the design system.

## UI Library Integration

- [#5544](https://github.com/leather-io/extension/pull/5544) (+5,949/-5,068, 310 files)
- [#5550](https://github.com/leather-io/extension/pull/5550) (+204/-991, 63 files) -- another net negative

## Icons

[#4543](https://github.com/leather-io/extension/pull/4543) (+280/-231, 83 files) -- fixed react-icons/fi console errors.

## The Borders Saga

- [#5147](https://github.com/leather-io/extension/pull/5147) (Apr 2024) (+489/-425, 19 files)
- [#6319](https://github.com/leather-io/extension/pull/6319) (Jul 2025) (+30/-36, 2 files) -- borders STILL breaking 15 months later

The borders never stop breaking.

## What Made This Work

1. **Incremental migration in 6 parts** -- each chunk was reviewable, testable, and shippable
2. **Net-negative PRs** -- #4515 removed 1,753 lines while adding 254. Less code = fewer bugs.
3. **Zero-runtime CSS** -- Panda CSS generates at build time. No runtime overhead.
4. **Design tokens as a package** -- shared across the monorepo

## Monorepo Foundation

I was assigned to early mono repo issues that laid groundwork for this migration:
- [#5](https://github.com/leather-io/mono/issues/5) - Design tokens package
- [#3](https://github.com/leather-io/mono/issues/3) - Migrate eslint-config
- [#7](https://github.com/leather-io/mono/issues/7) - Setup workflow on monorepo
- [#6](https://github.com/leather-io/mono/issues/6) - Investigate adding Nx
