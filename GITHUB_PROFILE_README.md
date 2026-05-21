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

**Monorepo & shared UI packages** — Set up the shared `packages/ui` foundation so the browser extension and mobile app consume the same components.
[leather-io/mono#161](https://github.com/leather-io/mono/pull/161)

**Cross-platform feature packages** — Refactored Activity into a shared feature package serving both mobile and the extension. 152 files.
[leather-io/mono#1837](https://github.com/leather-io/mono/pull/1837)

**Full-page view & container system rebuild** — Replaced the drawer/container system with Radix Dialog, unified headers and standardised viewport widths. 358 files.
[leather-io/extension#4655](https://github.com/leather-io/extension/pull/4655)

**Branded types for Bitcoin addresses** — Compile-time safety so a BTC address can't be passed where a Stacks one is expected. 47 files.
[leather-io/mono#885](https://github.com/leather-io/mono/pull/885)

**Secret-key redesign + BIP-39 validation** — Word-by-word mnemonic input with real-time `@scure/bip39` validation on wallet sign-in. 27 files.
[leather-io/extension#4243](https://github.com/leather-io/extension/pull/4243)

**Spam & scam token filtering** — Detect and filter phishing/scam token names (URLs, spam words) out of the asset list.
[leather-io/extension#4113](https://github.com/leather-io/extension/pull/4113)

**Modal routing refactor** — Fixed overlay modal routing for background content, direct navigation and nested route state in the extension. 30 files.
[leather-io/extension#4325](https://github.com/leather-io/extension/pull/4325)

**UTXO consolidation — the 6-line fix** — Removed validation blocking self-sends so users could consolidate dust. +6/−10. The best code is the code you delete.
[leather-io/extension#6085](https://github.com/leather-io/extension/pull/6085)

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
- [petewatters.ie/cv](https://petewatters.ie/cv) — CV
- [LinkedIn](https://www.linkedin.com/in/pete-watters/)
- [StackOverflow](https://stackoverflow.com/users/1365580/peadar)
