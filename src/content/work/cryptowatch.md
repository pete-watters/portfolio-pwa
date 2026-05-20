---
title: "Cryptowatch Trading Surface — Real Money, Millions of Users"
company: "Kraken"
project: "Cryptowatch"
role: "Senior Frontend Engineer"
period: "August 2020 — November 2022"
stat: "Millions of traders · 25 exchanges · 4,000+ markets · Codebashing security champion 2020"
headline: "High-impact frontend work on Cryptowatch's trading surface — multi-exchange trading form, cockpit redesign, and the leverage slider that fronted real money on real positions."
subtitle: "Cryptowatch was a widely-used real-time charting and trading terminal, acquired by Kraken and later integrated into Kraken Pro. Supported millions of active traders across 25 exchanges and 4,000+ markets."
confidentiality: "This case study describes my personal contributions. Cryptowatch has since been integrated into Kraken Pro. Details reflect my own experience and do not represent official Kraken communications."
tech:
  - React
  - TypeScript
  - PostCSS
  - Cypress
  - WebSocket APIs
  - Trading
  - Security
  - OWASP
order: 3
outcomeText: "Multi-exchange trading form delivered to a millions-of-users surface · Cockpit redesign shipped · Leverage slider rebuilt for real-money trade execution · Cypress E2E framework initiated and adopted as regression baseline · Won Kraken's company-wide Codebashing security challenge 2020 — first place across the engineering organisation."
---

## Overview

Cryptowatch was Kraken's real-time charting and trading terminal — millions of active traders, 25 exchanges, 4,000+ markets. I joined as a senior frontend engineer in August 2020 and stayed through November 2022.

This case study covers the high-impact work on the trading surface itself: the multi-exchange trading form, the cockpit redesign, the leverage slider, and the security work that came alongside it. For my work on Coderunner — the greenfield trading-automation product inside Cryptowatch — see [the Coderunner case study](/work/coderunner/).

## The problem

The trading surface is the unforgiving part of crypto frontend.

A leverage slider that snaps to the wrong step costs users actual money on a real position. A trading form that rounds the wrong way on the amount field misprices an order. A cockpit that lags by 100ms on a fast-moving market loses traders to competitors with better tooling.

This is high-traffic, mission-critical infrastructure with direct visibility to executive leadership. The standard isn't "works on my machine" — it's "works the same way on every device, every network, every market state, every time."

## What I built

### Chapter 1 — The multi-exchange trading form

The multi-exchange trading form was the primary trade-execution surface. Users could select an exchange, a market, an order type, and submit — across 25 exchanges' APIs, each with their own quirks around precision, minimum sizes, and rate limits.

The form's hardest problem wasn't the UI. It was making 25 different exchange APIs feel like one consistent interface to the user, without leaking the underlying inconsistencies. Asset-precision rules vary per exchange. Order minimums vary. Some support post-only flags, some don't. The form's job was to normalise all of that into a single confident UX.

<figure>
  <img src="/img/work/cryptowatch/order-form.png" alt="Cryptowatch multi-exchange order form with buy/sell toggle, order type, funds field, and advanced conditional-close options" loading="lazy" />
  <figcaption>The multi-exchange order form — one confident interface fronting 25 exchanges' APIs.</figcaption>
</figure>

<figure>
  <img src="/img/work/cryptowatch/buy-limit-review.png" alt="Order review showing a Buy Limit for 500 STX at 0.9300 with estimated fee, total, and a Take Profit conditional close" loading="lazy" />
  <figcaption>Order review — fees, totals, and conditional-close logic surfaced before the user commits.</figcaption>
</figure>

### Chapter 2 — The cockpit redesign

The cockpit was the trader's command center — multiple charts, an order book, recent trades, account balances, open positions. The redesign reorganised the layout for higher information density on widescreen and a sensible collapse pattern on narrower viewports.

The trickiest part was the realtime data fan-out. With multiple panels subscribing to overlapping WebSocket streams, naive component-level subscriptions burned both bandwidth and CPU. The redesign moved subscriptions up to a shared layer with reference counting, so opening a fourth chart on the same pair didn't open a fourth WebSocket.

<figure>
  <video src="/videos/work/cryptowatch/walkthrough.mp4" autoplay loop muted playsinline preload="metadata"></video>
  <figcaption>The cockpit in action — live chart, order book, holdings, trade history, and order form in one command center.</figcaption>
</figure>

<figure>
  <img src="/img/work/cryptowatch/holdings.png" alt="Cockpit holdings panel showing multi-asset balances with 24-hour change and per-asset allocation" loading="lazy" />
  <figcaption>The holdings panel — multi-asset balances with realtime 24h change. (Test-account data.)</figcaption>
</figure>

### Chapter 3 — The leverage slider

The leverage slider sat between the user and a leveraged position. Wrong by a step and the user trades more (or less) margin than they intended.

The slider had to handle continuous drag, keyboard step, and direct numeric input — all consistent. Validation had to reflect the exchange-specific max leverage for the selected pair. Visual feedback had to make the *committed* position obvious vs the *currently-dragging* preview.

(If you got rekt on Cryptowatch between 2020 and 2022, sorry about that, statistically speaking it was probably my slider.)

### Chapter 4 — Codebashing security champion 2020

I won Kraken's company-wide Codebashing security challenge in 2020, placing first across the engineering organisation for expertise in client-side vulnerabilities and OWASP mitigations. On a real-money trading platform, that mattered — XSS, CSRF, prototype pollution, and credential-handling missteps are all attacks with real financial impact for users.

The Cypress E2E testing framework I initiated as a side project became part of the team's regression baseline. Trading UI tests caught classes of bug that unit tests miss — race conditions in the order-submission flow, focus-management bugs in modals, mis-rounded amount displays.

## Outcome

A trading form serving millions of users across 25 exchanges. A cockpit redesign that shipped without regressions. A leverage slider that, when it worked correctly, didn't make the news. A security challenge first-place finish. A regression-testing baseline that outlived my time on the project.

The thing that holds up isn't the components themselves — it's the bar. Trading UI is the surface where "good enough" isn't. Every shipped change cleared that bar.
