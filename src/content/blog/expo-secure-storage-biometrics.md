---
title: "Secure Storage & Biometrics in a Crypto Wallet"
description: "How we protect seed phrases with expo-secure-store and expo-local-authentication"
pubDate: 2025-06-15
tags: ["code"]
draft: false
---

*This is Part 2 of the "Building a Crypto Wallet with Expo" series.*

<!-- ADD: As a seasoned crypto worker, you understand what happens when seed phrases leak better than most developers. How does that domain knowledge change how you approach the security implementation? -->

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

<!-- ADD: Any war stories about testing secure storage? Did you ever have a bug where the biometric prompt didn't trigger, or where data was lost on migration? -->

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
