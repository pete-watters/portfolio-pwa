---
title: "Adding a Hide Balance Feature to a Crypto Wallet"
description: "A privacy feature that touches every balance display in the app — and why the implementation is simpler than you'd think."
pubDate: 2026-03-03
tags: ["open-source", "react", "ux", "leather"]
draft: false
---

If you're checking your wallet on a train, at a cafe, or in a meeting you probably shouldn't be in, you don't want your balance visible on screen. "Hide balance" is a table-stakes feature for financial apps. The [Leather](https://leather.io) wallet didn't have it.

[PR #5865](https://github.com/leather-io/extension/pull/5865) added it — +328/-43 across 34 files.

## The approach

The feature is a toggle in Settings that replaces all balance displays with a masked value. Sounds straightforward. The catch is that "all balance displays" means:

- Total account balance on the home screen
- Individual BTC, STX, BRC-20, SRC-20, STX-20 and Rune token balances
- Transaction amounts in the activity list
- Available balance in the send form footer
- Fee selection amounts
- Asset balances in the fund chooser

That's a lot of components that display monetary values.

## The implementation

Rather than threading a `hideBalance` prop through every component, I added it to the existing settings store:

```typescript
// settings.slice.ts
hideBalance: boolean;

// settings.actions.ts
toggleHideBalance: () => void;

// settings.selectors.ts
useIsBalanceHidden: () => boolean;
```

Then a `<PrivateText>` component wraps any value that should be masked:

```tsx
function PrivateText({ children }: Props) {
  const isHidden = useIsBalanceHidden();

  if (isHidden) return <PrivateTextLayout />;
  return <>{children}</>;
}
```

`<PrivateTextLayout>` renders a fixed-width masked placeholder — consistent across every balance display. The actual value isn't in the DOM when hidden. It's not CSS opacity or a blur — the data just isn't rendered.

## Why not just blur?

A CSS blur on the balance text would be simpler — one style change at the container level. But:

1. **Blur is reversible in DevTools.** Anyone looking over your shoulder with basic knowledge could inspect the element. Not rendering the value means there's nothing to inspect.
2. **Screen readers would still announce the value.** Not rendering it is accessible by default.
3. **Blur looks sloppy.** The masked placeholder is a deliberate design choice, not an afterthought.

## Testing

The PR includes E2E tests that verify the toggle works and that balances are actually hidden in the DOM — not just visually obscured. The Storybook stories show the component in both states for visual review in Chromatic.

## The feature that touches everything

What makes this interesting isn't any single component — it's the surface area. 34 files changed because balance display is everywhere in a wallet app. The `<PrivateText>` wrapper keeps each change small (most files gained 3 lines), but you have to find every place a monetary value appears.

I missed a few in the first pass. Storybook caught them.
