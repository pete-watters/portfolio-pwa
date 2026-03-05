---
title: "Mnemonic Validation with @scure/bip39"
description: "Adding real-time word validation to a 12/24-word seed phrase input — consolidating BIP39 libraries and catching typos before they cost someone their wallet."
pubDate: 2026-03-05
tags: ["typescript", "bitcoin", "security", "leather"]
draft: false
featured: true
---

When you restore a crypto wallet, you type 12 or 24 words from the BIP39 word list. Get one word wrong and you'll derive a completely different set of keys — or no keys at all. The user won't know until they see an empty wallet and wonder where their Bitcoin went.

Leather's seed phrase input had no word-level validation. You'd type all 12 or 24 words, hit submit, and only then find out if something was wrong. No feedback on which word was invalid. No autocomplete suggestions. Just a failure at the end.

## The redesign

[PR #4243](https://github.com/leather-io/extension/pull/4243) rebuilt the seed phrase input from scratch. 739 additions, 436 deletions, 27 files changed. The key features:

**Per-word validation.** Each input field validates against the BIP39 word list as the user types. Invalid words get immediate visual feedback — no waiting until form submission.

**12/24-word toggle.** Some wallets generate 12-word mnemonics, others use 24. We added a toggle between the two modes. [PR #4354](https://github.com/leather-io/extension/pull/4354) fixed a bug where switching between modes left the form state out of sync — the inputs showed 12 fields but the form still expected 24 values.

**Formik integration.** We wrapped the form with Formik for validation state management. Each word field validates independently, and the form only submits when all words are valid BIP39 entries and the complete mnemonic passes checksum verification.

## Consolidating BIP39 libraries

The codebase had two different BIP39 libraries doing the same thing. [PR #4294](https://github.com/leather-io/extension/pull/4294) consolidated them down to `@scure/bip39` — the same library used by most of the Bitcoin ecosystem. 29 additions, 35 deletions, 4 files.

`@scure/bip39` is part of the `@noble` / `@scure` family of cryptographic libraries by Paul Miller. They're audited, have zero dependencies, and use modern JavaScript. The word list validation is straightforward:

```typescript
import { wordlist } from '@scure/bip39/wordlists/english';

function isValidBip39Word(word: string): boolean {
  return wordlist.includes(word.toLowerCase());
}
```

For full mnemonic validation, `@scure/bip39` provides `validateMnemonic` which checks both the word list and the checksum:

```typescript
import { validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

const isValid = validateMnemonic(phrase, wordlist);
```

The checksum is the part most people miss. A BIP39 mnemonic isn't just 12 random words — the last word encodes a checksum derived from the entropy. You can type 12 valid BIP39 words and still have an invalid mnemonic if the checksum doesn't match. `validateMnemonic` catches this.

## Why this matters

In a self-custody wallet, the seed phrase is everything. There's no password reset, no support ticket, no recovery option. If a user mistypes one word during restore and we don't catch it, they'll see a different wallet — or the app will silently fail to derive keys.

Per-word validation is a small UX improvement that prevents a catastrophic failure mode. The implementation is a few lines of word list checking, but the impact is the difference between "I can't access my wallet" and "that word is spelled wrong, try again."
