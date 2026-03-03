---
title: "Sharing Features Between React Native and a Browser Extension in a Monorepo"
description: "My first monorepo, two rendering targets, one shared feature layer"
pubDate: 2025-12-01
tags: ["code"]
draft: true
---

<!-- ADD: This was your first monorepo. What was your experience before? What did you expect? What surprised you? -->

I joined Leather coming from <!-- ADD: your previous experience -->. This was my first monorepo, my first time with React Native and Expo, and my first open-source project. The repo (`leather-io/mono`) was set up by the team before I joined -- the structure, tooling decisions, and initial packages were already in place. My role was building features within that structure, and eventually contributing to the cross-platform sharing patterns.

Both apps needed the same features -- collectibles gallery, transaction activity, token details -- but the implementations were largely separate. Features were being built twice. Bugs were being fixed twice.

## The `packages/features` Pattern

The team's solution was a shared `packages/features` directory containing platform-agnostic feature logic. The key constraint: **features can contain business logic, data mapping, and shared types, but not platform-specific rendering**.

Each feature exports:
- **Data hooks** - query wrappers, data transformation
- **View types** - typed interfaces that each platform's UI consumes (e.g. `CollectibleView`, `ActivityView`)
- **Constants and utilities** - shared formatting, mapping functions
- **Tests** - unit tests for the data layer

The platform apps then import these and wrap them with their own UI components.

### The Activity Example

The biggest single expression of this pattern was [#1837](https://github.com/leather-io/mono/pull/1837) -- 152 files, +4,796/-1,678 lines. This PR:

- Added a third tab for NFTs in the extension
- Replaced the old activity component with one from the shared portfolio package
- Refactored `packages/features` to be platform-agnostic
- Moved shared activity logic to `packages/features/activity`
- Introduced `ActivityView` -- a pre-formatted, UI-ready view of on-chain activity that both platforms consume via React Query's `select`

Before this PR, we had the concept of `OnChainActivity` in our lists. Afterwards, all source `Activity` gets transformed to `ActivityView` for standardised UI rendering across platforms.

The PR has a [video demo](https://github.com/leather-io/mono/pull/1837) showing activity working on both mobile and extension simultaneously.

<!-- ADD: How long did this PR take? Was it reviewed in one go or iterated? What was the hardest part? -->

### The Collectibles Example

I built the collectibles UI on mobile first (Sep-Nov 2025), then extracted the shared logic into `packages/features` ([#1981](https://github.com/leather-io/mono/pull/1981)), and worked on bringing it to the extension ([#2067](https://github.com/leather-io/mono/pull/2067)). The underlying query hooks and API services were built by other team members -- my contribution was the UI layer and the cross-platform extraction.

The `CollectibleView` type became the contract between the data layer and each platform's renderer. Mobile renders it with React Native's `Image` and `FlatList`. The extension renders it with HTML `img` tags and CSS grid. Same data, different presentation.

## Build System: Where The Pain Lives

Sharing code across platforms in a monorepo sounds clean in theory. In practice, the build system is where everything breaks.

- **EAS builds broke** ([#2018](https://github.com/leather-io/mono/pull/2018)) because the mobile build system (Expo Application Services) ran `postinstall` scripts that conflicted with non-mobile packages. The fix involved avoiding lifecycle hooks (`prepare`) and fixing lingui translation compilation.
- **Lingui translations** needed to compile correctly for both platforms
- **pnpm workspace hoisting** caused dependency resolution issues across packages

As someone new to monorepos, these were the hardest problems. The architecture pattern itself was straightforward -- the tooling to make two different build pipelines work with shared packages was not.

<!-- ADD: What specific monorepo gotcha caught you off guard? Any advice for someone setting up their first monorepo? -->

## The Go-Live Moment

After weeks of feature-flagged development, [#2067](https://github.com/leather-io/mono/pull/2067) went live with the new extension home tab layout. This was the payoff for the whole team: a feature that took months to build on mobile was adapted for the extension in a fraction of the time because the data layer was already shared.

## What I Learned From My First Monorepo

1. **The real cost isn't the architecture -- it's the build system.** Getting EAS, webpack, and pnpm to play nicely together consumed more time than the actual feature code.
2. **Share data, not UI.** View types as the contract between shared logic and platform-specific rendering worked well. Trying to share React components across React Native and React DOM would have been a nightmare.
3. **Build one platform first, extract second.** Building mobile first and then extracting shared code was much easier than trying to build the shared layer abstractly.

## Key PRs

| PR | What | Stats | Video? |
|---|---|---|---|
| [#1981](https://github.com/leather-io/mono/pull/1981) | Shared feature utilities foundation | +973/-111, 33 files | |
| [#1837](https://github.com/leather-io/mono/pull/1837) | Activity refactor + extension NFTs | +4,796/-1,678, 152 files | YES |
| [#2067](https://github.com/leather-io/mono/pull/2067) | Go live: new extension home | +284/-99, 19 files | |
| [#2018](https://github.com/leather-io/mono/pull/2018) | Fix EAS mobile build | +1,039/-15, 14 files | |
| [#1824](https://github.com/leather-io/mono/pull/1824) | Setup new Home component | +213/-100, 7 files | |
