import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { SELECTORS, URLS } from '../utils/constants';

/**
 * Checkout Complete Page Object
 */
export class CheckoutCompletePage extends BasePage {
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.completeHeader = page.locator(SELECTORS.CHECKOUT.COMPLETE_HEADER);
    this.completeText = page.locator('.complete-text');
    this.backHomeButton = page.locator(SELECTORS.CHECKOUT.BACK_HOME_BUTTON);
  }

  /**
   * Navigate to checkout complete page
   */
  async navigate(): Promise<void> {
    await this.goto(URLS.CHECKOUT_COMPLETE);
  }

  /**
   * Get complete header text
   */
  async getCompleteHeaderText(): Promise<string> {
    return await this.completeHeader.textContent() || '';
  }

  /**
   * Get complete message text
   */
  async getCompleteMessageText(): Promise<string> {
    return await this.completeText.textContent() || '';
  }

  /**
   * Check if order is complete
   */
  async isOrderComplete(): Promise<boolean> {
    return await this.completeHeader.isVisible();
  }

  /**
   * Click back home
   */
  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }

  /**
   * Verify checkout complete page
   */
  async verifyCheckoutComplete(): Promise<boolean> {
    const headerText = await this.getCompleteHeaderText();
    return headerText.toLowerCase().includes('thank you');
  }
}
