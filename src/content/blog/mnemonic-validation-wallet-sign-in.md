---
title: "Redesigning Wallet Onboarding: Mnemonic Validation with @scure/bip39"
description: "How I rebuilt the sign-in form for a crypto wallet browser extension — replacing a single textarea with word-by-word mnemonic input and real-time BIP-39 validation."
pubDate: 2026-02-27
tags: ["open-source", "react", "crypto", "leather"]
draft: true
---

Signing into a crypto wallet isn't like signing into a web app. There's no email field, no password reset. Your identity is a 12 or 24-word mnemonic phrase — get one word wrong and you're locked out of your funds.

The old sign-in form in the [Leather](https://leather.io) browser extension was a single textarea. Paste your seed phrase, hit submit, hope for the best. No feedback until you submitted. No way to know which word was wrong.

I wanted to fix that.

## The problem

A BIP-39 mnemonic phrase is drawn from a specific wordlist of 2,048 English words. Each word matters. A typo in word 9 of 24 is easy to miss in a wall of text, and the error message after submission doesn't tell you where the problem is.

Users were getting stuck on onboarding. Support tickets came in from people who'd copied their phrase from a notebook and couldn't figure out which word had a typo.

## The solution

I replaced the textarea with individual input fields — one per word — each with real-time validation against the BIP-39 wordlist using [`@scure/bip39`](https://github.com/paulmillr/scure-bip39).

```typescript
import { wordlist } from '@scure/bip39/wordlists/english';

function validateMnemonicWord(word: string): boolean {
  return wordlist.includes(word.trim().toLowerCase());
}
```

Each input validates on blur. If a word isn't in the BIP-39 wordlist, the field highlights immediately. No waiting until form submission to discover you typed "abandn" instead of "abandon".

## Implementation

The form is built with [Formik](https://formik.org) wrapping a grid of Radix UI `TextField` components. The key decisions:

**Word-by-word input over a textarea.** More markup, but each word gets its own validation state. Users can tab between fields, paste a full phrase (which auto-distributes across fields), or type word by word.

**Validation on blur, not on change.** Validating on every keystroke would flash errors while you're still typing "aban—". Blur gives you time to finish the word.

**Shared layout with key display.** The sign-in form and the "view your secret key" screen share the same two-column grid layout. New key generation, sign-in, and key display all use the same visual treatment — from the [Figma design system](https://www.figma.com/file/2MLHeIeL6XPVi3Tc2DfFCr).

The submit button is disabled until every word passes validation. No more submitting an invalid phrase and wondering what went wrong.

## What changed

| Before | After |
|---|---|
| Single textarea for entire phrase | Individual input per word |
| Validation on submit only | Real-time validation on blur |
| Generic error message | Per-word error highlighting |
| No shared layout with key display | Shared two-column grid component |

The PR ([#4243](https://github.com/leather-wallet/extension/pull/4243)) was 739 additions and 436 deletions across 27 files — including new E2E tests for the onboarding flow.

## Takeaway

Crypto UX has a reputation for being hostile to users. Seed phrases are already intimidating. The least we can do is tell people which word is wrong before they hit submit.
