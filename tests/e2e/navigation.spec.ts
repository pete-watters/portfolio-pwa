import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('header links to home', async ({ page }) => {
    await page.goto('/blog');
    await page.click('header h1 a');
    await expect(page).toHaveURL('/');
  });

  test('nav shows social icons only', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav a[href="/blog"]')).toHaveCount(0);
    await expect(page.locator('nav a[href="/cv"]')).toHaveCount(0);
    await expect(page.locator('nav a[aria-label="GitHub"]')).toBeVisible();
    await expect(page.locator('nav a[aria-label="LinkedIn"]')).toBeVisible();
  });

  test('404 page renders for unknown routes', async ({ page }) => {
    const response = await page.goto('/nonexistent-page');
    expect(response?.status()).toBe(404);
    await expect(page.locator('h2')).toContainText('404');
    await expect(page.getByRole('link', { name: 'Go home' })).toBeVisible();
  });

  test('blog index has back arrow to home', async ({ page }) => {
    await page.goto('/blog');
    const backLink = page.locator('.back-link');
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL('/');
  });

  test('blog post has back arrow to blog', async ({ page }) => {
    await page.goto('/blog/hello-world');
    const backLink = page.locator('.back-link');
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL('/blog');
  });
});
