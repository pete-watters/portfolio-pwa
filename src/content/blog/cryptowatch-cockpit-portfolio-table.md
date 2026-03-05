---
title: "Building the Cryptowatch Cockpit Portfolio Table"
description: "Creating a real-time portfolio management table and trading UI components for Kraken's Cryptowatch platform"
pubDate: 2026-02-23
tags: ["code"]
draft: false
---

Cryptowatch's Cockpit was the main trading interface -- a dense, real-time dashboard where users managed their positions across multiple exchanges. Think Bloomberg Terminal aesthetics but for crypto: live charts, order books, trade history, and portfolio data all on one screen. I joined the frontend team working on this before moving to Coderunner, and was pulled back in for three months when the Cockpit needed attention.

## The Portfolio Table

The main piece I built was a portfolio management HTML data table for the new chart view. This sat in the bottom panel of the Cockpit alongside tabs for open orders, holdings, margin positions, order history, and trade history.

The table needed to handle the realities of a trading interface: real-time price updates flowing in via the ticker bar, sortable columns, and the ability to filter by trading pair. Users could link their exchange API keys and see their actual positions, balances, and order status. Each row showed market, side, type, date, price, quantity, fill percentage, and current market price with a percentage-to-market comparison.

This was a pure HTML data table rather than reaching for a heavy table library. For a trading UI, rendering performance matters -- when prices are updating constantly, you don't want a table library's abstraction layer adding overhead.

## Trading UI Components

Beyond the portfolio table, I contributed a few components that were used across the broader platform:

**A cross-browser range slider for leverage selection.** Margin trading requires users to select their leverage multiplier, and the native HTML range input looks different on every browser. Building a custom one that was consistent across Chrome, Firefox, and Safari while handling the precise increments that leverage selection requires was a satisfying problem.

**Shared component library contributions.** Cryptowatch was actively building out a library of custom components during this period. Working on both Cockpit and Coderunner meant I had a good view of what was needed across the platform, and components I built for one project often found a home in the shared library.

## E2E Testing Prototype

I also built a proof-of-concept for automated E2E testing using Cypress. Trading UIs are notoriously hard to test -- there's real-time data, WebSocket connections, exchange API integrations, and complex user flows like placing an order, seeing it appear in the open orders tab, then watching it fill. The Cypress prototype demonstrated how we could automate these flows, though ultimately the QA team wanted to build their own testing system.

## Context

This work happened during a period of rapid growth at Cryptowatch. The frontend team was scaling up, we were overhauling the main charts page, and building out the shared component library simultaneously. I started on the trading frontend, was referred by a colleague who was then promoted to lead the new frontend team. We split into squads, and I moved between the trading/Cockpit work and the Coderunner automations project as priorities demanded.

Working on the Cockpit was a good counterpoint to Coderunner. Coderunner was a greenfield product where I owned the entire frontend. Cockpit was an established, complex application where my contributions needed to fit into existing patterns and work alongside other engineers' code. Both required different skills -- one rewarded architectural thinking, the other rewarded precision and attention to integration detail.
