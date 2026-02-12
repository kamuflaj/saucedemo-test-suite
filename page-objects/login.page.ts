import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { SELECTORS, URLS } from '../utils/constants';

/**
 * Login Page Object
 */
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator(SELECTORS.LOGIN.USERNAME_INPUT);
    this.passwordInput = page.locator(SELECTORS.LOGIN.PASSWORD_INPUT);
    this.loginButton = page.locator(SELECTORS.LOGIN.LOGIN_BUTTON);
    this.errorMessage = page.locator(SELECTORS.LOGIN.ERROR_MESSAGE);
    this.errorButton = page.locator(SELECTORS.LOGIN.ERROR_BUTTON);
  }

  /**
   * Navigate to login page
   */
  async navigate(): Promise<void> {
    await this.goto(URLS.LOGIN);
  }

  /**
   * Enter username
   */
  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  /**
   * Enter password
   */
  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Click login button
   */
  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Perform login
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Close error message
   */
  async closeErrorMessage(): Promise<void> {
    await this.errorButton.click();
  }

  /**
   * Clear username field
   */
  async clearUsername(): Promise<void> {
    await this.usernameInput.clear();
  }

  /**
   * Clear password field
   */
  async clearPassword(): Promise<void> {
    await this.passwordInput.clear();
  }

  /**
   * Check if login button is enabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }
}
