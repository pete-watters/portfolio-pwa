---
title: "Secure Storage & Biometrics in a Crypto Wallet"
description: "How we protect seed phrases with expo-secure-store and expo-local-authentication"
pubDate: 2025-06-15
tags: ["code"]
draft: false
---

*This is Part 2 of the "Building a Crypto Wallet with Expo" series.*

Having worked in crypto for several years, I've seen what happens when seed phrases leak. It's not hypothetical -- I've watched it happen to people in the community. Someone pastes their mnemonic into a dodgy "support" DM and within minutes their funds are gone. No reversal, no chargeback, no recourse. The blockchain doesn't care about intent, only signatures.

That experience changes how you write code. When I'm implementing storage for a seed phrase, I'm not just thinking about "does this work?" -- I'm thinking about every possible way the data could escape. Is it in memory longer than necessary? Could a crash dump expose it? Does the OS back it up somewhere we don't control? Could a malicious app on a jailbroken device read it? You develop a paranoia that's entirely justified. Every design decision gets filtered through "what if this is the thing that loses someone their life savings?"

This mindset extends to the team as well. During code reviews on anything touching secure storage, I pushed hard for defence in depth. No single layer should be trusted completely. If `expo-secure-store` has a bug, the biometric gate should still protect the data. If biometrics are bypassed, the encryption at rest should still hold. Belt and braces, always.

In a cryptocurrency wallet, the seed phrase (mnemonic) is everything. It's the master key that controls all of a user's funds. If it leaks, their money is gone -- permanently and irreversibly. There's no "forgot password" flow, no customer support to call.

## The Security Model

Our security approach has three layers:

1. **Encryption at rest** -- Seed phrases are stored in the device's secure enclave via `expo-secure-store`
2. **Access control** -- Data is only accessible when the device is unlocked
3. **Biometric gating** -- Optional Face ID/Touch ID requirement for sensitive operations

## expo-secure-store: The Foundation

```typescript
export function getBasicSecureStoreConfig(): SecureStore.SecureStoreOptions {
  return {
    authenticationPrompt: 'Allow app to access secure storage',
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  };
}

export function getBiometricsSecureStoreConfig(): SecureStore.SecureStoreOptions {
  return {
    ...getBasicSecureStoreConfig(),
    requireAuthentication: true,  // Triggers biometric prompt on every access
  };
}
```

`WHEN_UNLOCKED_THIS_DEVICE_ONLY` means data is only accessible when the device is unlocked, never syncs to iCloud, and is deleted if the device is reset.

## Versioned Mnemonic Storage

How do you migrate encrypted data when your storage format changes?

```typescript
export function mnemonicStore(fingerprint: string): MnemonicStore {
  return {
    async getMnemonic(): Promise<MnemonicData | null> {
      // Search newest version first, migrate if found in older version
      const v2Data = await tryGetV2Mnemonic(fingerprint);
      if (v2Data) return v2Data;

      const v1Data = await tryGetV1Mnemonic(fingerprint);
      if (v1Data) {
        await this.setMnemonic(v1Data);  // Migrate to V2
        await deleteV1Keys(fingerprint);
        return v1Data;
      }

      return null;
    },

    async deleteMnemonic(): Promise<void> {
      // Purge ALL version keys to ensure complete deletion
      await Promise.all([
        SecureStore.deleteItemAsync(getV1MnemonicKey(fingerprint)),
        SecureStore.deleteItemAsync(getV1PassphraseKey(fingerprint)),
        SecureStore.deleteItemAsync(getV2MnemonicKey(fingerprint)),
        SecureStore.deleteItemAsync(getV2PassphraseKey(fingerprint)),
      ]);
    },
  };
}
```

## Biometric Authentication

For sensitive operations, we require biometric authentication:

```typescript
export function useAuthentication(): UseAuthenticationResult {
  async function callIfEnrolled<T>(callback: () => T): Promise<T | undefined> {
    const securityLevel = await LocalAuthentication.getEnrolledLevelAsync();

    if (securityLevel === LocalAuthentication.SecurityLevel.NONE) {
      displayToast({ title: 'No device security configured', type: 'error' });
      return undefined;
    }

    return callback();
  }

  return { authenticate, callIfEnrolled };
}
```

The `callIfEnrolled` wrapper is important: without it, `authenticateAsync` **silently succeeds** on devices with no security configured -- which would defeat the entire purpose.

Testing secure storage was one of the more humbling experiences on this project. Early on, we discovered that `authenticateAsync` silently succeeds on devices and simulators with no biometric enrolment. That's the kind of bug that passes every test in development -- where you're using a simulator with Face ID enrolled -- but fails catastrophically in production for users who haven't set up biometrics. The `callIfEnrolled` wrapper above exists because of that discovery.

The versioned migration logic also caused a few headaches. During development of the V2 storage format, we had a bug where the migration would succeed but the old V1 keys wouldn't get deleted. This meant users had their mnemonic stored in two places instead of one -- doubling the attack surface for no reason. We caught it in code review, not in testing, which was a good reminder that secure storage bugs are often logic bugs, not runtime errors. The code runs fine; it just leaves sensitive data lying around.

We also learned the hard way that you absolutely must test on real devices. The iOS Simulator doesn't have a secure enclave, so `expo-secure-store` falls back to different behaviour. We had a bug that only manifested on physical devices where the Keychain access prompt appeared at an unexpected time, interrupting a transaction flow. Simulators never showed it.

## Lessons Learned

1. **Version your storage keys** -- You will need to migrate. Plan for it from day one.
2. **Check enrollment before authenticating** -- `authenticateAsync` succeeds on devices with no security. Always check `getEnrolledLevelAsync` first.
3. **Delete thoroughly** -- When a user removes a wallet, delete ALL possible key versions.
4. **Respect user choice** -- Not everyone can use biometrics. Provide secure alternatives.
5. **Test on real devices** -- Simulators don't have secure enclaves.

## Related PRs

| PR | What | Stats |
|---|---|---|
| [#4243](https://github.com/leather-io/extension/pull/4243) | Secret key redesign + mnemonic validation (extension) | +739/-436, 27 files |
