import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { SELECTORS } from '../utils/constants';

/**
 * Product Details Page Object
 */
export class ProductDetailsPage extends BasePage {
  readonly backToProductsButton: Locator;
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.backToProductsButton = page.locator(SELECTORS.PRODUCT_DETAILS.BACK_TO_PRODUCTS);
    this.productName = page.locator(SELECTORS.PRODUCT_DETAILS.PRODUCT_NAME);
    this.productDescription = page.locator(SELECTORS.PRODUCT_DETAILS.PRODUCT_DESC);
    this.productPrice = page.locator(SELECTORS.PRODUCT_DETAILS.PRODUCT_PRICE);
    this.addToCartButton = page.locator(SELECTORS.PRODUCT_DETAILS.ADD_TO_CART);
  }

  /**
   * Click back to products
   */
  async clickBackToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }

  /**
   * Get product name
   */
  async getProductName(): Promise<string> {
    return await this.productName.textContent() || '';
  }

  /**
   * Get product description
   */
  async getProductDescription(): Promise<string> {
    return await this.productDescription.textContent() || '';
  }

  /**
   * Get product price
   */
  async getProductPrice(): Promise<number> {
    const priceText = await this.productPrice.textContent() || '$0';
    return parseFloat(priceText.replace('$', ''));
  }

  /**
   * Add product to cart
   */
  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  /**
   * Remove product from cart
   */
  async removeFromCart(): Promise<void> {
    await this.addToCartButton.click(); // Button toggles to Remove
  }

  /**
   * Check if product is in cart
   */
  async isProductInCart(): Promise<boolean> {
    const buttonText = await this.addToCartButton.textContent();
    return buttonText?.toLowerCase().includes('remove') || false;
  }

  /**
   * Get complete product details
   */
  async getProductDetails(): Promise<{ name: string; description: string; price: number }> {
    return {
      name: await this.getProductName(),
      description: await this.getProductDescription(),
      price: await this.getProductPrice(),
    };
  }
}
