---
title: "When Every Bottom Sheet Is Invisible: Maestro, iOS, and Accessibility"
description: "Why our Maestro E2E tests passed on Android and failed on iOS — and how one accessibility prop on a bottom sheet broke (and then fixed) both testing and VoiceOver."
pubDate: 2026-06-15
tags: ["react-native", "mobile", "testing", "accessibility", "leather"]
draft: true
---

Leather's mobile wallet is built out of bottom sheets. Send is a sheet. Receive is a sheet. Swap, ramp, add-account, add-wallet, the browser approver, the version guard — all sheets. The global sheet provider holds ten of them:

```tsx
sendSheetRef: SendSheetRef;
receiveSheetRef: ReceiveSheetRef;
swapSheetRef: SwapSheetRef;
rampSheetRef: RampSheetRef;
browserSheetRef: SheetRef;
addAccountSheetRef: SheetRef;
addWalletSheetRef: SheetRef;
versionGuardSheetRef: SheetRef;
descriptionSheetRef: DescriptionSheetRef;
approverSheetRef: ApproverSheetRef;
```

It's a nice pattern for a wallet. Sheets keep you on the home screen, they animate in over your balances, and they compose well. Then I sat down to write end-to-end tests with [Maestro](https://maestro.mobile.dev/), and the entire model fell apart on one platform.

## The symptom

The tests passed on Android. On iOS, every single selector inside a sheet failed. Not "flaky" — failed, every time. Maestro couldn't find a button by `testID`, couldn't find a label by text, couldn't find anything. The sheet was right there on screen, visibly rendered, and the test runner was blind to its contents.

That asymmetry is the clue. The same flow, the same `testID`s, the same app — green on Android, impossible on iOS.

## The root cause

Maestro drives iOS through XCUITest, and XCUITest reads the accessibility tree. So I started inspecting what iOS actually exposed for an open sheet, and the answer was: one element. The whole sheet showed up as a single opaque node labelled "Bottom Sheet". Nothing inside it existed as far as the accessibility tree was concerned.

The cause is in [`@gorhom/bottom-sheet`](https://github.com/gorhom/react-native-bottom-sheet) (we're on `5.2.7`). Since v4.6.0 the library sets `accessible={true}` and `accessibilityRole="adjustable"` on the sheet container by default. On iOS, when a parent view is marked `accessible={true}`, UIKit treats it as a single accessibility element and **collapses all of its children into that one element**. VoiceOver — and therefore XCUITest, and therefore Maestro — sees the container and nothing beneath it.

Android doesn't do this. TalkBack handles `accessible={true}` differently and still surfaces the children, which is why the exact same tests were green there. This wasn't a Maestro bug or a flake. It was the accessibility contract differing between the two platforms.

## The fix

One line, in our shared sheet wrapper:

```tsx
// packages/ui/src/components/sheet/sheet.native.tsx
return (
  <BottomSheetModal
    accessible={false}
    onChange={handleChange}
    backdropComponent={SheetNativeBackdrop}
    // ...
  />
);
```

Setting `accessible={false}` on the container tells iOS to stop grouping. The children become individual accessibility elements again, XCUITest can see them, and the `testID` selectors inside sheets start resolving.

The part I didn't expect: this is also a real accessibility win. Before the change, a VoiceOver user on iOS couldn't navigate the individual controls inside any of our sheets either — the same collapse that hid elements from the test runner hid them from actual assistive tech. Fixing the tests fixed the app. That's the rare bug where the test harness was telling the truth about a user-facing defect.

## The other scars

The accessibility collapse was the headline, but sheets fought the test suite in smaller ways too.

**Sheets have no back button.** You dismiss them with a downward swipe, so the tests have to do the same:

```yaml
# Close send sheet (no back button on sheets, swipe to dismiss)
- swipe:
    start: 50%, 15%
    end: 50%, 85%
- assertVisible:
    id: 'homePrivacyButton'
```

**iOS concatenates labels.** Even with the accessibility fix, iOS renders a settings cell's title and caption as a single label. A network row that's a title ("Testnet4") plus a status caption ("Disabled") comes through as one string, so exact-text taps miss. The flows use regex instead:

```yaml
- tapOn: 'Testnet4.*Disabled'
# ...and switching back, Mainnet is now the "Disabled" one
- tapOn: 'Mainnet.*Disabled'
```

**Consecutive sheets race.** Open a sheet while the previous one is still animating out and `present()` silently no-ops. The approver sheet carries a manual guard for exactly this:

```tsx
// if the sheet is still somewhat open, wait a little bit before opening it up again
if (animatedIndex.value !== sheetClosedIndex) {
  setTimeout(() => {
    ref.current?.present();
  }, 500);
} else {
  ref.current?.present();
}
```

That 500ms delay is a workaround in the app code, not the tests — but it's the same underlying problem. A sheet's "is it actually ready" state lives in a Reanimated value the test runner can't query, so timing has to be papered over on both sides.

**Text input inside sheets is flaky on iOS.** This one is upstream. Maestro's `eraseText` and the `longPressOn` + "Select All" pattern are unreliable for sheet-hosted inputs on iOS, something the team left a note about in an older flow:

```yaml
# Doing this because iOS input is a bit flaky on maestro,
# It's a known issue and they are on it.
# https://maestro.mobile.dev/api-reference/commands/erasetext
```

## The pragmatic strategy

Once you accept that sheets are hostile to E2E on iOS, the answer isn't to force one approach everywhere. It's to test the sheet behaviour where it's reliable and route around it where it isn't.

So the suite splits by platform intent. Android keeps dedicated flows that exercise sheets directly — create a wallet through the add-wallet sheet, restore a wallet through the restore sheet:

```yaml
# maestro/flows/android/010-create-wallet-sheet.yaml
- tapOn:
    id: 'homeCreateWalletCard'
- tapOn: 'Create new wallet'
- tapOn:
    id: 'walletCreationTapToReveal'
- tapOn:
    id: 'walletCreationBackedUpButton'
- tapOn: 'Skip for now'
- tapOn: 'Proceed'
- assertVisible:
    id: 'homeAccountCard-0'
```

The cross-platform full suite, which has to be reliable on both, sets up its wallet state through a developer console instead of driving the sheets — then goes on to test everything that lives outside or downstream of a sheet. Shared `runFlow` subflows keep the setup DRY across both worlds.

The result: the flows that the accessibility bug had made impossible on iOS — wallet creation, settings navigation, send/receive verification, network switching, wallet removal — all run again, and the sheets that can be tested directly still are, on Android.

## The takeaway

Overusing bottom sheets is a code smell, and E2E testing is what surfaced it. The same property that made our sheets invisible to Maestro on iOS made them invisible to VoiceOver users on iOS. A UI pattern that's awkward to test is often a UI pattern that's awkward to use with assistive technology — they're frequently the same defect viewed from two angles. One `accessible={false}` fixed the test runner and the screen reader at once, which is the most satisfying kind of one-line change.
