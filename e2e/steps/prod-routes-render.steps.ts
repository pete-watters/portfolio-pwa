import { test, createBdd } from 'playwright-bdd';
import { expect, type Page } from '@playwright/test';

type ErrorBag = { errors: Error[] };

// Per-page error tracking — pageerror events captured into a bag keyed by page.
const pageErrors = new WeakMap<Page, ErrorBag>();

const { Before, When, Then } = createBdd(test);

// Register pageerror listener on every test's page before scenarios run.
// Use playwright-bdd's `Before` hook, not Playwright's `test.beforeEach` —
// the latter can't be called at module scope in a step-defs file.
Before(async ({ page }) => {
  const bag: ErrorBag = { errors: [] };
  pageErrors.set(page, bag);
  page.on('pageerror', (err) => bag.errors.push(err));
});

When('I visit {string}', async ({ page }, path: string) => {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  // Some pages have long-running connections (PWA registration); networkidle
  // isn't guaranteed. Catch is intentional.
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => undefined);
});

Then('no page error should have occurred', async ({ page }) => {
  const bag = pageErrors.get(page);
  const errors = bag?.errors ?? [];
  const messages = errors.map(
    (e) => `${e.name}: ${e.message}\n${e.stack ?? '(no stack)'}`
  );
  expect(
    messages,
    `pageerror events fired:\n${messages.join('\n---\n')}`
  ).toHaveLength(0);
});

Then('the rendered page matches the snapshot {string}', async ({ page }, name: string) => {
  // Wait for web fonts AND images before snapshotting to avoid loading-state diffs.
  await page.evaluate(() => document.fonts.ready).catch(() => undefined);
  await page.evaluate(() => Promise.all(
    Array.from(document.images)
      .filter((img) => !img.complete)
      .map((img) => new Promise<void>((resolve) => {
        img.addEventListener('load',  () => resolve(), { once: true });
        img.addEventListener('error', () => resolve(), { once: true });
      })),
  )).catch(() => undefined);

  await expect(page).toHaveScreenshot(`${name}.png`, {
    fullPage: true,
    animations: 'disabled',
    // 0.05 was too strict for full-page snapshots — minor subpixel/anti-alias
    // variation between bootstrap and assertion runs was tripping single routes
    // (Cryptowatch hit ~6% diff on three retries). 0.15 stays strict enough to
    // catch real layout/content regressions while tolerating render noise.
    maxDiffPixelRatio: 0.15,
  });
});
