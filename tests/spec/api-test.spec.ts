import { test, expect } from '../core/base/fixtures';
import { logger } from '../core/utils/logger';
import { config } from '../core/config/config';

test.describe('API Testing Examples', () => {
  test('Authentication using API @api', async ({ apiHelper }) => {
    // Perform API login
    const response = await apiHelper.post('/parabank/login.htm', {
      form: {
        username: 'h-janrao',
        password: '@Test1234'
      }
    });

    // Assert successful login
    await apiHelper.assertStatusCode(response, 200);
    logger.info('API login successful');
  });

  test('Get account information via API @api', async ({
    apiHelper,
    request
  }) => {
    // First login to get session
    await apiHelper.post('/parabank/login.htm', {
      form: {
        username: 'h-janrao',
        password: '@Test1234'
      }
    });

    // Get customer information
    const customerResponse = await apiHelper.get(
      '/parabank/services/bank/customers/12212'
    );

    // Validate response
    await apiHelper.assertStatusCode(customerResponse, 200);

    const customerData = await apiHelper.getJsonResponse(customerResponse);
    logger.info('Customer data retrieved', customerData);
  });

  test('Verify API response time @performance', async ({ apiHelper }) => {
    const startTime = Date.now();

    const response = await apiHelper.get('/parabank/services/bank/getBankInfo');

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    await apiHelper.assertStatusCode(response, 200);
    expect(
      responseTime,
      'API response time should be under 2 seconds'
    ).toBeLessThan(2000);

    logger.info(`API response time: ${responseTime}ms`);
  });

  test('Combined API and UI test @integration', async ({
    apiHelper,
    loginPage,
    page
  }) => {
    // Login via API
    const loginResponse = await apiHelper.post('/parabank/login.htm', {
      form: {
        username: 'h-janrao',
        password: '@Test1234'
      }
    });

    await apiHelper.assertStatusCode(loginResponse, 200);

    // Continue with UI verification
    await page.goto('/');
    await expect(page.locator('li.home')).toBeVisible();

    logger.info('Combined API and UI test completed');
  });
});
