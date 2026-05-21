---
title: "Coderunner — Kraken's Trading Automation Tool"
company: "Kraken"
project: "Cryptowatch · Coderunner"
role: "Senior Frontend Engineer"
period: "2021 — 2022"
stat: "Took over + rebuilt the frontend · 8 months to MVP · custom form-generation backbone"
headline: "Rebuilt a crypto trading-automation tool from the ground up."
subtitle: "Coderunner was a Cryptowatch product letting traders author and run automated strategies. I took over its frontend from an earlier engineer and rebuilt it to a shipped MVP, working alongside a backend developer."
confidentiality: "This case study describes my personal contributions. Cryptowatch was acquired by Kraken and later integrated into Kraken Pro. Details reflect my own experience and do not represent official Kraken communications."
tech:
  - React
  - TypeScript
  - PostCSS
  - Redux
  - Cypress
  - WebSocket APIs
  - Dynamic form generation
order: 4
outcomeText: "8 months to MVP · Led the frontend rebuild — architecture, components, testing and delivery, alongside a backend dev on the execution layer · Custom form-generation system supporting consistent field types — market picker, asset-aware amount input, precision-aware currency handling — without one-off code per strategy."
---

## Overview

Coderunner was a trading-automation product inside Cryptowatch. The wider platform served millions of traders across 25 exchanges; Coderunner sat alongside it, letting users compose and run automated strategies against the same execution layer.

I joined Cryptowatch as a senior frontend engineer in August 2020. An earlier engineer had built an initial prototype and then moved on; I took over the frontend, rebuilt it, and — working alongside a backend developer on the execution layer — took it to a shipped MVP over eight months.

For my work on the broader Cryptowatch trading surface — the multi-exchange trading form, cockpit redesign, leverage slider, and security work — see [the Cryptowatch case study](/work/cryptowatch/).

## The problem

Rebuilding a trading product is mostly about choosing what *not* to build. Every premature abstraction blocks delivery; every missing abstraction blocks the next feature. The hardest single decision was around the form layer — the prototype leaned on JSON-schema forms, and they didn't scale to the range of strategy inputs we needed.

Strategy configurations were the heart of the product. Each strategy had a different set of inputs — some needed asset pickers, some needed amount inputs with asset-specific precision, some needed market filters with cross-exchange awareness. Building a one-off form per strategy meant maintenance hell within a quarter. Building a generic forms framework meant a month before any strategy could ship.

The answer was somewhere between: a dynamic form-generation system with a small set of well-typed field primitives, composed at strategy definition time.

## What I built

### Chapter 1 — Rebuilding the architecture

The prototype was a starting point, not a foundation — the frontend needed rebuilding to ship. I made the foundational choices: React + TypeScript for the app shell, PostCSS for styling (Cryptowatch's wider convention), Redux for the trading state that needed cross-component subscriptions. A small set of opinions documented up front, then stayed out of the way.

The architecture was deliberately conservative — no novel patterns where boring ones worked. Trading software fails in spectacular ways when the engineer reaches for clever. Conservative-by-default kept iteration speed high without surprises in the trade-execution path.

### Chapter 2 — The dynamic form-generation system

The piece I'm most proud of, and the reason for the rebuild — it replaced the prototype's JSON-schema forms. Strategy authors define a schema; the framework renders the form, handles validation, manages state. Asset-aware amount fields know which precision to use based on the selected asset. Market pickers know which exchanges support the selected pair. Currency fields format and round consistently.

Every field type is a strongly-typed primitive. Adding a new strategy means picking from the primitives, not writing custom form code. Adding a new field type is a localised change that doesn't touch existing strategies.

This kept the strategy authors fast — which, in a product where shipping new strategies *is* the product, was the load-bearing decision.

### Chapter 3 — Cypress E2E coverage built over time

I initiated a Cypress E2E testing framework for Cryptowatch as a side project. For Coderunner, that framework was the regression baseline. Every shipped strategy got a happy-path E2E test; every bug that escaped got a regression test added.

Trading UI tests are unforgiving. A field that rounds wrong, a slider that snaps to the wrong step, a button that fires twice on a fast tap — all of these can cost a real user real money on a real position. The E2E suite caught these in CI before they reached prod.

## Outcome

Eight months to a shipped MVP that real traders ran real strategies on. A form-generation system that future strategy authors built on without coming back to me. A Cypress E2E baseline that outlived my time on the project.

The thing that travels: conservative architecture choices, an investment in the right abstraction (the form layer), and treating tests as the foundation, not the chore.
