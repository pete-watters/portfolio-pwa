---
title: "Building a Multi-Protocol NFT Gallery for a Bitcoin Wallet"
description: "Supporting Ordinal Inscriptions, SIP-9 NFTs, Bitcoin Stamps, and BNS Names in a single collectibles experience"
pubDate: 2025-11-15
tags: ["code"]
draft: true
---

Bitcoin and Stacks have multiple, completely different standards for digital collectibles. Ordinal Inscriptions live on Bitcoin's base layer. SIP-9 NFTs are smart contract tokens on Stacks. Bitcoin Stamps use a different encoding method entirely. BNS Names are Stacks' naming system. Each has different APIs, different metadata formats, and different rendering requirements.

We needed to build a gallery that treats them all as first-class citizens -- displaying images, audio, video, SVGs, and even 3D models -- while keeping the codebase maintainable. I picked up this work as part of the mobile app build-out, and it became one of the biggest feature areas I worked on.

<!-- ADD: Your background with NFTs/collectibles in crypto. Had you worked with ordinals before? What was your mental model going in? -->

## The Approach

### Protocol-Specific Data Layers

Rather than trying to normalise everything into one shape early, we kept each protocol's data layer separate. Each has its own service, its own query hooks, and its own type definitions. This meant adding Stamps support ([#1689](https://github.com/leather-io/mono/pull/1689)) didn't touch the Ordinals code, and integrating the Gamma API for richer SIP-9 metadata ([#1635](https://github.com/leather-io/mono/pull/1635)) didn't affect anything else.

The key insight was that normalisation should happen at the UI layer, not the data layer. Each protocol maps to a shared `CollectibleView` type that the gallery components consume.

<!-- ADD: How did you arrive at this insight? Was there a version where you tried normalizing early and it got messy? -->

### Multi-Source Data Merging

For SIP-9 NFTs, we integrated two separate APIs -- Hiro and Gamma -- and merged their data to get the best coverage. The team already had the Hiro integration; I added the Gamma layer and the merge strategy. Gamma provides richer metadata (collection info, rarity), while Hiro has broader token coverage. The merge strategy prioritises Gamma data when available, falling back to Hiro.

### Rich Media Handling

Ordinal inscriptions can be anything -- images, audio, video, SVG, HTML, even 3D GLTF models. Each format needs different rendering:

- **Images**: Standard `<Image>` with IPFS gateway resolution and fallbacks
- **Audio**: Audio player with waveform display
- **Video**: Video player with auto-generated thumbnail previews ([#1756](https://github.com/leather-io/mono/pull/1756)) -- the app plays the video briefly and captures a frame
- **SVG**: Rendered inline with sandboxing
- **3D Models**: GLTF viewer component

### Video Thumbnails: A Fun Problem

The video thumbnail generation ([#1756](https://github.com/leather-io/mono/pull/1756)) was a satisfying solve. Rather than requiring a separate thumbnail service, the approach uses client-side frame capture that plays the video momentarily and screenshots it. The entire solution was a single file change (+213/-111 lines). The PR has a [video demo](https://github.com/leather-io/mono/pull/1756) showing it in action.

<!-- ADD: What was the alternative you considered? Server-side thumbnail generation? Why did client-side win? Any edge cases with different video formats? -->

### Detail Pages Per Protocol

We split collectible detail views by protocol ([#1642](https://github.com/leather-io/mono/pull/1642), [#1636](https://github.com/leather-io/mono/pull/1636)) because each protocol has different metadata worth displaying. An Ordinal inscription shows its inscription number, content type, and sat rarity. A SIP-9 NFT shows its contract, collection, and traits. Trying to force these into one detail page would have been a mess.

## From Mobile to Extension

After building this for mobile (Sep-Nov 2025), I extracted the shared logic into `packages/features` ([#1981](https://github.com/leather-io/mono/pull/1981)) and worked on bringing it to the browser extension ([#1837](https://github.com/leather-io/mono/pull/1837), [#2067](https://github.com/leather-io/mono/pull/2067)). Other team members contributed to the extension integration too -- the queries and API layers that powered all of this were already in place thanks to earlier work by the team. The `CollectibleView` abstraction meant the same data logic powered both platforms, with only the rendering differing.

The "go live" moment was [#2067](https://github.com/leather-io/mono/pull/2067) -- shipping the new extension home tab with a Collectibles tab alongside Assets and Activity.

## The Result

The gallery handles four distinct blockchain protocols, multiple media formats, and two data sources, while the UI code stays clean because each protocol handles its own complexity behind a shared interface.

## Key PRs

| PR | What | Stats | Video? |
|---|---|---|---|
| [#1689](https://github.com/leather-io/mono/pull/1689) | Stamps service integration | +2,110/-1,133, 18 files | |
| [#1635](https://github.com/leather-io/mono/pull/1635) | Gamma API for SIP-9 | +409/-315, 15 files | |
| [#1636](https://github.com/leather-io/mono/pull/1636) | Collectibles UI overhaul | +537/-464, 30 files | |
| [#1642](https://github.com/leather-io/mono/pull/1642) | Audio, video, SVG formats | +817/-95, 27 files | |
| [#1756](https://github.com/leather-io/mono/pull/1756) | Video thumbnail generation | +213/-111, 1 file | YES |
| [#1981](https://github.com/leather-io/mono/pull/1981) | Shared CollectibleView utilities | +973/-111, 33 files | |
| [#1837](https://github.com/leather-io/mono/pull/1837) | Cross-platform activity + NFTs tab | +4,796/-1,678, 152 files | YES |
| [#2067](https://github.com/leather-io/mono/pull/2067) | Go live: extension home tab | +284/-99, 19 files | |
