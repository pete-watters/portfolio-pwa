import { test, expect } from '@playwright/test';

test.describe('About', () => {
  test('page loads with correct title', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle('About | Pete Watters');
  });

  test('contains content from GitHub README or fallback', async ({ page }) => {
    await page.goto('/about');
    const article = page.locator('.about-content');
    await expect(article).toBeVisible();
    // Should have either rendered README content or the fallback link
    const text = await article.textContent();
    expect(text!.length).toBeGreaterThan(0);
  });
});
