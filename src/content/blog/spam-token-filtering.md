---
title: "Filtering Spam Tokens in a Crypto Wallet"
description: "A small but important change — detecting and filtering spam token names that contain URLs and scam text in a wallet's asset list."
pubDate: 2026-02-27
tags: ["open-source", "crypto", "security", "leather"]
draft: true
---

Spam tokens are a real problem in crypto wallets. Scammers airdrop tokens with names like "claim-free-eth.com" or "visit-reward-site.xyz" directly to your address. They show up in your asset list, and if you're not paying attention, you might click through to a phishing site.

The [Leather](https://leather.io) wallet had no defence against this. Whatever name the token contract returned, that's what appeared in the UI. I added a filter in [PR #4113](https://github.com/leather-wallet/extension/pull/4113).

## The approach

The fix is deliberately simple. A utility function checks token names against patterns that indicate spam:

- Does the name contain a URL (http://, https://, or common TLDs)?
- Does it contain known spam trigger words?

If either check matches, the display name is replaced with "Unknown Token." The actual token data stays intact — you can still see the contract address and interact with it — but the scam name doesn't render in the UI.

```typescript
// Simplified version of the filter logic
function filterSpamTokenName(name: string): string {
  const hasUrl = /https?:\/\/|\.com|\.xyz|\.io/i.test(name);
  const hasSpamWords = /claim|free|reward|airdrop/i.test(name);

  if (hasUrl || hasSpamWords) return 'Unknown Token';
  return name;
}
```

The function is applied at the display layer — in the crypto currency asset item component — so it doesn't affect any underlying transaction logic or token metadata.

## Testing

The PR includes unit tests covering the edge cases: tokens with URLs in different positions, mixed case, tokens with legitimate names that happen to include common words, and tokens that are clearly clean.

## Why it matters

This is 52 lines of additions across 4 files. It's not a complex architectural change. But it's the kind of defensive UX that users don't notice when it works and absolutely notice when it doesn't — when they see a phishing URL sitting in their asset list pretending to be a token name.

Small PRs can have outsized impact on user trust.
