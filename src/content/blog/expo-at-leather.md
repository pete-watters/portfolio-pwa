---
title: "Building a Crypto Wallet on Expo"
description: "What Expo and EAS gave a small team building a self-custody Bitcoin and Stacks wallet — the stack, the architecture, and the parts that punched above their weight."
pubDate: 2026-06-15
tags: ["expo", "mobile", "react-native", "leather"]
draft: true
---

Most of my deep-dive posts pick one problem and chase it to the bottom. This one zooms out. I want to lay out what building [Leather](https://leather.io/)'s mobile wallet on [Expo](https://expo.dev/) actually looked like — the full stack a self-custody Bitcoin and Stacks wallet needed, and where the platform earned its keep for a small team.

This is a point-in-time account of the setup we ran while I was on the project. Some of it has since changed; the engineering held up regardless.

## The shape of the app

Leather mobile was an Expo app on SDK 54, React Native 0.81, with file-based routing via [expo-router](https://docs.expo.dev/router/introduction/). We used the prebuild model — Expo generates and owns the native projects, and we layered config plugins on top rather than hand-editing Xcode and Gradle. That kept the native surface declarative: the app config was the source of truth, and `expo prebuild` produced the platforms from it.

The dependency list told the real story. The app pulled in 34 `expo-*` packages, and they weren't padding — each one replaced something we'd otherwise have written and maintained natively:

| Need | Expo module |
|---|---|
| Encrypted key storage | `expo-secure-store` |
| Face ID / Touch ID | `expo-local-authentication` |
| QR scanning for addresses | `expo-camera` |
| Custom fonts | `expo-font` |
| Crypto primitives | `expo-crypto`, `expo-standard-web-crypto` |
| Switchable app icons | `expo-alternate-app-icons` |
| Custom dev builds | `expo-dev-client` |

A wallet lives or dies on the security-sensitive paths, and Expo had first-party modules for the two that mattered most — encrypted storage and biometrics. I wrote those up separately in [Secure Storage and Biometrics](/blog/expo-secure-storage-biometrics), because the details are worth their own post. The point here is that we got them as audited, maintained dependencies rather than bespoke native code.

## The custom dev client

We didn't use Expo Go. A wallet needs native modules Expo Go can't include, so we built our own development client with `expo-dev-client`. That gave us the iteration speed of Expo Go — push JavaScript, see it instantly — with the freedom to ship whatever native dependencies the app required. It's the setup I'd reach for on any non-trivial Expo app now: the convenience without the ceiling.

## EAS as a force-multiplier

Where Expo went from "nice SDK" to "this changes how a small team ships" was EAS. We used the three services together:

- **EAS Build** for cloud builds across both platforms, so nobody needed a perfectly configured local Xcode to cut a build.
- **EAS Update** for over-the-air JavaScript updates — most fixes shipped without an app-store round trip. I covered the financial-app considerations in [OTA Updates](/blog/expo-ota-updates).
- **EAS Workflows** to orchestrate CI, including Maestro E2E tests against real builds.

The hinge was fingerprinting. EAS hashes the inputs that affect the native runtime, so it knows when a PR is JavaScript-only and can reuse an existing native build. That single idea took our CI from twenty-minute builds to a fast path most PRs could take — the full story is in [How We Cut Our Mobile CI Time by 70%](/blog/expo-cicd-fingerprinting), with the testing machinery in [Part 2](/blog/maestro-eas-e2e-deep-dive).

## Fitting into a monorepo

Leather isn't a standalone app — it's a [Turborepo and pnpm workspace](/blog/designing-a-monorepo) where a browser extension and the mobile app share a couple of dozen packages. The interesting question was whether Expo would cooperate with that.

It did, with two pieces of glue. The app consumed shared packages through the `workspace:*` protocol — `@leather.io/ui/native`, the bitcoin and stacks logic, queries, state — as ordinary dependencies. And Metro was pointed at the workspace root so it watched and resolved across the whole monorepo, not just the app's own folder. Once those were in place, a change to a shared UI component showed up in the running app with fast refresh, exactly as it would in a single-package project. Sharing a [cross-platform UI library](/blog/cross-platform-ui-library) between an extension and a native app is hard enough; Expo not getting in the way of it was worth a lot.

## What it bought us

The throughline is how much a small team got for how little it had to build. We shipped a production wallet — encrypted storage, biometrics, QR scanning, 11 switchable app icons, OTA updates, E2E tests on real devices in CI — without standing up most of the native infrastructure those features usually demand. Expo's modules covered the sensitive paths, the dev client kept iteration fast, EAS turned builds and updates into a pipeline, and none of it fought the monorepo. That's the case for Expo I'd make to anyone building something serious on React Native.

---

*This post lives on [petewatters.ie](https://petewatters.ie). If the Expo team would like a version for their blog, I'm happy to adapt it.*
