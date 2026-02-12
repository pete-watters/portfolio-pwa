import { test, expect } from '@playwright/test';

test.describe('Work', () => {
  test('page loads with correct title', async ({ page }) => {
    await page.goto('/work');
    await expect(page).toHaveTitle('Work | Pete Watters');
  });

  test('has two tabs', async ({ page }) => {
    await page.goto('/work');
    await expect(page.locator('[data-tab="opensource"]')).toBeVisible();
    await expect(page.locator('[data-tab="portfolio"]')).toBeVisible();
  });

  test('shows repo cards or fallback link', async ({ page }) => {
    await page.goto('/work');
    const cards = page.locator('.repo-card');
    const fallback = page.locator('[data-panel="opensource"] a[href*="github.com"]');
    const hasCards = await cards.count() > 0;
    const hasFallback = await fallback.count() > 0;
    expect(hasCards || hasFallback).toBe(true);
  });

  test('tabs switch panels', async ({ page }) => {
    await page.goto('/work');

    await expect(page.locator('[data-panel="opensource"]')).toHaveClass(/active/);
    await expect(page.locator('[data-panel="portfolio"]')).not.toHaveClass(/active/);

    await page.click('[data-tab="portfolio"]');
    await expect(page.locator('[data-panel="portfolio"]')).toHaveClass(/active/);
    await expect(page.locator('[data-panel="opensource"]')).not.toHaveClass(/active/);
  });
});
