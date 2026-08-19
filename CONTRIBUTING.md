# Contributing

How work flows through this repo. This is a personal portfolio maintained
by Pete Watters; conventions still matter so the repo behaves consistently
with other repos in the same workflow.

If you're an external contributor opening a PR, please read this first.

---

## Workstream prefix on issue titles

Issues should be prefixed with `[XX-NN]` where:

- `XX` is the two-letter workstream code (e.g. `HP` for homepage, `CV` for
  CV section, `BL` for blog, `CI` for CI/deploy, `WK` for case-studies
  workstream)
- `NN` is the sequence within that workstream

Example: `[HP-04] Add view transitions between homepage and case studies`

Each workstream prefix maps 1:1 to:

- A workstream label on the issue (`ws: homepage`, `ws: cv`, etc.)
- An RFC in `docs/rfcs/` describing the scope, motivation, and acceptance
  criteria for that workstream (when the scope warrants one)

This convention is aspirational for this repo as of 2026-05 — `docs/rfcs/`
doesn't exist yet. The first non-trivial workstream that ships should
create it.

---

## Labels

Issues and PRs are tagged across four axes plus the existing default
stock labels.

### Area (per major surface or package)

- `area: homepage`
- `area: cv`
- `area: blog`
- `area: work` (case studies under `/work/<slug>/`)
- `area: ci`
- `area: infra` (deploy, secrets, Cloudflare Pages config)
- `area: docs`

### Workstream (per RFC)

Added as workstreams are formalised. Examples:

- `ws: homepage-redesign-may-2026`
- `ws: nft-avatar`
- `ws: dev-staging-workflow`

### Size

Rough effort estimate. Decide based on diff size and review surface.

- `size: s` — a single file or under ~50 changed lines
- `size: m` — several files or up to ~500 changed lines
- `size: l` — broad surface, >500 changed lines, or coordinated multi-PR work

### Status

State signals that change a triage decision.

- `status: blocked` — waiting on something external
- `status: quick-win` — small, well-scoped, can be picked up immediately
- `status: in-review` — open PR exists

### Stock (already on the repo)

`bug`, `enhancement`, `documentation`, `question`, `incident`,
`good first issue`, `help wanted`, `wontfix`, `dependencies`.

---

## Branching — GitFlow

| Branch | Role | Auto-deploys to |
|---|---|---|
| `main` | Production. Protected. Squash-merge only from PRs targeting `main`. | `petewatters.ie` |
| `dev` | Staging / integration. Light protection (block force-pushes + deletions). Feature PRs land here. | `dev.portfolio.pages.dev` |
| `feat/*`, `fix/*`, `chore/*`, `ci/*`, `docs/*` | Short-lived working branches. PR into `dev`. | Ephemeral per-PR preview |
| `release/*` | Optional, only used when batching dev → main needs review surface | n/a |

Release flow: when `dev` is stable, open a single `dev → main` PR. Merging
that promotes to production. Tag the resulting commit on main with the
release version where applicable.

CI is documented in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
— the header comment describes the deploy targets.

---

## PR hygiene

### Title — conventional commits

`type(scope): subject`

Types in active use: `feat`, `fix`, `chore`, `ci`, `docs`, `refactor`, `test`.
Scope is optional but encouraged for cross-area work.

Examples from this repo's history:

- `feat(homepage): hero, logo strip, case studies, timeline`
- `feat(work): four case study pages at /work/<slug>/`
- `ci: add dev branch staging deploy alongside main and PR previews`
- `chore: harden .gitignore to catch all .env variants`

No `feat:` for content-only changes (use `chore(blog):` or `docs:`).
Subject is imperative mood, no trailing period.

### Body — use the template

The PR body is auto-populated from
[`.github/pull_request_template.md`](.github/pull_request_template.md).
Required:

- A `## Summary` bullet list explaining what changed and why
- A `## Linked issue` block with one of: `Closes #N`, `Refs #N`, or a
  `Type:` tag for issueless work (`bug fix`, `chore / cleanup`)

No "test plan" section, no Claude credit, no Co-Authored-By unless the
collaborator is a real person.

### Post-open routine

When you open a PR, post a status comment that opens with `@<maintainer>`
and uses these sections (delete sections that don't apply):

```md
@pete-watters

## Shipped
- <what's done in this PR>

## Pending
- <what's still in flight / known follow-up>

## Verification
- <how to confirm it works — preview URL, test command, manual check>
```

The Cloudflare Pages preview URL will land as its own comment from the
deploy workflow — link to it from the Verification section.

---

## Incidents

For prod incidents (broken deploy, regression, security issue):

1. **Open an issue first**, labelled `incident` and the relevant `area:`
   label. Title prefix `[INC-NN]`. Description: timeline, impact, scope.
2. **Open a fix PR that `Closes #N`**, targeting `dev` (or `main` directly
   if production is broken right now — note the bypass in the PR body and
   open a follow-up PR backporting the fix to dev).
3. After resolution, edit the issue with a post-mortem: root cause,
   detection, response, prevention.

---

## Local development

```bash
pnpm install
pnpm dev          # Start Astro dev server
pnpm build        # Production build
pnpm preview      # Preview production build locally
```

Tests + lint:

```bash
pnpm lint                # ESLint
pnpm check               # Astro type-check
pnpm test:unit           # Vitest
pnpm test:e2e:headless   # Playwright chromium
```

---

## Project structure

```
src/
  components/    # Astro components (BaseHead, Header, Nav, …)
  content/
    blog/        # Blog posts (markdown)
    work/        # Case studies (markdown)
    cv/          # CV content collection
  layouts/       # BaseLayout, CvLayout
  pages/         # Routes — /, /blog, /work/<slug>, /cv, rss.xml
  styles/        # global.css
public/
  docs/          # PDFs (thesis, certifications)
  img/ videos/   # Static media
e2e/             # Playwright-BDD visual regression
tests/           # Vitest unit tests
```

---

## Verified commits

The `main` branch ruleset requires signed commits. GitHub squash-merges
satisfy this automatically. Local commits should be signed (GPG or SSH) so
they appear Verified on feature branches too — see GitHub's docs on
[signing commits](https://docs.github.com/en/authentication/managing-commit-signature-verification).
