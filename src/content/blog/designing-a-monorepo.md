---
title: "Designing a Monorepo for a Browser Extension and Mobile App"
description: "How I set up and designed the monorepo architecture for Leather wallet — consolidating a browser extension, mobile app, and shared packages into a single repository with automated publishing."
pubDate: 2026-02-27
tags: ["open-source", "monorepo", "devops", "leather"]
draft: true
---

The [Leather](https://leather.io) wallet started as a single repository — a Chrome extension built with React. Then came the mobile app. Then shared packages for crypto utilities, UI components, and API clients. Two apps, growing apart, duplicating code.

I designed and implemented the [monorepo](https://github.com/leather-wallet/mono) that brought them together.

## Why a monorepo

The extension and mobile app shared a significant amount of code — query hooks, crypto utilities, type definitions, and increasingly, UI components. Before the monorepo, changes to shared logic meant:

1. Update the package in its own repo
2. Publish a new version
3. Update the dependency in both consuming repos
4. Hope nothing broke in the version gap

With a monorepo, a change to a shared package is immediately available to both apps. CI runs tests for everything affected. No version drift, no publish-and-pray.

## The structure

```
leather-wallet/mono/
├── apps/
│   ├── extension/     # Chrome/Firefox browser extension
│   └── mobile/        # React Native mobile app
├── packages/
│   ├── ui/            # Shared UI component library
│   ├── crypto/        # Crypto utilities, key management
│   ├── query/         # Shared API queries and hooks
│   └── utils/         # Common utilities
├── pnpm-workspace.yaml
└── turbo.json
```

[pnpm workspaces](https://pnpm.io/workspaces) handle dependency resolution and linking. [Turborepo](https://turbo.build/repo) handles task orchestration — running builds, tests, and linting in the right order with caching.

## Key decisions

**pnpm over npm/yarn.** pnpm's strict dependency resolution catches phantom dependencies — packages that work by accident because a sibling package installed them. In a monorepo with shared packages, this strictness prevents subtle runtime errors where code works locally but breaks in production.

**Turborepo for task orchestration.** The dependency graph between packages means `packages/ui` needs to build before `apps/extension` can build. Turborepo understands this graph and parallelises everything it can while respecting build order. Remote caching means CI doesn't rebuild unchanged packages.

**Shared tsconfig and ESLint configs.** A base TypeScript config lives at the root. Each package extends it with its own needs (DOM types for the extension, React Native types for mobile). Same pattern for ESLint — shared rules at the root, package-specific overrides where needed.

## Automated publishing

Shared packages need to be published for external consumers and for the mobile app's Expo build (which can't use workspace links). I set up automated publishing via GitHub Actions ([PR #8](https://github.com/leather-wallet/mono/pull/8)) — on merge to main, changed packages get version-bumped and published to npm automatically.

The workflow detects which packages have changed using Turborepo's `--filter` flag, runs their build and test pipelines, and publishes only what's new. No manual version bumping, no forgetting to publish after a merge.

## What I learned

**Start with the dependency graph.** Before writing any config, I mapped out which packages depend on which. This drove the workspace structure and revealed circular dependencies that needed breaking.

**Migrate incrementally.** The extension moved in first, then shared packages were extracted one at a time, then the mobile app joined. Trying to do it all at once would have been a multi-week block on the entire team.

**Invest in DX early.** A monorepo with poor developer experience is worse than separate repos. Fast builds (Turborepo caching), instant linking (pnpm workspaces), and automated publishing make the day-to-day experience better than what it replaced.

## The result

Both apps now share code through typed, tested packages. A change to a shared component is tested against both apps in CI before it merges. Publishing is automated. The team ships faster because cross-cutting changes are a single PR instead of a coordinated dance across repositories.

The [initial setup commits](https://github.com/leather-wallet/mono/commits/main/) tell the story — workspace config, turborepo pipeline, CI workflows, then the apps and packages migrating in one by one.
