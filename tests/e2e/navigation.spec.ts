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
    await expect(page.locator('nav a[aria-label="X"]')).toBeVisible();
    await expect(page.locator('nav a[aria-label="StackOverflow"]')).toBeVisible();
  });

  test('nav shows all three social icons', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav a[aria-label="GitHub"]')).toBeVisible();
    await expect(page.locator('nav a[aria-label="X"]')).toBeVisible();
    await expect(page.locator('nav a[aria-label="StackOverflow"]')).toBeVisible();
  });

  test('social links open in new tab', async ({ page }) => {
    await page.goto('/');
    const socialLinks = page.locator('nav a[target="_blank"]');
    expect(await socialLinks.count()).toBe(3);
    for (const link of await socialLinks.all()) {
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  test('404 page renders for unknown routes', async ({ page }) => {
    const response = await page.goto('/nonexistent-page');
    expect(response?.status()).toBe(404);
    await expect(page.locator('h2')).toContainText('404');
    await expect(page.getByRole('link', { name: 'Go home' })).toBeVisible();
  });

  test('blog post shows breadcrumbs', async ({ page }) => {
    await page.goto('/blog/utxo-consolidation-six-lines');
    const breadcrumbs = page.locator('.breadcrumbs');
    await expect(breadcrumbs).toBeVisible();
    await expect(breadcrumbs.locator('a[href="/"]')).toHaveText('Home');
    await expect(breadcrumbs.locator('a[href="/blog"]')).toHaveText('Blog');
    await breadcrumbs.locator('a[href="/blog"]').click();
    await expect(page).toHaveURL('/blog');
  });

  test('blog index has no breadcrumbs', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('.breadcrumbs')).toHaveCount(0);
  });

  test('profile avatar is visible in header', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.profile-avatar')).toBeVisible();
  });

  test('header is visible on all pages', async ({ page }) => {
    for (const path of ['/', '/blog', '/cv']) {
      await page.goto(path);
      await expect(page.locator('header h1 a')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
    }
  });
});
