import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Web3 Engineer | Pete Watters');
  });

  test('rail shows availability badge (not hero)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.rail-availability')).toContainText('Available for remote work');
    // Hero-scale availability badge is gone — should not exist
    await expect(page.locator('.hero .availability-badge')).toHaveCount(0);
  });

  test('rail has the primary nav links', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('.rail-nav a');
    await expect(links).toHaveCount(3);
    await expect(links.nth(0)).toHaveText('Work');
    await expect(links.nth(1)).toHaveText('Writing');
    await expect(links.nth(2)).toHaveText('CV');
  });

  test('hero no longer duplicates the Pete Watters wordmark', async ({ page }) => {
    await page.goto('/');
    // .hero-name was removed; the rail name is the only wordmark
    await expect(page.locator('.hero-name')).toHaveCount(0);
    await expect(page.locator('.rail-name')).toHaveText('Pete Watters');
  });

  test('rail shows Web3 Engineer headline + plan/build/ship rhythm + bio', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.rail-title')).toContainText('Web3 Engineer');
    const items = page.locator('.rhythm-item');
    await expect(items).toHaveCount(3);
    await expect(items.nth(0)).toContainText('plan');
    await expect(items.nth(1)).toContainText('build');
    await expect(items.nth(2)).toContainText('ship');
    await expect(page.locator('.rail-bio')).toContainText('Building for the web');
  });

  test('rhythm items each have an inline monoline glyph SVG', async ({ page }) => {
    await page.goto('/');
    const glyphs = page.locator('.rhythm-item .rhythm-glyph');
    await expect(glyphs).toHaveCount(3);
  });

  test('shipped-at strip lists all six companies', async ({ page }) => {
    await page.goto('/');
    const items = page.locator('.rail-shipped-list li');
    await expect(items).toHaveCount(6);
    await expect(items.nth(0)).toHaveText('Leather');
    await expect(items.nth(5)).toHaveText('Fidelity');
  });

  test('case studies section has id="work" so /#work anchor scrolls correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('section.case-studies#work')).toBeVisible();
  });

  test('shows seven case study cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.case-card')).toHaveCount(7);
  });

  test('every case study card links to its /work/<slug>/ page', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('.case-card-link');
    await expect(links).toHaveCount(7);
    await expect(links.nth(0)).toHaveAttribute('href', '/work/leather-mobile/');
    await expect(links.nth(1)).toHaveAttribute('href', '/work/cryptowatch/');
    await expect(links.nth(2)).toHaveAttribute('href', '/work/xapo/');
    await expect(links.nth(3)).toHaveAttribute('href', '/work/qredo/');
    await expect(links.nth(4)).toHaveAttribute('href', '/work/stackr/');
    await expect(links.nth(5)).toHaveAttribute('href', '/work/simplyfpl/');
    await expect(links.nth(6)).toHaveAttribute('href', '/work/portfolio-pwa/');
  });

  test('open-source project cards show GitHub repo links opening in new tabs', async ({ page }) => {
    await page.goto('/');
    const repoLinks = page.locator('.case-card-repo');
    await expect(repoLinks).toHaveCount(4);
    await expect(repoLinks.nth(0)).toHaveAttribute('href', 'https://github.com/leather-io');
    await expect(repoLinks.nth(1)).toHaveAttribute('href', 'https://github.com/pete-watters/stackr');
    await expect(repoLinks.nth(2)).toHaveAttribute('href', 'https://github.com/pete-watters/simply-fpl');
    await expect(repoLinks.nth(3)).toHaveAttribute('href', 'https://github.com/pete-watters/portfolio-pwa');
    for (const link of await repoLinks.all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
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

  test('rail nav has no social icons (they moved to contact section)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.rail-nav a[href*="github.com"]')).toHaveCount(0);
    await expect(page.locator('.rail-nav a[href*="x.com"]')).toHaveCount(0);
  });
});
