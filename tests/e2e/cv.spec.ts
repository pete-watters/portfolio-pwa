import { test, expect } from '@playwright/test';

test.describe('CV page', () => {
  test('nav has CV link that opens in new tab', async ({ page }) => {
    await page.goto('/');
    const cvLink = page.locator('nav a[href="/cv"]');
    await expect(cvLink).toBeVisible();
    await expect(cvLink).toHaveAttribute('target', '_blank');
  });

  test('loads and shows correct title', async ({ page }) => {
    await page.goto('/cv');
    await expect(page).toHaveTitle('CV | Pete Watters');
  });

  test('displays summary', async ({ page }) => {
    await page.goto('/cv');
    await expect(page.locator('.cv')).toContainText('Senior Frontend Engineer');
  });

  test('displays skills section', async ({ page }) => {
    await page.goto('/cv');
    await expect(page.locator('dl')).toBeVisible();
    await expect(page.locator('dt').first()).toContainText('Front-End');
  });

  test('displays work experience', async ({ page }) => {
    await page.goto('/cv');
    await expect(page.locator('h2').first()).toContainText('Skills');
    await expect(page.locator('h2').nth(1)).toContainText('Work Experience');
  });

  test('displays education section', async ({ page }) => {
    await page.goto('/cv');
    await expect(page.locator('text=MEng Telecommunications Engineering')).toBeVisible();
    await expect(page.locator('text=BEng Digital Media Engineering')).toBeVisible();
  });

  test('thesis PDF link works', async ({ page, request }) => {
    await page.goto('/cv');
    await expect(page.locator('a[href="/docs/thesis-pete-watters.pdf"]')).toBeVisible();

    const response = await request.get('/docs/thesis-pete-watters.pdf');
    expect(response.status()).toBe(200);
  });

  test('BTC certificate link works', async ({ page, request }) => {
    await page.goto('/cv');
    await expect(page.locator('a[href="/docs/bitcoin-certified-professional.pdf"]')).toBeVisible();

    const response = await request.get('/docs/bitcoin-certified-professional.pdf');
    expect(response.status()).toBe(200);
  });
});
