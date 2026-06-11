import { test, expect } from '@playwright/test';

const cases = [
  { slug: 'leather-mobile', title: 'Leather Mobile — Bitcoin Wallet on iOS and Android', company: 'Trust Machines' },
  { slug: 'leather-nfts',   title: 'Leather NFT Gallery — Two Chains, Multimedia, AI-Assisted Build', company: 'Trust Machines' },
  { slug: 'cryptowatch',    title: 'Cryptowatch Trading Surface — Real Money, Millions of Users', company: 'Kraken' },
  { slug: 'coderunner',     title: "Coderunner — Kraken's Trading Automation Tool", company: 'Kraken' },
  { slug: 'xapo',           title: 'Xapo', company: 'Xapo' },
  { slug: 'qredo',          title: 'Qredo', company: 'Qredo' },
  { slug: 'portfolio-pwa',  title: 'petewatters.ie — An Astro PWA With Build-Time On-Chain Data', company: 'Independent' },
];

const reposBySlug = {
  'leather-mobile': 'https://github.com/leather-io',
  'leather-nfts': 'https://github.com/leather-io',
  'stackr': 'https://github.com/pete-watters/stackr',
  'simplyfpl': 'https://github.com/pete-watters/simply-fpl',
  'portfolio-pwa': 'https://github.com/pete-watters/portfolio-pwa',
};

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

  test('Leather Mobile page shows outcome stat grid', async ({ page }) => {
    await page.goto('/work/leather-mobile/');
    await expect(page.locator('.outcome-grid')).toBeVisible();
    await expect(page.locator('.outcome-stat')).toHaveCount(4);
  });

  test('Leather NFTs page shows outcome stat grid', async ({ page }) => {
    await page.goto('/work/leather-nfts/');
    await expect(page.locator('.outcome-grid')).toBeVisible();
    await expect(page.locator('.outcome-stat')).toHaveCount(3);
  });

  test('Pages with outcomeText show outcome text (not stat grid)', async ({ page }) => {
    for (const slug of ['cryptowatch', 'coderunner', 'xapo', 'qredo']) {
      await page.goto(`/work/${slug}/`);
      await expect(page.locator('.outcome-text')).toBeVisible();
      await expect(page.locator('.outcome-grid')).toHaveCount(0);
    }
  });

  test('open-source case studies show a prominent source link in the hero', async ({ page }) => {
    for (const [slug, repo] of Object.entries(reposBySlug)) {
      await page.goto(`/work/${slug}/`);
      const repoLink = page.locator('.case-study-repo');
      await expect(repoLink).toBeVisible();
      await expect(repoLink).toHaveAttribute('href', repo);
      await expect(repoLink).toHaveAttribute('target', '_blank');
      await expect(repoLink).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  test('proprietary case studies have no source link', async ({ page }) => {
    for (const slug of ['cryptowatch', 'coderunner', 'xapo', 'qredo']) {
      await page.goto(`/work/${slug}/`);
      await expect(page.locator('.case-study-repo')).toHaveCount(0);
    }
  });

  test('Old /work/leather redirects to /work/leather-mobile', async ({ page }) => {
    await page.goto('/work/leather');
    await expect(page).toHaveURL(/\/work\/leather-mobile\/?$/);
  });
});
