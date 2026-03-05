---
title: "Shipping a Crypto Wallet Mobile App From Scratch (As a React Native Newcomer)"
description: "From zero React Native experience to App Store in 3 months, launching at BTC Vegas"
pubDate: 2024-12-15
tags: ["code"]
draft: false
---

<!-- ADD: What were you working on before this? What made you want to take on the mobile app? -->

I'd never used React Native or Expo before. I'd been working on the browser extension -- design system migration, containers, routing -- and was about to tackle something completely new. The monorepo (`leather-io/mono`) was set up by the team, with the foundational packages and architecture already in place. Other team members were building the data layer, queries, and API integrations. My focus would be the mobile UI and features. My first PR was [#417](https://github.com/leather-io/mono/pull/417) -- adding a native Skeleton Loader to the UI library in September 2024.

By December 2024, the team shipped to the App Store. At BTC Vegas.

<!-- ADD: The BTC Vegas story. Were you onsite? What was the atmosphere like shipping at a conference? Any last-minute drama? -->

## Phase 1: Building Blocks (Sep 2024)

Coming from a browser extension codebase, React Native was a shift. No CSS Grid. No `position: fixed`. Different scrolling behaviour. Different modal patterns.

My first contributions were shared UI primitives in `packages/ui`:

- **[#426](https://github.com/leather-io/mono/pull/426) - Sheet component** (+899/-753) - Bottom sheets are the bread and butter of mobile UX. This was my introduction to React Native animation.
- **[#417](https://github.com/leather-io/mono/pull/417) - Skeleton Loader** (+237/-6) - Custom loading placeholders with animation variants.
- **[#434](https://github.com/leather-io/mono/pull/434) - SheetHeader** - Refactored ModalHeader for mobile context.
- **[#439](https://github.com/leather-io/mono/pull/439) - Accounts Widget** (+533/-189) - First real "feature" on mobile.

These weren't flashy, but they were the vocabulary the entire mobile app would be written in.

<!-- ADD: What was the steepest learning curve in React Native? Animation? Navigation? Testing? What surprised you vs web development? -->

## Phase 2: From Mockups to Live Data (Oct-Nov 2024)

With UI primitives ready, I built the home screen widgets:

- **[#448](https://github.com/leather-io/mono/pull/448) - Tokens Widget** (+933/-1,057) - Token holdings display
- **[#481](https://github.com/leather-io/mono/pull/481) - Collectibles Widget** (+1,739/-70) - NFT gallery preview

Then the critical moment: integrating real blockchain data through `LeatherQueryProvider`. The data layer -- queries, API services, balance calculations -- was built by other team members in shared packages. My job was wiring it into the mobile UI. The app went from showing hardcoded values to real Stacks balances. The first time you see your actual wallet balance render on a phone you helped build... that's a feeling.

<!-- ADD: What was that moment like? Who else was working on the mobile app? How did the collaboration work -- were you pairing, async, in different timezones? -->

## Phase 3: "Leatherhood" at BTC Vegas (Dec 2024)

The push to production was a team effort. In the final weeks, everyone was focused on launch blockers. My contributions included:

- Setting up **Maestro E2E tests** ([#726](https://github.com/leather-io/mono/pull/726)) covering wallet creation, restoration, balance display, network switching -- before launch, not after
- Adding **dark mode** with animated transitions
- Implementing **pull-to-refresh** for balance updates
- Adding **network badges** so users know which network they're on
- Hardcoding several broken translations that would have blocked the release
- Fixing multiple App Store submission issues

The whole team was shipping multiple PRs per day, each targeting a specific launch blocker.

<!-- ADD: The BTC Vegas details. How many team members were there? What was the energy like? Any funny stories about last-minute fixes across the team? Was there a specific moment you all knew it was ready to ship? -->

## Phase 4: Making It Production-Grade (Jan-May 2025)

Post-launch was about depth and safety:

**Security & Validation (Jan-Mar)**
- **[#885](https://github.com/leather-io/mono/pull/885) - Branded Types for Bitcoin addresses** (+1,002/-233, 47 files) - Compile-time prevention of invalid addresses
- **[#915](https://github.com/leather-io/mono/pull/915) - Compliance checks** (+592/-67) - Sanctions screening on mobile

**Barcelona Offsite (Jan 2025)**
During the team offsite in Barcelona, I shipped [#6085](https://github.com/leather-io/extension/pull/6085) -- UTXO consolidation. The fix was +6/-10 lines (removing validation that blocked users from sending BTC to themselves). Tiny change, huge user value. Sometimes the best code is the code you delete.

<!-- ADD: What was the Barcelona offsite like? Was the UTXO fix a hackathon thing or something you'd been thinking about? -->

**Quality Pass (Mar-May)**
One of the biggest quality improvements I worked on was [#1130](https://github.com/leather-io/mono/pull/1130) -- 121 files adding loading states and error handling. The critical fix: preventing the app from briefly showing "$0" balances while data loads.

In a crypto wallet, users seeing $0 when they have funds is a support nightmare. It's the worst bug a wallet can have -- not because it loses money, but because users *think* they've lost money.

## What I Learned (As a React Native Newcomer)

1. **UI primitives are worth the investment.** The time spent on Sheet, Dialog, and SkeletonLoader in month one saved weeks in months 3-6. Coming from the browser extension where I'd already done this work, I knew the payoff was real.
2. **Feature flags are non-negotiable for mobile.** You can't un-ship a mobile release like you can revert a web deploy. Gating unfinished features behind flags let us merge to main continuously.
3. **React Native is closer to web than you think.** The mental model transfers. The gotchas are in animation, navigation, and platform-specific behaviour -- not in the component model.
4. **E2E tests before launch, not after.** Maestro caught regressions that unit tests missed. Worth the setup cost even under launch pressure.

## Key PRs

| PR | What | Stats | Context |
|---|---|---|---|
| [#417](https://github.com/leather-io/mono/pull/417) | Skeleton Loader (first RN PR) | +237/-6 | Sep 2024 |
| [#426](https://github.com/leather-io/mono/pull/426) | Sheet component | +899/-753 | Sep 2024 |
| [#439](https://github.com/leather-io/mono/pull/439) | Accounts widget | +533/-189 | Sep 2024 |
| [#448](https://github.com/leather-io/mono/pull/448) | Tokens widget | +933/-1,057 | Sep 2024 |
| [#481](https://github.com/leather-io/mono/pull/481) | Collectibles widget | +1,739/-70 | Sep 2024 |
| [#726](https://github.com/leather-io/mono/pull/726) | Maestro E2E tests | +198/-1 | Dec 2024 |
| [#885](https://github.com/leather-io/mono/pull/885) | Branded Types | +1,002/-233, 47 files | Feb 2025 |
| [#915](https://github.com/leather-io/mono/pull/915) | Compliance checks | +592/-67 | Feb 2025 |
| [#1130](https://github.com/leather-io/mono/pull/1130) | Loading states everywhere | +915/-518, 121 files | May 2025 |
| [#6085](https://github.com/leather-io/extension/pull/6085) | UTXO consolidation | +6/-10 | Barcelona |
