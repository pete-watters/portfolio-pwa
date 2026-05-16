---
title: "Cryptowatch"
company: "Kraken"
project: "Cryptowatch"
role: "Senior Frontend Engineer"
period: "August 2020 — November 2022"
stat: "Millions of traders · 25 exchanges · 4,000+ markets"
headline: "Sole frontend engineer on a greenfield trading automation tool — eight months from blank repo to MVP."
subtitle: "Cryptowatch was a real-time charting and trading terminal acquired by Kraken and later integrated into Kraken Pro."
confidentiality: "This case study describes my personal contributions. Cryptowatch has since been integrated into Kraken Pro. Details reflect my own experience and do not represent official Kraken communications."
tech:
  - React
  - TypeScript
  - PostCSS
  - Redux
  - Cypress
  - WebSocket APIs
  - Trading
  - Security
order: 2
outcomeText: "Eight months blank-repo to MVP · Sole frontend on Coderunner · Shipped trading form, cockpit redesign and leverage slider for the wider platform · Codebashing security champion 2020."
---

## Overview

Cryptowatch served millions of active traders across 25 exchanges and over 4,000 markets. I joined in August 2020 and shipped components, features, and a full greenfield product over two years.

## The problem

Two things ran in parallel.

The wider Cryptowatch platform needed senior frontend work — a redesigned cockpit, a multi-exchange trading form, and a leverage slider for the trade-execution flow. These were high-traffic, mission-critical surfaces.

Separately, the team wanted to build a new product called Coderunner — a greenfield trading automation tool. It needed an engineer who could take a brief and turn it into a shipped MVP. There was no existing codebase to lean on.

## What I built

### Chapter 1 — Coderunner, the greenfield product

I was the sole frontend engineer on Coderunner. Architecture, component implementation, testing, delivery — all mine. Eight months from blank repo to MVP.

The dynamic form-generation system was the hardest part. Strategy configurations had to support consistent field types — market picker, asset-aware amount input, precision-aware currency handling — without one-off form code per strategy. Built in React and TypeScript on top of PostCSS, with a custom field-type system that kept the strategy authors fast and the UI consistent.

### Chapter 2 — The trading form and leverage slider

On the wider Cryptowatch platform, I shipped the multi-exchange trading form, the cockpit redesign, and the leverage slider that fronted real money on real positions.

Trading UI is one of the unforgiving surfaces in frontend. A leverage slider that snaps wrong, or a price field that rounds the wrong way, costs users actual money. Every component went through Cypress E2E coverage I built up over the project's lifetime.

### Chapter 3 — Security — Codebashing champion 2020

I won Kraken's company-wide Codebashing security challenge in 2020, placing first across the engineering organisation for expertise in client-side vulnerabilities and OWASP mitigations. On a real-money trading platform, that mattered.

I also initiated a Cypress E2E testing framework for Cryptowatch as a side project. It became part of the team's regression baseline.
