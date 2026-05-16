import { test, expect } from '@playwright/test';

const cases = [
  { slug: 'leather',     title: 'Leather Bitcoin Wallet', company: 'Trust Machines' },
  { slug: 'cryptowatch', title: 'Cryptowatch',            company: 'Kraken' },
  { slug: 'xapo',        title: 'Xapo',                   company: 'Xapo' },
  { slug: 'qredo',       title: 'Qredo',                  company: 'Qredo' },
];

test.describe('Case study pages', () => {
  for (const { slug, title, company } of cases) {
    test.describe(`/work/${slug}`, () => {
      test('loads with correct title', async ({ page }) => {
        await page.goto(`/work/${slug}/`);
        await expect(page).toHaveTitle(`${title} | Pete Watters`);
      });

      test('hero shows company and headline', async ({ page }) => {
        await page.goto(`/work/${slug}/`);
        await expect(page.locator('.meta-company')).toHaveText(company);
        await expect(page.locator('.case-study-headline')).toBeVisible();
      });

      test('shows confidentiality notice', async ({ page }) => {
        await page.goto(`/work/${slug}/`);
        await expect(page.locator('.case-study-notice')).toBeVisible();
      });

      test('shows Outcome and Tech sections', async ({ page }) => {
        await page.goto(`/work/${slug}/`);
        await expect(page.locator('.case-study-outcome')).toBeVisible();
        await expect(page.locator('.case-study-tech')).toBeVisible();
      });

      test('back link returns home', async ({ page }) => {
        await page.goto(`/work/${slug}/`);
        const back = page.locator('.case-study-back').first();
        await expect(back).toBeVisible();
        await back.click();
        await expect(page).toHaveURL('/');
      });
    });
  }

  test('Leather page shows outcome stat grid (not text)', async ({ page }) => {
    await page.goto('/work/leather/');
    await expect(page.locator('.outcome-grid')).toBeVisible();
    await expect(page.locator('.outcome-stat')).toHaveCount(5);
  });

  test('stub pages show outcome text (not stat grid)', async ({ page }) => {
    for (const slug of ['cryptowatch', 'xapo', 'qredo']) {
      await page.goto(`/work/${slug}/`);
      await expect(page.locator('.outcome-text')).toBeVisible();
      await expect(page.locator('.outcome-grid')).toHaveCount(0);
    }
  });
});
