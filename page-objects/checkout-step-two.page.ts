import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { SELECTORS, URLS } from '../utils/constants';

/**
 * Checkout Step Two (Overview) Page Object
 */
export class CheckoutStepTwoPage extends BasePage {
  readonly cartItems: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly paymentInfo: Locator;
  readonly shippingInfo: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator(SELECTORS.CART.CART_ITEM);
    this.itemTotal = page.locator(SELECTORS.CHECKOUT.ITEM_TOTAL);
    this.tax = page.locator(SELECTORS.CHECKOUT.TAX);
    this.total = page.locator(SELECTORS.CHECKOUT.TOTAL);
    this.paymentInfo = page.locator(SELECTORS.CHECKOUT.PAYMENT_INFO);
    this.shippingInfo = page.locator(SELECTORS.CHECKOUT.SHIPPING_INFO);
    this.finishButton = page.locator(SELECTORS.CHECKOUT.FINISH_BUTTON);
    this.cancelButton = page.locator(SELECTORS.CHECKOUT.CANCEL_BUTTON);
  }

  /**
   * Navigate to checkout step two
   */
  async navigate(): Promise<void> {
    await this.goto(URLS.CHECKOUT_STEP_TWO);
  }

  /**
   * Get item total (subtotal)
   */
  async getItemTotal(): Promise<number> {
    const text = await this.itemTotal.textContent() || '';
    const match = text.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get tax amount
   */
  async getTax(): Promise<number> {
    const text = await this.tax.textContent() || '';
    const match = text.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get total amount
   */
  async getTotal(): Promise<number> {
    const text = await this.total.textContent() || '';
    const match = text.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get payment information
   */
  async getPaymentInfo(): Promise<string> {
    return await this.paymentInfo.textContent() || '';
  }

  /**
   * Get shipping information
   */
  async getShippingInfo(): Promise<string> {
    return await this.shippingInfo.textContent() || '';
  }

  /**
   * Get cart item count
   */
  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /**
   * Get all cart item names
   */
  async getCartItemNames(): Promise<string[]> {
    return await this.page.locator(SELECTORS.CART.CART_ITEM_NAME).allTextContents();
  }

  /**
   * Click finish
   */
  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  /**
   * Click cancel
   */
  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Get complete order summary
   */
  async getOrderSummary(): Promise<{
    itemTotal: number;
    tax: number;
    total: number;
    paymentInfo: string;
    shippingInfo: string;
    itemCount: number;
  }> {
    return {
      itemTotal: await this.getItemTotal(),
      tax: await this.getTax(),
      total: await this.getTotal(),
      paymentInfo: await this.getPaymentInfo(),
      shippingInfo: await this.getShippingInfo(),
      itemCount: await this.getCartItemCount(),
    };
  }
}
