---
title: "Personalising Your App with Alternate Icons"
description: "How we implemented 11 app icon options using expo-alternate-app-icons"
pubDate: 2025-08-01
tags: ["code"]
draft: false
---

*This is Part 5 of the "Building a Crypto Wallet with Expo" series.*

The alternate icons feature came from the community. Users had been asking for it in Discord -- some wanted a more discreet icon that didn't advertise they had a crypto wallet, others just wanted something that matched their aesthetic. Our design team had already created a set of beautiful icon variants for the brand, so the assets were ready. It was more of a "why haven't we done this yet?" situation than a hard sell.

The reaction has been brilliant. It's one of those features that disproportionately drives engagement on social media. People screenshot their home screens showing off their chosen icon, which is free marketing for us. In the app's settings, the icon picker is one of the most-visited screens -- which says something, given that this is a financial app where you'd expect users to spend most of their time on balances and transactions.

Sometimes the best features are the ones that bring users joy. Alternate app icons don't make your app more secure or more functional -- they just make users smile when they see _their_ icon on _their_ home screen.

We ship 11 different app icon options in Leather, and users love it.

## Why Alternate Icons?

1. **Privacy** -- Some users prefer an icon that doesn't scream "I have crypto"
2. **Personalisation** -- Crypto users often identify strongly with specific aesthetics
3. **Delight** -- In a sea of serious financial apps, a bit of personality goes a long way
4. **Low effort, high reward** -- Once set up, adding new icons is just dropping in assets

## The Setup

```typescript
// app.config.ts
plugins: [
  [
    'expo-alternate-app-icons',
    [
      {
        name: 'Icon1',
        ios: './src/assets/icon-1.png',
        android: {
          foregroundImage: './src/assets/adaptive-icon-1.png',
          backgroundColor: '#12100F',
        },
      },
      // ... Icon2 through Icon11
    ],
  ],
]
```

## The UI

```typescript
import { setAlternateAppIcon } from 'expo-alternate-app-icons';

async function handleIconSelect(icon: AppIcon) {
  try {
    changeAppIconPreference(icon);
    const nativeIconName = mapIconNameToNative(icon);
    await setAlternateAppIcon(nativeIconName);
  } catch (error) {
    // Rollback preference if native change failed
    changeAppIconPreference(appIconPreference);
    Sentry.captureException(error);
  }
}
```

We store the user's preference separately from the actual icon state for instant UI updates and rollback capability.

## The iOS Alert

On iOS, changing the app icon shows a system alert: "You have changed the icon for Leather." This is an Apple requirement. To make it less jarring: show a preview before the user taps, use clear labelling and don't show the picker on first launch.

## Adding New Icons

1. Create the assets (iOS 1024x1024, Android adaptive 432x432)
2. Add the entry to `app.config.ts`
3. Add to the `appIcons` array and labels
4. Run `npx expo prebuild`
5. Build and test

## Series Conclusion

Over these five posts, we've covered:

1. **CI/CD**: Fingerprinting + EAS Workflows cut build times by 70%
2. **Security**: expo-secure-store + expo-local-authentication protect seed phrases
3. **Multi-chain**: Unified UI for Bitcoin and Stacks
4. **Updates**: Safe OTA updates for a financial app
5. **Personalisation**: 11 app icons with expo-alternate-app-icons

Expo and EAS have been transformative for our development velocity. We ship faster, test more thoroughly, and spend less time fighting native build issues.

Looking back across this series, I'm still a bit surprised by how far we got. I started with zero React Native experience in September 2024 and by December we'd shipped a production crypto wallet to the App Store. The Expo ecosystem deserves enormous credit for that -- it abstracts away so much of the native complexity that a web developer can be productive within days rather than weeks.

If I had one piece of advice for someone about to start their first React Native project, it would be this: invest in your primitives early, and trust that your web instincts will transfer. The component model, the state management patterns, the debugging mindset -- it's all the same. The differences are real but manageable: learn how `ScrollView` and `FlatList` differ from browser scrolling, understand that animations need to run on the native thread, and accept that you'll spend more time in Xcode than you'd like. But the core skill of building good UIs from composable parts? That translates directly.

The other thing I'd say is don't underestimate Expo. When I started, I half-expected we'd need to eject for a crypto wallet -- surely something this complex would need bare React Native. We never did. Every native feature we needed, from biometrics to secure storage to camera access, had an Expo package that just worked.

For a feature that took about a day to implement, the ROI has been excellent.
