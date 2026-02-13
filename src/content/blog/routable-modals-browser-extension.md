---
title: "Routable Modals in a Browser Extension"
description: "Solving the 'modal on top of route' problem with ModalBackgroundWrapper and React Router"
pubDate: 2024-03-01
tags: ["code"]
draft: true
---

Browser extensions use React Router for navigation, but modals need to overlay on top of existing routes without replacing them. When a user opens "Receive" as a modal, the home screen should still be visible behind it. If they refresh the page or open the modal URL directly, it should still work.

## The Solution

[#4325](https://github.com/leather-io/extension/pull/4325) (+504/-297, 30 files) introduced:

- **`ModalBackgroundWrapper`** - allows overlaying modals above other routes, showing the correct background behind nested routes
- **`useBackgroundLocationRedirect`** - when pages are visited directly or opened in new tabs, properly sets the content behind them

The PR has a [video demo](https://github.com/leather-io/extension/pull/4325) showing how it works.

## The Journey

1. [#4351 - "Stab at routing"](https://github.com/leather-io/extension/pull/4351) (+92/-90) -- first exploratory attempt
2. [#4325 - The real fix](https://github.com/leather-io/extension/pull/4325) (+504/-297) -- ModalBackgroundWrapper + useBackgroundLocationRedirect
3. Various follow-up fixes for edge cases (#4673 - brc-20 modal bg location, #5146 - send flow routing)

## Known Remaining Issues

Found but documented honestly in the PR:
- Secret key view + settings menu: modal doesn't display until password entered
- Direct access to `/receive/collectible/ordinal` crashes (missing taproot address)

<!-- ADD: Had you dealt with this kind of routing problem before? How did you discover the ModalBackgroundWrapper approach -- was it inspired by something you'd seen elsewhere? The "Stab at routing" PR title suggests it wasn't obvious from the start. -->

## Related Issues

- [#5066](https://github.com/leather-io/extension/issues/5066) (P1) - Fix redirect for API request instead of home on unlock
- [#4783](https://github.com/leather-io/extension/issues/4783) (P2) - Sign out shows password page
- [#5143](https://github.com/leather-io/extension/issues/5143) (P3) - Ledger routing issue when rejecting

Browser extension routing is its own special hell. You have popup mode, full-page tab mode, and action popups from dApps. Modals need to work in all three. React Router wasn't designed for this.
