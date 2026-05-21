---
title: "Leather Mobile — Bitcoin Wallet on iOS and Android"
company: "Trust Machines"
project: "Leather Mobile App"
role: "Senior Frontend Engineer"
period: "July 2023 — Present"
stat: "1,850+ MAU within three months · launched at BTC Vegas 2025"
headline: "Shipped Leather's first mobile app — zero to App Store in 3 months."
subtitle: "Leather (formerly Hiro Wallet) is an open-source, self-custodial Bitcoin and Stacks wallet. Before this work it lived only as a browser extension; the mobile app was net-new."
confidentiality: "This case study describes my personal contributions as a contractor at Trust Machines. The Leather wallet is open source — my work is publicly visible at github.com/leather-io. Technical details reflect my own experience and do not represent official Trust Machines communications."
tech:
  - React Native
  - Expo
  - TypeScript
  - Panda CSS
  - Radix UI
  - Redux
  - Maestro
  - Mono-repo architecture
  - Bitcoin
  - Stacks
  - sBTC
order: 1
outcomeStats:
  - number: "1,850+"
    label: "Monthly active users within three months of launch"
  - number: "2"
    label: "Platforms — iOS and Android — sharing one design system"
  - number: "1"
    label: "Mobile app shipped to App Store and Play Store"
  - number: "BTC Vegas"
    label: "Conference launch, 2025"
---

## Overview

[Trust Machines](https://trustmachines.co/) is a venture studio backing teams that build Web3 on Bitcoin. Leather — formerly Hiro Wallet — was its flagship product alongside Granite; together they brought Web3 to Bitcoin. Leather itself is an open-source, self-custodial wallet for Bitcoin and Stacks.

I joined in July 2023, when Leather still lived only as a browser extension. I played a key role in the Hiro → Leather rebrand and the push on quality that came with it. From there I set up a monorepo and moved shared code into it to pave the way for a mobile app — then, when it was time to ship, did whatever it took to launch on time for the Bitcoin Conference in Las Vegas, including self-funding my own trip to be there for it.

This case study covers that arc: the rebrand and quality work, the monorepo foundation that made cross-platform sharing possible, the first mobile build, and the launch.

The NFT gallery and AI-assisted workflow that grew out of this work has [its own case study](/work/leather-nfts/).

## The problem

Three constraints, all at once.

There was no shared component system. The extension's UI lived entirely in the extension repo. Any mobile app built without shared infrastructure would duplicate work indefinitely, and the two apps would drift apart cosmetically within a month.

There was no mobile app at all. No React Native presence in the codebase, no Expo configuration, no App Store metadata, no provisioning.

And the launch had a hard external deadline — the Bitcoin Conference in Las Vegas, May 2025. A target visible to executives, partners, and the wider Bitcoin community.

## What I built

### Chapter 1 — The Hiro → Leather rebrand

Before any of the mobile work, the product itself was changing. Hiro Wallet was becoming Leather, and I played a key role in that transition — not just the rename, but the quality bar a flagship rebrand demands: tightening the UI, fixing rough edges, and getting the extension into the shape a relaunch needed.

That work set the stage for everything after. A cleaner, more consistent codebase is what made it realistic to extract shared packages and point them at a second platform.

### Chapter 2 — The mono-repo foundation

Before a mobile app could ship, there needed to be shared infrastructure. As a core team member, I worked on a mono-repo to house the extension, mobile app, and shared packages under one roof.

The centrepiece was Panda UI — a shared component library built with Panda CSS and Radix UI primitives. Components defined once, consumed by both the extension and the React Native app without duplication.

This wasn't just a technical decision. Every hour saved on component maintenance is an hour that goes into shipping product. For a small team building across multiple surfaces, that compounded quickly.

### Chapter 3 — The first mobile app

The first Leather mobile app was built with React Native and Expo. I managed the end-to-end launch: architecture, component implementation, navigation, wallet connection, end-to-end testing with Maestro, and App Store submission.

The mobile UI shares business logic and UI primitives with the extension through the mono-repo. Where mobile patterns diverged from web — native gestures, platform-specific share sheets, biometric flows — the differences lived in platform-specific files behind the shared component interface.

Wallet integration on mobile is its own discipline. The mnemonic-handling, key derivation, and transaction signing all had to survive low-end Android devices, intermittent connectivity, and the OS-specific quirks of secure storage. Every flow that touched a private key got extra scrutiny.

<figure>
  <video src="/videos/work/leather-mobile/accounts-widget.mp4" aria-label="Demo: the Leather mobile accounts widget" autoplay loop muted playsinline preload="metadata"></video>
  <figcaption>The accounts widget — one of the first real features on mobile, assembled from shared monorepo components.</figcaption>
</figure>

<figure>
  <video src="/videos/work/leather-mobile/loading-states.mp4" aria-label="Demo: loading and error states across the Leather mobile app" autoplay loop muted playsinline preload="metadata"></video>
  <figcaption>Loading and error states across the app — no flash of "$0" balances while data resolves.</figcaption>
</figure>

### Chapter 4 — App Store, Play Store, BTC Vegas

App Store submission for a self-custodial Bitcoin wallet is harder than for a regular app. Reviewers ask about KYC, financial-services compliance, and whether the app facilitates transactions Apple wants to see in their own payment rails. The answer for a self-custodial wallet is "no, the user holds the keys" — but that conversation has to happen in writing, with screenshots and policy citations, before approval lands.

<figure>
  <img src="/img/work/leather-mobile/compliance.png" alt="Mobile sanctions-screening compliance flow shown during a transaction" loading="lazy" />
  <figcaption>Sanctions screening on mobile — part of the compliance story App Store review wanted documented.</figcaption>
</figure>

We shipped to both stores in time for the Bitcoin Conference 2025 in Las Vegas. I represented the team there for the launch.

## Outcome

1,850+ monthly active users in the first three months. Two platforms running on one design system. Leather's first-ever mobile app — taken from a rebrand and a monorepo all the way to the App Store.

I also helped shape the team: I headhunted Leather's engineering manager, a former Kraken colleague, who was promoted to GM after the mobile launch.

The mono-repo and the AI-assisted workflow that came out of this work are now load-bearing infrastructure for everything that ships at Leather.
