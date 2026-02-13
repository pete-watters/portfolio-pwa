---
title: "Type Safety Where It Matters: Branded Types in a Crypto Wallet"
description: "Using TypeScript's type system to prevent sending funds to invalid addresses"
pubDate: 2025-03-01
tags: ["code"]
draft: true
---

In a crypto wallet, sending to a wrong address means lost funds. There's no undo, no customer support, no chargeback. An address is just a string, and TypeScript's type system normally can't distinguish between a valid Bitcoin address, a Stacks address, a random string, or an empty string.

Having worked in crypto for years, I understood these stakes viscerally. But seeing the codebase handle addresses as raw strings still made me uncomfortable. The team knew it was a problem too -- it just hadn't been prioritised yet.

<!-- ADD: Any specific moment that triggered this work? A near-miss? A support ticket? Or just the general unease of seeing `string` everywhere? -->

## The Problem

Before this work, address handling in the codebase looked like this:

```typescript
function sendBtc(to: string, amount: number) { ... }
```

Nothing stops you from passing a Stacks address, a URL, or `"hello"` as the `to` parameter. The validation happened at runtime, deep in the send flow, often after the user had already filled out a form.

To make things worse, we were already dealing with real bugs in this area. Issues like [#4444](https://github.com/leather-io/extension/issues/4444) (unable to send Ordinals -- confirmation screen doesn't appear) and [#5204](https://github.com/leather-io/extension/issues/5204) (send ordinal flow not working) showed that the send flow was fragile. These were P1 bugs blocking users from sending their NFTs.

## Branded Types

The approach I took was [TypeScript Branded Types](https://github.com/leather-io/mono/pull/885) for `BitcoinAddress`:

```typescript
type BitcoinAddress = string & { __brand: 'BitcoinAddress' };

function validateBitcoinAddress(input: string): BitcoinAddress | null {
  // Validate against all Bitcoin address formats
  // (P2PKH, P2SH, Bech32, Bech32m, Taproot)
  if (isValid) return input as BitcoinAddress;
  return null;
}

function sendBtc(to: BitcoinAddress, amount: number) { ... }
```

Now `sendBtc("hello", 100)` is a **compile-time error**. You can only pass a `BitcoinAddress`, and the only way to get one is through the validation function. The type system enforces that validation has happened.

## The Implementation

The PR ([#885](https://github.com/leather-io/mono/pull/885), +1,002/-233, 47 files) touched 47 files because every place that handled Bitcoin addresses needed to go through the validation gate:

- **Send flow** - address input validation
- **Address display** - ensuring displayed addresses are validated
- **Transaction construction** - type-safe address parameters
- **QR code scanning** - validated on decode

Combined with Stacks address validation and transaction validation (with analytics tracking for malformed attempts), the wallet gained defence-in-depth against address errors.

<!-- ADD: Was there pushback on touching 47 files for a type-safety change? How did the team react? Did you find any latent bugs during the migration? -->

## Compliance Layer

Beyond address format validation, the compliance checking system also needed to come to mobile ([#915](https://github.com/leather-io/mono/pull/915), +592/-67). The extension already had this -- the team had built the compliance integration there. My job was migrating it to the mobile send flow.

`useBreakOnNonCompliantEntity` prevents the send flow from continuing if the recipient is on a sanctioned list. This is a legal requirement for crypto wallets operating in regulated jurisdictions.

## The Anti-Phishing Angle

Another security concern the team addressed was filtering URLs from token metadata ([#5589](https://github.com/leather-io/extension/issues/5589)). Malicious actors were airdropping tokens with phishing URLs baked into their metadata, which would then display in the wallet UI. A simple filter, but important for protecting users who might click without thinking.

## The Takeaway

In fintech/crypto, the type system isn't just about developer experience -- it's a safety mechanism. Branded Types turn "we validate this at runtime somewhere" into "this is provably validated, enforced by the compiler." For a wallet handling real money, that distinction matters.

The compliance and anti-phishing work sits alongside this as part of a broader responsibility: when you're building a wallet, you're not just building software. You're building something that holds people's money.

## Key PRs

| PR | What | Stats |
|---|---|---|
| [#885](https://github.com/leather-io/mono/pull/885) | BTC validation + branded address types | +1,002/-233, 47 files |
| [#915](https://github.com/leather-io/mono/pull/915) | Compliance checks on mobile | +592/-67, 13 files |

### Related Issues (P1 bugs this prevents)
- [#4444](https://github.com/leather-io/extension/issues/4444) - Unable to send Ordinals
- [#5204](https://github.com/leather-io/extension/issues/5204) - Send ordinal flow not working
- [#5253](https://github.com/leather-io/extension/issues/5253) - Ledger inscription sending broken
- [#5589](https://github.com/leather-io/extension/issues/5589) - Anti-phishing: filter URLs from token metadata
