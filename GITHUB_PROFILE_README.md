# Pete Watters

**Senior Software Engineer** — Bitcoin, Web3 and high-stakes fintech.

Currently at [Trust Machines](https://trustmachines.co), building [Leather](https://leather.io) — the leading wallet for Bitcoin and Stacks apps. Open-source contributor to the [Leather mono-repo](https://github.com/leather-io/mono).

## What I'm working on

**Leather Wallet** — Bitcoin & Stacks wallet serving 8,400+ monthly active extension users

- Core team on the Hiro Wallet → Leather rebrand — architected the mono-repo, built the shared Panda UI component library, implemented BIP key validation on the mnemonic login form
- Shipped the Leather mobile app from scratch (React Native + Expo), growing to 1,850+ MAU in three months on iOS and Android
- Shipped the multi-chain NFT gallery (Stacks SIP-9 + Bitcoin ordinals, including video and audio playback) using an AI-assisted development workflow
- Early AI-tooling adopter on the team — established working patterns with Claude Code and Codex, contributed to CLAUDE.md and reusable skills

## Notable open-source contributions

**Monorepo architecture for Leather wallet** — Designed the mono-repo that consolidated the browser extension, mobile app and shared packages into a single repository with automated npm publishing.
[leather-wallet/mono#8](https://github.com/leather-wallet/mono/pull/8)

**Mnemonic validation on wallet sign-in** — Replaced a single textarea with word-by-word input and real-time BIP-39 validation using `@scure/bip39`. 739 additions across 27 files including new E2E tests.
[leather-wallet/extension#4243](https://github.com/leather-wallet/extension/pull/4243)

**Full-page container system rebuild** — Replaced the entire drawer and container system with Radix Dialog, unified headers and standardised viewport widths. ~100 files, 8 bugs fixed.
[leather-wallet/extension#4655](https://github.com/leather-wallet/extension/pull/4655)

**Modal routing refactor** — Fixed overlay modal routing to properly handle background content, direct navigation and nested route state in the browser extension.
[leather-wallet/extension#4325](https://github.com/leather-wallet/extension/pull/4325)

**Spam token filtering** — Added detection and filtering of scam token names containing URLs and phishing text in the wallet's asset list.
[leather-wallet/extension#4113](https://github.com/leather-wallet/extension/pull/4113)

**Collectibles refactor across monorepo** — Introduced shared `CollectibleView` type, moved UI components into their respective apps, added token detail screens and Send Inscription flow. 5,783 additions.
[leather-io/mono#1903](https://github.com/leather-io/mono/pull/1903)

## Tech

**Front-End:** TypeScript, React, Next.js, React Native, Expo, Redux, HTML5, CSS3, Panda CSS, Radix UI
**Server-side:** Node.js, Express, Python, Ruby, Shell scripting
**Web3 & Crypto:** Bitcoin, Stacks, sBTC, wallet integration, MetaMask, WalletConnect
**Tooling:** CI/CD, Docker, Git, Cypress, Playwright, Maestro, Vitest, TDD, AI-assisted development (Claude Code, Codex)

## Previously

- **[Qredo](https://qredo.com)** — Web3 wallet integration and institutional trading UI
- **[Kraken / Cryptowatch](https://kraken.com)** — Multi-exchange trading terminal, sole FE on Coderunner trading automation
- **[Xapo](https://xapo.com)** — Full-stack architecture blueprint adopted company-wide, CI/CD from scratch
- **[Bank of America Merrill Lynch](https://bankofamerica.com)** — Introduced automated acceptance testing to frontend workflow
- **[Fidelity Investments](https://fidelity.com)** — Technical lead for offshore development

## Links

- [petewatters.ie](https://petewatters.ie) — Portfolio & blog
- [petewatters.ie/cv/full-stack](https://petewatters.ie/cv/full-stack) — CV
- [LinkedIn](https://www.linkedin.com/in/pete-watters/)
- [StackOverflow](https://stackoverflow.com/users/1365580/peadar)
