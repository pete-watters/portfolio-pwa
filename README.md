# petewatters.ie

Personal portfolio and blog built with Astro, hosted on Cloudflare Pages.

**Live:** [petewatters.ie](https://petewatters.ie)

## Stack

- [Astro](https://astro.build) v5 — static site generation, content collections
- TypeScript
- Cloudflare Pages — hosting and deployment
- Playwright — E2E tests
- Vite PWA — offline support and service worker

## Development

```bash
npm install
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
```

## Testing

```bash
npm run test:e2e:headless   # Playwright (chromium)
npm run test:e2e:ui         # Playwright with UI
npm run test:unit           # Vitest
npm run lint                # ESLint
```

## Structure

```
src/
  content/
    blog/        # Blog posts (markdown)
    cv/          # CV content collection
  layouts/       # Astro layouts (BaseLayout, CvLayout)
  pages/         # Routes (/, /blog, /cv)
  components/    # Astro components
public/
  docs/          # PDFs (thesis, certifications)
tests/
  e2e/           # Playwright tests
```

## License

MIT — see [LICENSE](./LICENSE).
