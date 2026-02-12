import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { SELECTORS, URLS } from '../utils/constants';

/**
 * Inventory/Products Page Object
 */
export class InventoryPage extends BasePage {
  readonly inventoryItems: Locator;
  readonly sortContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryItems = page.locator(SELECTORS.INVENTORY.ITEM);
    this.sortContainer = page.locator(SELECTORS.INVENTORY.SORT_CONTAINER);
  }

  /**
   * Navigate to inventory page
   */
  async navigate(): Promise<void> {
    await this.goto(URLS.INVENTORY);
  }

  /**
   * Get all product names
   */
  async getProductNames(): Promise<string[]> {
    const names = await this.page.locator(SELECTORS.INVENTORY.ITEM_NAME).allTextContents();
    return names;
  }

  /**
   * Get all product prices
   */
  async getProductPrices(): Promise<number[]> {
    const prices = await this.page.locator(SELECTORS.INVENTORY.ITEM_PRICE).allTextContents();
    return prices.map(price => parseFloat(price.replace('$', '')));
  }

  /**
   * Get product count
   */
  async getProductCount(): Promise<number> {
    return await this.inventoryItems.count();
  }

  /**
   * Add item to cart by name
   */
  async addItemToCart(itemName: string): Promise<void> {
    const selector = SELECTORS.INVENTORY.ADD_TO_CART_BUTTON(itemName);
    await this.page.locator(selector).click();
  }

  /**
   * Remove item from cart by name
   */
  async removeItemFromCart(itemName: string): Promise<void> {
    const selector = SELECTORS.INVENTORY.REMOVE_BUTTON(itemName);
    await this.page.locator(selector).click();
  }

  /**
   * Check if item is in cart
   */
  async isItemInCart(itemName: string): Promise<boolean> {
    const selector = SELECTORS.INVENTORY.REMOVE_BUTTON(itemName);
    return await this.page.locator(selector).isVisible();
  }

  /**
   * Click on product name to view details
   */
  async clickProductByName(productName: string): Promise<void> {
    await this.page.locator(SELECTORS.INVENTORY.ITEM_NAME, { hasText: productName }).click();
  }

  /**
   * Sort products
   */
  async sortProducts(sortOption: string): Promise<void> {
    await this.sortContainer.selectOption(sortOption);
  }

  /**
   * Get current sort option
   */
  async getCurrentSortOption(): Promise<string> {
    return await this.sortContainer.inputValue();
  }

  /**
   * Get product details by index
   */
  async getProductDetails(index: number): Promise<{ name: string; description: string; price: number }> {
    const item = this.inventoryItems.nth(index);
    const name = await item.locator(SELECTORS.INVENTORY.ITEM_NAME).textContent() || '';
    const description = await item.locator(SELECTORS.INVENTORY.ITEM_DESC).textContent() || '';
    const priceText = await item.locator(SELECTORS.INVENTORY.ITEM_PRICE).textContent() || '$0';
    const price = parseFloat(priceText.replace('$', ''));
    
    return { name, description, price };
  }

  /**
   * Add multiple items to cart
   */
  async addMultipleItemsToCart(itemNames: string[]): Promise<void> {
    for (const itemName of itemNames) {
      await this.addItemToCart(itemName);
    }
  }
}
