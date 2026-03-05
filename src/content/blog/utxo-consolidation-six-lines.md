---
title: "The Six-Line Fix: UTXO Consolidation at the Barcelona Offsite"
description: "Sometimes the best code is the code you delete. +6/-10 lines, merged same day."
pubDate: 2025-01-20
tags: ["code"]
draft: true
---

During the team offsite in Barcelona (Jan 2025), I shipped [#6085](https://github.com/leather-io/extension/pull/6085) -- enabling UTXO consolidation by removing validation that blocked users from sending BTC to themselves.

**The entire PR: +6/-10 lines, 3 files, merged same day.**

The fix: remove `sameAddressError` validation from the send flow. The validation existed to prevent users from accidentally sending to themselves. But it also prevented UTXO consolidation -- a legitimate and useful Bitcoin operation where you combine multiple small UTXOs into one larger one by sending to your own address.

## Why It Matters

UTXO consolidation is important for Bitcoin users because:

- Many small UTXOs = higher transaction fees (each UTXO adds to tx size)
- Consolidating during low-fee periods saves money on future transactions
- Power users and Lightning node operators need this regularly
- This was an open issue for a while: [leather-io/extension#5349](https://github.com/leather-io/extension/issues/5349)

<!-- ADD: Was this a hackathon project? How did you find this issue? What was the Barcelona offsite like? Was it a team hackathon or did you just pick this up between sessions? Any reactions from users after it shipped? -->

A story about questioning assumptions, small changes with outsized user impact, and the offsite energy that lets you pick up lingering issues.
