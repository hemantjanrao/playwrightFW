import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',

  /* Maximum time one test can run for. */
  timeout: 60 * 1000, // 60 seconds

  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 10000 // 10 seconds
  },

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 4,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['./tests/core/listners/reporter.ts'],
    ['html', { outputFolder: 'playwright-report/html', open: 'never' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 15000,

    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.ENVIRONMENT === 'prod'
      ? 'https://parabank.parasoft.com'
      : process.env.ENVIRONMENT === 'staging'
        ? 'https://parabank-staging.parasoft.com'
        : process.env.ENVIRONMENT === 'dev'
          ? 'https://parabank-dev.parasoft.com'
          : 'https://parabank.parasoft.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',

    /* Browser settings */
    headless: process.env.CI ? true : process.env.HEADLESS === 'true',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,

    /* Capture video and screenshots on failure */
    video: process.env.CI ? 'retain-on-failure' : 'off',
    screenshot: 'only-on-failure',

    /* Geolocation and permissions */
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox']
      }
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari']
      }
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5']
      }
    },

    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12']
      }
    }
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: './playwright-report/artifacts',

  /* Global setup and teardown */
  // globalSetup: require.resolve('./tests/core/config/global-setup.ts'),
  // globalTeardown: require.resolve('./tests/core/config/global-teardown.ts'),

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  //   timeout: 120 * 1000,
  //   reuseExistingServer: !process.env.CI,
  // },
};

export default config;
