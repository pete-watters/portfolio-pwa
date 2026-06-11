---
title: "SimplyFPL — A Real-Time Fantasy Premier League Product, Built Solo"
company: "SimplyFPL (independent)"
project: "SimplyFPL"
role: "Founder & Sole Engineer"
period: "2025 — Present"
stat: "One-person company: real-time, edge-served, crash-proof — built by directing AI across the whole stack"
headline: "A real-time Fantasy Premier League product, built solo."
subtitle: "SimplyFPL is a faster, calmer, never-crashes alternative to the incumbent live-rank trackers. Edge-served from Cloudflare, tested like a team product, and built by steering AI across architecture, infra, design, and ops — with me reviewing and signing off every commit."
confidentiality: "SimplyFPL is my own independent product. All architecture decisions, code, screenshots, and technical details here are my own work."
repo: "https://github.com/pete-watters/simply-fpl"
tech:
  - Next.js 15
  - TypeScript
  - Tamagui
  - Cloudflare Workers
  - Durable Objects
  - Cloudflare KV
  - Supabase
  - Stripe
  - Turborepo
  - Playwright
  - Claude Code
  - AI-driven development
order: 0
outcomeText: "A real-time, edge-served product with a reliability model the incumbents lack — and a working model for how one engineer, directing AI deliberately, can ship and own team-scale work."
outcomeStats:
  - number: "1"
    label: "Person — architecture, edge infra, design system, tests, and ops"
  - number: "60s"
    label: "Live-rank refresh, fanned out to every client from one edge compute"
  - number: "100%"
    label: "FPL traffic served through the edge — client load decoupled from upstream"
  - number: "3"
    label: "Redesign directions explored in a structured AI-assisted design audit"
draft: false
---

## Overview

Fantasy Premier League has around 11 million managers, and on a big gameweek they all want the same thing at the same instant: their **live rank**, right now. The established tools deliver the data but buckle under load and bury it in clutter — the peak moment of excitement is exactly when the site falls over.

SimplyFPL is my answer, built as a **one-person company**: be the fast, quiet, *never-crashes* alternative. Latest data first, nothing in the way, rock-solid precisely when everyone piles in at 5pm on a Saturday.

The genuinely interesting part isn't fetching FPL data. It's the operating question behind it: **how does a single engineer ship a real-time, edge-served product with a team's reliability — and keep moving fast?** My answer was to build the infrastructure properly *and* to run an AI-driven development workflow where I direct the model, set the standards, and own every commit.

![SimplyFPL live dashboard in production](/img/work/simplyfpl/before-web-dashboard.png)

## The problem

Three constraints at once:

- **Reliability at the worst possible time.** Live data is interesting only during matches, when traffic spikes hardest. A naïve design — every browser polling FPL every 60 seconds — is exactly how you crash and get rate-limited.
- **Clarity under density.** Managers want a lot of numbers, fast, without a wall of clutter. The brand is "cleaner than the incumbent," so every element has to earn its place.
- **A team's surface area, a solo budget.** Web now, native later, plus auth, payments, a price predictor, cohort analytics — the scope of a small team, the staffing of one person.

## What I built

### The architecture — a clean monorepo, edge-first

A Turborepo / pnpm monorepo organised in strict clean-architecture layers, so a solo codebase stays legible and the same logic powers web today and native tomorrow:

- **Domain logic** — pure TypeScript: the FPL client, live-rank and price-change algorithms. No React, no platform code, fully unit-tested.
- **Application** — React-aware business logic and hooks; the heart of the product, where coverage matters most.
- **Presentation** — one cross-platform component layer in Tamagui, and a thin Next.js shell that only composes and routes.
- **Infrastructure** — the Cloudflare Worker that fronts every FPL call.

Boundaries are enforced, not aspirational: types carry no logic, UI carries no business logic, apps depend on packages and never the reverse.

### The hard part — real-time data at the edge

SimplyFPL inverts the naïve polling model:

- **Every** FPL request goes through a Cloudflare Worker with KV caching — never direct from the client. One upstream read fans out to thousands of users.
- A **Durable Object** owns the live gameweek: it computes the live snapshot once and **fans it out over WebSockets** to every connected client on a fixed cadence, with a graceful polling fallback when sockets aren't available.
- A **cohort engine** aggregates ownership and effective-ownership by rank tier (top 1k / 10k / 100k / overall), turning raw picks into the "what are my rivals doing" insight that makes the product sticky.
- A **price-change predictor** runs on the same edge infrastructure.

The result: load is decoupled from the number of users, the expensive work happens once, and the failure mode that defines the competition simply doesn't exist here.

### The gameweek simulator

The killer constraint of building anything live for football: **the matches only happen when they happen.** You can't test live-rank behaviour, fan-out, or intra-gameweek edge cases on a Tuesday in the off-season.

So I built a **gameweek simulator** into the worker — a replay engine that re-runs a real gameweek's data through the live pipeline deterministically. It lets me develop and debug live features **on demand**, reproduce a specific minute of a specific gameweek to chase a bug, and run a full match-day's worth of state transitions in seconds, in CI, with no live dependency. It's paired with a **season-archive** routine that captures the complete season before FPL wipes the prior year each August — preserving real data to simulate against indefinitely. For a solo team, that's the difference between "wait until Saturday to find out" and "reproduce it now."

### The AI-driven workflow — and why I still own every commit

SimplyFPL is a deliberate experiment in **AI-driven product development**: how far one engineer can take a real product by treating AI as a force multiplier across the *entire* stack, while keeping full ownership of the decisions and the code.

The leverage is in the setup, not in "AI writes code":

- I work primarily in **Claude Code**, Anthropic's agentic CLI, as my development environment — pairing on architecture, infra, tests, and refactors across the monorepo.
- I steer it with a committed **`CLAUDE.md`** — a written "constitution" for the repo that encodes the clean-architecture boundaries, naming and code-style rules, testing requirements, branching/release process, and hard guardrails. The model works *within my standards* instead of inventing its own, and every session and automated agent inherits the same rules.
- I used Claude Code's **frontend-design plugin** to run a structured design audit and generate three fully-realised redesign directions as working prototypes — compressing days of exploration into an afternoon (more below).
- The work is driven by a **populated issue board and a set of RFCs** — live fan-out, the rivals view, the cohort engine, the gameweek simulator — so the AI is always working against a clear, written spec rather than vibes.
- Repetitive and time-bound work runs as **scheduled agents**: season capture, gameweek simulations, and PR triage execute on a cadence without me babysitting them.

The crucial part for me: **I review and sign off on every change, and every commit is authored by me.** The AI is the throughput; the architecture, the trade-offs, the product calls, and the quality bar are mine. That ownership is the point — it's what turns "AI wrote some code" into "I shipped and stand behind this product."

### Reliability engineering

Robustness is a feature, so it's tested like one:

- **BDD throughout** — Gherkin specs with executable step definitions describe user-observable behaviour; every new feature ships with at least one scenario, with all network mocked so no test touches live FPL.
- **End-to-end + visual regression** — Playwright drives real routes. After a styling regression once took production down, **visual-regression and page-error assertions became mandatory release gates**: a blank screen now fails CI instead of reaching users.
- **Disciplined delivery** — GitFlow, conventional commits, pre-commit/pre-push hooks, and CI checks (format, lint, typecheck, tests, deploy) on every change.

## Designing it

The visual identity is a Linear-inspired, information-first design system — warm-neutral palette, monospace for every number to signal "this is data," borders not shadows, restrained motion — built once in Tamagui and shared across platforms.

Most recently I ran a structured **design audit** (UX, hierarchy, and WCAG-AA contrast) and used the AI frontend workflow to explore three redesign directions in parallel — each a working prototype with both a pre-team landing and a consolidated, above-the-fold dashboard. The goal: make the live rank unmissable and bring rank, key stats, and the pitch together, even on mobile.

<figure>
  <img src="/img/work/simplyfpl/before-web-landing.png" alt="SimplyFPL home before the redesign" loading="lazy" />
  <figcaption>Before — the production landing: functional, but the live rank is buried and the page reads like a tool, not a product.</figcaption>
</figure>

<figure>
  <img src="/img/work/simplyfpl/after-C-web-dashboard.png" alt="Redesigned SimplyFPL dashboard, Vibrant Stadium direction" loading="lazy" />
  <figcaption>After — the chosen "Vibrant Stadium" direction: a floodlit hero with a live count-up rank, club-coloured kits, and the whole picture consolidated above the fold.</figcaption>
</figure>

<figure>
  <img src="/img/work/simplyfpl/after-C-mobile-dashboard.png" alt="Redesigned SimplyFPL dashboard on mobile" loading="lazy" />
  <figcaption>The same dashboard on mobile — rank, stats, and pitch in one dense, scannable view.</figcaption>
</figure>

_[Optional: drop in the after-A / after-B variants to show the full exploration, and any extra shots once available.]_

## Outcome

A real-time, edge-served product with a reliability model the incumbents lack, a clean cross-platform codebase one person can keep moving fast in, and tooling — the simulator and season archive — that removes the off-season as a blocker.

More than that, it's a working answer to a question I care about: with the right setup — a written constitution for the codebase, a clear issue board, and AI as a force multiplier I direct and review — **one engineer can ship and fully own work at the scale of a team.**

**Next:** mobile app via Expo, the Pro tier, and a public launch before the 2026/27 season kicks off.
