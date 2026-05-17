---
title: "Qredo"
company: "Qredo"
role: "Senior Frontend Engineer"
period: "January — June 2023"
stat: "Greenfield to shipped in six months"
headline: "A greenfield institutional DeFi trading interface, blank repo to shipped in six months."
subtitle: "Qredo was a Layer 2 decentralised custodian protocol for institutional private key management on a blockchain network."
confidentiality: "This case study describes my personal contributions as a contractor at Qredo. Some details have been omitted to respect confidentiality obligations. Details reflect my own experience and do not represent official Qredo communications."
tech:
  - React
  - Redux Toolkit
  - Material UI
  - styled-components
  - Node.js
  - MetaMask
  - WalletConnect
  - Ethereum
order: 6
outcomeText: "Full institutional trading interface built from zero · MetaMask and WalletConnect integration live · Node.js ETH transaction parser delivered for compliance."
---

## Overview

Qredo was a Layer 2 institutional custodian protocol — the part of the stack that institutional asset managers use to hold and move on-chain assets without surrendering custody of their private keys. I joined as a senior frontend engineer in January 2023 for a six-month engagement.

## The problem

Two distinct pieces.

The platform needed a new institutional trading interface — somewhere asset managers could place trades, view balances, and connect external wallets. None of that existed yet.

Compliance teams also needed a way to audit on-chain Ethereum activity in human-readable form. The raw transaction format is unforgiving — addresses, nonces, hex data — and not something a compliance analyst can sign off on at speed.

## What I built

### Chapter 1 — The institutional trading interface

Built the trading interface from scratch in React, Redux Toolkit, Material UI and styled-components. Integrated MetaMask, WalletConnect and the Qredo WebAPI so institutional clients could sign transactions on the Qredo network without leaving the app.

The institutional context shaped every decision — the interface had to be auditable, the wallet flows had to handle multi-sig approval explicitly, and the data flow had to make confusion impossible. There's a different bar for trading interfaces that move other people's money.

### Chapter 2 — The ETH transaction parser

Built a Node.js ETH transaction parser to present on-chain history in human-readable form. Raw transactions came in; structured, labelled, compliance-friendly output came out. The compliance team could read it without having to interpret hex.

*(See the related blog post: [Human-readable Ethereum transactions](/blog/human-readable-ethereum-transactions/).)*
