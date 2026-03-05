import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads and shows intro', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.intro').first()).toContainText('Senior Frontend Engineer');
  });

  test('has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Pete Watters');
  });

  test('shows OSS contributions section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.oss-section h3')).toHaveText('Open Source');
    const cards = page.locator('.oss-card');
    await expect(cards).toHaveCount(2);
  });

  test('displays repo links with full org/repo names', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a.oss-repo-name[href*="leather-io/extension"]')).toHaveText('leather-io/extension');
    await expect(page.locator('a.oss-repo-name[href*="leather-io/mono"]')).toHaveText('leather-io/mono');
  });

  test('OSS PR counts link to filtered GitHub pulls page', async ({ page }) => {
    await page.goto('/');
    const prLink = page.locator('.oss-stat a[href*="/pulls?q="]').first();
    await expect(prLink).toBeVisible();
    await expect(prLink).toHaveAttribute('href', /\/pulls\?q=is:pr\+is:merged\+author:pete-watters/);
  });

  test('OSS commit counts link to filtered GitHub commits page', async ({ page }) => {
    await page.goto('/');
    const commitLink = page.locator('.oss-stat a[href*="/commits?author="]').first();
    await expect(commitLink).toBeVisible();
    await expect(commitLink).toHaveAttribute('href', /\/commits\?author=pete-watters/);
  });

  test('shows fallback PR and commit numbers', async ({ page }) => {
    await page.goto('/');
    const numbers = page.locator('.oss-number');
    await expect(numbers).toHaveCount(4);
    for (const el of await numbers.all()) {
      const text = await el.textContent();
      expect(Number(text)).toBeGreaterThan(0);
    }
  });

  test('shows recent blog posts', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.recent-posts > h3')).toHaveText('Writing');
    await expect(page.locator('.recent-posts .blog-card').first()).toBeVisible();
  });

  test('has view all posts link', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.view-all a[href="/blog"]')).toBeVisible();
  });

  test('view all posts link navigates to blog', async ({ page }) => {
    await page.goto('/');
    await page.click('.view-all a[href="/blog"]');
    await expect(page).toHaveURL('/blog');
  });
});
