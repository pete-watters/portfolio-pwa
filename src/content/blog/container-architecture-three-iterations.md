---
title: "Three Iterations to Get Container Architecture Right"
description: "Why the third time was the charm for our browser extension layout system"
pubDate: 2024-08-15
tags: ["code"]
draft: true
---

Browser extensions are a weird UI context. A small popup (400x600px), full browser tabs, and "action popups" triggered by dApps. The same components need to work across all three. I iterated on this three times over 8 months.

## v1: Full Page Views (Dec 2023 - Mar 2024)

[#4655](https://github.com/leather-io/extension/pull/4655) (+4,990/-5,113, 358 files). Open Dec 7, merged Mar 28 -- nearly 4 months. This PR replaced baseDrawer with Radix.Dialog, standardised viewport width, moved CSS from the app to the UI library, refactored navigation out of Dialog, and fixed 8 bugs along the way.

The problem: containers were rigid. Every page used the same structure.

```jsx
<Container header="back" footer="actions" title="Send Bitcoin">
  {content}
</Container>
```

## v2: UI Library Integration (Jun 2024)

[#5544](https://github.com/leather-io/extension/pull/5544) (+5,949/-5,068, 310 files). Revealed that containers were tightly coupled to the old component structure. We also tried a Context-based approach ([#5619](https://github.com/leather-io/extension/pull/5619)) which didn't pan out.

## v3: "This Time It's Composable" (Aug 2024)

[#5715](https://github.com/leather-io/extension/pull/5715) (+1,548/-1,650, 110 files). Open Jul 31, merged Aug 1 -- **one day** (vs 4 months for v1). Driven by a [team discussion](https://github.com/orgs/leather-io/discussions/87). Routes no longer configure the container -- pages own their own headers via composition.

```jsx
<Container>
  <Container.Header>
    <BackButton />
    <Title>Send Bitcoin</Title>
  </Container.Header>
  <Container.Body>{content}</Container.Body>
  <Container.Footer>
    <ActionButtons />
  </Container.Footer>
</Container>
```

v1 took 4 months and 358 files. v3 took 1 day and 110 files. The code got smaller AND faster to ship.

<!-- ADD: What triggered each iteration? Was v1's rigidity obvious immediately or did it emerge over months? What was the team discussion like? Was there any resistance to "doing it again"? The PR title is great -- was it intentional humour? -->

### v3.5: Popup Differentiation (Aug 2024)

[#5778](https://github.com/leather-io/extension/pull/5778) (+815/-860, 49 files). Differentiated between the popup context and the action popup context. Fixed responsiveness issues.

## Related Work

The routing and modal work was deeply intertwined with containers:

- [#4325](https://github.com/leather-io/extension/pull/4325) - Routable modals with `ModalBackgroundWrapper` (HAS VIDEO)
- [#4351](https://github.com/leather-io/extension/pull/4351) - "Stab at routing"
- [#5579](https://github.com/leather-io/extension/pull/5579) - Integrate Dialog from monorepo
- [#5816](https://github.com/leather-io/extension/pull/5816) - Rename Dialog as Sheet
