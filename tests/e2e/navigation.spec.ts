import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('rail avatar links to home', async ({ page }) => {
    await page.goto('/blog');
    await page.click('.rail-avatar-link');
    await expect(page).toHaveURL('/');
  });

  test('rail nav shows internal links and no social icons', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.rail-nav a[href="/blog"]')).toHaveCount(1);
    await expect(page.locator('.rail-nav a[href="/cv"]')).toHaveCount(1);
    await expect(page.locator('.rail-nav a[href*="github.com"]')).toHaveCount(0);
    await expect(page.locator('.rail-nav a[href*="x.com"]')).toHaveCount(0);
  });

  test('contact section shows the social links', async ({ page }) => {
    await page.goto('/');
    const contact = page.locator('section#contact');
    await expect(contact.locator('a[href*="github.com/pete-watters"]')).toBeVisible();
    await expect(contact.locator('a[href*="x.com/petew_btc"]')).toBeVisible();
    await expect(contact.locator('a[href*="linkedin.com/in/pete-watters"]')).toBeVisible();
  });

  test('social links open in new tab', async ({ page }) => {
    await page.goto('/');
    const socialLinks = page.locator('section#contact a[target="_blank"]');
    expect(await socialLinks.count()).toBe(3);
    for (const link of await socialLinks.all()) {
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  test('404 page renders for unknown routes', async ({ page }) => {
    const response = await page.goto('/nonexistent-page');
    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toContainText('404');
    await expect(page.getByRole('link', { name: 'Go home' })).toBeVisible();
  });

  test('blog post shows breadcrumbs', async ({ page }) => {
    await page.goto('/blog/utxo-consolidation-six-lines');
    const breadcrumbs = page.locator('.breadcrumbs');
    await expect(breadcrumbs).toBeVisible();
    await expect(breadcrumbs.locator('a[href="/"]')).toHaveText('Home');
    await expect(breadcrumbs.locator('a[href="/blog"]')).toHaveText('Writing');
    await breadcrumbs.locator('a[href="/blog"]').click();
    await expect(page).toHaveURL('/blog');
  });

  test('blog index has no breadcrumbs', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('.breadcrumbs')).toHaveCount(0);
  });

  test('profile avatar is visible in the rail', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.rail-avatar')).toBeVisible();
  });

  test('sidebar rail is visible on all pages', async ({ page }) => {
    for (const path of ['/', '/blog', '/cv']) {
      await page.goto(path);
      await expect(page.locator('aside.app-sidebar')).toBeVisible();
      await expect(page.locator('.rail-nav')).toBeVisible();
    }
  });
});
