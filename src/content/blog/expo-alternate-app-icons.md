---
title: "Personalizing Your App with Alternate Icons"
description: "How we implemented 11 app icon options using expo-alternate-app-icons"
pubDate: 2025-08-01
tags: ["code"]
draft: false
---

*This is Part 5 of the "Building a Crypto Wallet with Expo" series.*

<!-- ADD: Was this your idea or a team/community request? What's the reaction been like from users? -->

Sometimes the best features are the ones that bring users joy. Alternate app icons don't make your app more secure or more functional -- they just make users smile when they see _their_ icon on _their_ home screen.

We ship 11 different app icon options in Leather, and users love it.

## Why Alternate Icons?

1. **Privacy** -- Some users prefer an icon that doesn't scream "I have crypto"
2. **Personalization** -- Crypto users often identify strongly with specific aesthetics
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

On iOS, changing the app icon shows a system alert: "You have changed the icon for Leather." This is an Apple requirement. To make it less jarring: show a preview before the user taps, use clear labeling, and don't show the picker on first launch.

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
5. **Personalization**: 11 app icons with expo-alternate-app-icons

Expo and EAS have been transformative for our development velocity. We ship faster, test more thoroughly, and spend less time fighting native build issues.

<!-- ADD: Wrap the series with a personal reflection. You started with zero React Native experience and built all of this. What would you tell someone about to start their first RN project? -->

For a feature that took about a day to implement, the ROI has been excellent.
