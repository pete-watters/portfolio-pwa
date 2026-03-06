---
title: "Designing a Mobile Deep Link Flow for iOS"
description: "Setting up Apple Universal Links for a React Native crypto wallet — associated domains, entitlements, and the apple-app-site-association file."
pubDate: 2025-06-15
tags: ["react-native", "ios", "mobile", "leather"]
draft: false
---

Deep linking in a mobile app sounds straightforward. User taps a link, app opens to the right screen. In practice — especially on iOS — it's a minefield of configuration files, entitlements, and Apple-specific behaviour that's poorly documented and painful to debug.

We needed deep links in Leather's mobile wallet so users could tap a payment request URL and land directly on the send screen with the recipient and amount pre-filled. Here's what it took.

## Universal Links vs URL Schemes

iOS supports two kinds of deep links. Custom URL schemes (`leather://send?to=...`) are the old way — they work, but any app can register any scheme, there's no ownership verification, and Safari shows an ugly confirmation dialog. Universal Links (`https://leather.io/send?to=...`) are Apple's preferred approach. They open your app directly with no dialog, and they fall back to the website if the app isn't installed.

Universal Links require more setup, but for a financial app where phishing is a real concern, verified ownership matters. We went with Universal Links.

## The three pieces

### 1. apple-app-site-association

This is a JSON file hosted at `https://yourdomain.com/.well-known/apple-app-site-association`. It tells iOS which URL paths should open your app:

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.io.leather.mobile",
        "paths": ["/send/*", "/connect/*"]
      }
    ]
  }
}
```

Apple's CDN fetches this file when the app is installed (and periodically after). If the file is missing, malformed, or served with the wrong content type, deep links silently fail. No error, no fallback — just nothing happens.

### 2. Associated Domains entitlement

In the Xcode project (or via Expo's `app.json`), you add an Associated Domains entitlement:

```json
{
  "expo": {
    "ios": {
      "associatedDomains": ["applinks:leather.io"]
    }
  }
}
```

This gets baked into the app binary at build time. The domain here must exactly match where your `apple-app-site-association` file is hosted.

### 3. Navigation handling

When iOS opens your app via a Universal Link, the URL arrives as a linking event. With React Navigation, you configure a linking config that maps URL paths to screens:

```typescript
const linking = {
  prefixes: ['https://leather.io'],
  config: {
    screens: {
      Send: 'send/:address',
      Connect: 'connect/:session',
    },
  },
};
```

## What went wrong

Everything, at some point. The associated domains entitlement requires a fresh build — you can't hot-reload it. Apple's CDN caches the `apple-app-site-association` file aggressively, so a fix to the JSON can take hours to propagate. And the best debugging tool — the Apple developer mode link validator — only works in Safari on a Mac signed into the same Apple ID.

The most subtle issue: Universal Links don't work if the user is already in Safari on the same domain. If someone is browsing `leather.io` in Safari and taps a deep link to `leather.io/send/...`, Safari navigates instead of opening the app. Apple considers this "staying in context." You can work around it with a redirect domain or a banner, but it's a UX trap you won't find in the docs.

## The takeaway

Deep linking on iOS is a configuration problem, not a code problem. The actual navigation handling is a few lines. The associated domains, the JSON file, the entitlement, the CDN caching, the debugging — that's where the time goes. Budget a day for setup and testing, not an hour.
