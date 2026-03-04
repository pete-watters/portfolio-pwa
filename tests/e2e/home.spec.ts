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

  test('shows profile sections', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.working-on h3')).toHaveText('What I\'m working on');
    await expect(page.locator('.oss-prs h3')).toHaveText('Notable OSS contributions');
    await expect(page.locator('.tech h3')).toHaveText('Tech');
    await expect(page.locator('.previously h3')).toHaveText('Previously');
  });

  test('shows OSS contributions section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.oss-section h3')).toHaveText('Open Source');
    const cards = page.locator('.oss-card');
    await expect(cards).toHaveCount(2);
  });

  test('displays repo links with correct hrefs', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a.oss-repo-name[href*="leather-io/extension"]')).toBeVisible();
    await expect(page.locator('a.oss-repo-name[href*="leather-io/mono"]')).toBeVisible();
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
    await expect(page.locator('.recent-posts h3')).toHaveText('Recent posts');
    await expect(page.locator('.recent-posts .blog-card').first()).toBeVisible();
  });

  test('has view all posts link', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.view-all a[href="/blog"]')).toBeVisible();
  });
});
