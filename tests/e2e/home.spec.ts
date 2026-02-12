import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads and shows tagline', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('p').first()).toContainText('Full stack developer');
  });

  test('has email link', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a[href="mailto:pete@cteic.ie"]')).toBeVisible();
  });

  test('shows social media links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer a[aria-label="GitHub"]')).toBeVisible();
    await expect(page.locator('footer a[aria-label="LinkedIn"]')).toBeVisible();
  });

  test('has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Pete Watters');
  });
});
