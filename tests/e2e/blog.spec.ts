import { test, expect } from '@playwright/test';

test.describe('Blog', () => {
  test('listing page loads and shows posts', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('h2')).toContainText('Blog');
    await expect(page.locator('.blog-card').first()).toBeVisible();
  });

  test('blog post page renders markdown', async ({ page }) => {
    await page.goto('/blog/hello-world');
    await expect(page.locator('.blog-post h2').first()).toBeVisible();
    await expect(page.locator('.blog-post')).toContainText('Astro');
  });

  test('listing links to individual posts', async ({ page }) => {
    await page.goto('/blog');
    const firstPost = page.locator('.blog-card a').first();
    await firstPost.click();
    await expect(page.locator('.blog-post')).toBeVisible();
  });

  test('blog listing has correct title', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveTitle('Blog | Pete Watters');
  });

  test('has search element', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('#search')).toBeVisible();
  });

  test('has tag filter pills', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('.tag-filters')).toBeVisible();
    await expect(page.locator('.tag-filters button[data-tag="all"]')).toBeVisible();
  });

  test('tag filter "All" is selected by default', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('.tag-filters button[data-tag="all"]')).toHaveAttribute('aria-selected', 'true');
  });

  test('clicking a tag filters posts', async ({ page }) => {
    await page.goto('/blog');
    const allCards = page.locator('.blog-card');
    const totalBefore = await allCards.count();

    // Click a specific tag that won't match all posts
    const firstTagButton = page.locator('.tag-filters button:not([data-tag="all"])').first();
    const tagName = await firstTagButton.textContent();
    await firstTagButton.click();

    // The tag should now be selected
    await expect(firstTagButton).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('.tag-filters button[data-tag="all"]')).toHaveAttribute('aria-selected', 'false');

    // At least one card should be visible
    const visibleCards = page.locator('.blog-card:not([hidden])');
    expect(await visibleCards.count()).toBeGreaterThan(0);
    expect(await visibleCards.count()).toBeLessThanOrEqual(totalBefore);

    // Visible cards should have the filtered tag
    for (const card of await visibleCards.all()) {
      const tags = await card.getAttribute('data-tags');
      expect(tags).toContain(tagName);
    }
  });

  test('clicking "All" resets tag filter', async ({ page }) => {
    await page.goto('/blog');
    const totalBefore = await page.locator('.blog-card').count();

    // Filter by a tag first
    await page.locator('.tag-filters button:not([data-tag="all"])').first().click();

    // Reset
    await page.locator('.tag-filters button[data-tag="all"]').click();
    await expect(page.locator('.tag-filters button[data-tag="all"]')).toHaveAttribute('aria-selected', 'true');

    const visibleCards = page.locator('.blog-card:not([hidden])');
    expect(await visibleCards.count()).toBe(totalBefore);
  });

  test('blog post shows date and tags', async ({ page }) => {
    await page.goto('/blog/hello-world');
    await expect(page.locator('.blog-post time')).toBeVisible();
    await expect(page.locator('.blog-post .tags li').first()).toBeVisible();
  });

  test('blog post back arrow links to blog', async ({ page }) => {
    await page.goto('/blog/hello-world');
    const backLink = page.locator('.back-link');
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/blog');
  });

  test('has back arrow linking to home', async ({ page }) => {
    await page.goto('/blog');
    const backLink = page.locator('.back-link');
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/');
  });

  test('blog cards have data-tags attribute', async ({ page }) => {
    await page.goto('/blog');
    const firstCard = page.locator('.blog-card').first();
    const tags = await firstCard.getAttribute('data-tags');
    expect(tags).toBeTruthy();
    expect(tags!.split(',').length).toBeGreaterThan(0);
  });

  test('tag links in cards point to blog filter', async ({ page }) => {
    await page.goto('/blog');
    const tagLink = page.locator('.blog-card .tags a[data-filter-tag]').first();
    await expect(tagLink).toBeVisible();
    await expect(tagLink).toHaveAttribute('href', /\/blog#/);
  });
});
