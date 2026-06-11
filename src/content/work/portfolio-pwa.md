---
title: "petewatters.ie — An Astro PWA With Build-Time On-Chain Data"
company: "Independent"
project: "petewatters.ie"
role: "Designer & Engineer"
period: "2026"
headline: "This site — an Astro PWA with build-time on-chain data."
subtitle: "The portfolio you're reading: static-rendered, offline-capable, and personal — a live GitHub contribution graph and a Solana-NFT avatar fetched at build time, so what you see is real and current at zero runtime cost."
confidentiality: "petewatters.ie is my own independent project — all architecture, code, design, and content are my own work. The code is open source under AGPL-3.0; the writing, imagery, and identity are reserved."
repo: "https://github.com/pete-watters/portfolio-pwa"
tech:
  - Astro 5
  - TypeScript
  - PWA / Workbox
  - Pagefind
  - Playwright
  - playwright-bdd
  - Vale
  - Cloudflare Pages
  - GitHub Actions
  - Helius API
order: 7
outcomeStats:
  - number: "0"
    label: "Runtime API calls — every piece of live data is baked in at build time"
  - number: "3"
    label: "Deploy targets — production, staging, and an ephemeral preview per PR"
  - number: "249"
    label: "Functional browser checks across Chromium, Firefox and WebKit"
draft: false
---

## Overview

A portfolio site is a strange product: it has one user who matters at a time, it gets judged in under a minute, and — for an engineer — it *is* the work sample. So this site is built the way I build products: static-first for speed, a real test suite, a real release process, and a couple of genuinely unusual tricks where they earn their place.

The stack is deliberately boring where boring is right — Astro 5, plain CSS, TypeScript strict — and interesting where it counts.

## Build-time on-chain data

The two "live" elements on the homepage are fetched at **build time**, not in the browser:

- **The avatar is a Solana NFT.** At build, the site resolves the NFT's current image via the Helius API and bakes it into the page. Change the NFT, redeploy, new avatar — no client-side wallet calls, no loading spinner.
- **The open-source section is a live GitHub contribution graph**, queried from the GitHub API during the build, so it's always current as of the latest deploy.

The effect is data that is *real* — verifiable on-chain, verifiable on GitHub — with the runtime cost of a static page: zero API calls, nothing to rate-limit, nothing to fall over.

## An installable, offline-capable PWA

The site ships as a progressive web app — Workbox service worker, install manifest, offline fallback — so it loads instantly on repeat visits and survives a dead connection. Search is **Pagefind**, indexed at build over the blog and case studies, served as static chunks: full-text search with no search server.

## Tested like a product

The quality gates are the same shape I set up for client work:

- **Functional end-to-end suite** — Playwright across Chromium, Firefox and WebKit, run on every pull request.
- **Visual regression guardrail** — a playwright-bdd suite screenshots every primary route against committed baselines, so a styling regression or a blank page fails CI instead of reaching production.
- **Prose linting** — Vale runs over every blog post before publication.
- Lint, strict type-checking, and unit tests on every change.

## Shipped like a product

GitFlow with a protected production branch: features PR into `dev` (staging), and a release is a single `dev → main` promotion that tags a version, publishes release notes, and deploys — one click, end to end. Cloudflare Pages serves production, a staging environment, and an ephemeral preview per pull request.

The code is open source under **AGPL-3.0** — the engineering is there to read, which is the point of a portfolio. The content, writing, and identity stay mine.

## Outcome

A fast, installable, offline-capable site where the interesting claims — the on-chain avatar, the live contribution graph, the test discipline — are verifiable rather than asserted. The repo is the case study.
