import { test, expect } from '../core/base/fixtures';
import { LoginTestData } from '../core/data/test-data';
import { logger } from '../core/utils/logger';

test.describe('Authentication', () => {
  test.beforeEach(async ({ loginPage }) => {
    logger.info('Setting up authentication test');
    await loginPage.navigate();
  });

  test('Login with valid credentials via UI @smoke', async ({
    loginPage,
    page
  }) => {
    // Get test data from config
    const validUser = LoginTestData.getValidUser();

    // Perform login
    await loginPage.login(validUser.username, validUser.password);

    // Verify successful login
    await expect(page.locator('li.home')).toBeVisible();
    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn, 'User should be logged in').toBe(true);

    logger.info('Login test completed successfully');
  });

  test('Login with invalid credentials @negative', async ({
    loginPage,
    page
  }) => {
    const invalidUser = LoginTestData.getInvalidUser();

    await loginPage.login(invalidUser.username, invalidUser.password);

    // Verify error message appears
    const errorSelector = page.locator('.error');
    await expect(errorSelector).toBeVisible();

    logger.info('Invalid login test completed');
  });

  test('Verify login page is displayed @smoke', async ({ loginPage }) => {
    const isOnLoginPage = await loginPage.isOn();
    expect(isOnLoginPage, 'Login page should be displayed').toBe(true);

    logger.info('Login page verification completed');
  });
});
