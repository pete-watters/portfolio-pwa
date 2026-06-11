import { test, expect } from '@playwright/test';

test.describe('PWA', () => {
  test('manifest is served', async ({ request }) => {
    const response = await request.get('/manifest.webmanifest');
    expect(response.status()).toBe(200);
    const manifest = await response.json();
    expect(manifest.name).toBe('Pete Watters — Senior Web3 Frontend Engineer');
    expect(manifest.short_name).toBe('Pete Watters');
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons).toHaveLength(2);
  });

  test('service worker file is served', async ({ page }) => {
    const response = await page.goto('/sw.js');
    expect(response?.status()).toBe(200);
    const contentType = response?.headers()['content-type'];
    expect(contentType).toContain('javascript');
  });

  test('registerSW script is served', async ({ page }) => {
    const response = await page.goto('/registerSW.js');
    expect(response?.status()).toBe(200);
  });
});
