import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

// BDD config — parallel to playwright.config.ts. The latter runs the existing
// tests/e2e/*.spec.ts; this one runs the BDD prod-routes-render guardrail
// and visual regression suite under e2e/features.

const PORT = 4321;
const baseURL = `http://localhost:${PORT}`;

const testDir = defineBddConfig({
  features: './e2e/features/**/*.feature',
  steps: './e2e/steps/**/*.ts',
  outputDir: '.features-gen',
});

export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: process.env['CI']
    ? [['html', { open: 'never', outputFolder: 'playwright-report-bdd' }]]
    : 'list',
  use: { baseURL, trace: 'on-first-retry' },
  snapshotPathTemplate:
    '{testDir}/../e2e/__screenshots__/{testFilePath}/{arg}{-projectName}{-platform}{ext}',
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.05, animations: 'disabled', caret: 'hide' },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Build then serve the production output — closer to CI than dev server.
    command: 'npm run build && npm run preview',
    url: baseURL,
    reuseExistingServer: !process.env['CI'],
    timeout: 180_000,
  },
});
