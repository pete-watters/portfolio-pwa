---
title: "OTA Updates for Financial Apps"
description: "Balancing speed with security using EAS Update for a production crypto wallet"
pubDate: 2025-07-15
tags: ["code"]
draft: false
---

*This is Part 4 of the "Building a Crypto Wallet with Expo" series.*

I first understood the real value of OTA updates about a week after our initial App Store launch. We had a UI bug where certain token balances weren't rendering correctly for users with specific Stacks configurations. It wasn't a security issue, but users were seeing incorrect numbers -- and in a crypto wallet, incorrect numbers cause panic. An App Store review cycle would have taken days. With EAS Update, we had the fix live within the hour.

That experience crystallised something for me: in a financial app, the speed at which you can respond to issues is itself a security feature. Every hour a bug is live is another hour users might make decisions based on bad information, or worse, lose trust in the product entirely. OTA updates aren't just a convenience -- they're part of your incident response toolkit.

Over-the-air updates are a superpower for React Native apps. Ship a bug fix in minutes instead of days. No app store review, no waiting for users to update. But for a cryptocurrency wallet, this power comes with serious responsibility.

If we ship a bad update, users could lose access to their funds. If an attacker compromised our update pipeline, they could steal seed phrases. This post covers how we use EAS Update responsibly.

## The Risk Model

1. **Bad code ships** -- A bug crashes the app or corrupts data
2. **Supply chain attack** -- Malicious code injected into an update
3. **Rollback failure** -- Users stuck on a broken version
4. **Version skew** -- JS update incompatible with native code

Each could result in users losing access to their cryptocurrency.

## Configuration

```typescript
// app.config.ts
export default {
  updates: {
    url: 'https://u.expo.dev/c03c1f22-be7b-4b76-aa1b-3ebf716bd2cc',
  },
  runtimeVersion: {
    policy: 'fingerprint',
  },
};
```

The `fingerprint` runtime version policy ensures JavaScript updates only apply to compatible native builds.

## Channel Strategy

Updates flow through channels: **development** (internal testing) -> **staging** (QA) -> **production** (public). We never push directly to production.

## Forced Update Mechanism

For critical security fixes, we can force users to update via LaunchDarkly feature flags + version checking:

```typescript
export function useVersionCheck(): VersionCheckResult {
  const minimumVersion = useMinimumAppVersion();  // From LaunchDarkly
  const currentVersion = Application.nativeApplicationVersion;
  return { needsUpdate: isVersionLessThan(currentVersion, minimumVersion) };
}
```

We "fail open" on errors -- if we can't check the version, we let users continue. Blocking users due to a network error would be worse than the security risk.

## What We Don't Do (Yet)

**Staged rollouts** -- tricky for a wallet app where a "canary" user with $100k has more to lose than a test account. **Automatic updates** -- disabled because users should know when their wallet software changes, and automatic updates during a transaction could corrupt state.

We haven't had to use the forced update mechanism in anger yet, which is exactly how you want it. The closest call was a dependency update that introduced a subtle regression in how we parsed certain API responses. It didn't crash the app, but it caused balance calculations to be slightly off for a small subset of tokens. We caught it in staging, but if it had made it to production, a forced update would have been on the table.

The LaunchDarkly integration has been more useful for feature management than emergency response, which I consider a success. We've used it to gate unfinished features, run A/B tests on UI changes and gradually roll out new functionality. The forced update path is there as a safety net, and we've rehearsed deploying it, but the channel discipline and staging environment have caught everything so far. I'd rather have the mechanism and never need it than need it and not have it.

## Lessons Learned

1. **Channel discipline is non-negotiable** -- Never push to production without staging
2. **Fingerprint policy prevents disasters** -- Use `policy: 'fingerprint'` to prevent JS/native version skew
3. **Fail open on version checks** -- A network error shouldn't lock users out of their funds
4. **Feature flags enable instant response** -- Force updates without shipping new code
5. **Manual approval for production** -- Automation is great for CI, dangerous for production deploys
