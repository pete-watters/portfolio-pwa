---
title: "Fixing Modal Routing in a React Browser Extension"
description: "How I refactored overlay modal routing in a browser extension to properly handle background content, direct navigation, and nested route state."
pubDate: 2026-02-27
tags: ["open-source", "react", "react-router", "leather"]
draft: true
---

Browser extensions are weird. You've got a popup view that's 360px wide, a full-page tab view, and sometimes a notification window for transaction signing. All running the same React app, all sharing the same routes.

Now add overlay modals — the "receive" sheet, the "switch account" dialog, the settings menu — that need to slide over whatever page you were on. In a regular web app, you'd just render a modal. In an extension, you need the background content to persist correctly across popup reopens, direct URL access, and nested route changes.

This was broken in [Leather](https://leather.io). I fixed it in [PR #4325](https://github.com/leather-wallet/extension/pull/4325).

## What was broken

Two bugs, both related to background content behind modals:

1. Open the settings menu, choose "View Secret Key", enter your password — the settings modal disappears until you authenticate. The background goes blank.
2. Copy the URL for `/receive/collectible/ordinal` and open it in a new tab — crash. The page expects state from the parent route that doesn't exist when navigated to directly.

The root cause was the same: the app had no concept of "what should be behind this modal."

## The fix: background location state

React Router's `useLocation` gives you the current location. But what we needed was a way to say "render this route as a modal overlay, and keep rendering _that other route_ behind it."

I introduced two pieces:

**`ModalBackgroundWrapper`** — a component that wraps modal routes and renders the correct background content behind them. It reads a `backgroundLocation` from route state and renders that location's content underneath the modal.

**`useBackgroundLocationRedirect`** — a hook for pages that should always have background content. When visited directly (no background location in state), it redirects to itself with the correct background location injected.

```typescript
// When navigating to a modal route, pass the current location as background
navigate('/receive', {
  state: { backgroundLocation: location }
});
```

The `ModalBackgroundWrapper` then renders two things: the background route (from state) and the foreground modal (from the URL). When someone opens a modal URL directly, the redirect hook sets up the background state automatically.

## Route restructuring

The routes file was a single flat list of 40+ routes. I broke it into logical groups:

- `receive-routes.tsx` — all receive flows
- `settings-routes.tsx` — settings and preferences
- `request-routes.tsx` — transaction request handling
- `rpc-routes.tsx` — RPC method routing
- `ordinal-routes.tsx` — ordinal/inscription flows

Each group is self-contained and easier to reason about. The main `app-routes.tsx` went from 173 lines of route definitions to 39 lines of group imports.

## The result

Both bugs fixed. Modals overlay correctly regardless of how you get there. Direct URL access works. The route file is readable. The PR was 504 additions and 297 deletions across 30 files.

Browser extensions force you to think about navigation edge cases that web apps rarely hit. Every route needs to work when opened cold — no parent state, no navigation history, no assumptions.
