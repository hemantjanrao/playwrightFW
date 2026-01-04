import { Locator, Page } from '@playwright/test';
import BasePage from '../../core/base/base.page';
import { logger } from '../../core/utils/logger';

export default class LoginPage extends BasePage {
  private inputEmail: Locator;
  private inputPassword: Locator;
  private buttonSubmit: Locator;
  private homeLink: Locator;

  constructor(page: Page) {
    super(page);
    this.inputEmail = this.page.locator('input[name="username"]');
    this.inputPassword = this.page.locator('input[name="password"]');
    this.buttonSubmit = this.page.locator('input[value="Log In"]');
    this.homeLink = this.page.locator('li.home');
  }

  /**
   * Navigate to login page
   * @returns Promise<void>
   */
  public async navigate(): Promise<void> {
    await logger.step('Navigate to login page', async () => {
      await this.goto('/');
    });
  }

  /**
   * Login to the application
   * @param username - User's username
   * @param password - User's password
   * @returns Promise<void>
   */
  public async login(username: string, password: string): Promise<void> {
    await logger.step(`Login with username: ${username}`, async () => {
      await this.fill(this.inputEmail, username);
      await this.fill(this.inputPassword, password);
      await this.click(this.buttonSubmit);
      logger.info('Login button clicked');
    });
  }

  /**
   * Verify whether the user is on the login page
   * @returns Promise<boolean>
   */
  public async isOn(): Promise<boolean> {
    return await this.isVisible(this.buttonSubmit);
  }

  /**
   * Verify user is logged in successfully
   * @returns Promise<boolean>
   */
  public async isLoggedIn(): Promise<boolean> {
    return await this.isVisible(this.homeLink);
  }

  /**
   * Get login button text
   * @returns Promise<string>
   */
  public async getLoginButtonText(): Promise<string> {
    return await this.getText(this.buttonSubmit);
  }
}
