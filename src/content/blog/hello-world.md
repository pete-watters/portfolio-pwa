---
title: "Hello World"
description: "Welcome to my new blog, rebuilt with Astro and deployed on Cloudflare Pages."
pubDate: 2026-02-11
tags: ["astro", "cloudflare", "devops"]
---

Welcome to the new blog! This site has been rebuilt from the ground up using [Astro](https://astro.build) and deployed to [Cloudflare Pages](https://pages.cloudflare.com) via GitHub Actions CI/CD.

## What changed

The previous version was a React 16 Create React App hosted on Firebase. It served its purpose, but the tooling had aged out — CRA is no longer maintained, and the build was broken on modern Node.js.

The new stack:

- **Astro 5** — static site generation with zero client-side JS by default
- **Content collections** — type-safe markdown blog with Zod schema validation
- **@vite-pwa/astro** — automatic service worker and web manifest generation
- **Vitest + Playwright** — unit and end-to-end testing
- **GitHub Actions** — CI/CD with parallel lint, typecheck, test, and build jobs
- **Cloudflare Pages** — fast edge hosting with automatic deployments

## Why Astro

Astro ships zero JavaScript by default. For a portfolio site that's mostly static content, this means faster page loads and better Lighthouse scores. When interactivity is needed (like the about page tabs or image carousel), vanilla JS in `<script>` tags keeps things simple.

## What's next

More posts about the migration process, DevOps patterns, and whatever else I find interesting. Stay tuned.
