# Pete Watters — Leather OSS Contributions Research
## Repos: leather-io/mono + leather-io/extension
*Compiled March 2026*

---

## Summary

Total merged PRs found:
- **leather-io/extension**: ~175 PRs across 7 pages
- **leather-io/mono**: ~229 PRs across 10 pages

Combined: **~400+ merged PRs** across both repos.

---

## HIGH-IMPACT CONTRIBUTIONS (Blog-Worthy)

These are the standout PRs with the most substance for technical writing.

---

### 🏗️ ARCHITECTURE & INFRASTRUCTURE

#### mono/#1 — Initial Mono Repo Setup (Release/mono 0.0.1)
**Repo:** leather-io/mono  
**What:** Pete created the mono repo from scratch — PR #1 is the initial release.  
**Blog angle:** "I set up the monorepo that unified Leather's extension and mobile codebase." This is the founding architecture story.

#### mono/#2 — Developer Tooling Bootstrap (Chore/4391/devtooling)
**Repo:** leather-io/mono  
**What:** Early devtooling setup for the monorepo.

#### mono/#8 — CI/CD Auto-Release (chore(git): add deploy job to auto release)
**Repo:** leather-io/mono  
**What:** Automated release pipeline setup.

#### mono/#27 — Design Tokens Package (Chore/5/design tokens package)
**Repo:** leather-io/mono  
**What:** First design tokens package — foundational piece for the design system.

#### extension/#4655 — Full Page Extension Views: Containers, Shared Headers & Footers
**Repo:** leather-io/extension  
**What:** Major architectural PR. Introduced the container architecture for full-page extension views with composable shared headers/footers. This is mentioned in your blog release plan as PR #42 ("Full Page Containers Extension").  
**Blog angle:** The container architecture evolution story — referenced in your blog plan as PR #21 "Three Iterations to Get Container Architecture Right."

#### extension/#5715 — Containers Refactor III: This Time It's Composable
**Repo:** leather-io/extension  
**What:** Third iteration of the container architecture — explicitly named "composable." This is the resolution of the architectural journey.  
**Blog angle:** The payoff of the three-iterations story.

---

### 🎨 DESIGN SYSTEM (Panda CSS)

#### mono/#151 — Panda Preset Package *(feat: panda preset package)*
**Repo:** leather-io/mono  
**PR Link:** https://github.com/leather-io/mono/pull/151  
**Stats:** +503/-124 lines, 18 files changed, 6 weeks of iteration, multiple beta releases  
**What:** Created `@leather-wallet/panda-preset` — a fully installable, publishable npm package containing Leather's complete Panda CSS configuration including breakpoints, colours, keyframes, semantic tokens, typography, and component recipes (Button, Link). Pete tested it by publishing to his own npm org (`@cteic/panda-preset`) before landing it in the mono repo. Built a CodeSandbox demo. Had to solve the ESM vs CJS packaging problem for Panda codegen.  
**Blog angle:** This is the "Creating a Panda CSS Preset" blog post. Directly maps to PR #19 in your blog plan. Rich technical content: tsup build config, ESM export, circular dependency handling, beta release strategy, CodeSandbox demo.

#### mono/#161 — Migrate UI Components to ui/packages *(feat: migrate UI components to ui/packages)*
**Repo:** leather-io/mono  
**What:** Moved existing UI components into the shared packages structure after panda-preset landed.

#### mono/#175 — Populate @leather-wallet/ui
**Repo:** leather-io/mono  
**What:** Bulk population of the installable UI library.

#### mono/#186 — Use tsup to Prep UI Package
**Repo:** leather-io/mono  
**What:** Build tooling for the UI package using tsup.

#### mono/#201, #202, #224, #228 — Add More UI Components + Fix Exports
**Repo:** leather-io/mono  
**What:** Iterative expansion and fixing of the `@leather-wallet/ui` package, including `AddressDisplayer`, `AvatarIcons`, PNG export testing.

#### extension/#5429 — Panda Preset Package (Extension Integration)
**Repo:** leather-io/extension  
**What:** The extension-side companion to mono/#151 — consumed the new panda-preset package.

#### extension/#5489, #5544 — Update Panda + Integrate @leather-wallet/ui
**Repo:** leather-io/extension  
**What:** Follow-on PRs integrating the published UI library into the extension.

#### extension/#4343 — Brand Audit (Chore/4249/brand audit)
**Repo:** leather-io/extension  
**What:** Major Hiro→Leather rebrand audit across the codebase.

#### extension/#4822 — Audit Colours, Update Token Package (brown becomes ink)
**Repo:** leather-io/extension  
**What:** Colour system migration — renamed the design token semantics.

---

### 🔐 SECURITY

#### mono/#885 — BTC Transaction Validation + Branded Type for Address
**Repo:** leather-io/mono  
**What:** Introduced branded types for Bitcoin addresses. This is your "Type Safety: Branded Types in a Crypto Wallet" blog post (PR #28 in your plan).  
**Blog angle:** Why you use branded types to prevent raw strings being passed as Bitcoin addresses — a runtime safety pattern with compile-time enforcement.

#### mono/#927 — Stacks Transaction Validation *(feat: stacks transaction validation)*
**Repo:** leather-io/mono  
**What:** Stacks-equivalent of the BTC validation work.

#### mono/#893 — Stacks Address Validation
**Repo:** leather-io/mono  
**What:** Part of the validation suite.

#### extension/#5354 — Show Correct Amount for nonWitnessUtxo *(fix: show correct amount for nonWitnessUtxo, ref #5113)*
**Repo:** leather-io/extension  
**What:** The Ledger nonWitnessUtxo fix. This is a high-stakes Ledger hardware wallet bug where the displayed BTC amount was wrong. Maps to PR #23 in your blog plan.  
**Blog angle:** "Ledger nonWitnessUtxo Fix — when 1 line changes what a user signs."

#### extension/#4295 — Spam Filtering for Fungible Token Assets *(fix: filter spam transactions from activity)*
**Repo:** leather-io/extension  
**What:** Spam token/transaction filtering. Maps to PR #44 in your plan ("Spam Token Filtering").

#### extension/#5593 — Apply spamFilter More Generically to All Crypto Captions and Titles
**Repo:** leather-io/extension  
**What:** Expanded the spam filter to all display surfaces.

#### extension/#4113 — Filter Out URLs and Spam Words From Token Names
**Repo:** leather-io/extension  
**What:** Earlier spam filtering work.

#### extension/#5853 — path-to-regexp Vulnerability (GHSA-9wv6-86v2-598j)
**Repo:** leather-io/extension  
**What:** Security vulnerability fix.

#### extension/#5708 — Force Resolution of fast-xml-parser
**Repo:** leather-io/extension  
**What:** Dependency security fix.

---

### 📱 REACT NATIVE / MOBILE (All in leather-io/mono)

#### mono/#588 — Updates to Support Query Package in React Native
**What:** Foundational work making the shared query layer work on mobile.

#### mono/#590 — Integrate Stacks Total Balances
**What:** First Stacks balance integration on mobile.

#### mono/#968 — Token View in Leather Mobile *(feat: token view in leather mobile)*
**What:** First token details screen on mobile.

#### mono/#977 — Activity UI Integration *(feat: activity UI integration)*
**What:** Transaction history on mobile.

#### mono/#1006 — Integrate Collectibles *(feat: integrate collectibles)*
**What:** NFT/collectibles on mobile.

#### mono/#1202 — Sort Tokens + FlashList for Performance *(fix: sort tokens, add FlashList)*
**What:** Performance optimisation using React Native's FlashList over FlatList.

#### mono/#1219 — Earn Cards *(feat: Earn cards)*
**What:** Stacking/earning feature on mobile.

#### mono/#1584 — SIP-10 Sends from Token Details *(feat: SIP-10 sends from token details)*
**What:** Full send flow from token detail screen.

#### mono/#1591 — Rune Token Details *(feat: rune token details)*
**What:** Runes support on mobile.

#### mono/#1636 — Collectibles UI *(feat: collectibles UI)*
**What:** Full collectibles screen implementation.

#### mono/#1655 — Collectible Details Content *(feat: collectible details content)*
**What:** Detail view for individual NFTs/inscriptions.

#### mono/#1805 — Collection Details Stats *(feat: mobile collection details stats)*
**What:** Collection-level stats on mobile.

#### mono/#1928, #2018 — CI Build Fixes for Mobile
**What:** Fixing the mobile EAS/Expo build pipeline in CI. Maps to PR #25 "How We Cut Mobile CI by 70% with Expo/EAS."

---

### 🎭 UX FEATURES

#### extension/#5865 — Add Option to Hide Balance *(feat: add option to hide balance)*
**Repo:** leather-io/extension  
**What:** The privacy hide-balance feature. Maps to PR #22 in your blog plan ("Hide Balance Privacy Feature").  
**Blog angle:** Simple feature, interesting UX decisions — where do you persist this? Extension storage? What happens across windows?

#### extension/#4243 — Secret Key Redesign + Mnemonic Validation
**Repo:** leather-io/extension  
**What:** Full redesign of the secret key onboarding form with BIP-39 mnemonic validation. Maps to PR #40 in your plan ("Mnemonic Validation with @scure/bip39").  
**Blog angle:** The UX of validating a 12/24-word seed phrase in real-time.

#### extension/#4294 — Remove Dependency on Two Libraries for BIP39
**Repo:** leather-io/extension  
**What:** Follow-on simplification of the mnemonic validation dependencies.

#### extension/#4354 — Properly Switch Between 12 and 24 Word Inputs
**Repo:** leather-io/extension  
**What:** Follow-on to the secret key redesign.

#### extension/#4325 — Fix Leather Wallet Modal Routing *(Fix/4028/leather wallet modal routing)*
**Repo:** leather-io/extension  
**What:** The modal routing fix. Maps to PR #41 in your plan ("Fixing Modal Routing in a Browser Extension"). Browser extension routing is genuinely weird — React Router doesn't work like it does in a normal web app.

#### extension/#5816 — Rename Dialog as Sheet *(fix: rename dialog as sheet)*
**Repo:** leather-io/extension  
**What:** Design system semantic naming — aligning with native UI patterns.

#### extension/#4122 — Update Receive Modal with More Complete Options per Type
**Repo:** leather-io/extension  
**What:** Multi-asset receive flow improvement.

#### extension/#5674 — Update Popup Headers to Show Account Info
**Repo:** leather-io/extension  
**What:** Contextual account display in extension popup.

#### mono/#835 — Add BNS Names to Accounts *(feat: add bns-names to accounts)*
**What:** Bitcoin Name Service integration — showing human-readable names instead of addresses.

---

### 🔗 CROSS-PLATFORM / MONOREPO

#### mono/#1410 — E2E Tests (Maestro) *(chore(mobile): e2e tests)*
**What:** Maestro mobile E2E test setup. Part of the mobile CI story.

#### mono/#1647 — Add Associated Domains Entitlement for Deep Linking
**What:** iOS deep linking setup — requires Apple associated domains configuration.

#### mono/#1703 — Refactor Settings State to Infer Schema
**What:** Type inference improvement for settings — reducing manual typing.

#### extension/#5270 — Update README
**What:** Documentation work.

#### extension/#4390 — Import Prettier Config from Monorepo *(chore: import prettier config from monorepo)*
**What:** Standardising code formatting across monorepo packages.

---

### 📦 DEPENDENCY & INFRASTRUCTURE

Several PRs show Pete's security awareness and maintenance ownership:
- extension/#3922, #5853, #5708, #5372 — vulnerability fixes across multiple CVEs
- extension/#5487 — pnpm update
- extension/#5510, #5154, #5196, #4919 — regular package maintenance

---

## BLOG POST COVERAGE GAPS (PRs not yet in your plan)

Based on the PR crawl, here are contributions with blog potential **not currently in your 27-PR plan**:

| Contribution | Suggested Title | Notes |
|---|---|---|
| mono/#151 + subsequent panda-preset work | Already in plan as PR #19 | Richest technical content — full npm publish story |
| mono/#885 + #927 + #893 | Already in plan as PR #28 | Branded types + validation suite |
| mono/#1928/#2018 CI fixes | Already in plan as PR #25 | EAS build pipeline |
| mono/#1410 Maestro E2E | Not in plan | "Mobile E2E Testing with Maestro" — could merge into mobile CI post |
| extension/#4655 + #5715 Containers | In plan as PR #21 + #42 | Good — the three-iterations story is well-supported |
| extension/#4822 Colour token migration | Not in plan | "Migrating a Design System Colour Vocabulary" — lighter post |
| mono/#835 BNS names | Not in plan | "Showing Human Names Instead of Addresses" — short, interesting crypto UX post |
| mono/#1647 Deep linking | Not in plan | iOS deep linking + Universal Links is genuinely painful — short post material |
| extension/#5270 + README work | Not needed | Skip — not blogworthy |

---

## NOTES ON PR VOLUME

The raw numbers are worth knowing for your About/GitHub pages:

- **leather-io/extension**: Pete contributed from PR #3922 (early days) through #6319 (very recent). That's across the full lifetime of the repo.
- **leather-io/mono**: Pete contributed from PR #1 (literally created it) through ~#2100.
- Your contributions span **architecture, design systems, mobile, security, UX, and infra** — genuinely broad ownership rather than siloed feature work.

---

## RECOMMENDED BLOG ADDITIONS (to your existing 27-PR plan)

1. **"Designing a Mobile Deep Link Flow for iOS"** (mono/#1647) — short, crypto UX, Apple-specific pain
2. **"Migrating Colour Tokens from Brown to Ink"** (extension/#4822) — design system vocabulary evolution, could be a short companion to the design system series
3. **"FlashList vs FlatList in a Crypto Wallet"** (mono/#1202) — concrete React Native performance piece, easy to write, searchable

These are all short posts (~500-800 words) that complement your longer flagship pieces.