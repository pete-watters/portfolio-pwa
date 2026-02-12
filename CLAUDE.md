# Portfolio PWA

Personal portfolio and blog at petewatters.ie. Static site built with Astro, deployed to Cloudflare Pages.

## Commands

```bash
npm run dev          # local dev server
npm run build        # production build
npm run preview      # preview production build
npm run lint         # eslint
npm run check        # astro type checking
npm run test:unit    # vitest
npm run test:e2e     # playwright (all browsers)
```

After any code change, verify with: `npm run lint && npm run check && npm run test:unit && npm run build`

## Architecture

- `src/pages/` — Astro file-based routing (static output, no SSR)
- `src/layouts/BaseLayout.astro` — single shared layout
- `src/components/` — reusable Astro components
- `src/content/blog/` — markdown blog posts via Astro content collections
- `src/consts.ts` — all site constants (routes, social links, metadata)
- `src/styles/global.css` — single global stylesheet, no CSS modules
- `tests/unit/` — Vitest unit tests (`*.test.ts`)
- `tests/e2e/` — Playwright E2E tests (`*.spec.ts`)

## Code style

### Astro components

- PascalCase filenames (`RepoCard.astro`)
- Props typed with `interface Props { }` in frontmatter
- Destructure from `Astro.props`
- Import order: framework (`astro:content`) → components → consts/utils
- Client-side interactivity via `<script>` tags with `data-` attributes — no framework JS

### TypeScript

- Strict mode (`astro/tsconfigs/strict`)
- `as const` for constant objects
- Prefer `interface` for component props, `type` for aliases
- Avoid `any`

### CSS

- All styles in `src/styles/global.css`
- BEM-like class naming (`.repo-card`, `.blog-post`, `.about-tabs`)
- CSS Grid for layouts
- Mobile breakpoint at `42.5rem`

### Testing

- Unit test files: `tests/unit/*.test.ts`
- E2E test files: `tests/e2e/*.spec.ts`
- E2E tests run against `npm run preview` on `localhost:4321`

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/). Enforced by commitlint + husky locally and in CI.

```
feat: add new feature
fix: correct a bug
docs: update documentation
style: formatting only
refactor: restructure without behaviour change
test: add or update tests
chore: tooling, dependencies, config
ci: CI/CD changes
```

Do not include `Co-Authored-By` lines in commits.

## Pull requests

- PR title must use conventional commit format (e.g. `feat: add work page`)
- Body format:

```
## Summary
<1-3 bullet points describing the change>
```

- Do not include a "Test plan" section
- Do not include "Generated with Claude" or similar attribution lines
