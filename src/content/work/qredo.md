---
title: "Qredo"
company: "Qredo"
role: "Web3 Lead Developer"
period: "January — June 2023"
stat: "Led Web3 wallet integration — MetaMask + WalletConnect — into the rebranded UI"
headline: "Led Web3 wallet integration into a rebranded institutional DeFi platform."
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
outcomeText: "Led the frontend Web3 wallet integration (MetaMask, WalletConnect) into Qredo's rebranded UI · Node.js ETH transaction parser delivered for compliance."
---

## Overview

Qredo was a Layer 2 institutional custodian protocol — the part of the stack that institutional asset managers use to hold and move on-chain assets without surrendering custody of their private keys. I joined in January 2023 for a six-month engagement, as lead frontend developer for the Web3 wallet integration into Qredo's newly rebranded UI.

## The problem

Two distinct pieces.

Qredo was rolling out a rebranded UI, and the trading experience needed Web3 wallet connectivity — somewhere institutional clients could connect external wallets and sign transactions on the Qredo network.

Compliance teams also needed a way to audit on-chain Ethereum activity in human-readable form. The raw transaction format is unforgiving — addresses, nonces, hex data — and not something a compliance analyst can sign off on at speed.

## What I built

### Chapter 1 — Web3 wallet integration

As lead frontend developer, I drove the Web3 wallet integration into the rebranded trading UI — React, Redux Toolkit, Material UI and styled-components. Integrated MetaMask, WalletConnect and the Qredo WebAPI so institutional clients could connect their wallets and sign transactions on the Qredo network without leaving the app.

The institutional context shaped every decision — the interface had to be auditable, the wallet flows had to handle multi-sig approval explicitly, and the data flow had to make confusion impossible. There's a different bar for trading interfaces that move other people's money.

### Chapter 2 — The ETH transaction parser

Built a Node.js ETH transaction parser to present on-chain history in human-readable form. Raw transactions came in; structured, labelled, compliance-friendly output came out. The compliance team could read it without having to interpret hex.

*(See the related blog post: [Human-readable Ethereum transactions](/blog/human-readable-ethereum-transactions/).)*

### Rebuilt in the open

The transaction-parser idea stuck with me, so I rebuilt the concept from scratch as a live, open-source app: **[eth-hrt](https://eth-hrt.pete-9c4.workers.dev/)** ([source on GitHub](https://github.com/pete-watters/eth-hrt)). Paste an Ethereum transaction and read it in plain English — ERC20 transfers, Uniswap V2/V3 swaps, NFT mints, Gnosis Safe confirmations and more, decoded straight from a public RPC with no accounts and no API keys.

<figure>
  <img src="/img/work/qredo/eth-hrt-landing.png" alt="eth-hrt landing page — 'Paste an Ethereum transaction. Read it like English.' with an input field and a table of sample mainnet transactions" loading="lazy" />
  <figcaption>eth-hrt — paste a transaction or pick a sample to decode it.</figcaption>
</figure>

It's a modern take on the Qredo work: [viem](https://viem.sh/) for on-chain decoding, a Next.js 15 Server Action keeping the RPC server-side, and Panda CSS for styling. Where the original parser was internal and Node.js, this one is read-only, public, and built on the current generation of Ethereum tooling.

<figure>
  <img src="/img/work/qredo/eth-hrt-decoded.png" alt="eth-hrt decoding a Uniswap V3 swap — 'swapped 0.0002 WETH for 0.36527 MATIC' with from/to, block, gas cost, and timestamp details" loading="lazy" />
  <figcaption>A decoded Uniswap V3 swap — the raw transaction rendered as one plain-English line, with the full details below.</figcaption>
</figure>
