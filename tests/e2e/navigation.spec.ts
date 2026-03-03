import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('header links to home', async ({ page }) => {
    await page.goto('/blog');
    await page.click('header h1 a');
    await expect(page).toHaveURL('/');
  });

  test('404 page renders for unknown routes', async ({ page }) => {
    const response = await page.goto('/nonexistent-page');
    expect(response?.status()).toBe(404);
    await expect(page.locator('h2')).toContainText('404');
    await expect(page.getByRole('link', { name: 'Go home' })).toBeVisible();
  });
});
