---
title: "Shipping a Crypto Wallet Mobile App From Scratch (As a React Native Newcomer)"
description: "From zero React Native experience to App Store in 3 months, launching at BTC Vegas"
pubDate: 2024-12-15
tags: ["code"]
draft: false
---

Before the mobile app, I was deep in the Leather browser extension -- a React app with a complex design system migration, container architecture and routing overhaul. I'd been at Leather for a while and knew the product inside out: the data models, the blockchain quirks, the user expectations. When the mobile project spun up, I saw an opportunity to apply all that domain knowledge to a completely new platform.

Honestly, part of the appeal was the challenge. I'd never written a line of React Native. The idea of going from zero to App Store on a production crypto wallet -- where bugs can cost people real money -- was both terrifying and exciting. I'd spent years building confidence in web development, and I wanted to test whether those skills would transfer. The monorepo structure helped enormously here: the shared packages meant I could focus on the mobile UI without having to rebuild the entire data layer from scratch.

I'd never used React Native or Expo before. I'd been working on the browser extension -- design system migration, containers, routing -- and was about to tackle something completely new. The monorepo (`leather-io/mono`) was set up by the team, with the foundational packages and architecture already in place. Other team members were building the data layer, queries, and API integrations. My focus would be the mobile UI and features. My first PR was [#417](https://github.com/leather-io/mono/pull/417) -- adding a native Skeleton Loader to the UI library in September 2024.

By December 2024, the team shipped to the App Store. At BTC Vegas.

BTC Vegas in December 2024 was the target from the start. The team had committed to launching the mobile app at the conference, which meant we had an immovable deadline and thousands of crypto enthusiasts ready to try our product. I wasn't onsite -- I was working remotely, shipping PRs alongside team members who were on the ground in Las Vegas. The time zone difference meant I was fixing bugs while they were demoing the app to users at the booth.

There's a particular intensity to shipping software that people are going to download and use _that day_. Every PR felt urgent. Every code review had real stakes. The Slack channel was buzzing around the clock with bug reports from the conference floor, and we were triaging and fixing in near real-time. It was chaotic, exhausting and one of the best shipping experiences of my career.

## Phase 1: Building Blocks (Sep 2024)

Coming from a browser extension codebase, React Native was a shift. No CSS Grid. No `position: fixed`. Different scrolling behaviour. Different modal patterns.

My first contributions were shared UI primitives in `packages/ui`:

- **[#426](https://github.com/leather-io/mono/pull/426) - Sheet component** (+899/-753) - Bottom sheets are the bread and butter of mobile UX. This was my introduction to React Native animation.
- **[#417](https://github.com/leather-io/mono/pull/417) - Skeleton Loader** (+237/-6) - Custom loading placeholders with animation variants.
- **[#434](https://github.com/leather-io/mono/pull/434) - SheetHeader** - Refactored ModalHeader for mobile context.
- **[#439](https://github.com/leather-io/mono/pull/439) - Accounts Widget** (+533/-189) - First real "feature" on mobile.

These weren't flashy, but they were the vocabulary the entire mobile app would be written in.

The steepest learning curve was navigation and the mental model around screens. On the web, you think in terms of pages and URLs. In React Native with expo-router, you think in terms of stacks, tabs and modals -- and they nest in ways that aren't immediately intuitive. Getting a bottom sheet to present correctly over a tab navigator, which itself contains a stack navigator, required understanding how React Navigation's screen hierarchy actually works. I spent more time debugging navigation state than any other single topic.

Animation was the other big adjustment. On the web, you can get surprisingly far with CSS transitions. In React Native, anything smooth needs to run on the native thread, which means `react-native-reanimated` and thinking about shared values, worklets and layout animations. The Sheet component (PR #426) was my baptism by fire -- getting a performant, gesture-driven bottom sheet with a backdrop that correctly intercepts touches was genuinely hard. But once I understood the Reanimated mental model, it clicked, and I started reaching for native animations by default.

What surprised me most versus web development was how much platform-specific behaviour matters. On the web, browsers are mostly consistent. On mobile, iOS and Android have fundamentally different expectations for scrolling, haptics, navigation patterns and even how alerts look. You can't just build once and expect it to feel native on both platforms.

## Phase 2: From Mockups to Live Data (Oct-Nov 2024)

With UI primitives ready, I built the home screen widgets:

- **[#448](https://github.com/leather-io/mono/pull/448) - Tokens Widget** (+933/-1,057) - Token holdings display
- **[#481](https://github.com/leather-io/mono/pull/481) - Collectibles Widget** (+1,739/-70) - NFT gallery preview

Then the critical moment: integrating real blockchain data through `LeatherQueryProvider`. The data layer -- queries, API services, balance calculations -- was built by other team members in shared packages. My job was wiring it into the mobile UI. The app went from showing hardcoded values to real Stacks balances. The first time you see your actual wallet balance render on a phone you helped build... that's a feeling.

That moment -- seeing real blockchain data render in a UI I'd built -- was genuinely special. I remember refreshing the app and watching my actual STX balance appear on the Tokens Widget for the first time. It went from a prototype to a real product in that instant.

The mobile app was a proper team effort. Other engineers were building the shared query layer, API integrations and the data models that powered the whole thing. My focus was the mobile-specific UI: screens, navigation, components and the integration layer that wired the data into the interface. We worked mostly async across different time zones, with PRs as the primary communication mechanism. Code reviews were thorough -- sometimes frustratingly so when you wanted to ship fast -- but that rigour is what kept the quality bar high. We'd occasionally jump on calls to hash out architectural decisions, but day to day it was PRs, Slack threads and well-written commit messages.

## Phase 3: "Leatherhood" at BTC Vegas (Dec 2024)

The push to production was a team effort. In the final weeks, everyone was focused on launch blockers. My contributions included:

- Setting up **Maestro E2E tests** ([#726](https://github.com/leather-io/mono/pull/726)) covering wallet creation, restoration, balance display, network switching -- before launch, not after
- Adding **dark mode** with animated transitions
- Implementing **pull-to-refresh** for balance updates
- Adding **network badges** so users know which network they're on
- Hardcoding several broken translations that would have blocked the release
- Fixing multiple App Store submission issues

The whole team was shipping multiple PRs per day, each targeting a specific launch blocker.

The BTC Vegas push involved the full engineering team -- around six or seven of us, some onsite at the conference and others remote. The energy was electric. There's nothing quite like a hard deadline that's also a public event to focus the mind. We had a shared spreadsheet of launch blockers and each morning we'd divvy them up based on who was awake and available.

One of the more memorable last-minute fixes was a localisation issue. We'd integrated CrowdIn for translations, and some of the translated strings were breaking the UI -- overflowing containers, wrapping in unexpected places. I ended up hardcoding several critical strings to English to unblock the release, with a plan to fix the layouts properly after launch. It wasn't elegant, but it shipped.

The moment we knew it was ready was anticlimactic in the best way. There wasn't a dramatic "hit the button" moment -- we'd been iterating on TestFlight builds for days, and the final submission to the App Store happened quietly. The real celebration was when users at the conference started downloading it and sending their first transactions. Seeing strangers use something you built, in real time, for real money -- that's when it felt done.

## Phase 4: Making It Production-Grade (Jan-May 2025)

Post-launch was about depth and safety:

**Security & Validation (Jan-Mar)**
- **[#885](https://github.com/leather-io/mono/pull/885) - Branded Types for Bitcoin addresses** (+1,002/-233, 47 files) - Compile-time prevention of invalid addresses
- **[#915](https://github.com/leather-io/mono/pull/915) - Compliance checks** (+592/-67) - Sanctions screening on mobile

**Barcelona Offsite (Jan 2025)**
During the team offsite in Barcelona, I shipped [#6085](https://github.com/leather-io/extension/pull/6085) -- UTXO consolidation. The fix was +6/-10 lines (removing validation that blocked users from sending BTC to themselves). Tiny change, huge user value. Sometimes the best code is the code you delete.

The Barcelona offsite in January 2025 was the first time the full team was in one room. We'd been working together for months, but mostly through screens. Having everyone physically together changed the dynamic -- you could lean over, point at a screen and debug something in five minutes that would have taken an hour over Slack.

The UTXO consolidation fix wasn't a hackathon project -- it was something I'd been thinking about since users started reporting it. The issue was simple: Bitcoin users with lots of small UTXOs (dust) wanted to consolidate them into a single output by sending to themselves, but our validation was blocking self-sends as potentially erroneous. The fix was literally removing overzealous validation -- six lines added, ten removed. I'd been mulling it over for a while, and being at the offsite with the team meant I could quickly validate the approach with the Bitcoin experts, get a review and ship it same day. It's a good example of how the most impactful changes aren't always the biggest ones.

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
