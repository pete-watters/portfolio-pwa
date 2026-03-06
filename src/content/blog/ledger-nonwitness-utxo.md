---
title: "Displaying Correct Amounts for Legacy UTXOs on Ledger"
description: "A small but critical fix for hardware wallet users — ensuring nonWitnessUtxo transactions display the right amount before signing."
pubDate: 2024-05-14
tags: ["open-source", "crypto", "bitcoin", "leather"]
draft: false
---

When you sign a Bitcoin transaction on a Ledger hardware wallet, the device shows you the amount you're about to send. You verify it on the screen, press the button, and the transaction is signed. If the amount shown is wrong, you might approve something you didn't intend.

[PR #5354](https://github.com/leather-io/extension/pull/5354) fixed a bug where the displayed amount was incorrect for transactions containing legacy (non-SegWit) UTXOs.

## SegWit vs legacy UTXOs

Bitcoin transactions consume UTXOs — unspent transaction outputs. Two flavours exist:

**Witness UTXOs (SegWit)** contain the value directly in the transaction input. The signing device can read the amount from the input data itself.

**NonWitness UTXOs (legacy)** don't include the value in the input. To know the amount, you need the full previous transaction — the one that created the UTXO you're now spending.

When a Ledger signs a transaction with nonWitnessUtxos, it needs that full previous transaction to display the correct amount. If the software doesn't provide it, the device either shows a wrong amount or can't verify the total.

## The bug

The wallet's Ledger signing flow was conditionally updating transaction inputs — but the condition didn't account for nonWitnessUtxos properly. The amount shown on the Ledger screen could be incorrect when the transaction mixed SegWit and legacy inputs.

## The fix

Two files, 17 additions, 5 deletions. The signing flow now:

1. Checks whether each input is a witness or nonWitness UTXO
2. For nonWitness inputs, includes the full previous transaction data
3. Only updates the transaction when the input type requires it

```typescript
// Add conditional check to prevent unnecessary updates
// and ensure nonWitnessUtxo data is correctly included
if (isNonWitnessUtxo(input)) {
  psbt.updateInput(index, {
    nonWitnessUtxo: previousTransaction,
  });
}
```

The fix ensures the Ledger device has the data it needs to display accurate amounts for every input type.

## Why this matters

This is a 17-line change in a crypto wallet. The stakes are different from a 17-line change in a todo app.

If a user sees the wrong amount on their Ledger and approves it, they could send more Bitcoin than intended — and Bitcoin transactions are irreversible. Hardware wallet signing is the last line of defence. The amount displayed on that screen has to be correct.

Small PRs in financial software carry outsized responsibility. Every line touches real money.
