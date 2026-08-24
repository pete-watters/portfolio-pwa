# petewatters.ie — Claude Instructions

Personal portfolio and blog for Pete Watters, a solo maintainer. Single Astro package, deployed to Cloudflare Pages. CONTRIBUTING.md is the authoritative source for branching rules, label taxonomy, and release process — defer to it when it conflicts with anything here.

## Scoped instruction files

This is the only instruction file in the repo. Never create a directory-scoped
`CLAUDE.md` or `AGENTS.md` — this is a single Astro package with one set of
rules, and a second file would only drift from this one. Anything narrower
belongs in the PR description or the issue.

`AGENTS.md` is a symlink to this file, so tools reading either name get the same
rules.

Standing rules that apply everywhere — attribution, commit authorship,
confidentiality, secrets, verification before "done" — are global and are
deliberately not repeated here.

## Stack

- **Package manager**: pnpm (`pnpm-lock.yaml` present). Do not switch to npm, yarn, or bun.
- **Framework**: Astro v5, `output: 'static'`
- **TypeScript**: strict (`astro/tsconfigs/strict`)
- **PWA**: `@vite-pwa/astro` — Workbox, `registerType: 'autoUpdate'`, manifest defined in `astro.config.mjs`
- **Search**: Pagefind — build runs `astro build && pnpm dlx pagefind --site dist`
- **Styling**: plain CSS in `src/styles/global.css`. No CSS framework. Do not add one without asking.
- **Prose linting**: Vale (`.vale.ini`) — runs write-good, alex, and a custom AISpeak style on `src/content/blog/*.md` to catch AI-sounding writing. Keep prose human; the site is interview-facing.
- **Hosting**: Cloudflare Pages — `main` → production (petewatters.ie), `dev` → staging (dev.portfolio.pages.dev), PRs → ephemeral preview (`<branch>.portfolio.pages.dev`)
- **CI**: GitHub Actions (`.github/workflows/`)

## Project structure

Single Astro package, not a monorepo.

```
src/
  components/       Astro components
  content/
    config.ts       Content collection schemas
    blog/           Blog posts (markdown)
    cv/             CV variants (markdown)
    work/           Case study prose (markdown)
  layouts/          Astro layouts (BaseLayout, CvLayout, etc.)
  pages/            Routes (/, /blog, /cv, ...)
  styles/
    global.css      All site CSS
  consts.ts         Site-wide constants
public/
  docs/             PDFs (thesis, certifications)
  img/              Images
  videos/           Video assets
tests/
  unit/             Vitest unit tests (tests/unit/**/*.test.ts)
  e2e/              Playwright functional specs (tests/e2e/*.spec.ts)
e2e/
  features/         playwright-bdd Gherkin .feature files
  steps/            Step definitions (*.ts)
  __screenshots__   Visual-regression baselines (platform-specific PNGs)
```

**Where things go**: new UI components → `src/components/`; new routes → `src/pages/`; blog posts → `src/content/blog/`; work case studies → `src/content/work/`; unit logic tests → `tests/unit/`; functional route/page tests → `tests/e2e/`; BDD + visual regression scenarios → `e2e/features/` + `e2e/steps/`.

## Licensing — code vs content

Two separate licenses govern this repo:

- **Code** (`*.astro`, `*.ts`, `*.js`, CSS, build config, GitHub Actions workflows) — AGPL-3.0. See `LICENSE`.
- **Content** (`src/content/blog/`, `src/content/cv/`, `src/content/work/`, images, the "Pete Watters" identity) — © 2026 Pete Watters, all rights reserved. Not AGPL.

Do not add AGPL headers to content files or treat content prose as relicensable code.

## Development commands

```bash
pnpm install
pnpm dev          # astro dev
pnpm build        # astro build && pnpm dlx pagefind --site dist
pnpm preview      # astro preview (serves on port 4321)
```

## Code style — repo-specific

General TypeScript style is global; these are the Astro-specific rules.

- Astro component filenames: PascalCase. Route slugs and non-component filenames: kebab-case.
- ESLint flat config (`eslint.config.js`): `eslint-plugin-astro` recommended + `@typescript-eslint/parser`. Ignores `dist/`, `.astro/`, `node_modules/`.

## Branching + release process (GitFlow)

- `main` — production. Protected. **Requires signed commits.** Squash-merge only. Never direct-push or force-push.
- `dev` — staging/integration. Default branch. All feature/fix/chore/ci/docs PRs target `dev`.
- `feat/*`, `fix/*`, `chore/*`, `ci/*`, `docs/*` — branch off `dev`, PR back into `dev`.
- Releases — single PR `dev → main`, then tag the merge commit.
- Sign local commits. Do not direct-push or force-push `main` or `dev`. Do not delete either branch.
- Conventional commits. Content-only changes: use `chore(blog):` or `docs:`, not `feat:`. Issue titles use `[XX-NN]` workstream prefix; incidents use `[INC-NN]`.
- Defer to CONTRIBUTING.md for the label taxonomy.

## Content & prose

- Content collections validated by `src/content/config.ts`.
- Run Vale on blog prose before pushing: `vale src/content/blog/`. The AISpeak style flags AI-sounding writing — keep the voice human.
- `docs/rfcs/` is aspirational and does not exist yet.

## What NOT to do

- Don't switch package managers. pnpm only.
- Don't run `pnpm install` inside an agent worktree if `node_modules` is symlinked from the main checkout.
- Don't commit to `main` directly. Don't force-push `main` or `dev`.
- Don't commit `.private/` (gitignored, never push) or `.env`/`.env.*` (only `*.example` is tracked). Don't quote `.private/` contents in any artifact.
- Don't relicense content files as AGPL.
- Don't add a CSS framework without asking.
- No AI attribution anywhere — not in commits, PR bodies, comments, or code.

## Verification

Run after any code changes before reporting done:

```bash
pnpm lint         # ESLint
pnpm check        # astro type-check
pnpm test:unit    # Vitest unit tests
```

For UI or route changes, also run:

```bash
pnpm test:e2e:headless   # Playwright (chromium) against pnpm preview on port 4321
pnpm e2e:bdd             # playwright-bdd: BDD + visual regression suite
```

Do not report done until lint, check, and test:unit all pass. Regenerate visual-regression baselines deliberately via the `update-visual-baselines` workflow — never blindly commit new screenshots.

## Testing

- **Unit**: Vitest — `tests/unit/**/*.test.ts`
- **E2E functional**: Playwright — `tests/e2e/*.spec.ts`, runs on chromium/firefox/webkit against `pnpm preview` (port 4321)
- **BDD + visual regression**: playwright-bdd — `.feature` files in `e2e/features/`, step definitions in `e2e/steps/`, baselines in `e2e/__screenshots__/` (builds production first via `playwright.bdd.config.ts`)

New user-facing behaviour needs a test. Bug fixes need a regression test. The PR author writes the tests.
