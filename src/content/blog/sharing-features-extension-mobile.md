---
title: "Sharing Code Between a Browser Extension and React Native App"
description: "How we refactored Leather's activity feed into a platform-agnostic features package — sharing queries, types, and business logic across extension and mobile."
pubDate: 2026-03-05
tags: ["typescript", "react-native", "monorepo", "architecture", "leather"]
draft: false
---

Leather ships two apps from one monorepo: a browser extension (React, Panda CSS) and a mobile app (React Native, Expo). They share a Bitcoin and Stacks wallet backend, the same account model, and — increasingly — the same UI components. But for a long time, each app had its own copy of core features like the activity feed, token balances, and collectibles.

The activity feed was the worst offender. Both apps fetched the same on-chain data, applied the same filters, and formatted the same transaction types. But the code was duplicated — once in the extension's source tree, once in the mobile app's. Bugs got fixed in one and not the other. New token types got added to the extension and forgotten on mobile.

[PR #1837](https://github.com/leather-io/mono/pull/1837) moved the activity feed into a shared `packages/features` package. 152 files changed, +4,796/-1,678. Here's what we learned.

## What can be shared

Not everything should live in a shared package. The rule of thumb: **share queries, types, and business logic. Keep navigation, storage, and platform APIs in the app.**

For the activity feed, the shared parts were:

- **Query definitions** — TanStack Query hooks that fetch transaction data from Stacks and Bitcoin APIs
- **Query key factories** — standardised key generation so cache invalidation works consistently
- **Type definitions** — `Activity`, `ActivityType`, `TransactionStatus`, and other domain types
- **Formatting logic** — converting raw blockchain data into UI-ready `ActivityView` objects (human-readable amounts, relative dates, status labels)

The app-specific parts stayed in each app:

- **Rendering** — the extension uses Panda CSS components, the mobile app uses React Native views
- **Navigation** — tapping an activity item navigates differently in each context
- **Error boundaries** — the extension shows inline errors, mobile uses toast notifications

## The key pattern: ActivityView

The most useful abstraction was `ActivityView` — a platform-agnostic data structure that contains everything a UI needs to render a transaction:

```typescript
interface ActivityView {
  type: 'send' | 'receive' | 'swap' | 'contract-call';
  title: string;
  caption: string;
  amount: string;
  fiatAmount: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  txid: string;
}
```

The shared package transforms raw blockchain data into `ActivityView` objects. Each app maps them to platform-specific components. The extension renders a `<CryptoAssetItemLayout>`, the mobile app renders a `<Cell>` — but both consume the same data shape.

## Query key factories

The other pattern worth mentioning is query key factories. Before the refactor, query keys were ad-hoc strings scattered across both codebases:

```typescript
// Extension
useQuery(['stacks-activity', address], ...)

// Mobile
useQuery(['activity-stacks', address, networkMode], ...)
```

Different keys meant different cache behaviour. The shared package introduced a factory:

```typescript
const activityKeys = {
  all: ['activity'] as const,
  stacks: (address: string) => [...activityKeys.all, 'stacks', address] as const,
  bitcoin: (address: string) => [...activityKeys.all, 'bitcoin', address] as const,
};
```

Both apps import the same factory. Cache invalidation, deduplication, and stale-time configuration work identically.

## What went wrong

The initial refactor was too aggressive. We tried to share the entire activity feature — including some rendering logic that assumed web APIs. React Native doesn't have `window.open()` or DOM-based date formatting. We had to pull those back into app-specific code.

We also hit a circular dependency. The `features` package imported types from `models`, which imported from `bitcoin`, which tried to import from `features`. The fix was moving shared types into `models` and keeping `features` as a consumer, never a provider, of base types.

The CI impact was real too. The shared package needed to build before either app could start. [PR #2018](https://github.com/leather-io/mono/pull/2018) overhauled the build pipeline — removing lifecycle hooks that caused `pnpm install` to trigger builds, and adding conditional build targets so mobile CI didn't waste time building extension code.

## The result

After the refactor, adding Rune activity to both apps was a single PR that touched the shared package. Before, it would have been two PRs with duplicated logic. The same applied when we added inscription transfers, SIP-10 token events, and BRC-20 transactions.

The mobile app still needs its own rendering code. But the data layer — what to fetch, how to parse it, what to show the user — lives in one place. When a new token standard launches, we implement support once.
