---
title: "Maestro and EAS, Part 2: The CI Machine Around the Tests"
description: "A closer look at why Maestro's YAML model is a pleasure to work in, and the EAS Workflows build matrix — cached vs fresh, smoke-as-gate — I wrapped around it."
pubDate: 2026-06-15
tags: ["expo", "mobile", "ci", "testing", "leather"]
draft: true
---

In [Part 1](/blog/expo-cicd-fingerprinting) I wrote that setting up Maestro was one of those rare cases where the tooling just works. That's still true, but it undersells the part that took the actual effort: the CI machine around the tests. This is the deeper cut — why Maestro itself is pleasant to work in, and how I structured the EAS Workflows pipeline that ran it.

This is a point-in-time account. It describes the suite as I built it at Leather, on the EAS-based pipeline we used at the time.

## Why Maestro's model holds up

Maestro tests are YAML. That sounds like a limitation and turns out to be a feature. A flow is a flat list of commands against the running app, and that flatness makes flows readable by people who don't write the tests:

```yaml
appId: io.leather.mobilewallet
---
- tapOn:
    id: 'homeCreateWalletCard'
- tapOn: 'Create new wallet'
- tapOn:
    id: 'walletCreationTapToReveal'
- tapOn:
    id: 'walletCreationBackedUpButton'
- tapOn: 'Skip for now'
- tapOn: 'Continue'
- extendedWaitUntil:
    visible:
      id: 'homePrivacyButton'
    timeout: 10000
```

The two features I leaned on hardest were `runFlow` and conditionals. `runFlow` lets flows compose, so setup steps live in one place and get reused — wallet creation, cleanup, removal are each a shared subflow that the bigger journeys pull in:

```yaml
- runFlow: ../shared/create-wallet-dev-console.yaml
# ...later...
- runFlow: ../shared/remove-wallet.yaml
```

Conditionals handle the things real apps throw at you mid-flow — a passcode prompt, an OS dialog, a deep-link confirmation that only iOS shows:

```yaml
- runFlow:
    when:
      visible: 'Open'
    commands:
      - tapOn: 'Open'
```

And `extendedWaitUntil` replaces the sleep-and-pray pattern with an explicit condition and timeout. After a JS bundle loads over the network, you wait for the actual UI, not a guessed number of seconds.

The one hard-won lesson — covered in Part 1 but worth repeating because it dwarfs everything else — is to put `testID` on every interactive element from day one. Text selectors broke wholesale the moment we localised with CrowdIn. A `testID` is the only selector that survives a translation.

## The build matrix

The expensive part of mobile E2E isn't the test, it's getting a build to test against. EAS Workflows let me express the whole pipeline as jobs with dependencies, and the shape that emerged ran the suite across four build situations: iOS and Android, each either reused from cache or freshly built.

The trick that made this affordable was loading JavaScript over the air. Each test job points the dev-client build at an [EAS Update](/blog/expo-ota-updates) channel via a deep link, so the native binary can be a cached artifact while the JS under test is the PR's bundle:

```yaml
env:
  MAESTRO_DEEP_LINK_URL: 'exp+leather://expo-development-client/?url=https://u.expo.dev/<project>?channel-name=cicd'
```

Most PRs don't touch native code, so most runs reuse a cached build and only ship new JS — which is the whole reason CI stopped taking twenty minutes.

## Smoke as a fast-fail gate

Running the full suite four times over is slow, so I gated it. A small smoke flow runs first across all four build situations; only if smoke passes does the full suite run. In EAS Workflows that's just a `needs` edge:

```yaml
smoke_ios_cached:
  name: iOS Smoke (cached)
  type: maestro
  params:
    flow_path: maestro/flows/smoke-tests-ci.yaml

maestro_ios_cached:
  name: iOS Full Suite (cached)
  needs: [smoke_ios_cached, get_ios_build]
  type: maestro
  params:
    flow_path: maestro/flows/full-suite-ci.yaml
```

If the app can't even launch and reach the home screen, you find out in a minute instead of fifteen, and you don't burn a runner on the full journey for a broken build.

## CI economics around the edges

Two more things kept the pipeline cheap and quiet.

First, a code-quality gate runs *before* any native build. There's no point spending a macOS runner on a build if the PR doesn't lint or typecheck, so a small job waits on the repo's existing checks (`lint-eslint`, `typecheck`, `lint-prettier`, `test-unit`) and the build validation only runs once they're green.

Second, the path filters are scoped to what actually affects the mobile app. The build-validation workflow triggers on `apps/mobile/**` and the specific runtime packages it depends on — not on every change under `packages/**`. An edit to the browser extension, or to a package the app never imports, doesn't kick off a mobile build at all.

## Two gotchas worth the post

These two cost me real time and aren't in any getting-started guide.

**`__DEV__` is `false` in an EAS Update bundle.** I gated a developer console behind `__DEV__`, which works locally and then vanishes in CI — because an over-the-air bundle is built in production mode even when it's loaded into a development client. The fix is to gate on an explicit environment variable instead, and to make sure the update step bakes it in:

```yaml
run_eas_update:
  name: EAS Update
  type: update
  environment: development
  params:
    platform: all
    channel: cicd
```

To make this debuggable, the dev console just prints what it sees, so a screenshot tells you whether the bundle has the env you expected:

```tsx
<Text variant="caption01">{`__DEV__: ${String(__DEV__)}`}</Text>
<Text variant="caption01">{`NODE_ENV: ${process.env.EXPO_PUBLIC_NODE_ENV ?? 'undefined'}`}</Text>
```

**A `.gitignore` change can move your fingerprint.** EAS decides whether it can reuse a native build by hashing the inputs that affect the native runtime, and `.gitignore` is one of those inputs. Changing `android/` to `/android/` — semantically identical to a human — altered the hash and triggered fresh native builds on every PR until I reverted the slash. The fingerprint is exact; treat anything it reads as load-bearing.

## Where it landed

At its peak the suite covered the journeys that matter for a wallet: creation and restoration, the full settings tree, send and receive verification, network switching, and wallet removal — gated behind smoke, fanned across cached and fresh builds on both platforms, with most runs taking the fast over-the-air path. Maestro's YAML kept the tests themselves readable; the value was in the machine I built around it.
