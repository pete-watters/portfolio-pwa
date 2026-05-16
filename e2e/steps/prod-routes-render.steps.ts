import { test, createBdd } from 'playwright-bdd';
import { expect, type Page } from '@playwright/test';

type ErrorBag = { errors: Error[] };

// Per-page error tracking — pageerror events captured into a bag keyed by page.
const pageErrors = new WeakMap<Page, ErrorBag>();

const { When, Then } = createBdd(test);

// Register pageerror listener on every test's page before scenarios run.
test.beforeEach(async ({ page }) => {
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
  // Wait for web fonts before snapshotting to avoid font-flicker diffs.
  await page.evaluate(() => document.fonts.ready).catch(() => undefined);
  await expect(page).toHaveScreenshot(`${name}.png`, {
    fullPage: true,
    animations: 'disabled',
    maxDiffPixelRatio: 0.05,
  });
});
