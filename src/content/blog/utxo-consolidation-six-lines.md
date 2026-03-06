---
title: "The Six-Line Fix: UTXO Consolidation at the Barcelona Offsite"
description: "Sometimes the best code is the code you delete. +6/-10 lines, merged same day."
pubDate: 2025-01-20
tags: ["code"]
draft: false
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

The Barcelona offsite wasn't a hackathon in the formal sense -- there was no theme, no judging, no presentations. It was a week of the team working together in person, which for a fully remote company was rare and valuable. The schedule was loose: some structured planning sessions in the mornings, then open time to work on whatever felt highest-impact. The energy of being in the same room meant you could tap someone on the shoulder for a quick review instead of waiting for async feedback, and smaller fixes that had been sitting in the backlog got attention they wouldn't normally get.

I'd seen [#5349](https://github.com/leather-io/extension/issues/5349) in the issue tracker before the trip. It had been open for months and had a handful of user comments asking for it. The validation that blocked self-sends was well-intentioned -- protecting users from accidental mistakes -- but it was the kind of guardrail that assumes all users are beginners. Anyone who understands UTXOs knows that sending to yourself is a legitimate operation, and blocking it was more frustrating than helpful.

The fix itself took about an hour to write and test. I removed the `sameAddressError` validation from three files in the send flow, verified that the send form still worked correctly for normal transfers, tested a self-send on testnet, and opened the PR. It was reviewed and merged the same day -- one of those satisfying moments where the offsite energy turned a months-old backlog item into a same-day ship. After it went out, a few users in the Discord noticed and were genuinely pleased. Small change, but it mattered to the people who needed it.

A story about questioning assumptions, small changes with outsized user impact, and the offsite energy that lets you pick up lingering issues.
