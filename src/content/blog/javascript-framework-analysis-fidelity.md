---
title: "Evaluating JavaScript Frameworks at Fidelity Investments in 2014"
description: "A look back at evaluating Ember.js vs Backbone/Marionette for enterprise financial applications — and what it taught me about making technology decisions that stick."
pubDate: 2026-02-13
tags: ["code"]
draft: true
---

In 2014, I was a UX Developer at Fidelity Investments in Dublin — one of the world's largest financial services firms, managing over $11 trillion in assets. My role involved leading frontend development for the UX team, including acting as technical lead for an offshore development team across the UK and India.

One of the most impactful things I did during that year wasn't writing code. It was writing a document. A framework analysis that evaluated the JavaScript ecosystem and recommended a path forward for how the UX team should build complex browser-based applications.

## The Problem

By 2014, the jQuery-driven approach to building complex browser applications was showing its age. jQuery had been revolutionary — it made DOM manipulation bearable and smoothed over browser inconsistencies that would otherwise drive you mad. But it also made it very easy to end up with unmaintainable spaghetti code. As application complexity grew, the UX team needed a framework that could impose structure and make codebases sustainable across teams and time.

The question was simple: which one?

## The Contenders

In 2014, the JavaScript framework landscape was dominated by three options: Angular.js, Ember.js, and Backbone.js (typically paired with Marionette).

I ruled Angular out relatively early for the specific context of Fidelity's UX work. Angular was best suited for single-page, single-view applications. Our team built applications with multiple views and sub-views — complex, multi-screen workflows typical of financial software. Angular's architecture wasn't the right fit for that pattern.

That left Ember.js and Backbone with Marionette — two fundamentally different philosophies of how to build frontend applications.

## Opinionated vs Unopinionated

This was the core tension, and it's a tension that still exists in frontend development today (think Next.js vs a custom Vite setup).

**Backbone/Marionette** was lightweight and left all architectural decisions to the developer. File structure, state management, how views communicate — all of it was up to you. This offered maximum flexibility but demanded serious upfront planning. If multiple developers were working on the same project, you needed to establish and enforce conventions manually. Without discipline, codebases diverged.

**Ember.js** was the opposite. It was heavily opinionated with strong rules around structure and architecture. It decided your file structure, your naming conventions, your routing patterns. The learning curve was steeper — it took real time before you could get a simple application up and running. But once you were productive, you were very productive. The conventions meant that any Ember developer could pick up any Ember project and immediately understand how it was organised.

## The Evaluation Framework

I structured the analysis around criteria from Addy Osmani (then a frontend engineer at Google, known for his TodoMVC project) and added a couple of my own:

- What is the framework really capable of?
- Has it been proved in production?
- Is it mature?
- Is it flexible or opinionated?
- Does it have comprehensive documentation?
- What's the total size, factoring in minification and gzip?
- What's the community like?
- How steep is the learning curve for someone new?
- How quickly can applications be developed in a maintainable way across teams?

Those last two were the ones I added, and they turned out to be the most important for our context. At Fidelity, we weren't building a side project. We were building financial software that would be maintained by rotating teams of developers, including offshore engineers I was training. The framework needed to make the right thing easy and the wrong thing hard.

## What I Found

Backbone had the larger community and more production deployments — Groupon, Foursquare, and others had been running Backbone apps for years. Its API was stable and well-documented. But it required writing a lot of boilerplate code. Every project needed its own architectural decisions, and those decisions had to be communicated and enforced across teams.

Ember was younger — its 1.0 release had only landed in August 2013 after two years of development. The documentation was improving but patchy. The API had been intentionally unstable pre-1.0, which meant some examples and tutorials were already outdated. But the framework itself was remarkably productive once you got past the initial learning curve. Because it enforced conventions, distributed teams could work on the same codebase without the overhead of establishing shared standards from scratch.

The size comparison was instructive too. Ember was considerably larger than Backbone, but that was misleading — Ember included everything you might need, while Backbone required Marionette plus additional plugins to offer comparable functionality, which closed the gap.

## The Recommendation

For the UX team at Fidelity, I recommended Ember.js. The reasoning came down to team dynamics and maintainability:

We had developers across Dublin, the UK, and India. I was flying between offices to provide training and technical direction. In that context, a framework that imposed consistent structure was worth more than one that offered maximum flexibility. The steeper learning curve was a reasonable trade-off against the ongoing cost of architectural divergence across distributed teams.

I also recommended Ember because of developer productivity. Once past the initial hump, Ember's conventions meant you could move fast without constantly making (and documenting) micro-decisions about how to organise code. For financial software where reliability matters, having the framework handle the boring structural decisions freed developers to focus on the business logic.

## What Happened Next

The framework analysis became a reference document for the UX team's technology choices. I went on to represent the engineering function during Enterprise Ireland's R&D accreditation process — a formal assessment of Fidelity's R&D activities in Ireland, where I acted as the technical expert throughout.

After Fidelity, I moved to Kontainers (an ocean freight startup founded by a Fidelity alumnus), where I used Ember.js to take the product from inception to production. Then to Rocksteady, where I rescued a legacy Ember.js application and shipped the first stable release in 7 months. The framework evaluation at Fidelity kicked off a period where Ember became my primary tool — I became the person teams brought in when they needed Ember expertise.

Eventually, React won the framework wars, and I made the transition around 2017 at Xapo. But the habits I built during the Ember years — strong conventions, opinionated architecture, consistent structure — carried over directly into how I approach React projects today.

## The Retrospective

Looking back from 2026, a few things stand out:

**The analysis was right for the context.** Ember was the correct choice for distributed enterprise teams in 2014. The conventions and enforced structure solved real problems around code consistency and onboarding. In a different context — a small startup with a single co-located team — Backbone's flexibility might have been the better call.

**Framework choice is mostly about people, not technology.** The technical capabilities of Ember and Backbone/Marionette were comparable. The difference was in how they affected team dynamics. An opinionated framework reduces the surface area for disagreement. In a distributed team, that's worth a lot.

**The skills transfer, the frameworks don't.** I haven't written Ember in years, but the muscle memory of thinking about conventions, maintainability, and team-scale architecture is something I use every day. The specific syntax doesn't matter. The habits do.

**Write things down.** That framework analysis document was one of the most valuable things I produced at Fidelity — not because the conclusion was surprising, but because the structured evaluation gave the team confidence in the decision. When you're making technology choices that will affect a team for years, putting the reasoning in writing forces clarity and creates a reference point for future decisions.
