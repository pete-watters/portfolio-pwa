---
title: "Building an Installable UI Library from a Production App"
description: "How I extracted 20+ React components from a crypto wallet browser extension into a published, versioned UI library — and then integrated it back."
pubDate: 2026-03-03
tags: ["open-source", "react", "design-system", "leather"]
draft: false
---

Extracting a component library from a running production app is a different challenge to building one from scratch. You're not designing in a vacuum — you're reverse-engineering the implicit API of components that already work, making them explicit, and then proving the extraction didn't break anything.

That's what I did for the [Leather](https://leather.io) wallet. Two PRs, one story.

## Phase 1: the big integration

[PR #5544](https://github.com/leather-io/extension/pull/5544) (+5,949/-5,068, 100+ files) was the first major integration of [`@leather-wallet/ui`](https://www.npmjs.com/package/@leather-wallet/ui) into the extension. Twenty-one components moved from local code to the shared package:

Accordion, Button, Callout, Caption, DynamicColorCircle, Flag, HR, Accessible Icon, Icon Button, all Icons, Input, ItemLayout, Link, Logo, NetworkModeBadge, Pressable, Select, Skeleton Loader, Spinner, Tag, and Title.

The diff was large but mechanical — find every import of a local component, replace it with the library import, delete the local file. The tricky part was the components that didn't map cleanly.

## What didn't migrate cleanly

**The Dropdown.** Integrating the library's `Dropdown` caused a bug where the UI would hang after interacting with dialogs in the settings menu — open Settings, change theme, and the app freezes. The fix was to leave `Dropdown` out of this phase and address it separately. Knowing when to stop is part of shipping.

**PNG-dependent icons.** Two avatar icons used `.png` assets that couldn't move to the shared library (which was SVG-only). They stayed in the extension as local overrides. A library doesn't need to handle every edge case — it needs to handle the common ones well.

**Spam filter utilities.** The `spam-filter.ts` and its tests moved to the shared package too, since both the extension and mobile app needed the same filtering logic. This wasn't a UI component, but it followed the same pattern — shared code belongs in shared packages.

## Phase 2: completing the migration

[PR #5550](https://github.com/leather-io/extension/pull/5550) (+204/-991) brought the next batch: Toast, Tabs, Avatar, AvatarIcon, and AddressDisplayer. This PR was smaller and cleaner because the pattern was established. The extension's `package.json` lost 5 direct UI dependencies and gained one version bump.

After this, only `Dialog` and a new `Dropdown` remained as follow-up work.

## The pattern

Each component migration followed the same steps:

1. **Build the component in the monorepo** with Storybook stories and types
2. **Publish a new version** of `@leather-wallet/ui` via the auto-publish pipeline
3. **Replace imports in the extension** — local component path to library import
4. **Delete the local component** and its tests
5. **Verify in Chromatic** — visual regression testing catches style differences

The Storybook and Chromatic integration was critical. You can't eyeball 100+ files of import changes. Automated visual testing confirms that `<Button>` from the library renders identically to the old local `<Button>`.

## What I learned

**Extract in phases, not all at once.** Phase 1 moved 21 components. Phase 2 moved 5. Each phase was independently shippable and reviewable. Trying to do all 26+ components in one PR would have been unreviewable.

**Libraries expose coupling.** When you extract a component, you discover all the implicit dependencies it had — local styles, local icons, app-specific hooks. These need to be resolved before the component can stand alone.

**The diff looks scary but the risk is low.** A PR that changes 100 files but only changes import paths is less risky than a PR that changes 5 files with new logic. Mechanical refactors are boring by design.

The extension went from 12 local UI dependencies to 1 library import. The mobile app uses the same library. Changes to shared components are tested against both apps in CI. That's the payoff.
