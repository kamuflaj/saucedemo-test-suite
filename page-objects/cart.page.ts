import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { SELECTORS, URLS } from '../utils/constants';

/**
 * Cart Page Object
 */
export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator(SELECTORS.CART.CART_ITEM);
    this.continueShoppingButton = page.locator(SELECTORS.CART.CONTINUE_SHOPPING);
    this.checkoutButton = page.locator(SELECTORS.CART.CHECKOUT_BUTTON);
  }

  /**
   * Navigate to cart page
   */
  async navigate(): Promise<void> {
    await this.goto(URLS.CART);
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
   * Get all cart item prices
   */
  async getCartItemPrices(): Promise<number[]> {
    const prices = await this.page.locator(SELECTORS.CART.CART_ITEM_PRICE).allTextContents();
    return prices.map(price => parseFloat(price.replace('$', '')));
  }

  /**
   * Remove item from cart by name
   */
  async removeItemByName(itemName: string): Promise<void> {
    const selector = SELECTORS.CART.REMOVE_BUTTON(itemName);
    await this.page.locator(selector).click();
  }

  /**
   * Click continue shopping
   */
  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  /**
   * Click checkout
   */
  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    return (await this.getCartItemCount()) === 0;
  }

  /**
   * Get cart total (sum of all item prices)
   */
  async getCartSubtotal(): Promise<number> {
    const prices = await this.getCartItemPrices();
    return prices.reduce((sum, price) => sum + price, 0);
  }

  /**
   * Check if item exists in cart
   */
  async isItemInCart(itemName: string): Promise<boolean> {
    const items = await this.getCartItemNames();
    return items.some(name => name.includes(itemName));
  }

  /**
   * Remove all items from cart
   */
  async removeAllItems(): Promise<void> {
    const count = await this.getCartItemCount();
    for (let i = 0; i < count; i++) {
      const firstItem = this.cartItems.first();
      const removeButton = firstItem.locator('button');
      await removeButton.click();
    }
  }

  /**
   * Get cart item details
   */
  async getCartItemDetails(index: number): Promise<{ name: string; price: number; quantity: number }> {
    const item = this.cartItems.nth(index);
    const name = await item.locator(SELECTORS.CART.CART_ITEM_NAME).textContent() || '';
    const priceText = await item.locator(SELECTORS.CART.CART_ITEM_PRICE).textContent() || '$0';
    const quantityText = await item.locator(SELECTORS.CART.CART_QUANTITY).textContent() || '0';
    
    return {
      name,
      price: parseFloat(priceText.replace('$', '')),
      quantity: parseInt(quantityText),
    };
  }
}
