import { test, expect } from '@playwright/test';

test.describe('Blog', () => {
  test('listing page loads and shows posts', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('h2')).toContainText('Blog');
    await expect(page.locator('.blog-card').first()).toBeVisible();
  });

  test('blog post page renders markdown', async ({ page }) => {
    await page.goto('/blog/hello-world');
    await expect(page.locator('.blog-post h2').first()).toBeVisible();
    await expect(page.locator('.blog-post')).toContainText('Astro');
  });

  test('listing links to individual posts', async ({ page }) => {
    await page.goto('/blog');
    const firstPost = page.locator('.blog-card a').first();
    await firstPost.click();
    await expect(page.locator('.blog-post')).toBeVisible();
  });

  test('blog listing has correct title', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveTitle('Blog | Pete Watters');
  });
});
