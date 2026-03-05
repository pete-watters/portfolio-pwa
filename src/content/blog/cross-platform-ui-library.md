---
title: "From Web Components to Native: Shipping a Cross-Platform UI Library"
description: "How we extended a web-first React UI library to support React Native, built components bottom-up, and shipped the first production mobile screen from shared packages."
pubDate: 2026-03-05
tags: ["react-native", "typescript", "design-systems", "monorepo", "mobile"]
draft: false
featured: true
---

When we started building Leather's mobile app, we already had a UI library. `@leather-wallet/ui` lived in our monorepo and gave the browser extension a shared set of components — Button, Link, Avatar, and a handful of others. The extension imported them via `link:/` from `packages/ui/`, and it worked well.

The question was whether that same library could serve React Native. We had two options: build a separate native component library, or extend the existing one to support both platforms. We chose the latter. Four months and 255 files later, we had a tokens widget — our first full production screen — built entirely from shared library components.

## The starting point

PR [#161](https://github.com/leather-io/mono/pull/161) in May 2024 proved the concept. It migrated web components into `packages/ui/` and set up the package structure. Button, Link, and Avatar moved out of the extension's source tree and into the shared library. The extension imported them like any other package. 31 files changed, 551 additions.

That PR also introduced Storybook stories for each component. This turned out to be more important than we expected — Storybook became our cross-platform visual testing tool later on.

## What makes native different

React Native looks like React, but the layout engine has subtle incompatibilities that only surface once you start porting components.

**`alignItems` doesn't support `start` and `end`.** The CSS spec values work fine on web, but React Native's Yoga layout engine requires `flex-start` and `flex-end`. This broke our `ItemLayout` component immediately. The fix is simple, but it's the kind of thing you only discover at runtime on a device.

**SVGs don't work the same way.** On web, you inline an SVG or use an `<img>` tag. On native, you need `react-native-svg` and its own component tree (`<Svg>`, `<Path>`, etc.). We hit this in Storybook first — icon components that worked perfectly on web rendered nothing on native. For Cell component stories, we used placeholder images instead of SVG icons until we sorted out the native SVG pipeline.

**CSS transforms behave differently.** We had a chevron icon on our Cell component that used `transform: rotate(90deg)` on web. On native, the transform syntax is different — an array of transform objects. Small, but it meant the chevron pointed the wrong direction until we caught it.

**You need platform-specific files.** React Native's module resolver picks up `.native.tsx` files over `.tsx` when bundling for native. This is the mechanism that makes cross-platform work — you write `button.tsx` for web and `button.native.tsx` for native, and the bundler does the right thing. But it means every component that differs between platforms needs two files.

## Building bottom-up

We could have tried to port everything at once. Instead, we started with the smallest primitives and worked up.

**Flag** ([#383](https://github.com/leather-io/mono/pull/383)) was the first native component added to the library. 94 additions across 4 files. A simple layout component, but it proved the workflow: write the `.native.tsx` file, add a Storybook story, test on a device.

**ItemLayout** ([#389](https://github.com/leather-io/mono/pull/389)) was next, and that's where we hit the `alignItems` issue. 127 additions, 5 files. The web version used `align-items: start`. The native version needed `alignItems: 'flex-start'`. We wrote the platform-specific variant and moved on.

**Cell** ([#398](https://github.com/leather-io/mono/pull/398)) moved from the app's source into the shared package. 10 files changed. Then a follow-up ([#416](https://github.com/leather-io/mono/pull/416)) fixed the chevron transform and swapped SVG icons for placeholder images in Storybook.

**Button** ([#415](https://github.com/leather-io/mono/pull/415)) was the first real migration. `button.tsx` moved from `apps/mobile/` to `button.native.tsx` in `packages/ui/`. 197 additions, 276 deletions — a net reduction. The app was getting smaller as the library grew. 19 files changed.

**Skeleton Loader** ([#417](https://github.com/leather-io/mono/pull/417)) came from an external contributor, [@adrianocola](https://github.com/adrianocola). We reviewed it, integrated it into the library, and credited them in the PR. Open source working as intended.

**Sheet** ([#426](https://github.com/leather-io/mono/pull/426)) was the biggest single PR: 899 additions, 753 deletions, 70 files. We took the `<Modal>` component from `apps/mobile/`, renamed it to `<Sheet>`, and moved it into `packages/ui/`. The `@gorhom/bottom-sheet` dependency moved with it. Every reference to `Modal` across the codebase became `Sheet`. This was the component that proved the library could handle complex, stateful, platform-specific UI — not just simple layout primitives.

## The tokens widget

PR [#448](https://github.com/leather-io/mono/pull/448) was the payoff. The tokens widget — the main screen users see when they open the mobile app — was built entirely from library components. Flag, Cell, ItemLayout, Button, Sheet, Skeleton Loader. All from `@leather-wallet/ui`.

933 additions, 1,057 deletions, 46 files. Another net reduction. The widget showed token balances across chains, handled locked STX, and introduced two new components — `Chip` and `BulletSeparator` — both with Storybook entries.

The screen was static UI at this point, wired to mock data. But the architecture was proven: a production mobile screen composed from shared, cross-platform components.

## What I'd do differently

The bottom-up approach was right, but we could have been more disciplined about the `.native.tsx` boundary. Some components ended up with minor platform differences (a `flexStart` here, a transform array there) that could have been abstracted into a shared utility. Instead, each component solved the same problem independently.

Storybook was invaluable for visual testing, but we didn't have automated visual regression tests. That meant platform-specific rendering bugs — like the chevron transform issue — were caught by humans, not CI. If I were starting again, I'd set up Chromatic or a similar visual diff tool from the first PR.

## The numbers

11 PRs over four months. 4,874 lines added, 2,735 removed, 255 files changed. The app's own source tree shrank with each migration as components moved into the shared library. By the time the tokens widget shipped, the mobile app was thinner than when we started — and the extension could use the same components if needed.
