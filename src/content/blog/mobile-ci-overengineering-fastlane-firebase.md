---
title: "We Built the Whole Native CI Pipeline Before Realising We Didn't Need It"
description: "How a mobile team reached for the Fastlane and Firebase playbook out of habit, then deleted most of it once EAS turned out to already do the job."
pubDate: 2026-06-15
tags: ["expo", "mobile", "ci", "leather"]
draft: true
---

When a team starts a new mobile app, it tends to reach for the tooling it already knows. For us building [Leather](https://leather.io/)'s wallet, that meant the standard native CI playbook — the one the Flutter and bare-native world runs on. Fastlane to drive builds and signing, `match` to manage certificates, Firebase App Distribution to get beta builds to testers. It's a well-trodden path and it works.

It also turned out to be mostly unnecessary. This is the story of building that pipeline carefully and then deleting most of it — and why that's a result, not a failure.

## The pipeline we built first

The first version was the "proper" one. The git history reads like a checklist of the native CI canon:

- `ci: init fastlane`
- `chore: add fastlane match`
- `ci: initial fastlane firebase setup`
- `feat: firebase notifications`
- `fix: add fastlane deploy to firebase with version increment`
- `chore: refactor fastlane to try and better share lanes, add slack hook`

Each of those was real work. `match` meant setting up a certificates repository and getting signing identities synced across machines and CI. Firebase App Distribution meant wiring up the service, managing tester groups, and a Fastlane lane that built, incremented the version, and uploaded — with a Slack hook to announce it. None of it is hard exactly, but all of it is moving parts: secrets to store, services to keep authenticated, lanes to maintain, a whole second system sitting beside the app.

We did it because that's what you do. If your mental model of mobile CI was formed on Flutter or bare React Native, Fastlane plus Firebase *is* the answer. You don't question it; you just set it up.

## The realisation

The thing that made us question it was already in the project: Expo's EAS.

We'd adopted [EAS](https://expo.dev/eas) for builds, and once it was running properly, the overlap became impossible to ignore. The Fastlane-and-Firebase stack we'd carefully assembled was solving a list of problems EAS already solved:

| What we'd built | What EAS already did |
|---|---|
| Fastlane lanes for cloud builds | EAS Build, both platforms |
| `match` certificate management | EAS-managed signing credentials |
| Firebase App Distribution for betas | EAS Build + internal distribution |
| Manual version increments in a lane | Handled in the build pipeline |
| Over-the-air updates (not even attempted) | EAS Update, out of the box |

We had spent real time standing up infrastructure to do things the platform we were already paying for did natively — and in the case of OTA updates, it did things our hand-rolled pipeline never could.

## The deletion

So we ripped it out. Out went the Fastlane lanes, the `match` setup, the Firebase App Distribution wiring, the version-increment scripting, the Slack hook. The build, signing, and distribution story collapsed into EAS, and the maintenance surface shrank with it: fewer secrets in CI, fewer services to keep authenticated, fewer lanes that could rot.

The most satisfying diffs are the ones that remove more than they add, and this was one of them — a pile of carefully-built scaffolding traded for configuration the platform already understood.

## The lesson

The mistake wasn't building the Fastlane pipeline. It was building it *first*, on reflex, before checking whether the stack we'd chosen already covered it. We imported a previous platform's defaults into a new one without asking if they still applied.

The senior version of this instinct isn't "know Fastlane" or "know EAS." It's: when you adopt a platform, learn what it does for you *before* you build around it. The tooling you reach for out of habit is solving the problems of the last project, not necessarily this one. Pick the smallest thing that fits — and be willing to delete the rest when it turns out you reached too far.
