---
title: "How We Cut Our Mobile CI Time by 70% with Expo and EAS"
description: "Fingerprinting, EAS Workflows, and Maestro E2E tests for a production crypto wallet"
pubDate: 2025-06-01
tags: ["code"]
draft: false
---

*This is Part 1 of the "Building a Crypto Wallet with Expo" series.*

Before joining the Leather mobile project, I'd never touched React Native, Expo or EAS. My CI experience was entirely web-focused -- GitHub Actions running lint, type checks and Playwright tests for the browser extension. Mobile CI was a different beast entirely. You're not just building JavaScript; you're compiling native binaries for two platforms, managing signing certificates, provisioning profiles and dealing with build times that make webpack look instant.

I approached EAS the way I approach most new tooling: read the docs cover to cover, then start breaking things. The Expo documentation is genuinely excellent, and the EAS Workflows feature was still relatively new when we adopted it. I spent the first week just running builds locally, understanding what the different profiles did and getting a feel for what changed the native fingerprint versus what didn't. That investment paid off enormously -- once I understood the fingerprint concept, our entire CI strategy clicked into place.

At [Leather](https://leather.io/), we're building a self-custody Bitcoin and Stacks wallet that millions of users trust with their digital assets. When you're handling people's money, quality isn't optional -- it's everything. That's why we invested heavily in our mobile CI/CD pipeline, and Expo's EAS platform has been transformative.

We went from 20+ minute builds on every PR to under 6 minutes for most changes -- while _increasing_ our test coverage.

## The Challenge: Security Meets Speed

Cryptocurrency wallets face a unique challenge: we need the security rigor of a bank with the iteration speed of a startup. Our mobile app handles seed phrase generation, transaction signing, QR code scanning, biometric authentication and push notifications. Every feature touches sensitive code paths. We can't ship bugs. But we also can't wait 20 minutes to find out if a PR is safe to merge.

This tension was sharpest in the lead-up to our BTC Vegas launch in May 2025. The whole team was shipping multiple PRs per day, each targeting a specific launch blocker. If every PR had required a full 20-minute native build before we could validate it, we'd have been queueing builds all day and merging on faith. That's not acceptable when you're handling people's money.

I set up the core CI pipeline before launch, which turned out to be one of the better decisions we made under pressure. Having fast, reliable feedback on every PR meant we could ship confidently at pace. The fingerprinting strategy came together slightly later as I learned more about EAS, but even the initial setup -- automating builds and running basic checks -- removed a huge amount of friction during the most intense shipping period.

## Our Expo Stack

### Core Infrastructure

- **Expo SDK 54** with expo-router for file-based navigation
- **EAS Build** for cloud builds across 6 profiles (development, staging, production, preview, devClient, maestro)
- **EAS Update** for over-the-air JavaScript updates
- **EAS Workflows** for orchestrating our entire CI/CD pipeline

### Native Features (31 Expo packages!)

- `expo-secure-store` for encrypted credential storage
- `expo-local-authentication` for Face ID/Touch ID
- `expo-camera` for QR scanning
- `expo-notifications` with Firebase Cloud Messaging
- `expo-haptics` for tactile feedback
- `expo-alternate-app-icons` (we have 11 app icons users can choose from!)

## The Fingerprint Breakthrough

The breakthrough was understanding that **most PRs don't change native code**. We're primarily shipping JavaScript -- new features, bug fixes, UI tweaks. Why rebuild the entire native app for a copy change?

Expo's `@expo/fingerprint` library generates a hash of everything that affects the native runtime: native dependencies, iOS and Android configuration, native modules and their versions, build settings.

When the fingerprint matches a previous build, we know we can reuse that build and just update the JavaScript bundle.

### Our Fingerprint Configuration

```javascript
// fingerprint.config.js
module.exports = {
  sourceSkips: [
    'ExpoConfigRuntimeVersionIfString',
    'ExpoConfigVersions',
    'PackageJsonAndroidAndIosScriptsIfNotContainRun',
    'PackageJsonScriptsAll',
    'GitIgnore',
  ],
  ignorePaths: [
    '**/GoogleService-Info*.plist',  // Environment-specific
    '**/google-services*.json',
    'src/assets/adaptive-icon.png',
  ],
};
```

## The Workflow

Here's our EAS Workflow that runs on every PR:

```yaml
name: Maestro E2E Tests

on:
  pull_request:
    branches: [dev]
    paths:
      - apps/mobile/**
      - packages/**

jobs:
  # Step 1: Calculate fingerprint
  fingerprint:
    name: Fingerprint
    type: fingerprint

  # Step 2: Push JS bundle to EAS Update
  run_eas_update:
    name: EAS Update
    type: update
    params:
      platform: all
      channel: cicd

  # Step 3: Check for existing builds
  get_android_build:
    name: Check Android Build
    needs: [fingerprint]
    type: get-build
    params:
      fingerprint_hash: ${{ needs.fingerprint.outputs.android_fingerprint_hash }}
      profile: devClient
      platform: android

  # Step 4: Only build if no match found
  build_android:
    name: Build Android
    needs: [get_android_build]
    if: ${{ !needs.get_android_build.outputs.build_id }}
    type: build
    params:
      platform: android
      profile: devClient

  # Step 5: Run E2E tests
  maestro_android_cached:
    name: Android Maestro (cached)
    needs: [get_android_build, run_eas_update]
    if: ${{ needs.get_android_build.outputs.build_id }}
    type: maestro
    params:
      build_id: ${{ needs.get_android_build.outputs.build_id }}
      flow_path: maestro/flows/full-suite-ci.yaml
```

For JavaScript-only changes, steps 3-4 take seconds instead of 15-20 minutes.

## Maestro E2E Testing

We use [Maestro](https://maestro.mobile.dev/) for E2E testing. Here's a sample:

```yaml
# shared/create-wallet.yaml
appId: io.leather.mobilewallet
---
- tapOn:
    id: 'homeCreateWalletCard'
- tapOn:
    id: 'createNewWalletSheetButton'
- tapOn:
    id: 'walletCreationTapToReveal'
- tapOn:
    id: 'walletCreationBackedUpButton'
- tapOn:
    text: 'Skip for now'
- tapOn:
    text: 'Continue'
- assertVisible:
    id: 'networkBadge'
    timeout: 10000
```

Our full test suite covers wallet creation and restoration, settings navigation, send/receive flows, network switching, and wallet removal.

I set up the Maestro E2E test suite in [PR #726](https://github.com/leather-io/mono/pull/726), and it was one of those rare cases where the tooling just works. I'd used Playwright extensively on the browser extension, so the concept of E2E testing wasn't new -- but mobile E2E has its own quirks. You're dealing with app launch times, biometric prompts, system alerts and the general flakiness of emulators.

Maestro's YAML-based approach was a breath of fresh air compared to the JavaScript-heavy alternatives. The learning curve was mostly around understanding which selectors to use (we settled on `testID` for everything critical) and structuring shared flows so tests could compose wallet creation and setup steps without duplication. The biggest lesson was getting `testID` props on every interactive element from the start. Retrofitting them later is painful, and text-based selectors broke immediately once we integrated CrowdIn for localisation.

## The Results

| Metric | Before | After |
|---|---|---|
| JS-only PR build time | ~20 min | ~6 min |
| Native change build time | ~20 min | ~20 min |
| Test coverage | Basic smoke | Full E2E suite |
| Tests run per PR | Manual trigger | Automatic |

**Most of our PRs are now in the "fast path"**. Native code changes are relatively rare compared to feature development and bug fixes.

## Tips for Teams Adopting This Pattern

1. **Start with fingerprinting** -- Even without the full workflow, understanding your fingerprint will show you how many builds you could skip.
2. **Invest in testIDs early** -- Text-based assertions break with localization. We learned this the hard way when our CrowdIn integration broke all our tests.
3. **Use development clients** -- The `devClient` profile gives you the speed of Expo Go with the flexibility of custom native code.
4. **Organize shared flows** -- Maestro's `runFlow` command lets you compose tests.
5. **Monitor your fingerprint hit rate** -- Track how often you're reusing builds vs. rebuilding.

## Related PRs

| PR | What | Stats |
|---|---|---|
| [#726](https://github.com/leather-io/mono/pull/726) | Maestro E2E test setup | +198/-1, 13 files |
| [#2018](https://github.com/leather-io/mono/pull/2018) | Fix mobile CI build (EAS/pnpm/lingui conflicts) | +1,039/-15, 14 files |
