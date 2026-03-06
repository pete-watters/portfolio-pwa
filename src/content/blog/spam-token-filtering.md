---
title: "Filtering Spam Tokens in a Crypto Wallet"
description: "How we built and evolved a spam filter for token names, symbols and transactions in Leather — from a URL regex to a generic sanitiser across the whole UI."
pubDate: 2024-07-02
tags: ["typescript", "security", "bitcoin", "leather"]
draft: false
---

Anyone who's used a crypto wallet has seen them: tokens with names like `free-airdrop.com` or `claim-rewards.xyz` appearing in their balance list. Attackers mint worthless tokens with spam URLs as the name or symbol, send dust amounts to thousands of addresses, and hope someone clicks through to a phishing site.

In a self-custody wallet, showing these tokens without filtering is a liability. Users trust what the wallet shows them. If a token named `leather.io-claim-bonus.com` appears in their asset list, some will click it.

## The first filter

[PR #4113](https://github.com/leather-io/extension/pull/4113) was the initial implementation. Straightforward approach: check token names against a list of patterns. If the name contains a URL-like string or known spam words, replace it with "Unknown Token."

```typescript
const spamPatterns = [
  /https?:\/\//i,
  /\.com/i,
  /\.xyz/i,
  /\.fund/i,
  /airdrop/i,
  /claim/i,
  /free/i,
];

function spamFilter(name: string): string {
  if (spamPatterns.some(p => p.test(name))) {
    return 'Unknown Token';
  }
  return name;
}
```

This caught the clear-cut cases. But it only ran on the token list — not on the activity feed, not on token symbols, and not on any other surface where token metadata was displayed.

## Expanding coverage

[PR #4295](https://github.com/leather-io/extension/pull/4295) extended the filter to fungible token asset items. Spam tokens were showing their raw names in the asset list even though the main token list was filtered. Small fix — 3 additions — but it closed a gap.

[PR #4318](https://github.com/leather-io/extension/pull/4318) added filtering to the activity feed. Transaction titles were showing spam token names because the activity list used the raw metadata. Another 2-line fix, another surface covered.

## Making it generic

The pattern was clear: every time we added a new UI surface that displayed token metadata, we had to remember to apply the spam filter. We kept missing spots.

[PR #5593](https://github.com/leather-io/extension/pull/5593) fixed this by applying the filter in `CryptoAssetItemLayout` — the base component that all token displays use. Instead of filtering at each call site, we filter once in the shared layout component. Any token name or symbol that passes through the layout gets sanitised automatically.

This caught SIP-10 token symbols that were slipping through. Attackers had started putting URLs in the symbol field instead of the name, bypassing the name-only filter.

## Choosing the replacement text

[PR #255](https://github.com/leather-io/mono/pull/255) in the monorepo changed the replacement text from "Unknown" to "Suspicious" and added test cases. The reasoning: "Unknown Token" sounds like a data loading issue. "Suspicious Token" tells the user something is actively wrong. It's a small word change, but it shifts the user's mental model from "this might load eventually" to "this might be harmful."

The same PR added explicit test cases for `.fund` and `.com` domain patterns, formalising what the filter catches.

## What still gets through

Pattern-based filtering has limits. Attackers adapt — they use unicode lookalikes, split URLs across name and symbol fields, or use names that are suggestive without containing blocked words. A better approach would use an allowlist of known tokens from a curated registry, showing "Suspicious" for anything not on the list.

But for a wallet that supports multiple token standards (BTC, SIP-10, Runes, BRC-20, SRC-20, ordinals), maintaining a comprehensive allowlist is its own challenge. The pattern-based filter catches the bulk of spam with minimal maintenance. Five PRs over a year, each a few lines, progressively tightening coverage until the filter runs everywhere token metadata is displayed.
