---
title: "Stackr — A Self-Custody Multi-Chain Portfolio Terminal"
company: "Independent"
project: "Stackr"
role: "Design + Engineering (solo)"
period: "2026 — present"
stat: "4 chains · Bitcoin · Ethereum · Solana · Stacks — wallet-connect + watch-only · live on Cloudflare Workers"
headline: "A self-custodial cross-chain portfolio terminal."
subtitle: "Stackr tracks balances, allocation, and activity across Bitcoin, Ethereum, Solana, and Stacks in one view — computed entirely client-side from public chain RPCs."
confidentiality: "Stackr is my own product — built in the open on a public repo, but proprietary (all rights reserved). All figures and addresses shown here are mock data."
tech:
  - Next.js 15
  - React 19
  - TypeScript
  - Tailwind v4
  - Custom SVG charts
  - wagmi / viem
  - Solana wallet-adapter
  - "@stacks/connect"
  - Turborepo
  - Cloudflare Workers
order: 0
outcomeText: "Live on Cloudflare Workers · four chains in one view · wallet-connect across three wallet families plus watch-only addresses · custom SVG charts built to hold 10+ ticks/sec without jank · zero dashboard libraries."
---

## Overview

Stackr is a cross-chain portfolio terminal for people who actually self-custody. Connect MetaMask, Phantom, or Leather — or paste any address to watch it — and your holdings across **Bitcoin, Ethereum, Solana, and Stacks** render in one view: balances, allocation, and recent activity, with live prices and depth-aware charts.

Everything is computed client-side from public chain RPCs. No account, no database, no tracking. It's a monorepo (Turborepo + pnpm) on Next.js 15 / React 19, styled with Tailwind v4 and a hand-rolled component set, deployed to Cloudflare Workers.

## The problem

Most multi-chain portfolio trackers force a trade-off: hosted convenience behind a KYC wall, or DIY self-custody with no useful interface. And the ones that exist mostly look the same — a generic dark dashboard, a stock charting library, a narrow centred column with oceans of empty space, color as the only signal.

I wanted the opposite: self-custody by default, hosted nothing, and a surface that feels like a real trading terminal — dense, fast, and recognisably built rather than assembled from a UI kit.

## Design exploration

Before committing, I built four full working design directions for the dashboard — same data, same components, four distinct points of view — and put them side by side. Each is full-width and dense (no wasted space), accessible (direction conveyed by arrows and sign, not colour alone; AA contrast; real focus states), and hand-rolled — the only dependency added was web fonts.

<figure>
  <img src="/img/work/stackr/a-terminal.png" alt="Stackr 'Terminal' direction — pure-black, all-monospace dashboard with a green portfolio sparkline, a four-chain allocation bar, a dense holdings table, and a recent-activity ladder" loading="lazy" />
  <figcaption>Direction A — <strong>Terminal</strong>: pure-black, all-monospace (IBM Plex Mono), dense number ladders, hairline grid, HUD chrome. The shipped direction — a Bloomberg-for-crypto feel.</figcaption>
</figure>

<figure>
  <img src="/img/work/stackr/b-kraken-pro.png" alt="Stackr 'Kraken Pro' direction — deep slate panels with an indigo accent, rounded cards, a gradient sparkline, and pill-tagged holdings" loading="lazy" />
  <figcaption>Direction B — <strong>Kraken Pro</strong>: deep slate panels, indigo accent, distinctive sans with tabular-mono numerals, soft elevation. Funded-product polish.</figcaption>
</figure>

<figure>
  <img src="/img/work/stackr/c-leather-warm.png" alt="Stackr 'Leather Warm' direction — warm near-black with a Bitcoin-orange accent, a Fraunces display serif, and an editorial layout" loading="lazy" />
  <figcaption>Direction C — <strong>Leather Warm</strong>: warm near-black, Bitcoin-orange accent, Fraunces display serif, soft geometry. Editorial and human — a deliberate break from the cold-dashboard norm.</figcaption>
</figure>

<figure>
  <img src="/img/work/stackr/d-onyx-ledger.png" alt="Stackr 'Onyx Ledger' direction — near-black with a gold accent, Bricolage Grotesque, and ruled ledger-style tables" loading="lazy" />
  <figcaption>Direction D — <strong>Onyx Ledger</strong>: near-black and gold, Bricolage Grotesque, ruled ledger tables. Terminal density with a quiet-luxury calm.</figcaption>
</figure>

I shipped **Terminal**. It's the most honest expression of what Stackr is — a fast, dense, self-custody trading surface — and the hardest to mistake for a template.

## What I built

### Multi-chain, additively

The data layer is four read-only HTTP clients (BTC via Blockchair, ETH via Etherscan, SOL via Helius, STX via Hiro), each taking an address and returning a normalised balance. Wallet-connect is an **additive layer** on top: MetaMask via wagmi/viem, Phantom via the Solana wallet-adapter, Leather via `@stacks/connect`. A connected wallet is just a discovered address fed into the same pipeline as a watch-only one — so connected and watch-only holdings unify in a single portfolio view, and the service layer never had to learn about wallets at all.

### Charts I own

The charts are custom SVG, not a library. A charting dependency re-renders the React tree on every tick; surgical `<path d>` updates on raw SVG handle 10+ updates a second without dropping frames. That was the right call for the order book and depth chart specifically — the same argument that held on Cryptowatch's trading surface, where I'd made it before.

### Hand-rolled, accessible, fast

No dashboard or charting libraries. Visual primitives are hand-built; behaviour primitives (dialog, dropdown, tooltip) use headless Radix styled by me, so accessibility isn't hand-rolled and risky. Everything is keyboard-navigable with visible focus, direction is never colour-only, and the bar is Lighthouse 95+ across the board — which hand-rolled SVG and minimal JS reach comfortably.

## Outcome

Stackr is live on Cloudflare Workers, serving the full four-chain experience from a single edge worker. The wallet-connect layer covers three wallet families plus watch-only addresses; the charts are mine end to end; and the whole thing ships with zero dashboard libraries. It's a product I'm continuing to build — the terminal aesthetic above is where it's heading.
