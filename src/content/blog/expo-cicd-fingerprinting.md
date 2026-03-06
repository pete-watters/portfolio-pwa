---
title: "How We Cut Our Mobile CI Time by 70% with Expo and EAS"
description: "Fingerprinting, EAS Workflows, and Maestro E2E tests for a production crypto wallet"
pubDate: 2025-06-01
tags: ["code"]
draft: true
---

*This is Part 1 of the "Building a Crypto Wallet with Expo" series.*

<!-- ADD: Frame this with your personal context. You'd never used React Native, Expo, or EAS before. Setting up CI for a mobile app was new territory. What was your experience with CI before this? How did you approach learning EAS? -->

At [Leather](https://leather.io/), we're building a self-custody Bitcoin and Stacks wallet that millions of users trust with their digital assets. When you're handling people's money, quality isn't optional -- it's everything. That's why we invested heavily in our mobile CI/CD pipeline, and Expo's EAS platform has been transformative.

We went from 20+ minute builds on every PR to under 6 minutes for most changes -- while _increasing_ our test coverage.

## The Challenge: Security Meets Speed

Cryptocurrency wallets face a unique challenge: we need the security rigor of a bank with the iteration speed of a startup. Our mobile app handles seed phrase generation, transaction signing, QR code scanning, biometric authentication and push notifications. Every feature touches sensitive code paths. We can't ship bugs. But we also can't wait 20 minutes to find out if a PR is safe to merge.

<!-- ADD: Relate this to the BTC Vegas launch pressure. When you were shipping multiple PRs a day in the lead-up to launch, slow CI would have been a blocker. Did you set up the CI before or after launch? -->

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

<!-- ADD: Did you set up the Maestro tests? PR #726 was your Maestro E2E setup PR. What was the learning curve? Had you used E2E testing before? -->

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
