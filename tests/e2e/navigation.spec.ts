import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('header links to home', async ({ page }) => {
    await page.goto('/blog');
    await page.click('header h1 a');
    await expect(page).toHaveURL('/');
  });

  test('nav links work', async ({ page }) => {
    await page.goto('/');

    await page.click('nav a[href="/work"]');
    await expect(page).toHaveURL('/work');

    await page.click('nav a[href="/blog"]');
    await expect(page).toHaveURL('/blog');

    await page.click('nav a[href="/about"]');
    await expect(page).toHaveURL('/about');
  });

  test('404 page renders for unknown routes', async ({ page }) => {
    const response = await page.goto('/nonexistent-page');
    expect(response?.status()).toBe(404);
    await expect(page.locator('h2')).toContainText('404');
    await expect(page.getByRole('link', { name: 'Go home' })).toBeVisible();
  });

  test('nav shows active state', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('nav a[href="/blog"]')).toHaveClass('active');

    await page.goto('/work');
    await expect(page.locator('nav a[href="/work"]')).toHaveClass('active');

    await page.goto('/about');
    await expect(page.locator('nav a[href="/about"]')).toHaveClass('active');
  });
});
