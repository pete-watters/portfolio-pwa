import { test, expect } from '@playwright/test';

test.describe('CV page', () => {
  test('/cv shows a landing page linking to all three variants', async ({ page }) => {
    await page.goto('/cv');
    await expect(page).toHaveURL(/\/cv\/?$/);
    const cards = page.locator('.cv-variant-card');
    await expect(cards).toHaveCount(3);
    await expect(page.locator('.cv-variant-card[href="/cv/full-stack/"]')).toBeVisible();
    await expect(page.locator('.cv-variant-card[href="/cv/frontend/"]')).toBeVisible();
    await expect(page.locator('.cv-variant-card[href="/cv/product/"]')).toBeVisible();
  });

  test.describe('full-stack variant', () => {
    test('loads and shows correct title', async ({ page }) => {
      await page.goto('/cv/full-stack');
      await expect(page).toHaveTitle('CV | Pete Watters');
    });

    test('displays summary as Senior Software Engineer', async ({ page }) => {
      await page.goto('/cv/full-stack');
      await expect(page.locator('.cv')).toContainText('Senior Software Engineer');
    });

    test('displays skills section with frontend groupings', async ({ page }) => {
      await page.goto('/cv/full-stack');
      await expect(page.locator('dl')).toBeVisible();
      await expect(page.locator('dt').first()).toContainText('Front-End');
    });

    test('displays work experience', async ({ page }) => {
      await page.goto('/cv/full-stack');
      await expect(page.locator('h2').first()).toContainText('Skills');
      await expect(page.locator('h2').nth(1)).toContainText('Work Experience');
    });

    test('displays education section', async ({ page }) => {
      await page.goto('/cv/full-stack');
      await expect(page.locator('text=MEng Telecommunications Engineering')).toBeVisible();
      await expect(page.locator('text=BEng Digital Media Engineering')).toBeVisible();
    });

    test('thesis PDF link works', async ({ page, request }) => {
      await page.goto('/cv/full-stack');
      await expect(page.locator('a[href="/docs/thesis-pete-watters.pdf"]')).toBeVisible();

      const response = await request.get('/docs/thesis-pete-watters.pdf');
      expect(response.status()).toBe(200);
    });

    test('shows BTC certification heading', async ({ page, request }) => {
      await page.goto('/cv/full-stack');
      await expect(page.locator('text=C4 Certified Bitcoin Professional')).toBeVisible();

      const response = await request.get('/docs/bitcoin-certified-professional.pdf');
      expect(response.status()).toBe(200);
    });
  });

  test.describe('frontend variant', () => {
    test('loads and shows correct title', async ({ page }) => {
      await page.goto('/cv/frontend');
      await expect(page).toHaveTitle('CV | Pete Watters');
    });

    test('displays summary as Senior Frontend Engineer', async ({ page }) => {
      await page.goto('/cv/frontend');
      await expect(page.locator('.cv')).toContainText('Senior Frontend Engineer');
    });

    test('displays skills section with frontend groupings', async ({ page }) => {
      await page.goto('/cv/frontend');
      await expect(page.locator('dl')).toBeVisible();
      await expect(page.locator('dt').first()).toContainText('Front-End');
    });

    test('displays work experience', async ({ page }) => {
      await page.goto('/cv/frontend');
      await expect(page.locator('h2').first()).toContainText('Skills');
      await expect(page.locator('h2').nth(1)).toContainText('Work Experience');
    });

    test('displays education section', async ({ page }) => {
      await page.goto('/cv/frontend');
      await expect(page.locator('text=MEng Telecommunications Engineering')).toBeVisible();
      await expect(page.locator('text=BEng Digital Media Engineering')).toBeVisible();
    });

    test('thesis PDF link works', async ({ page, request }) => {
      await page.goto('/cv/frontend');
      await expect(page.locator('a[href="/docs/thesis-pete-watters.pdf"]')).toBeVisible();

      const response = await request.get('/docs/thesis-pete-watters.pdf');
      expect(response.status()).toBe(200);
    });

    test('shows BTC certification heading', async ({ page, request }) => {
      await page.goto('/cv/frontend');
      await expect(page.locator('text=C4 Certified Bitcoin Professional')).toBeVisible();

      const response = await request.get('/docs/bitcoin-certified-professional.pdf');
      expect(response.status()).toBe(200);
    });
  });
});
