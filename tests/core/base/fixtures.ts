import { test as base, Page } from '@playwright/test';
import { ApiHelper } from '../utils/api-helper';
import { config } from '../config/config';
import LoginPage from '../../spec/page/login.page';

// Extend base test with custom fixtures
type CustomFixtures = {
  loginPage: LoginPage;
  apiHelper: ApiHelper;
};

/**
 * Custom test fixtures for common page objects and utilities
 * Usage: import { test, expect } from './fixtures';
 */
export const test = base.extend<CustomFixtures>({
  /**
   * Login page fixture - automatically creates a new login page instance
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  /**
   * API helper fixture - provides API testing utilities
   */
  apiHelper: async ({ request }, use) => {
    const apiHelper = new ApiHelper(request);
    await use(apiHelper);
    // Cleanup if needed
    apiHelper.clearAuthToken();
  },

  /**
   * Override base URL from config
   */
  baseURL: config.baseUrl,

  /**
   * Configure page fixture to use config settings
   */
  page: async ({ page }, use) => {
    // Set default timeout from config
    page.setDefaultTimeout(config.timeout);

    // Navigate to base URL before each test
    await page.goto('/');

    await use(page);

    // Cleanup after test
    await page.close();
  }
});

export { expect } from '@playwright/test';
