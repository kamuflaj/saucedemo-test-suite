import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { SELECTORS, URLS } from '../utils/constants';

/**
 * Checkout Step One (Information) Page Object
 */
export class CheckoutStepOnePage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator(SELECTORS.CHECKOUT.FIRST_NAME);
    this.lastNameInput = page.locator(SELECTORS.CHECKOUT.LAST_NAME);
    this.postalCodeInput = page.locator(SELECTORS.CHECKOUT.POSTAL_CODE);
    this.continueButton = page.locator(SELECTORS.CHECKOUT.CONTINUE_BUTTON);
    this.cancelButton = page.locator(SELECTORS.CHECKOUT.CANCEL_BUTTON);
    this.errorMessage = page.locator(SELECTORS.LOGIN.ERROR_MESSAGE);
  }

  /**
   * Navigate to checkout step one
   */
  async navigate(): Promise<void> {
    await this.goto(URLS.CHECKOUT_STEP_ONE);
  }

  /**
   * Enter first name
   */
  async enterFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  /**
   * Enter last name
   */
  async enterLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  /**
   * Enter postal code
   */
  async enterPostalCode(postalCode: string): Promise<void> {
    await this.postalCodeInput.fill(postalCode);
  }

  /**
   * Fill checkout information
   */
  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.enterFirstName(firstName);
    await this.enterLastName(lastName);
    await this.enterPostalCode(postalCode);
  }

  /**
   * Click continue
   */
  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  /**
   * Click cancel
   */
  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    try {
      return await this.errorMessage.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Complete checkout step one
   */
  async completeStepOne(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fillCheckoutInfo(firstName, lastName, postalCode);
    await this.continue();
  }
}
