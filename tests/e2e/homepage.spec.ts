import { test, expect } from '@playwright/test';

test.describe('OSS Contributions card', () => {
  test('renders the OSS section with heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.oss-section h3')).toHaveText('Open Source');
  });

  test('shows both repo cards', async ({ page }) => {
    await page.goto('/');
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
});
