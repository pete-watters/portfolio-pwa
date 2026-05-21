---
title: "Redesigning My Portfolio: From a React PWA to an Astro Sidebar"
description: "Three rebuilds of my personal site -- the tooling, the positioning, and the visual identity -- and the decision behind each one."
pubDate: 2026-05-21
tags: ["code", "design"]
draft: false
---

I've rebuilt this site three times now. Each rebuild changed the code, but looking back at the screenshots, the more interesting story is how the words changed. The way I described myself on the homepage tracked exactly where I was in my career -- and the first version got it badly wrong.

So this is a short history of my own portfolio: what each version looked like, what was broken about it, and what I'd tell my earlier self.

## 2021: a React PWA and a title that said nothing

![The 2021 portfolio: a Monoton wordmark, the tagline "Full stack developer, UX specialist and JavaScript enthusiast", and a row of social icons.](/img/blog/portfolio-evolution/01-old-pwa-2021.png)
*The first version, recovered from the Wayback Machine.*

The first version was a Create React App project backed by Firebase -- React 16, react-scripts, a FontAwesome icon set, and a project carousel that pulled its data over `axios`. It was a single-page app pretending to be a content site.

The headline tells you everything: *"Full stack developer, UX specialist and JavaScript enthusiast."* Three labels, none of them specific. That sentence describes about half the people at any meetup. If a recruiter searched for it, they'd find everyone and remember no one.

The tech had problems too. Create React App was already on its way out -- builds were slow, the toolchain was frozen, and everything rendered on the client, which is the wrong default for a site that's mostly text. Adding a blog post meant writing a component. I didn't add many blog posts.

## Moving to Astro

![The current homepage on Astro: structured hero, an open-source contributions section, and a writing list.](/img/blog/portfolio-evolution/02-astro-main.png)
*The Astro rebuild -- structured content, but a positioning that was still too broad.*

The second rebuild moved everything to Astro with static output, hosted on Cloudflare Pages. That solved the tooling problems in one go: content collections gave me real schemas for blog posts, case studies and the CV; Pagefind added search over the built output; and every pull request gets its own preview deployment, which is how I now review design changes before they go live.

It also let me do something I'm fond of -- fetching data at build time instead of in the browser. The contribution graph and the Solana NFT I use as an avatar are both pulled when the site builds, so they're real and current without costing the visitor a single runtime request.

The positioning improved, but only halfway. *"Senior Frontend Engineer -- Bitcoin, Web3 and high-stakes fintech"* is far better than "JavaScript enthusiast." It says what I do and where. But "Senior Frontend Engineer" is still a title thousands of people share, and the bio leaned on "15+ years of experience," which is the kind of number that reads as filler.

## Committing to the niche

The third rebuild started with the words, not the design.

I've spent the last decade working in crypto -- wallets, trading terminals, institutional custody interfaces -- across Bitcoin, Stacks, Solana and EVM chains. That's the specific thing. So the headline became **Web3 Engineer**, with "Web3" picked out in Bitcoin orange.

It's a narrower claim, and that's the point. A narrow, accurate title is easier to find, easier to remember, and easier to believe than a broad one. I dropped "Senior" from the headline entirely -- the work history carries that signal better than the adjective does.

Here's how the self-description changed across the three versions:

| Version | How I described myself |
|---|---|
| 2021 (CRA) | Full stack developer, UX specialist and JavaScript enthusiast |
| Astro v1 | Senior Frontend Engineer -- Bitcoin, Web3 and high-stakes fintech, 15+ years |
| Astro v2 | Web3 Engineer -- building for the web for nearly 20 years, the last decade in crypto |

The years line is also more honest. "Nearly 20 years, the last decade in crypto" maps to my actual history; "15+ years of experience" was a number I'd stopped thinking about.

## Giving it a visual identity

![Variant A: a dark full-bleed hero band with the headline, an NFT avatar, and an animated cluster of crypto coins.](/img/blog/portfolio-evolution/03-variant-a-band.png)
*Variant A -- the dark hero band I prototyped first.*

With the words settled, the design followed. I gave the hero a real identity: Space Grotesk for the display type, the Bitcoin-orange accent, a "plan, build, ship" rhythm line, and a small cluster of animated coins -- Bitcoin, Ethereum, Stacks and Solana -- that wobble and float using nothing but CSS keyframes. No animation library, no runtime cost.

My first layout was a dark full-bleed band that meets the header, with the lighter content flowing underneath. It's confident and it reads instantly. But I wanted to see one more option before committing.

## Band versus sidebar

![Variant B: a full-height dark sidebar holding the identity, navigation, coins and links, with light content on the right.](/img/blog/portfolio-evolution/04-variant-b-sidebar.png)
*Variant B -- the sidebar, and the version I landed on.*

The second layout moves the whole identity into a full-height dark sidebar: avatar, title, the rhythm line, navigation, the coin cluster, availability and links all live in the rail, and the work scrolls past on the right. It feels less like a document and more like a product -- which is the impression I want a design-engineer role to take away.

I built both as separate branches and opened a pull request for each, so I could compare the real thing on real devices instead of guessing from a mockup. The sidebar won, with two tradeoffs I went in with eyes open:

- On a phone, the rail stacks on top, so you scroll past a tall identity panel before reaching the work.
- The sidebar is homepage-only, so navigating to the blog or CV drops back to the standard header.

Neither was bad enough to outweigh how distinctive the layout is, and the comparison itself was the useful part.

## What I'd tell the 2021 version

- **Write the headline before the CSS.** Two of three rebuilds were really about fixing the words. The design was downstream of getting those right.
- **A narrow title beats a broad one.** "Web3 Engineer" is a smaller claim than "full stack developer," and it does far more work.
- **Pick a tool that matches the content.** A mostly-text site rendering on the client was the wrong call; static output was the right fix once I stopped defaulting to React for everything.
- **Compare in the browser, not in your head.** Shipping both layouts as preview deployments turned a debate into a decision.

One detail survived all three versions: the Monoton wordmark in the header. The title under it has changed three times, but the name has stayed put. That feels about right.
