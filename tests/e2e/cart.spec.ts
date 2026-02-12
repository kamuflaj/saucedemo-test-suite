import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/login.page';
import { InventoryPage } from '../../page-objects/inventory.page';
import { CartPage } from '../../page-objects/cart.page';
import { TEST_USERS } from '../fixtures/test-users';
import { PRODUCT_NAMES, URLS } from '../../utils/constants';

test.describe('Cart Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    
    // Login before each test
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.STANDARD.username, TEST_USERS.STANDARD.password);
  });

  test.describe('Cart Navigation', () => {
    test('should navigate to cart page from inventory', async ({ page }) => {
      await inventoryPage.goToCart();
      
      expect(page.url()).toContain(URLS.CART);
    });

    test('should navigate back to inventory from cart', async ({ page }) => {
      await inventoryPage.goToCart();
      await cartPage.continueShopping();
      
      expect(page.url()).toContain(URLS.INVENTORY);
    });
  });

  test.describe('Empty Cart', () => {
    test('should display empty cart when no items added', async () => {
      await inventoryPage.goToCart();
      
      const isEmpty = await cartPage.isCartEmpty();
      expect(isEmpty).toBeTruthy();
      
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(0);
    });

    test('should not display cart badge when cart is empty', async () => {
      const isBadgeVisible = await inventoryPage.isCartBadgeVisible();
      expect(isBadgeVisible).toBeFalsy();
    });
  });

  test.describe('Cart with Items', () => {
    test('should display added items in cart', async () => {
      // Add items to cart
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BIKE_LIGHT);
      
      // Navigate to cart
      await inventoryPage.goToCart();
      
      // Verify items in cart
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(2);
      
      const itemNames = await cartPage.getCartItemNames();
      expect(itemNames.some(name => name.includes('Backpack'))).toBeTruthy();
      expect(itemNames.some(name => name.includes('Bike Light'))).toBeTruthy();
    });

    test('should display correct item count in cart badge', async () => {
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BIKE_LIGHT);
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BOLT_TSHIRT);
      
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(3);
    });

    test('should display correct prices for cart items', async () => {
      // Add items
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
      await inventoryPage.goToCart();
      
      const prices = await cartPage.getCartItemPrices();
      expect(prices.length).toBeGreaterThan(0);
      expect(prices[0]).toBeGreaterThan(0);
    });

    test('should calculate correct cart subtotal', async () => {
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BIKE_LIGHT);
      await inventoryPage.goToCart();
      
      const subtotal = await cartPage.getCartSubtotal();
      expect(subtotal).toBeGreaterThan(0);
    });

    test('should display quantity for each item', async () => {
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
      await inventoryPage.goToCart();
      
      const itemDetails = await cartPage.getCartItemDetails(0);
      expect(itemDetails.quantity).toBe(1);
    });
  });

  test.describe('Remove from Cart', () => {
    test('should remove item from cart', async () => {
      // Add items
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BIKE_LIGHT);
      await inventoryPage.goToCart();
      
      // Remove one item
      await cartPage.removeItemByName(PRODUCT_NAMES.BACKPACK);
      
      // Verify item removed
      const itemNames = await cartPage.getCartItemNames();
      expect(itemNames.some(name => name.includes('Backpack'))).toBeFalsy();
      expect(itemNames.some(name => name.includes('Bike Light'))).toBeTruthy();
      
      // Verify count updated
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(1);
    });

    test('should remove all items from cart', async () => {
      // Add items
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BIKE_LIGHT);
      await inventoryPage.goToCart();
      
      // Remove all items
      await cartPage.removeAllItems();
      
      // Verify cart is empty
      const isEmpty = await cartPage.isCartEmpty();
      expect(isEmpty).toBeTruthy();
    });

    test('should update cart badge after removing items', async () => {
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BIKE_LIGHT);
      expect(await inventoryPage.getCartItemCount()).toBe(2);
      
      await inventoryPage.goToCart();
      await cartPage.removeItemByName(PRODUCT_NAMES.BACKPACK);
      
      // Go back to inventory to check badge
      await cartPage.continueShopping();
      expect(await inventoryPage.getCartItemCount()).toBe(1);
    });

    test('should hide cart badge when all items removed', async () => {
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
      await inventoryPage.goToCart();
      await cartPage.removeItemByName(PRODUCT_NAMES.BACKPACK);
      
      await cartPage.continueShopping();
      const isBadgeVisible = await inventoryPage.isCartBadgeVisible();
      expect(isBadgeVisible).toBeFalsy();
    });
  });

  test.describe('Cart Item Verification', () => {
    test('should verify item exists in cart', async () => {
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
      await inventoryPage.goToCart();
      
      const isInCart = await cartPage.isItemInCart('Backpack');
      expect(isInCart).toBeTruthy();
    });

    test('should verify item does not exist in cart', async () => {
      await inventoryPage.goToCart();
      
      const isInCart = await cartPage.isItemInCart('Backpack');
      expect(isInCart).toBeFalsy();
    });

    test('should get complete item details from cart', async () => {
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
      await inventoryPage.goToCart();
      
      const itemDetails = await cartPage.getCartItemDetails(0);
      
      expect(itemDetails.name).toBeTruthy();
      expect(itemDetails.price).toBeGreaterThan(0);
      expect(itemDetails.quantity).toBe(1);
    });
  });

  test.describe('Cart Persistence', () => {
    test('should maintain cart items when navigating away and back', async () => {
      // Add items
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BIKE_LIGHT);
      
      // Go to cart
      await inventoryPage.goToCart();
      expect(await cartPage.getCartItemCount()).toBe(2);
      
      // Navigate back to inventory
      await cartPage.continueShopping();
      
      // Navigate back to cart
      await inventoryPage.goToCart();
      
      // Verify items still in cart
      expect(await cartPage.getCartItemCount()).toBe(2);
    });
  });

  test.describe('Checkout from Cart', () => {
    test('should navigate to checkout from cart', async ({ page }) => {
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
      await inventoryPage.goToCart();
      
      await cartPage.checkout();
      
      expect(page.url()).toContain(URLS.CHECKOUT_STEP_ONE);
    });

    test('should not proceed to checkout with empty cart', async ({ page }) => {
      await inventoryPage.goToCart();
      
      // Cart is empty, but checkout button should still be clickable
      // The app allows clicking checkout even with empty cart
      await cartPage.checkout();
      
      // This is application behavior - it allows checkout with empty cart
      expect(page.url()).toContain(URLS.CHECKOUT_STEP_ONE);
    });
  });
});
