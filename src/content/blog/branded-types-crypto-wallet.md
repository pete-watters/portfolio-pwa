---
title: "Branded Types for Bitcoin Addresses"
description: "How adding a branded type for BTC addresses caught bugs at compile time and made the send flow safer in Leather's mobile wallet."
pubDate: 2025-02-21
tags: ["typescript", "bitcoin", "mobile", "leather"]
draft: false
featured: true
---

A Bitcoin address is a string. So is a Stacks address. So is an account name, a transaction ID, and a dozen other things in a wallet codebase. TypeScript doesn't distinguish between them — they're all `string`. That means you can pass a BTC address where a STX address is expected, and the compiler won't complain.

We hit real bugs from this. A function expecting a Bitcoin address received a Stacks address because both were typed as `string`. The code compiled, tests passed (with mocks), and the bug made it to staging. That's when we decided to add branded types.

## What's a branded type

A branded type is a TypeScript pattern that creates nominally unique types from structural primitives. The idea is simple: attach a unique symbol to a type so that two `string`-based types are no longer interchangeable.

```typescript
type Brand<T, B> = T & { readonly __brand: B };

type BitcoinAddress = Brand<string, 'BitcoinAddress'>;
type StacksAddress = Brand<string, 'StacksAddress'>;
```

Now `BitcoinAddress` and `StacksAddress` are both strings at runtime, but TypeScript treats them as incompatible types at compile time. You can't pass one where the other is expected without an explicit cast.

## Validation at the boundary

The brand is meaningless if you can create a `BitcoinAddress` from any arbitrary string. The value comes from pairing the branded type with a validation function that only produces the branded type when the input is actually valid:

```typescript
function toBitcoinAddress(input: string): BitcoinAddress {
  if (!isValidBtcAddress(input)) {
    throw new Error(`Invalid Bitcoin address: ${input}`);
  }
  return input as BitcoinAddress;
}
```

We validate once — at the boundary where user input enters the system — and from that point on, every function that accepts `BitcoinAddress` knows the value has been validated. No redundant checks deeper in the call stack.

## Where it caught bugs

The send flow was the biggest win. Before branded types, the send form collected an address as a `string`, passed it through several layers of validation logic, fee estimation, and PSBT construction. At each layer, the address was just a string. If a refactor shuffled parameters, the compiler couldn't help.

After adding the branded type, we found three places where the wrong address type was being passed:

1. A fee estimation function received the sender's address instead of the recipient's
2. A UTXO lookup was called with a change address that hadn't been validated
3. A display function showed the recipient address but was reading from the wrong variable

All three compiled fine with `string`. All three became compile errors with `BitcoinAddress`.

## The PR

[PR #885](https://github.com/leather-io/mono/pull/885) added BTC transaction validation and the branded type for addresses to Leather's mobile send flow. 1,002 additions, 233 deletions, 47 files changed. Most of the additions were validation logic and tests — the branded type itself is a few lines, but threading it through the send flow touched everything from the form to the PSBT builder.

We also moved the `BitcoinAddress` type to a shared `models` package ([PR #905](https://github.com/leather-io/mono/pull/905)) so both the extension and mobile app could use the same type. That change surfaced a circular dependency — the `Inscription` and `UTXO` interfaces in the `bitcoin` package were importing from the same file that was trying to import them. Moving the branded type to `models` broke the cycle.

## When to use branded types

They're worth the effort when:
- Two values have the same structural type but different semantic meaning
- Mixing them up causes subtle bugs that tests don't catch easily
- The value crosses multiple function boundaries before being used

For a crypto wallet, addresses are the obvious candidate. But we also considered branded types for amounts (satoshis vs BTC, microSTX vs STX) where unit confusion can lose users' money. The address type was the starting point. The pattern scales.

The total overhead is one type definition, one validation function, and a cast at the boundary. In exchange, the compiler catches an entire category of bugs that would otherwise reach production.
