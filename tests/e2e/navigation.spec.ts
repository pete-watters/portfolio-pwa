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

  test('nav shows all five social icons', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav a[aria-label="GitHub"]')).toBeVisible();
    await expect(page.locator('nav a[aria-label="LinkedIn"]')).toBeVisible();
    await expect(page.locator('nav a[aria-label="StackOverflow"]')).toBeVisible();
    await expect(page.locator('nav a[aria-label="Medium"]')).toBeVisible();
    await expect(page.locator('nav a[aria-label="Instagram"]')).toBeVisible();
  });

  test('social links open in new tab', async ({ page }) => {
    await page.goto('/');
    const socialLinks = page.locator('nav a[target="_blank"]');
    expect(await socialLinks.count()).toBe(5);
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

  test('blog index shows breadcrumb', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('.breadcrumb-current')).toHaveText('blog');
    await page.click('header h1 a');
    await expect(page).toHaveURL('/');
  });

  test('blog post shows breadcrumbs with link to blog', async ({ page }) => {
    await page.goto('/blog/hello-world');
    const blogLink = page.locator('.breadcrumb-link');
    await expect(blogLink).toHaveText('blog');
    await blogLink.click();
    await expect(page).toHaveURL('/blog');
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
