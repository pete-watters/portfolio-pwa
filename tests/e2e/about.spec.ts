import { test, expect } from '@playwright/test';

test.describe('About page', () => {
  test('loads with Story tab active by default', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('[data-panel="story"]')).toBeVisible();
    await expect(page.locator('[data-panel="work"]')).not.toBeVisible();
  });

  test('switches tabs on click', async ({ page }) => {
    await page.goto('/about');

    await page.click('[data-tab="work"]');
    await expect(page.locator('[data-panel="work"]')).toBeVisible();
    await expect(page.locator('[data-panel="story"]')).not.toBeVisible();

    await page.click('[data-tab="contact"]');
    await expect(page.locator('[data-panel="contact"]')).toBeVisible();

    await page.click('[data-tab="adventures"]');
    await expect(page.locator('[data-panel="adventures"]')).toBeVisible();
  });

  test('deep links to tab via hash', async ({ page }) => {
    await page.goto('/about#work');
    await expect(page.locator('[data-panel="work"]')).toBeVisible();
    await expect(page.locator('[data-panel="story"]')).not.toBeVisible();
  });

  test('Story tab has bio content', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('[data-panel="story"]')).toContainText('Full stack developer');
    await expect(page.locator('[data-panel="story"]')).toContainText('DCU');
  });

  test('has correct title', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle('About | Pete Watters');
  });
});
