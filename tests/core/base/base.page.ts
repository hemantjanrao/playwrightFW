import { Locator, Page } from '@playwright/test';
import { logger } from '../utils/logger';

export default class BasePage {
  protected page!: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param url - URL to navigate to
   */
  protected async goto(url: string): Promise<void> {
    logger.info(`Navigating to: ${url}`);
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to be fully loaded
   */
  protected async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page
      .waitForLoadState('networkidle', { timeout: 10000 })
      .catch(() => {
        logger.warn('Network idle timeout - continuing anyway');
      });
    logger.debug('Page loaded successfully');
  }

  /**
   * Wait for an element to be visible
   * @param locator - Element locator
   * @param timeout - Optional timeout in milliseconds
   */
  protected async waitForElement(
    locator: Locator,
    timeout = 10000
  ): Promise<void> {
    logger.debug(`Waiting for element to be visible`);
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for an element to be hidden
   * @param locator - Element locator
   * @param timeout - Optional timeout in milliseconds
   */
  protected async waitForElementToBeHidden(
    locator: Locator,
    timeout = 10000
  ): Promise<void> {
    logger.debug(`Waiting for element to be hidden`);
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Scroll to an element
   * @param locator - Element locator
   */
  protected async scrollToElement(locator: Locator): Promise<void> {
    logger.debug('Scrolling to element');
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Click an element with retry logic
   * @param locator - Element locator
   * @param options - Click options
   */
  protected async click(
    locator: Locator,
    options?: { force?: boolean; timeout?: number }
  ): Promise<void> {
    logger.debug('Clicking element');
    await this.waitForElement(locator, options?.timeout);
    await locator.click(options);
  }

  /**
   * Fill input field with retry logic
   * @param locator - Element locator
   * @param value - Value to fill
   */
  protected async fill(locator: Locator, value: string): Promise<void> {
    logger.debug(`Filling element with value: ${value}`);
    await this.waitForElement(locator);
    await locator.fill(value);
  }

  /**
   * Get text from an element
   * @param locator - Element locator
   * @returns Text content of the element
   */
  protected async getText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    const text = await locator.textContent();
    logger.debug(`Got text: ${text}`);
    return text || '';
  }

  /**
   * Get all text contents from multiple elements
   * @param locator - Element locator
   * @returns Array of text contents
   */
  protected async getAllTexts(locator: Locator): Promise<string[]> {
    await locator.first().waitFor({ state: 'visible' });
    const texts = await locator.allTextContents();
    logger.debug(`Got ${texts.length} text elements`);
    return texts;
  }

  /**
   * Check if element is visible
   * @param locator - Element locator
   * @returns True if element is visible
   */
  protected async isVisible(locator: Locator): Promise<boolean> {
    try {
      const visible = await locator.isVisible();
      logger.debug(`Element visibility: ${visible}`);
      return visible;
    } catch (e) {
      return false;
    }
  }

  /**
   * Check if element is enabled
   * @param locator - Element locator
   * @returns True if element is enabled
   */
  protected async isEnabled(locator: Locator): Promise<boolean> {
    const enabled = await locator.isEnabled();
    logger.debug(`Element enabled: ${enabled}`);
    return enabled;
  }

  /**
   * Take screenshot of the page
   * @param name - Screenshot name
   */
  protected async takeScreenshot(name: string): Promise<void> {
    logger.info(`Taking screenshot: ${name}`);
    await this.page.screenshot({
      path: `screenshots/${name}.png`,
      fullPage: true
    });
  }

  /**
   * Take screenshot of a specific element
   * @param locator - Element locator
   * @param name - Screenshot name
   */
  protected async takeElementScreenshot(
    locator: Locator,
    name: string
  ): Promise<void> {
    logger.info(`Taking element screenshot: ${name}`);
    await locator.screenshot({ path: `screenshots/${name}.png` });
  }

  /**
   * Get current page URL
   * @returns Current URL
   */
  protected async getCurrentUrl(): Promise<string> {
    const url = this.page.url();
    logger.debug(`Current URL: ${url}`);
    return url;
  }

  /**
   * Get page title
   * @returns Page title
   */
  protected async getTitle(): Promise<string> {
    const title = await this.page.title();
    logger.debug(`Page title: ${title}`);
    return title;
  }

  /**
   * Wait for specified time
   * @param milliseconds - Time to wait in milliseconds
   */
  protected async wait(milliseconds: number): Promise<void> {
    logger.debug(`Waiting for ${milliseconds}ms`);
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * Reload the page
   */
  protected async reload(): Promise<void> {
    logger.info('Reloading page');
    await this.page.reload();
    await this.waitForPageLoad();
  }

  /**
   * Go back in browser history
   */
  protected async goBack(): Promise<void> {
    logger.info('Navigating back');
    await this.page.goBack();
    await this.waitForPageLoad();
  }

  /**
   * Select option from dropdown
   * @param locator - Select element locator
   * @param value - Value to select
   */
  protected async selectOption(locator: Locator, value: string): Promise<void> {
    logger.debug(`Selecting option: ${value}`);
    await this.waitForElement(locator);
    await locator.selectOption(value);
  }

  /**
   * Check a checkbox
   * @param locator - Checkbox locator
   */
  protected async check(locator: Locator): Promise<void> {
    logger.debug('Checking checkbox');
    await this.waitForElement(locator);
    await locator.check();
  }

  /**
   * Uncheck a checkbox
   * @param locator - Checkbox locator
   */
  protected async uncheck(locator: Locator): Promise<void> {
    logger.debug('Unchecking checkbox');
    await this.waitForElement(locator);
    await locator.uncheck();
  }

  /**
   * Hover over an element
   * @param locator - Element locator
   */
  protected async hover(locator: Locator): Promise<void> {
    logger.debug('Hovering over element');
    await this.waitForElement(locator);
    await locator.hover();
  }

  /**
   * Press a key
   * @param key - Key to press
   */
  protected async pressKey(key: string): Promise<void> {
    logger.debug(`Pressing key: ${key}`);
    await this.page.keyboard.press(key);
  }

  /**
   * Get element count
   * @param locator - Element locator
   * @returns Number of elements
   */
  protected async getElementCount(locator: Locator): Promise<number> {
    const count = await locator.count();
    logger.debug(`Element count: ${count}`);
    return count;
  }
}
