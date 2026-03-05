---
title: "Three Iterations to Get Container Architecture Right"
description: "How Leather's browser extension went from a global container system to composable page-level headers — across 468 files and two major refactors."
pubDate: 2024-08-19
tags: ["typescript", "architecture", "browser-extensions", "leather"]
draft: false
featured: true
---

Browser extensions have a constraint that most web apps don't: the same codebase renders in at least three different contexts. There's the popup (the small window from the toolbar icon), the full-page tab view, and approval popups (centred windows that open when a dApp requests a signature). Each context has different viewport sizes, different navigation patterns, and different header requirements.

In Leather's extension, we got the architecture for this wrong twice before landing on something that worked.

## Iteration 1: no containers

When I joined the project, each page was responsible for its own layout. Headers, footers, backgrounds, viewport handling — all inline per route. This meant copy-pasted layout code across dozens of routes, inconsistent spacing, and no shared way to handle the difference between popup and full-page contexts.

The popup was 390px wide. Full-page tab views were whatever the browser window was. There was no standardisation, so some pages looked broken in one context or the other.

## Iteration 2: global containers

[PR #4655](https://github.com/leather-io/extension/pull/4655) was the first attempt at fixing this. It took four months and touched 358 files. The diff was +4,990/-5,113 — essentially a rewrite of the layout layer.

The idea was a global container system: each route declared what kind of container it needed (home, page, popup), and a top-level wrapper rendered the appropriate header, footer, and background. We replaced the legacy `BaseDrawer` with Radix Dialog, standardised viewport width so popup and full-page matched, and introduced full-page extension views for flows like onboarding and settings.

It worked, but the global container pattern had a fundamental problem. The container configuration was route-level, defined separately from the page component. When someone added a new page, they had to remember to configure its container in a routing file. When they needed a slightly different header for one page, they either added a new container variant or worked around it with conditional logic in the global wrapper.

After merging, we immediately found a routing bug — the send flow wouldn't advance past "Continue" because the container wrapping interfered with navigation state. [PR #5146](https://github.com/leather-io/extension/pull/5146) fixed it, but it was a sign that the abstraction was fighting us.

## Iteration 3: composable headers

[PR #5715](https://github.com/leather-io/extension/pull/5715) — "Containers refactor III: This time it's composable" — replaced the global system with page-level composition. 110 files, +1,548/-1,650.

The new pattern: each page is responsible for its own header. No global container mapping. Instead, we provide three header components:

- `<MainHeader>` for home screens (logo, account switcher)
- `<PageHeader>` for full-page flows (back button, title)
- `<PopupHeader>` for approval popups (account info, network, balance)

A page composes its header inline:

```tsx
function SendPage() {
  return (
    <Page>
      <PageHeader title="Send" />
      <SendForm />
    </Page>
  );
}
```

No routing configuration needed. No global state. If a page needs a custom header, it just renders different components. The container is implicit in the composition, not configured externally.

## The popup split

Between iterations 2 and 3, we also had to solve a subtler problem: the browser action popup and approval popups are fundamentally different contexts, but they were sharing the same HTML entry point.

[PR #5778](https://github.com/leather-io/extension/pull/5778) split them into separate files — `popup.html` for the toolbar popup and `action-popup.html` for approval flows. This let us set different max-widths, handle responsive behaviour independently, and simplify the CSS. 49 files, +815/-860.

## What I learned

The global container pattern felt like the right abstraction at the time. Centralise layout decisions, keep pages focused on content. But it violated a principle I now hold strongly: **the component that renders content should control its own layout context**.

Global configuration creates invisible coupling. A page "works" in isolation but breaks when the global wrapper changes. Composition makes the coupling explicit — if a page needs a header, it imports and renders one. The dependency is visible in the file.

The numbers tell the story. Three PRs, 468 files changed across a year. But the composable version is the one that stopped generating bugs.
