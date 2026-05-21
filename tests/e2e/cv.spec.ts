import { test, expect } from '@playwright/test';

test.describe('CV page', () => {
  test('/cv renders the unified CV', async ({ page }) => {
    await page.goto('/cv');
    await expect(page).toHaveTitle('CV | Pete Watters');
    await expect(page.locator('.cv')).toContainText('Engineer with 15+ years');
  });

  test('skills section renders with frontend groupings', async ({ page }) => {
    await page.goto('/cv');
    await expect(page.locator('dl')).toBeVisible();
    await expect(page.locator('dt').first()).toContainText('Front-End');
  });

  test('work experience and skills headings render', async ({ page }) => {
    await page.goto('/cv');
    await expect(page.locator('h2').first()).toContainText('Skills');
    await expect(page.locator('h2').nth(1)).toContainText('Work Experience');
  });

  test('education section renders', async ({ page }) => {
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

  test('BTC certification heading renders', async ({ page, request }) => {
    await page.goto('/cv');
    await expect(page.locator('text=C4 Certified Bitcoin Professional')).toBeVisible();
    const response = await request.get('/docs/bitcoin-certified-professional.pdf');
    expect(response.status()).toBe(200);
  });

  test.describe('old variant URLs redirect to /cv/', () => {
    for (const variant of ['full-stack', 'frontend', 'product']) {
      test(`/cv/${variant} redirects to /cv/`, async ({ page }) => {
        await page.goto(`/cv/${variant}`);
        await expect(page).toHaveURL(/\/cv\/?$/);
      });
    }
  });
});
