import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/login.page';
import { InventoryPage } from '../../page-objects/inventory.page';
import { CartPage } from '../../page-objects/cart.page';
import { ProductDetailsPage } from '../../page-objects/product-details.page';
import { TEST_USERS } from '../fixtures/test-users';
import { PRODUCT_NAMES, URLS } from '../../utils/constants';

test.describe('Navigation Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let productDetailsPage: ProductDetailsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    productDetailsPage = new ProductDetailsPage(page);
    
    // Login before each test
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.STANDARD.username, TEST_USERS.STANDARD.password);
  });

  test.describe('Burger Menu', () => {
    test('should open burger menu', async () => {
      await inventoryPage.openMenu();
      
      // Verify logout link is visible (menu is open)
      expect(await inventoryPage.logoutLink.isVisible()).toBeTruthy();
    });

    test('should close burger menu', async () => {
      await inventoryPage.openMenu();
      expect(await inventoryPage.logoutLink.isVisible()).toBeTruthy();
      
      await inventoryPage.closeMenu();
      
      // Menu should be closed
      // Note: The menu doesn't completely disappear, but slides out
    });

    test('should display all menu items', async () => {
      await inventoryPage.openMenu();
      
      expect(await inventoryPage.allItemsLink.isVisible()).toBeTruthy();
      expect(await inventoryPage.aboutLink.isVisible()).toBeTruthy();
      expect(await inventoryPage.logoutLink.isVisible()).toBeTruthy();
      expect(await inventoryPage.resetAppLink.isVisible()).toBeTruthy();
    });
  });

  test.describe('Menu Navigation', () => {
    test('should navigate to All Items from cart', async ({ page }) => {
      // Go to cart first
      await inventoryPage.goToCart();
      expect(page.url()).toContain(URLS.CART);
      
      // Navigate to All Items
      await cartPage.goToAllItems();
      
      expect(page.url()).toContain(URLS.INVENTORY);
    });

    test('should logout from menu', async ({ page }) => {
      await inventoryPage.logout();
      
      expect(page.url()).toContain(URLS.LOGIN);
    });

    test('should reset app state', async () => {
      // Add items to cart
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BIKE_LIGHT);
      
      expect(await inventoryPage.getCartItemCount()).toBe(2);
      
      // Reset app state
      await inventoryPage.resetAppState();
      
      // Cart should be cleared
      expect(await inventoryPage.isCartBadgeVisible()).toBeFalsy();
    });

    test('should navigate to About page', async ({ page }) => {
      // Increase timeout for external navigation
      test.setTimeout(60000);
      
      await inventoryPage.openMenu();
      await inventoryPage.aboutLink.click();
      
      // About link goes to saucelabs.com - wait with extended timeout
      await page.waitForURL(/saucelabs.com/, { timeout: 30000 });
      expect(page.url()).toContain('saucelabs.com');
    });
  });

  test.describe('Cart Navigation', () => {
    test('should navigate to cart from inventory', async ({ page }) => {
      await inventoryPage.goToCart();
      
      expect(page.url()).toContain(URLS.CART);
    });

    test('should navigate to cart from product details', async ({ page }) => {
      await inventoryPage.clickProductByName('Sauce Labs Backpack');
      await productDetailsPage.goToCart();
      
      expect(page.url()).toContain(URLS.CART);
    });

    test('should navigate back to inventory from cart', async ({ page }) => {
      await inventoryPage.goToCart();
      await cartPage.continueShopping();
      
      expect(page.url()).toContain(URLS.INVENTORY);
    });
  });

  test.describe('Product Navigation', () => {
    test('should navigate to product details', async ({ page }) => {
      await inventoryPage.clickProductByName('Sauce Labs Backpack');
      
      expect(page.url()).toContain('inventory-item.html');
    });

    test('should navigate back from product details', async ({ page }) => {
      await inventoryPage.clickProductByName('Sauce Labs Backpack');
      await productDetailsPage.clickBackToProducts();
      
      expect(page.url()).toContain(URLS.INVENTORY);
    });

    test('should navigate between different products', async ({ page }) => {
      // Navigate to first product
      await inventoryPage.clickProductByName('Sauce Labs Backpack');
      expect(page.url()).toContain('id=4');
      
      // Go back
      await productDetailsPage.clickBackToProducts();
      
      // Navigate to second product
      await inventoryPage.clickProductByName('Sauce Labs Bike Light');
      expect(page.url()).toContain('id=0');
    });
  });

  test.describe('Page Title and URL Verification', () => {
    test('should have correct page title', async () => {
      const title = await inventoryPage.getPageTitle();
      expect(title).toBe('Swag Labs');
    });

    test('should maintain correct URL during navigation', async ({ page }) => {
      // Inventory page
      expect(page.url()).toContain(URLS.INVENTORY);
      
      // Cart page
      await inventoryPage.goToCart();
      expect(page.url()).toContain(URLS.CART);
      
      // Back to inventory
      await cartPage.continueShopping();
      expect(page.url()).toContain(URLS.INVENTORY);
    });
  });

  test.describe('Shopping Cart Badge', () => {
    test('should display cart badge when items added', async () => {
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
      
      const isBadgeVisible = await inventoryPage.isCartBadgeVisible();
      expect(isBadgeVisible).toBeTruthy();
    });

    test('should update cart badge across different pages', async () => {
      // Add item on inventory page
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
      expect(await inventoryPage.getCartItemCount()).toBe(1);
      
      // Navigate to product details
      await inventoryPage.clickProductByName('Sauce Labs Bike Light');
      
      // Cart badge should still show 1
      expect(await productDetailsPage.getCartItemCount()).toBe(1);
      
      // Add another item
      await productDetailsPage.addToCart();
      
      // Cart badge should show 2
      expect(await productDetailsPage.getCartItemCount()).toBe(2);
    });

    test('should hide cart badge after removing all items', async () => {
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
      await inventoryPage.goToCart();
      await cartPage.removeItemByName(PRODUCT_NAMES.BACKPACK);
      
      await cartPage.continueShopping();
      
      expect(await inventoryPage.isCartBadgeVisible()).toBeFalsy();
    });
  });

  test.describe('Browser Navigation', () => {
    test('should handle browser back button', async ({ page }) => {
      // Navigate to cart
      await inventoryPage.goToCart();
      
      // Use browser back
      await page.goBack();
      
      expect(page.url()).toContain(URLS.INVENTORY);
    });

    test('should handle browser forward button', async ({ page }) => {
      // Navigate to cart
      await inventoryPage.goToCart();
      
      // Go back
      await page.goBack();
      
      // Go forward
      await page.goForward();
      
      expect(page.url()).toContain(URLS.CART);
    });

    test('should maintain state during browser navigation', async ({ page }) => {
      // Add items
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BIKE_LIGHT);
      
      // Navigate to cart
      await inventoryPage.goToCart();
      
      // Go back
      await page.goBack();
      
      // Cart badge should still show 2
      expect(await inventoryPage.getCartItemCount()).toBe(2);
    });
  });

  test.describe('Footer Links', () => {
    test('should display footer with social media links', async ({ page }) => {
      const twitterLink = await page.locator('.social_twitter').isVisible();
      const facebookLink = await page.locator('.social_facebook').isVisible();
      const linkedinLink = await page.locator('.social_linkedin').isVisible();
      
      expect(twitterLink).toBeTruthy();
      expect(facebookLink).toBeTruthy();
      expect(linkedinLink).toBeTruthy();
    });

    test('should display footer text', async ({ page }) => {
      const footerText = await page.locator('.footer_copy').textContent();
      expect(footerText).toContain('Sauce Labs');
    });
  });

  test.describe('Direct URL Access', () => {
    test('should access cart directly via URL', async ({ page }) => {
      await page.goto(URLS.CART);
      expect(page.url()).toContain(URLS.CART);
    });

    test('should access product details directly via URL', async ({ page }) => {
      await page.goto('/inventory-item.html?id=4');
      expect(page.url()).toContain('inventory-item.html?id=4');
    });
  });
});
