import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Pete Watters');
  });

  test('hero shows availability badge', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.availability-badge')).toContainText('Available September 2026');
  });

  test('hero shows name and the three words', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero-name')).toHaveText('Pete Watters');
    const words = page.locator('.hero-word');
    await expect(words).toHaveCount(3);
    await expect(words.nth(0)).toHaveText('Builder');
    await expect(words.nth(1)).toHaveText('Engineer');
    await expect(words.nth(2)).toHaveText('Shipper');
  });

  test('hero shows sub-tagline and bio', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero-subtagline')).toContainText('PLAN IT');
    await expect(page.locator('.hero-bio')).toContainText('crypto products');
  });

  test('logo strip lists all six companies', async ({ page }) => {
    await page.goto('/');
    const items = page.locator('.logo-strip-list li');
    await expect(items).toHaveCount(6);
    await expect(items.nth(0)).toHaveText('Kraken');
    await expect(items.nth(5)).toHaveText('Qredo');
  });

  test('shows four case study cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.case-card')).toHaveCount(4);
  });

  test('case study cards link to /work/<slug>/', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('.case-card-link');
    await expect(links).toHaveCount(4);
    await expect(links.nth(0)).toHaveAttribute('href', '/work/leather/');
    await expect(links.nth(1)).toHaveAttribute('href', '/work/cryptowatch/');
    await expect(links.nth(2)).toHaveAttribute('href', '/work/xapo/');
    await expect(links.nth(3)).toHaveAttribute('href', '/work/qredo/');
  });

  test('timeline lists every role from Trust Machines back to Earlier', async ({ page }) => {
    await page.goto('/');
    const rows = page.locator('.timeline-row');
    await expect(rows).toHaveCount(9);
    await expect(rows.first().locator('.timeline-company')).toHaveText('Trust Machines');
    await expect(rows.last().locator('.timeline-company')).toHaveText('Earlier');
  });
});
