---
title: "Leather NFT Gallery — Two Chains, Multimedia, AI-Assisted Build"
company: "Trust Machines"
project: "Leather NFT Gallery"
role: "Senior Frontend Engineer"
period: "2024 — 2025"
stat: "Stacks SIP-9 + Bitcoin Ordinals · video + audio playback · ~5,800-line monorepo refactor"
headline: "From minimal Stacks NFT support to multimedia collectibles across two chains, shipped via shared feature packages and an agentic AI workflow."
subtitle: "Two very different on-chain data models — Stacks SIP-9 and Bitcoin Ordinals — collapsed into a single coherent gallery UI, shared across the Leather extension and mobile app."
confidentiality: "This case study describes my personal contributions as a contractor at Trust Machines. The Leather wallet is open source — my work is publicly visible at github.com/leather-io. Technical details reflect my own experience and do not represent official Trust Machines communications."
tech:
  - TypeScript
  - React
  - React Native
  - Stacks SIP-9
  - Bitcoin Ordinals
  - Panda CSS
  - Mono-repo architecture
  - Claude Code
  - Codex
  - AI-assisted development
order: 2
outcomeStats:
  - number: "2"
    label: "Chains supported — Stacks SIP-9 and Bitcoin Ordinals"
  - number: "5,783"
    label: "Lines added in the collectibles monorepo refactor"
  - number: "Audio + Video"
    label: "Playback support for multimedia Ordinals inscriptions"
---

## Overview

The NFT gallery in Leather started as minimal Stacks SIP-9 support. By the end of this work it covered both Stacks and Bitcoin Ordinals, including audio and video playback for multimedia inscriptions, and was shared across the browser extension and mobile app via a unified feature-packages architecture.

This case study covers the evolution: starting point, the refactor that made cross-platform sharing possible, the multimedia work, and the agentic AI workflow that accelerated delivery without compromising the wallet's review and testing standards.

For context on the wider Leather work — the rebrand, monorepo setup, and mobile app launch — see [the Leather Mobile case study](/work/leather-mobile/).

## The problem

Three things had to land in parallel.

NFT support in the extension was thin: Stacks SIP-9 only, basic image rendering, no Ordinals. Users with Bitcoin Ordinals collections — increasingly the majority of Leather's NFT-active users — couldn't see most of what they held.

Stacks and Bitcoin Ordinals have nothing in common at the data layer. SIP-9 is a smart-contract standard on a programmable chain; Ordinals are inscriptions embedded directly in Bitcoin transactions. The metadata, the fetch patterns, the rendering pipelines all differ. A naive implementation would mean two parallel codepaths everywhere.

And the extension and mobile app needed the same gallery experience. With the mono-repo in place from the [earlier mobile work](/work/leather-mobile/), the opportunity was to land NFT support once, in a shared package, consumed by both surfaces.

## What I built

### Chapter 1 — The feature-packages refactor

Before adding new chains and media types, I refactored the existing collectible code into a shared monorepo package. A unified `CollectibleView` type and a set of shared UI primitives became the contract — extension and mobile both consume the same components and the same data shape.

The refactor itself was substantial: ~5,800 lines added across the monorepo, components moved from app-specific directories into shared packages, new token detail screens and a Send Inscription flow introduced. Every existing collectible flow had to keep working through the migration.

This is the kind of refactor that's easy to get wrong. Touching collectibles in a wallet means touching code that displays — and lets users send — assets worth real money. Tests, type safety, and incremental rollout did the heavy lifting.

<figure>
  <video src="/videos/work/leather-nfts/cross-platform-activity.mp4" autoplay loop muted playsinline preload="metadata"></video>
  <figcaption>Shared feature packages in action — the same logic driving identical UI on both mobile and the extension.</figcaption>
</figure>

### Chapter 2 — Bitcoin Ordinals and multimedia

With the shared architecture in place, adding Bitcoin Ordinals became a matter of plugging a new chain adapter into the shared `CollectibleView` interface. The Ordinals data layer is meaningfully more complex than SIP-9 — inscriptions can carry arbitrary content types, including video and audio.

Supporting multimedia in a wallet UI raises questions that don't exist for static images. Auto-play behaviour. Bandwidth on mobile. Audio that fires unexpectedly when a user opens a gallery. Each got resolved with care for the user-money-at-stake context — playback gated behind explicit interaction, mobile-aware bandwidth handling, audio muted by default.

<figure>
  <video src="/videos/work/leather-nfts/collectibles-mobile.mp4" autoplay loop muted playsinline preload="metadata"></video>
  <figcaption>The collectibles gallery on mobile — Stacks SIP-9 and Bitcoin Ordinals in one unified view.</figcaption>
</figure>

<figure>
  <video src="/videos/work/leather-nfts/collectibles-extension.mp4" autoplay loop muted playsinline preload="metadata"></video>
  <figcaption>The same gallery on the browser extension — one feature package, two surfaces.</figcaption>
</figure>

### Chapter 3 — The agentic AI workflow

The pace of this work was only possible because the team had moved to an AI-assisted development model. I was an early adopter on the engineering side — established working patterns with Claude Code and Codex, contributed to CLAUDE.md and reusable skills, and pushed the team toward a model where agentic AI was load-bearing infrastructure rather than a side experiment.

Concretely, that meant: rich CLAUDE.md context files describing the codebase's architecture and conventions; reusable skills for common refactor and test-writing patterns; agentic delivery of well-scoped features with human review at the merge point. The wallet's strict review and testing standards never relaxed — the AI workflow accelerated delivery within those standards, not around them.

The pattern has since extended across the broader engineering team.

## Outcome

A unified NFT gallery covering Stacks SIP-9 and Bitcoin Ordinals, with audio and video playback, shared seamlessly between extension and mobile via the feature-packages architecture. ~5,800 lines of refactor delivered in a single coordinated pass. An AI-assisted workflow that other engineers on the team have since adopted.

The thing that travels from this work isn't any one feature — it's the instinct to refactor *first* so the new work has somewhere clean to land, and to let AI tooling do the load-bearing parts of routine implementation under human review.
