---
title: "Migrating My PWA Portfolio from React + Firebase to Astro + Cloudflare Pages"
description: "How I rebuilt my lightweight Progressive Web App portfolio — from a broken CRA build to a modern Astro static site with CI/CD, testing, and edge hosting."
pubDate: 2026-02-11
tags: ["astro", "cloudflare", "devops", "pwa", "github-actions"]
---

This site has been a Progressive Web App since day one. The original README said it best:

> The app is a PWA designed to be as simple as possible. The UI is built using HTML, CSS and some React. The project is designed to be as light and performant as possible — using basic CSS and semantic HTML to achieve an elegant style.

That philosophy hasn't changed. What has changed is everything underneath.

## The original stack

The first version of [petewatters.ie](https://petewatters.ie) was built with:

- **React 16** via Create React App
- **Firebase Hosting** with Cloud Functions (proxying my Medium RSS feed for the blog)
- **FontAwesome** for icons
- **Enzyme** snapshot tests
- A hand-written `serviceWorker.js` and `manifest.json` for PWA support

It was lightweight by design and scored 100% on Lighthouse — something I was proud enough of to put on the Work page.

## What broke

Create React App was deprecated. The `react-scripts` build stopped working on modern Node.js. The Firebase Cloud Function for fetching my Medium feed was pinned to Node 8. Dependabot kept opening PRs for vulnerabilities in `/functions` dependencies that would never get merged.

The site still worked in production (it was already built and deployed), but I couldn't make changes or redeploy. Time for a rebuild.

## The new stack

The guiding principle was the same — keep it as simple and performant as possible — but with modern tooling and a proper DevOps pipeline:

| Concern | Before | After |
|---|---|---|
| Framework | React 16 + CRA | Astro 5 (static output) |
| Hosting | Firebase Hosting | Cloudflare Pages |
| Blog | Medium RSS via Firebase Function | Markdown content collections |
| Icons | FontAwesome React components | Inline SVGs |
| PWA | Hand-written service worker | @vite-pwa/astro (auto-generated) |
| Testing | Enzyme snapshots | Vitest + Playwright |
| CI/CD | Manual `firebase deploy` | GitHub Actions |

### Astro

[Astro](https://astro.build) ships zero JavaScript by default. For a portfolio site that's mostly static content, that's exactly what you want. The entire site is pre-rendered at build time to plain HTML and CSS.

When interactivity is needed — the about page tabs, the image carousel — it's just vanilla JS in `<script>` tags. No framework runtime, no hydration, no bundle overhead.

### Content collections

Instead of fetching blog posts from Medium at runtime via a Firebase Cloud Function, posts are now markdown files in `src/content/blog/`. Astro validates the frontmatter against a [Zod](https://zod.dev) schema at build time:

```typescript
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});
```

Type-safe, no runtime dependencies, and I own my content.

### PWA support

The original site had a hand-written service worker and a `manifest.json` in the public folder. The new site uses [`@vite-pwa/astro`](https://github.com/vite-pwa/astro) which generates both automatically from config in `astro.config.mjs`. Same PWA capabilities, zero maintenance.

### Testing

The old Enzyme snapshot tests were brittle — they'd break on any markup change and the snapshots were hard to review. The new setup:

- **Vitest** for unit tests (constants validation, etc.)
- **Playwright** for end-to-end tests across Chromium, Firefox, and WebKit

The Playwright tests cover real user flows: navigating between pages, switching about page tabs, deep-linking via hash, verifying the blog renders markdown, and checking that PWA assets (manifest, service worker) are served correctly.

### CI/CD

The old deploy was `firebase deploy` from my laptop. Now there are three GitHub Actions workflows:

1. **Code Checks** (on every push) — runs lint, typecheck, unit tests, and build in parallel
2. **Integration Tests** (on PR) — runs Playwright across 2 shards with report merging
3. **Deploy** (on merge to master) — builds and uploads to Cloudflare Pages via `wrangler`

No manual steps. Push code, CI validates it, merge deploys it.

### Cloudflare Pages

Firebase Hosting worked fine, but Cloudflare Pages gives me edge hosting with zero config. The deploy is a simple `wrangler pages deploy dist` — just upload a static folder. No Firebase project, no Cloud Functions billing, no Node 8 runtime constraints.

## What stayed the same

The design philosophy. Semantic HTML, simple CSS, minimal JavaScript. The site still loads fast, still works offline as a PWA, and still scores well on Lighthouse. The fonts are the same. The layout is the same. The content is the same.

The difference is that now I can actually change it.

## The numbers

- **99 files changed** in the migration commit
- **19,163 lines removed** (React, Firebase, Enzyme, CRA config)
- **14,533 lines added** (Astro, Playwright, GitHub Actions, content)
- **5 pages** generated at build time
- **25 Playwright tests** passing across 3 browsers
- **Build time**: under 2 seconds
