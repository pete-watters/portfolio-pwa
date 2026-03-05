---
title: "Building a Multi-Chain Wallet UI with React Native"
description: "Managing Bitcoin and Stacks in a unified interface with chain-specific balance, send, and receive flows"
pubDate: 2025-07-01
tags: ["code"]
draft: false
---

*This is Part 3 of the "Building a Crypto Wallet with Expo" series.*

<!-- ADD: This is where your crypto experience really matters. You understand WHY Bitcoin has UTXOs, WHY Stacks has locked balances. How did that domain knowledge shape the architecture? -->

Leather started as a Stacks wallet, but our users wanted Bitcoin support too. The challenge: Bitcoin and Stacks are fundamentally different blockchains with different address formats, transaction models, and balance concepts. How do you build a UI that feels unified while respecting these differences?

## The Account Model

At the core is a unified account model:

```typescript
export type Account = {
  id: string;                    // "fingerprint/accountIndex"
  fingerprint: string;           // Wallet identifier
  accountIndex: number;          // BIP44 account index
  status: 'active' | 'hidden';
  name: string;
  icon: AccountIcon;
};
```

**Accounts are chain-agnostic.** The same account can hold both Bitcoin and Stacks assets. We don't create separate "Bitcoin accounts" and "Stacks accounts."

## Balance Architecture

Bitcoin has a simple "available balance" (sum of UTXOs). Stacks has unlocked, locked, and total balances due to its stacking mechanism. The aggregate balance for the home screen combines both:

```typescript
export function useAccountTotalBalance({ fingerprint, accountIndex }: AccountId) {
  const btc = useBtcAccountBalance(fingerprint, accountIndex);
  const stx = useStxAccountBalance(fingerprint, accountIndex);

  return useMemo(() => {
    if (btc.state === 'loading' || stx.state === 'loading') {
      return { state: 'loading' };
    }
    const totalQuote = addMoney(
      btc.value?.quote.availableBalance,
      stx.value?.quote.availableUnlockedBalance
    );
    return { state: 'success', value: { totalBalance: totalQuote } };
  }, [btc, stx]);
}
```

## Send Flow: Chain-Specific Forms

While the entry point is unified ("Send" button), the forms differ by chain. Bitcoin sends require recipient address, amount, and fee rate selection (slow/medium/fast). Stacks sends require address, amount, and an optional memo field. Bitcoin users see fee rate selection because fees vary significantly. Stacks users see a memo field useful for exchange deposits.

## Receive Flow: Multiple Address Types

Bitcoin complicates things with multiple address types. We show both Native Segwit and Taproot addresses because some exchanges only support one type, users may want to consolidate UTXOs, and different address types have different fee characteristics.

<!-- ADD: How do the branded BitcoinAddress types work in the multi-chain context? Does the type system prevent accidentally passing a Stacks address to a Bitcoin send function? -->

## State Management

```
Redux: Account metadata (persisted)
- Account names, icons, hidden/visible status, security preferences

React Query: Blockchain data (cached, refetched)
- Balances, transaction history, fee rates, exchange rates
```

Account metadata changes rarely and should persist. Blockchain data changes constantly and should be fresh.

## Lessons Learned

1. **Abstract at the right level** -- Accounts are chain-agnostic, but balances are chain-specific. Don't force a bad abstraction.
2. **Show complexity only when needed** -- Bitcoin has multiple address types, but most users just want "an address."
3. **Unify the entry points** -- One "Send" button, one "Receive" button. Chain selection happens after intent.
4. **Design for the differences** -- Stacks has memos, Bitcoin has fee selection. Don't hide chain-specific features in the name of consistency.

## Related PRs

| PR | What | Stats |
|---|---|---|
| [#448](https://github.com/leather-io/mono/pull/448) | Tokens Widget (first balance display) | +933/-1,057 |
| [#977](https://github.com/leather-io/mono/pull/977) | Activity UI integration | +755/-183, 59 files |
| [#885](https://github.com/leather-io/mono/pull/885) | Branded address types | +1,002/-233, 47 files |
| [#1465](https://github.com/leather-io/mono/pull/1465) | Token details on mobile | +1,340/-132, 48 files |
| [#1130](https://github.com/leather-io/mono/pull/1130) | Loading states / prevent "$0" flash | +915/-518, 121 files |
| [#6085](https://github.com/leather-io/extension/pull/6085) | UTXO consolidation (self-sends) | +6/-10 |
