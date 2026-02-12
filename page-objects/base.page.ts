import { Page, Locator } from '@playwright/test';
import { SELECTORS } from '../utils/constants';

/**
 * Base Page Object - contains common methods and elements
 */
export class BasePage {
  readonly page: Page;
  readonly burgerMenu: Locator;
  readonly logoutLink: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly resetAppLink: Locator;
  readonly closeMenuButton: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.burgerMenu = page.locator(SELECTORS.NAVIGATION.BURGER_MENU);
    this.logoutLink = page.locator(SELECTORS.NAVIGATION.LOGOUT_LINK);
    this.allItemsLink = page.locator(SELECTORS.NAVIGATION.ALL_ITEMS_LINK);
    this.aboutLink = page.locator(SELECTORS.NAVIGATION.ABOUT_LINK);
    this.resetAppLink = page.locator(SELECTORS.NAVIGATION.RESET_APP_LINK);
    this.closeMenuButton = page.locator(SELECTORS.NAVIGATION.CLOSE_MENU);
    this.shoppingCartLink = page.locator(SELECTORS.INVENTORY.SHOPPING_CART_LINK);
    this.shoppingCartBadge = page.locator(SELECTORS.INVENTORY.SHOPPING_CART_BADGE);
  }

  /**
   * Navigate to a specific URL
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Open burger menu
   */
  async openMenu(): Promise<void> {
    await this.burgerMenu.click();
    await this.logoutLink.waitFor({ state: 'visible' });
  }

  /**
   * Close burger menu
   */
  async closeMenu(): Promise<void> {
    await this.closeMenuButton.click();
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await this.openMenu();
    await this.logoutLink.click();
  }

  /**
   * Navigate to all items
   */
  async goToAllItems(): Promise<void> {
    await this.openMenu();
    await this.allItemsLink.click();
  }

  /**
   * Reset app state
   */
  async resetAppState(): Promise<void> {
    await this.openMenu();
    await this.resetAppLink.click();
    await this.closeMenu();
  }

  /**
   * Go to cart
   */
  async goToCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  /**
   * Get cart badge count
   */
  async getCartItemCount(): Promise<number> {
    try {
      const count = await this.shoppingCartBadge.textContent();
      return count ? parseInt(count) : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Check if cart badge is visible
   */
  async isCartBadgeVisible(): Promise<boolean> {
    return await this.shoppingCartBadge.isVisible();
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Wait for page load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }
}
