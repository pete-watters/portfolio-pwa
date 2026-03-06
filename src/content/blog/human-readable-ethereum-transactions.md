---
title: "Making Ethereum Transactions Human-Readable"
description: "Raw blockchain transactions are incomprehensible to most users. Here's how you decode them into something meaningful — and why it matters for crypto UX."
pubDate: 2026-02-13
tags: ["code"]
draft: false
---

If you've ever looked at a raw Ethereum transaction, you know the problem. A wall of hexadecimal data, an ABI-encoded function call, token transfers buried in event logs, and no obvious indication of what actually happened. Did the user swap tokens? Stake ETH? Approve a spending limit? The blockchain knows, but it doesn't make it easy to find out.

I worked on a system that solved this problem — decoding raw Ethereum transactions into plain-language summaries. The kind of thing where instead of seeing `0xa9059cbb000000000000000000000000...`, a user sees "Sent 1,500 USDC to 0xAbc...123."

Here's how it works.

## The Problem Space

Ethereum transactions are opaque by design. A transaction's `input` field contains ABI-encoded data — the function signature and its parameters packed into a hex string. Unless you have the contract's ABI and know how to decode it, this data is meaningless.

It gets worse with DeFi. A single Uniswap swap might involve multiple internal transactions, token approvals, liquidity pool interactions and fee calculations — all compressed into one transaction hash. Token transfers don't even appear in the transaction's value field; they're emitted as ERC-20 `Transfer` events in the transaction receipt's logs.

For wallets, explorers and compliance tools, turning this raw data into something a human can understand is essential. Users need to know what happened. Compliance teams need audit trails. Portfolio trackers need accurate records.

## Step 1: Simulate the Transaction

The first insight is that you often can't fully understand a transaction just by looking at its encoded input data. You need to see its *effects* — what state changes did it actually produce?

The approach: fork the blockchain state at the block where the transaction occurred, then replay the transaction in a local EVM. Tools like Ganache (or Hardhat's forking mode) can do this. You point a local EVM at an archive node, tell it to fork at a specific block number, and re-execute the transaction. This gives you the full execution trace: every internal call, every event log, every state change.

Why simulate instead of just reading the receipt from the chain? Because simulation gives you access to intermediate states and internal transactions that aren't always visible in the standard transaction receipt. For complex DeFi interactions, this context is invaluable.

## Step 2: Decode the Event Logs

Once you have the transaction's event logs (either from simulation or the receipt), the real work begins. ERC-20 `Transfer` events follow a known signature:

```
Transfer(address indexed from, address indexed to, uint256 value)
```

The event topic `0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef` is the keccak256 hash of this signature. When you see this topic in a log entry, you know a token transfer happened. The `from` and `to` addresses are in the indexed topics, and the `value` is in the log data.

Similarly, ERC-721 NFT transfers use the same `Transfer` event signature but with `uint256 tokenId` instead of a fungible amount. ERC-1155 uses `TransferSingle` and `TransferBatch`. Each has a known topic hash you can match against.

For non-standard events, you need the contract's ABI. Services like Etherscan's API or 4byte.directory can help match function selectors and event signatures to their human-readable forms.

## Step 3: Resolve Token Metadata

Knowing that a `Transfer` event moved `1500000000` units of a token at address `0x123...` isn't useful until you know the token's name, symbol, and decimals. A multicall (batching multiple `eth_call` requests) to the token contract resolves this:

- `name()` → "USD Coin"
- `symbol()` → "USDC"
- `decimals()` → 6

Now `1500000000` becomes `1,500 USDC`. Without this step, every amount is an incomprehensible large integer.

Caching token metadata is essential — you'll see the same tokens repeatedly, and calling the contract every time is wasteful.

## Step 4: Classify the Transaction

This is where heuristics come in. Based on the decoded events and the transaction's input data, you can classify what type of operation occurred:

**Swap** — The transaction interacted with a known DEX router (Uniswap, SushiSwap, 1inch, etc.) and the event logs show tokens going in and different tokens coming out. The function selector often confirms this (`swapExactTokensForTokens`, `exactInputSingle`, etc.).

**Send/Receive** — A simple ERC-20 `Transfer` event where the `from` or `to` matches the user's address. No DEX interaction.

**Approve** — An `Approval` event, granting a spender permission to move tokens on the user's behalf. The function selector is `approve(address,uint256)`.

**Stake/Unstake** — Interaction with known staking contracts. Often identifiable by function names like `deposit`, `withdraw`, `stake`, `unstake` in the decoded input.

**Add/Remove Liquidity** — Interaction with a DEX's liquidity pool. Events show tokens going into a pool contract and LP tokens being minted (or the reverse).

**Contract Creation** — The transaction's `to` field is null, and the input data is the contract bytecode.

**Mint** — A `Transfer` event where the `from` address is `0x0000...0000` (the zero address), indicating new tokens were created.

Each classification maps to a human-readable template: "Swapped 1.5 ETH for 3,200 USDC on Uniswap" or "Approved USDC spending for Aave."

## The Edge Cases

Real-world transactions are messier than the clean categories above:

**Multicalls** — Many DeFi protocols batch multiple operations into a single transaction. Uniswap V3's `multicall` can wrap a swap, a fee collection, and a liquidity adjustment into one tx. You need to decode each sub-call separately and present them as a sequence of operations.

**Proxy contracts** — Many contracts use the proxy pattern, where the transaction goes to a proxy address but the logic lives in an implementation contract. The ABI you need for decoding belongs to the implementation, not the proxy. You have to detect this and resolve the implementation address.

**Unknown contracts** — Not every contract has a verified ABI on Etherscan. For unknown contracts, you can still decode standard events (ERC-20 transfers, approvals) but the specific function call remains opaque. The best you can offer is "Interacted with contract 0x123..." plus whatever events you can decode.

**Internal transactions** — When contract A calls contract B during execution, the token transfers in contract B's context don't appear as top-level events. You need the full execution trace from simulation to capture these.

## Why This Matters

Human-readable transactions are a UX problem, not just a technical one. Every crypto wallet, every block explorer, and every portfolio tracker needs this capability. When a user opens their transaction history and sees a list of hex strings, they lose trust. When they see "Swapped 0.5 ETH for 1,100 USDC on Uniswap — 3 hours ago," they understand their financial activity.

For institutional users and compliance teams, the stakes are higher. Audit trails need to be comprehensible. Regulatory reporting requires clear descriptions of what happened, not raw calldata.

The blockchain is a public ledger, but without decoding, it's a public ledger written in a language almost nobody speaks. Making transactions human-readable is how we translate.

Working on transaction decoding at Qredo changed how I think about crypto UX fundamentally. It forced me to confront the gap between what the blockchain stores and what users actually need to understand. The technical challenge was interesting -- ABI decoding, event log parsing, heuristic classification -- but the real lesson was about empathy. Most users don't know what a function selector is. They don't care about event topics. They want to know what happened to their money.

That perspective carried directly into my work at Leather. When I was building the activity feed for the Bitcoin wallet, I kept coming back to the same principle: the raw data is the blockchain's concern, not the user's. The `ActivityView` type I built for Leather's cross-platform activity feed was informed by exactly this experience -- transform on-chain data into something that reads like a sentence, not a hex dump. Different chain, different protocols, but the same core problem.

There's a broader point here about crypto adoption. The industry talks endlessly about scalability and throughput, but the UX layer is where most people bounce. If a user can't understand their own transaction history, the underlying technology doesn't matter. Making blockchain data legible isn't a nice-to-have -- it's infrastructure. Every wallet, every explorer, every compliance tool has to solve this problem, and most of them solve it poorly. Having built one of these systems from scratch, I have a deep appreciation for how much invisible work goes into making a simple transaction summary appear correct.
