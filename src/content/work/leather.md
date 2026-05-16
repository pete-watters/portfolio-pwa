---
title: "Leather Bitcoin Wallet"
company: "Trust Machines"
project: "Leather Bitcoin Wallet"
role: "Senior Frontend Engineer"
period: "July 2023 — Present"
stat: "62,000+ users in six months · 1,850+ mobile MAU"
headline: "A Bitcoin wallet rebrand, a shared design system, and the first mobile app — across web and mobile."
subtitle: "Leather is an open-source, self-custodial Bitcoin and Stacks wallet. I joined Trust Machines as a core engineer to help ship it."
confidentiality: "This case study describes my personal contributions as a contractor at Trust Machines. The Leather wallet is open source — my work is publicly visible at github.com/leather-io. Technical details reflect my own experience and do not represent official Trust Machines communications."
tech:
  - React Native
  - Expo
  - TypeScript
  - Panda CSS
  - Radix UI
  - Redux
  - Maestro
  - Vitest
  - Cypress
  - Bitcoin
  - Stacks
  - sBTC
  - Bitcoin Ordinals
  - Claude Code
  - Mono-repo architecture
order: 1
outcomeStats:
  - number: "8,400+"
    label: "Monthly active extension users"
  - number: "62,000+"
    label: "Extension users over six months"
  - number: "1,850+"
    label: "Mobile MAU within three months of launch"
  - number: "2"
    label: "Platforms sharing one design system"
  - number: "1"
    label: "Mobile app shipped to App Store and Play Store"
---

## Overview

Leather (formerly Hiro Wallet) is a self-custodial Bitcoin wallet serving tens of thousands of users across a browser extension and mobile app. It supports Bitcoin, Stacks, sBTC, and Bitcoin Ordinals.

I joined as a senior frontend engineer in July 2023 as a core team member, working on the Hiro → Leather rebrand, the mono-repo architecture, the shared design system, and the launch of the first Leather mobile app.

## The problem

When I joined, the product faced three simultaneous challenges.

The rebrand from Hiro Wallet to Leather needed to ship — new name, new visual identity, new domain — without breaking the experience for existing users managing real Bitcoin.

The codebase had no shared component system. The extension and any future mobile product would duplicate work indefinitely without one.

And there was no mobile app. Leather existed only as a browser extension. A significant portion of the Bitcoin user base — especially in emerging markets — needed a native mobile experience.

All three needed to move at once.

## What I built

### Chapter 1 — The rebrand

The Hiro → Leather rebrand wasn't cosmetic. Every surface of the extension needed updating: icons, copy, domain references, app store metadata, and the security-critical mnemonic login flow.

On the login form, I implemented BIP39 word-level validation using `@scure/bip39` — the first time Leather had per-word feedback instead of a single failure at submission. Get one word wrong restoring a Bitcoin wallet and you derive a completely different set of keys. The user won't know until they see an empty wallet and wonder where their Bitcoin went.

The rebrand shipped to 8,400+ monthly active extension users. Over six months, 62,000+ users moved through the updated experience.

*(See the related blog post: [Mnemonic Validation with @scure/bip39](/blog/mnemonic-validation/).)*

### Chapter 2 — The mono-repo and design system

Before a mobile app could ship, there needed to be shared infrastructure. As a core team member, I worked on a mono-repo to house the extension, mobile app, and shared packages under one roof.

The centrepiece was Panda UI — a shared component library built with Panda CSS and Radix UI primitives. Components defined once, consumed by both the extension and the React Native app without duplication.

This wasn't just a technical decision. Every hour saved on component maintenance is an hour that goes into shipping product. For a small team building across multiple surfaces, that compounded quickly.

### Chapter 3 — The mobile app

The first Leather mobile app launched on iOS and Android. I managed the end-to-end launch: architecture, component implementation, navigation, wallet connection, testing with Maestro, and App Store submission.

Built with React Native and Expo, it shares business logic and UI primitives with the extension through the mono-repo.

1,850+ monthly active users in the first three months.

I represented the team at the Bitcoin Conference 2025 in Las Vegas for the mobile launch.

### Chapter 4 — The NFT gallery and AI workflow

I shipped the multi-chain NFT gallery — supporting Stacks SIP-9 tokens and Bitcoin Ordinals, including video and audio playback. The technical challenge was normalising two very different on-chain data models into a single coherent UI.

I was also an early AI-tooling adopter on the engineering team: established working patterns with Claude Code and Codex, contributing to CLAUDE.md and reusable skills that extended AI fluency across the team. We shipped faster without cutting corners on the wallet's review and testing standards.
