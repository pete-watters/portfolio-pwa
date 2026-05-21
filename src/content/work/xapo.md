---
title: "Xapo"
company: "Xapo"
role: "Senior Frontend Engineer"
period: "November 2017 — April 2020"
stat: "1.5M+ customers · Blueprint adopted company-wide"
headline: "Designed the React + Next.js + Express blueprint adopted across every product team at a 1.5M-customer Bitcoin company."
subtitle: "Xapo was a global Bitcoin custody and multi-currency wallet platform. The architecture and tooling I introduced became the company's frontend standard."
confidentiality: "Xapo has since rebranded to Xapo Bank. This case study describes work on the original Xapo wallet product. Details reflect my personal contributions and do not represent official Xapo communications."
tech:
  - React
  - Next.js
  - Express
  - Node.js
  - Docker
  - Cypress
  - styled-components
  - Architecture
  - CI/CD
order: 5
outcomeText: "Blueprint adopted as company-wide engineering standard · CI/CD and E2E testing built from zero · Core product redesign squad led to delivery · Private blockchain training with Andreas Antonopoulos and Jimmy Song."
---

## Overview

Xapo was a fully remote global fintech providing multi-currency digital wallets and Bitcoin custody to over 1.5 million customers worldwide. I joined as a senior frontend engineer in November 2017 and stayed through April 2020.

## Inside the product

Xapo packed a lot of wallet into one app, built for a global audience — English, Spanish and Portuguese — with bitcoin and local currencies sitting side by side.

![Xapo account view showing bitcoin and fiat balances, the debit card, and rewards.](/img/work/xapo/account.png)
*Bitcoin, US dollars, Brazilian reais and Argentine pesos in one account — with the Xapo debit card and rewards built in.*

**Multi-currency, multi-language.** Customers in Argentina and Brazil held pesos and reais next to their bitcoin, in their own language, with every balance converted to a reference currency in real time.

**A bitcoin-native debit card.** A Visa debit card funded straight from the wallet, so a balance held in bitcoin or local currency could be spent anywhere.

**Send money any way.** A bitcoin address, a bank transfer, a phone contact, or stablecoins — one Send flow handled them all.

![Xapo payments — choosing how to send: bitcoin address, bank account, contact, or stablecoin.](/img/work/xapo/payments.png)
*One Send flow, several rails: bitcoin, bank account, a saved contact, and stablecoins.*

**The Vault.** Beyond the everyday wallet, the Vault moved bitcoin into deep cold storage — kept offline in a former Swiss military bunker, the feature Xapo was best known for.

![Xapo Vault — bitcoin moved into deep cold storage.](/img/work/xapo/vault.png)
*The Vault: long-term bitcoin storage, held offline and kept apart from the spending wallet.*

**Chat, and People Nearby.** An in-app chat let people send payments inside a conversation, and a People Nearby tab helped users find each other to swap cash for bitcoin and back — peer-to-peer, well before that was common.

**Rewards.** Small in-product rewards paid out free bitcoin for everyday actions, nudging people to get more from the wallet.

## The problem

The frontend teams were building product against different stacks, with no shared architecture, no shared CI, and no shared testing baseline. Every new product surface meant re-deciding the basics. That slowed delivery and made cross-team review difficult.

## What I built

### Chapter 1 — The architecture blueprint

I designed a full-stack application blueprint — React, Next.js and Express — that became Xapo's company-wide engineering standard, adopted across multiple product teams. The blueprint included a server-rendering pattern, conventions for state management, an HTTPS-terminated Express layer, and consistent project layout.

The pattern's first live use was a standalone web app for identity verification, account freezing, and password recovery — separate from the main mobile product but sharing the same architectural shape. I wrote about that work [in the Next.js verify flow post](/blog/xapo-nextjs-verify-flow/).

### Chapter 2 — CI/CD and E2E testing from zero

There was no shared CI/CD pipeline when I joined. I built one — Docker-based, environment-aware, with Cypress E2E coverage layered on top. Manual QA cycle time dropped; release confidence went up.

### Chapter 3 — Core product redesign squad

Led the core product squad responsible for a comprehensive web platform redesign. The redesign shipped to existing customers without breaking the trust relationships they had with the wallet — the standard requirement for anything touching real money.

### Chapter 4 — Blockchain training

Completed private blockchain engineering training, including live sessions with Andreas Antonopoulos and a multi-day Bitcoin programming course with Jimmy Song. Working on a Bitcoin custody platform without understanding the protocol underneath felt like cheating; the training closed that gap.
