---
title: "FlashList vs FlatList in a Crypto Wallet"
description: "How switching from FlatList to FlashList cut dropped frames and improved scroll performance in Leather's React Native token list."
pubDate: 2024-11-15
tags: ["react-native", "performance", "mobile", "leather"]
draft: false
---

The token list in Leather's mobile wallet is the first thing you see when you open the app. It shows every token across multiple chains — BTC, STX, SIP-10 tokens and Runes — sorted by value. When a user has dozens of tokens, that list needs to scroll smoothly.

It didn't.

## The problem

We were using React Native's built-in `FlatList`. For short lists it's fine, but once we added sorting logic and the token count grew past 30-40 items, the scroll started hitching. Dropped frames were visible on mid-range Android devices. The issue was `FlatList`'s recycling strategy — or lack of one.

`FlatList` creates and destroys cell components as they scroll in and out of view. Each mount triggers layout calculation, and for our token cards (which include formatted balances, fiat conversions, and chain icons), that mount cost added up.

## FlashList

[FlashList](https://shopify.github.io/flash-list/) is Shopify's drop-in replacement for `FlatList`. The API is nearly identical — same props, same `renderItem` pattern — but the internals are fundamentally different. FlashList recycles cell components instead of destroying them. When a cell scrolls off screen, its component instance is reused for the next item scrolling in. No unmount, no remount, just new props.

The migration was straightforward:

```tsx
// Before
import { FlatList } from 'react-native';

<FlatList
  data={sortedTokens}
  renderItem={({ item }) => <TokenCard token={item} />}
  keyExtractor={(item) => item.id}
/>

// After
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={sortedTokens}
  renderItem={({ item }) => <TokenCard token={item} />}
  keyExtractor={(item) => item.id}
  estimatedItemSize={72}
/>
```

The only new required prop is `estimatedItemSize`. FlashList uses it to calculate how many cells to pre-render. Get it roughly right and the list fills the viewport without blank frames on first render.

## Sorting

The same PR also added proper token sorting. Previously tokens appeared in whatever order the API returned them. We sorted by fiat value descending, so the user's most valuable holdings appear first:

```typescript
const sortedTokens = tokens.sort((a, b) => {
  const aValue = a.balance * a.fiatPrice;
  const bValue = b.balance * b.fiatPrice;
  return bValue - aValue;
});
```

Simple, but it matters for UX. Nobody wants to scroll past dust tokens to find their BTC balance.

## The result

FlashList's built-in performance warnings helped us validate the change. With `estimatedItemSize` tuned correctly, the list reported zero blank cells during scroll on both iOS and Android. The dropped frame issue on mid-range Android devices was gone.

The diff was small — a dependency addition, an import swap, and one new prop. The scroll performance improvement was immediately noticeable. If you're using `FlatList` with more than ~20 items and any kind of non-trivial cell rendering, FlashList is worth the five-minute migration.
