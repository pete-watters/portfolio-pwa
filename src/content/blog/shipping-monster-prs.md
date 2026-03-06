---
title: "Shipping a 5,000-Line PR Without Losing Your Mind"
description: "Lessons from shipping massive pull requests on a crypto wallet — including a 5,783-addition PR that refactored collectibles across a monorepo."
pubDate: 2025-12-09
tags: ["open-source", "code-review", "process", "leather"]
draft: false
---

Nobody wants to review a 5,000-line pull request. Nobody wants to write one either. But sometimes that's the size of the change.

Working on the [Leather](https://leather.io) wallet, I shipped PRs that ranged from small bug fixes to sweeping refactors. Two of the largest — [PR #1903](https://github.com/leather-io/mono/pull/1903) (5,783 additions, 1,152 deletions) and [PR #2004](https://github.com/leather-io/mono/pull/2004) (1,485 additions) — taught me how to manage large changes without the review process falling apart.

## Why some PRs can't be small

PR #1903 refactored the entire collectibles system across the monorepo. It introduced a shared `CollectibleView` type, moved UI components from a shared package into their respective apps, added token detail screens, ported the "Send Inscription" flow, and added loading states — all of which depended on each other.

You can't ship a shared type without the components that use it. You can't ship the components without the screens that render them. You can't ship the screens without the routes that mount them. The dependency chain makes it a single unit of work.

PR #2004 was the gated follow-up — new collectible components behind a feature flag, maintaining production code alongside the new implementation. Still large because it introduced a complete parallel UI layer.

## What makes a large PR reviewable

**A clear PR description.** PR #1903's description has a feature checklist, a list of known follow-up work, a note about an external API issue (Gamma returning 500s), and a video demo. Reviewers can watch the 30-second demo and understand the change before reading a single line of code.

**Feature flags for incremental rollout.** PR #2004 gated new components behind a `revampCollectibles` feature flag. Production code stayed untouched. Reviewers could focus on new code without worrying about regression in existing flows.

**Logical file grouping.** When a PR touches 80+ files, the diff is unreadable in order. But the files follow a pattern: types in one directory, components in another, queries in a third. Reviewing by directory instead of by diff order makes the structure visible.

**Video demos.** Both PRs included screen recordings showing the before and after. For UI-heavy changes, a video is worth more than any PR description. It answers the reviewer's first question — "does it actually work?" — before they start reading code.

## What I'd do differently

**Ship the type layer first.** The `CollectibleView` type and query hooks could have been a separate PR. It would have been small, quick to review, and established the foundation for the UI work. I underestimated how much easier it is to review large PRs when the data layer is already merged.

**More inline comments on the diff.** For PRs this size, leaving your own review comments on tricky sections saves the reviewer time. "This looks complex but it's just mapping the old Inscription type to the new CollectibleView" is one sentence that saves 10 minutes of confusion.

## The reality

Large PRs are sometimes unavoidable. The goal isn't to never ship them — it's to make them reviewable despite their size. A clear description, a working demo, logical structure and proactive communication go a long way.

And if your teammate has a meltdown during review, that's just part of the process.
