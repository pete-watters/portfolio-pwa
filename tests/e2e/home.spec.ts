import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Pete Watters');
  });

  test('header shows availability badge (not hero)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.header-availability')).toContainText('Available Sep 2026');
    // Hero-scale availability badge is gone — should not exist
    await expect(page.locator('.hero .availability-badge')).toHaveCount(0);
  });

  test('header has the primary nav links', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('header.site-header .primary-nav a');
    await expect(links).toHaveCount(3);
    await expect(links.nth(0)).toHaveText('Work');
    await expect(links.nth(1)).toHaveText('Blog');
    await expect(links.nth(2)).toHaveText('CV');
  });

  test('hero no longer duplicates the Pete Watters wordmark', async ({ page }) => {
    await page.goto('/');
    // .hero-name was removed; the header h1 a is the only wordmark
    await expect(page.locator('.hero-name')).toHaveCount(0);
    await expect(page.locator('header.site-header h1 a')).toHaveText('Pete Watters');
  });

  test('hero shows the three words, sub-tagline and bio', async ({ page }) => {
    await page.goto('/');
    const words = page.locator('.hero-word');
    await expect(words).toHaveCount(3);
    await expect(words.nth(0)).toHaveText('Builder');
    await expect(words.nth(1)).toHaveText('Engineer');
    await expect(words.nth(2)).toHaveText('Shipper');
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

  test('case studies section has id="work" so /#work anchor scrolls correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('section.case-studies#work')).toBeVisible();
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

  test('contact section renders with email + social links', async ({ page }) => {
    await page.goto('/');
    const contact = page.locator('section.contact-section#contact');
    await expect(contact).toBeVisible();
    await expect(contact.locator('a[href^="mailto:"]')).toBeVisible();
    await expect(contact.locator('a[href*="github.com/pete-watters"]')).toBeVisible();
    await expect(contact.locator('a[href*="x.com/petew_btc"]')).toBeVisible();
  });

  test('header has no social icons (they moved to contact section)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header.site-header a[href*="github.com"]')).toHaveCount(0);
    await expect(page.locator('header.site-header a[href*="x.com"]')).toHaveCount(0);
  });
});
