---
title: "Building Coderunner: A Trading Automation Tool at Cryptowatch"
description: "Taking over a prototype and shipping an MVP for custom Python trading scripts at Kraken's Cryptowatch"
pubDate: 2022-03-10
tags: ["code"]
draft: false
---

At Cryptowatch (owned by Kraken), we had power users who wanted more than the standard order types exchanges offered. Things like "cancel all my orders on this pair" or trailing take-profit orders -- synthetic order types that didn't exist natively on most exchanges. Coderunner was the answer: let users write and schedule custom Python scripts that executed trades through the Cryptowatch trading API.

A single developer had built an initial prototype using a "jailed" Python instance that could safely run custom code within the browser. When he left, I took over the frontend -- rearchitecting the UI and, alongside a backend engineer, taking it to MVP.

## The Team

For eight months I worked directly with one backend engineer (managing the Python scripts via Django) and the automations product owner. We were part of the broader "Trading and Automations" squad, but Coderunner was my domain on the frontend. The key stakeholders beyond our immediate team were Artur (Cryptowatch's creator) and Jesse Powell (then CEO of Kraken), both of whom had a keen interest in the project.

I was pulled off Coderunner for three months to work on the main Cockpit product. When I came back, we added a designer to the team -- someone I'd referred -- and that's when the UI really started to come together.

## What We Were Solving

The core problems were straightforward to describe but tricky to build well:

- Give users a code editor to write or customise Python trading scripts
- Let them save scripts with reusable parameters
- Schedule scripts to run at intervals (essentially a crontab for trades)
- Show execution logs so users could see what their scripts did

The goal was a polished MVP, fast. I planned the frontend architecture around making it quick to iterate -- clean code, portable state, quick to update when requirements shifted.

## Architecture Decisions

The stack was standard Cryptowatch: React, TypeScript, and PostCSS. But I made a deliberate choice on state management. While the rest of Cryptowatch used Redux, I went with React's `useReducer` for Coderunner. This kept the feature more portable and self-contained -- important for a product that was still finding its shape.

The architecture followed a container/component pattern with composition over inheritance. The main Coderunner container composed sub-containers for scripts and logs, managing its own state plus the log state. Scripts maintained their own state independently. Custom hooks handled data fetching and polling over REST (WebSocket wasn't available for our endpoints). Midway through the project, GraphQL started gaining traction at the company -- it would have been a good improvement as a gateway to the backend, but we didn't get there.

## The Tricky Bits

**Dynamic form generation** was the most interesting challenge. Each Python script had a schema defining its input fields. Basic fields like strings were straightforward, but domain-specific fields like `marketID` and `exchangeID` needed real UX thought.

Instead of showing users a raw market ID input, we built a market search field. Once they selected a market, we fetched their available funds on that pair and displayed the balance in the UI. The `amount` field was a custom numeric input with the asset slug overlaid (e.g. "ETH"), increment/decrement arrows, and proper handling of each currency's decimal precision.

We initially used JSON Forms for form generation, but the level of customisation we needed led to fighting the library more than using it. Early on, I decided to write our own form field generation code. This turned out to be the right call -- it kept things consistent with the broader Cryptowatch design system and let us contribute components back to the shared UI library.

**Simulated logs** were a small but satisfying UX touch. Most script executions completed almost instantly, which made the UI feel broken -- you'd click "Run" and nothing visibly happened before results appeared. I introduced simulated running logs that displayed briefly before transitioning to the real completed output. It gave users confidence that something had actually executed.

## Code Quality

AceEditor worked well as the embedded code editor. For testing, we used React Testing Library with Jest. I also prototyped a Cypress E2E testing setup as a side project, though the QA team preferred to build their own system. Error handling used React Error Boundaries reporting to Sentry, which was important given the variety of script errors users could trigger.

## The Redesigns

We went through three redesigns of the UI before landing on the final MVP. Requirements shifted, release dates came and went, and there were crossed wires between product, design and engineering -- partly because we hadn't documented requirements formally enough. It caused some tension, but nothing unusual for a prototype-stage product. As the company grew and the design system matured, the final version was something we were genuinely proud of.

## The Outcome

We completed the final MVP just before layoffs hit in November 2022. The web version proved the concept worked, and the decision was made to implement it in Cryptowatch's desktop app rather than ship the web version. I never got to see it in production, which was disappointing. But the work wasn't wasted -- by following clean engineering practices throughout, the components and patterns I'd built for Coderunner were contributed back to the main Cryptowatch codebase and used across the platform.

The biggest takeaway was about building for change. Three UI redesigns, shifting requirements, a three-month gap in the middle -- the architecture held up through all of it because we'd invested in portability (useReducer over Redux), composability (container/component pattern), and clean boundaries between concerns.
