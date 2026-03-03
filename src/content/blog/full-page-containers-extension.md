---
title: "Rebuilding a Browser Extension's Container System from Scratch"
description: "How I replaced the entire drawer and container system in a crypto wallet extension with full-page views, shared headers, and a new design system implementation."
pubDate: 2026-02-27
tags: ["open-source", "react", "design-system", "leather"]
draft: true
---

This is the story of a PR that touched nearly 100 files, replaced the entire container system, and fixed 8 bugs in the process. [PR #4655](https://github.com/leather-wallet/extension/pull/4655) — 4,990 additions, 5,113 deletions.

The [Leather](https://leather.io) wallet extension had accumulated layers of layout components over time. `BaseDrawer`, `ControlledDrawer`, `CenteredPageContainer`, `ModalHeader`, a custom `Header` component — each solving a slightly different layout problem, each with its own quirks. The design team had moved to a new container system in Figma. The code hadn't caught up.

## The problems

The extension runs in two modes: a 360px popup and a full-page tab view. The old code treated these differently. Popup width wasn't standardised — some views were wider than others. Modals looked different depending on which drawer component rendered them. The settings menu was a bespoke implementation that didn't match the new designs.

And the drawers. The `BaseDrawer` was a 127-line component with its own animation logic, scroll handling, and close behaviour. `ControlledDrawer` wrapped it with state management. Both were used inconsistently throughout the app.

## The approach

Rather than patch the existing system, I replaced it. The work broke down into clear steps:

1. **Replace `BaseDrawer` with Radix `Dialog`.** Radix handles focus trapping, scroll locking, and accessibility out of the box. No more custom animation code.

2. **Unify all headers.** The old codebase had `Header`, `ModalHeader`, and `DrawerHeader` — three components doing roughly the same thing. I consolidated them into composable header components that work in every context.

3. **Standardise viewport width.** Extension popup and popout mode now use the same width. No more layout shifts when a view opens in a different context.

4. **Move CSS from app to UI library.** Radix styles and global CSS were imported at the app level. I moved them into the shared UI library so they're available everywhere and managed in one place.

5. **Implement screen variants.** Background colours now change based on screen type — "home", "page", "modal" — driven by a single container component instead of scattered inline styles.

6. **Refactor `navigate` out of layout components.** Headers and dialogs were calling `useNavigate` internally, coupling layout to routing. I lifted navigation handlers to the page level and passed them as props.

## What got deleted

- `BaseDrawer` (127 lines)
- `ControlledDrawer` (30 lines)
- `CenteredPageContainer` (15 lines)
- `Header` (86 lines)
- `ModalHeader` (86 lines)
- `DrawerHeader` (56 lines)
- `HeaderActionButton` (34 lines)
- `PreviewButton` (24 lines)
- `LeatherLogo` component (23 lines)
- `NetworkModeBadge` (33 lines)
- `useRouteHeader` hook (16 lines)
- `useDrawers` hook (26 lines)
- `useEventListener` hook (74 lines)
- `useMediaQuery` hook (23 lines)

Over 600 lines of layout primitives replaced by Radix Dialog and a single composable container system.

## What got added

The new `Container` component handles everything. It reads the current route and applies the correct layout variant — header style, background colour, footer visibility. A set of utility functions (`getPopupHeader`, `getTitleFromUrl`, `routeHelpers`) derive layout state from the URL.

New Storybook stories document each container variant. Chromatic visual regression testing catches layout changes across the full matrix of screen sizes and variants.

## The bugs it fixed

Because the old system was fragmented, bugs lived in the gaps between components. This refactor closed 8 open issues:

- Popup background colour inconsistencies
- Settings sub-menu rendering issues
- Scroll behaviour differences between popup and tab
- Sign-out layout not matching designs
- Fund page layout broken in popout mode

When your layout system is unified, entire categories of bugs disappear.

## Takeaway

Sometimes the right refactor is the big one. Patching 6 different drawer components to match a new design system would have taken longer and left the same fragmentation in place. One focused PR that replaces the entire container layer is easier to review (despite the line count), easier to maintain going forward, and fixes bugs you didn't even set out to fix.
