---
title: "Three Iterations to Get Container Architecture Right"
description: "How the container system in a browser extension went through three major rewrites — from route-driven config, to context-based, to composable — before we got it right."
pubDate: 2026-03-03
tags: ["open-source", "react", "architecture", "leather"]
draft: true
---

I rewrote the container system for the [Leather](https://leather.io) wallet extension three times. Not because the first two were bad — each solved a real problem. But each introduced a new one that only became visible at scale.

This is what iterative architecture actually looks like.

## Iteration I: route-driven containers

[PR #4655](https://github.com/leather-io/extension/pull/4655) (+4,990/-5,113) replaced the original patchwork of drawers, modals, and page wrappers with a unified `Container` component. The container read the current route and applied the correct layout — header style, background colour, footer visibility.

Utility functions like `getPopupHeader` and `getTitleFromUrl` derived layout state from the URL. A `routeHelpers` module mapped routes to their layout variants.

**What it solved:** Unified layout. No more six different drawer components. Consistent backgrounds. Shared headers and footers. Eight bugs fixed in the process.

**What it introduced:** The container was a god component. Every new route needed to be registered in the route helpers. The mapping between URLs and layout variants lived in a separate file from the routes themselves. Adding a new page meant updating two places.

## Iteration II: context-based containers

The [next attempt](https://github.com/leather-io/extension/pull/5619) moved layout configuration into React Context. Instead of deriving layout from the URL, pages would declare their layout needs through a context provider.

**What it solved:** Routes and layout were co-located. No more route helper mappings.

**What it introduced:** Context made the container reactive but implicit. It was hard to see what layout a page would render without tracing through the provider tree. Testing required wrapping everything in the right context. The indirection made it harder to reason about, not easier.

## Iteration III: composition

[PR #5715](https://github.com/leather-io/extension/pull/5715) (+1,548/-1,650) threw out both approaches and went with plain composition. No route mapping. No context. Each page explicitly renders its own header.

```tsx
<Container>
  <PageHeader title="Send" />
  <ContainerLayout>
    <Content>
      <Page>
        {/* page content */}
      </Page>
    </Content>
  </ContainerLayout>
</Container>
```

Three header variants — `<MainHeader>`, `<PageHeader>`, `<PopupHeader>` — cover every case. Home pages share `<MainHeader>` at the route level. Full-page views compose `<PageHeader>` with a `<Page>` wrapper for width control. Popup approval windows use `<PopupHeader>` without the page wrapper.

**What it solved:** Everything is explicit. You look at a page component and see exactly what it renders. No mapping files, no context providers, no indirection. Adding a new page means composing existing building blocks.

The `container.tsx` went from 134 lines of route-driven logic to 4 lines. The deleted `getPopupHeader` utility alone was 87 lines.

## Why three iterations?

Each version was shaped by what we'd learned from the previous one:

| Version | Approach | Problem it created |
|---------|----------|-------------------|
| I — Route-driven | Centralised mapping | God component, two-place updates |
| II — Context | Declarative via providers | Implicit, hard to trace, test overhead |
| III — Composition | Explicit, per-page | None so far |

The pattern is well-known: **start centralised, discover the coupling, move to composition.** But knowing the pattern doesn't mean you can skip the steps. Each iteration revealed constraints that weren't visible until the codebase grew into them.

## Takeaway

The right architecture isn't always the one you design upfront. Sometimes you need to build the wrong thing to understand what right looks like. The important thing is recognising when your current abstraction is creating more problems than it solves — and being willing to rewrite it.

Three rewrites sounds expensive. Shipping a god component forever is more expensive.
