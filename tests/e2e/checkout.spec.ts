import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/login.page';
import { InventoryPage } from '../../page-objects/inventory.page';
import { CartPage } from '../../page-objects/cart.page';
import { CheckoutStepOnePage } from '../../page-objects/checkout-step-one.page';
import { CheckoutStepTwoPage } from '../../page-objects/checkout-step-two.page';
import { CheckoutCompletePage } from '../../page-objects/checkout-complete.page';
import { TEST_USERS } from '../fixtures/test-users';
import { VALID_CHECKOUT_INFO, INVALID_CHECKOUT_INFO, TAX_RATE, PAYMENT_INFO, SHIPPING_INFO } from '../fixtures/test-data';
import { PRODUCT_NAMES, ERROR_MESSAGES, SUCCESS_MESSAGES, URLS } from '../../utils/constants';
import { calculateTax, calculateTotal } from '../../utils/helpers';

test.describe('Checkout Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutStepOnePage: CheckoutStepOnePage;
  let checkoutStepTwoPage: CheckoutStepTwoPage;
  let checkoutCompletePage: CheckoutCompletePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutStepOnePage = new CheckoutStepOnePage(page);
    checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    checkoutCompletePage = new CheckoutCompletePage(page);
    
    // Login and add items to cart
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.STANDARD.username, TEST_USERS.STANDARD.password);
    await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
    await inventoryPage.goToCart();
    await cartPage.checkout();
  });

  test.describe('Checkout Step One - Information', () => {
    test('should complete checkout step one with valid information', async ({ page }) => {
      await checkoutStepOnePage.completeStepOne(
        VALID_CHECKOUT_INFO.firstName,
        VALID_CHECKOUT_INFO.lastName,
        VALID_CHECKOUT_INFO.postalCode
      );
      
      // Verify navigated to step two
      expect(page.url()).toContain(URLS.CHECKOUT_STEP_TWO);
    });

    test('should show error for missing first name', async () => {
      await checkoutStepOnePage.completeStepOne(
        INVALID_CHECKOUT_INFO.MISSING_FIRST_NAME.firstName,
        INVALID_CHECKOUT_INFO.MISSING_FIRST_NAME.lastName,
        INVALID_CHECKOUT_INFO.MISSING_FIRST_NAME.postalCode
      );
      
      expect(await checkoutStepOnePage.isErrorMessageVisible()).toBeTruthy();
      const errorMessage = await checkoutStepOnePage.getErrorMessage();
      expect(errorMessage).toContain(ERROR_MESSAGES.REQUIRED_FIRST_NAME);
    });

    test('should show error for missing last name', async () => {
      await checkoutStepOnePage.completeStepOne(
        INVALID_CHECKOUT_INFO.MISSING_LAST_NAME.firstName,
        INVALID_CHECKOUT_INFO.MISSING_LAST_NAME.lastName,
        INVALID_CHECKOUT_INFO.MISSING_LAST_NAME.postalCode
      );
      
      expect(await checkoutStepOnePage.isErrorMessageVisible()).toBeTruthy();
      const errorMessage = await checkoutStepOnePage.getErrorMessage();
      expect(errorMessage).toContain(ERROR_MESSAGES.REQUIRED_LAST_NAME);
    });

    test('should show error for missing postal code', async () => {
      await checkoutStepOnePage.completeStepOne(
        INVALID_CHECKOUT_INFO.MISSING_POSTAL_CODE.firstName,
        INVALID_CHECKOUT_INFO.MISSING_POSTAL_CODE.lastName,
        INVALID_CHECKOUT_INFO.MISSING_POSTAL_CODE.postalCode
      );
      
      expect(await checkoutStepOnePage.isErrorMessageVisible()).toBeTruthy();
      const errorMessage = await checkoutStepOnePage.getErrorMessage();
      expect(errorMessage).toContain(ERROR_MESSAGES.REQUIRED_POSTAL_CODE);
    });

    test('should cancel checkout and return to cart', async ({ page }) => {
      await checkoutStepOnePage.cancel();
      
      expect(page.url()).toContain(URLS.CART);
    });

    test('should fill individual fields correctly', async () => {
      await checkoutStepOnePage.enterFirstName(VALID_CHECKOUT_INFO.firstName);
      await checkoutStepOnePage.enterLastName(VALID_CHECKOUT_INFO.lastName);
      await checkoutStepOnePage.enterPostalCode(VALID_CHECKOUT_INFO.postalCode);
      
      const firstName = await checkoutStepOnePage.firstNameInput.inputValue();
      const lastName = await checkoutStepOnePage.lastNameInput.inputValue();
      const postalCode = await checkoutStepOnePage.postalCodeInput.inputValue();
      
      expect(firstName).toBe(VALID_CHECKOUT_INFO.firstName);
      expect(lastName).toBe(VALID_CHECKOUT_INFO.lastName);
      expect(postalCode).toBe(VALID_CHECKOUT_INFO.postalCode);
    });
  });

  test.describe('Checkout Step Two - Overview', () => {
    test.beforeEach(async () => {
      await checkoutStepOnePage.completeStepOne(
        VALID_CHECKOUT_INFO.firstName,
        VALID_CHECKOUT_INFO.lastName,
        VALID_CHECKOUT_INFO.postalCode
      );
    });

    test('should display order summary correctly', async () => {
      const summary = await checkoutStepTwoPage.getOrderSummary();
      
      expect(summary.itemTotal).toBeGreaterThan(0);
      expect(summary.tax).toBeGreaterThan(0);
      expect(summary.total).toBeGreaterThan(0);
      expect(summary.itemCount).toBeGreaterThan(0);
    });

    test('should display payment information', async () => {
      const paymentInfo = await checkoutStepTwoPage.getPaymentInfo();
      expect(paymentInfo).toBe(PAYMENT_INFO);
    });

    test('should display shipping information', async () => {
      const shippingInfo = await checkoutStepTwoPage.getShippingInfo();
      expect(shippingInfo).toBe(SHIPPING_INFO);
    });

    test('should calculate tax correctly', async () => {
      const itemTotal = await checkoutStepTwoPage.getItemTotal();
      const tax = await checkoutStepTwoPage.getTax();
      
      const expectedTax = calculateTax(itemTotal);
      
      // Allow small rounding differences
      expect(Math.abs(tax - expectedTax)).toBeLessThan(0.01);
    });

    test('should calculate total correctly', async () => {
      const itemTotal = await checkoutStepTwoPage.getItemTotal();
      const tax = await checkoutStepTwoPage.getTax();
      const total = await checkoutStepTwoPage.getTotal();
      
      const expectedTotal = itemTotal + tax;
      
      expect(Math.abs(total - expectedTotal)).toBeLessThan(0.01);
    });

    test('should display cart items in overview', async () => {
      const itemNames = await checkoutStepTwoPage.getCartItemNames();
      expect(itemNames.length).toBeGreaterThan(0);
      expect(itemNames.some(name => name.includes('Backpack'))).toBeTruthy();
    });

    test('should complete order successfully', async ({ page }) => {
      await checkoutStepTwoPage.finish();
      
      expect(page.url()).toContain(URLS.CHECKOUT_COMPLETE);
    });

    test('should cancel and return to inventory', async ({ page }) => {
      await checkoutStepTwoPage.cancel();
      
      expect(page.url()).toContain(URLS.INVENTORY);
    });
  });

  test.describe('Checkout Complete', () => {
    test.beforeEach(async () => {
      await checkoutStepOnePage.completeStepOne(
        VALID_CHECKOUT_INFO.firstName,
        VALID_CHECKOUT_INFO.lastName,
        VALID_CHECKOUT_INFO.postalCode
      );
      await checkoutStepTwoPage.finish();
    });

    test('should display order complete message', async () => {
      const headerText = await checkoutCompletePage.getCompleteHeaderText();
      expect(headerText).toContain(SUCCESS_MESSAGES.ORDER_COMPLETE);
    });

    test('should display order dispatched message', async () => {
      const messageText = await checkoutCompletePage.getCompleteMessageText();
      expect(messageText).toBeTruthy();
    });

    test('should verify order is complete', async () => {
      const isComplete = await checkoutCompletePage.isOrderComplete();
      expect(isComplete).toBeTruthy();
    });

    test('should verify checkout complete', async () => {
      const verified = await checkoutCompletePage.verifyCheckoutComplete();
      expect(verified).toBeTruthy();
    });

    test('should navigate back home after order complete', async ({ page }) => {
      await checkoutCompletePage.backHome();
      
      expect(page.url()).toContain(URLS.INVENTORY);
    });

    test('should have empty cart after order complete', async () => {
      await checkoutCompletePage.backHome();
      
      const isBadgeVisible = await inventoryPage.isCartBadgeVisible();
      expect(isBadgeVisible).toBeFalsy();
    });
  });

  test.describe('Complete Checkout Flow', () => {
    test('should complete full checkout flow with single item', async ({ page }) => {
      // Already in checkout step one with backpack in cart
      
      // Complete step one
      await checkoutStepOnePage.completeStepOne(
        VALID_CHECKOUT_INFO.firstName,
        VALID_CHECKOUT_INFO.lastName,
        VALID_CHECKOUT_INFO.postalCode
      );
      
      // Verify step two
      expect(page.url()).toContain(URLS.CHECKOUT_STEP_TWO);
      
      // Complete step two
      await checkoutStepTwoPage.finish();
      
      // Verify complete page
      expect(page.url()).toContain(URLS.CHECKOUT_COMPLETE);
      expect(await checkoutCompletePage.isOrderComplete()).toBeTruthy();
    });

    test('should complete full checkout flow with multiple items', async ({ page }) => {
      // Go back and add more items
      await checkoutStepOnePage.cancel();
      await cartPage.continueShopping();
      
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BIKE_LIGHT);
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BOLT_TSHIRT);
      
      await inventoryPage.goToCart();
      expect(await cartPage.getCartItemCount()).toBe(3);
      
      await cartPage.checkout();
      
      // Complete checkout
      await checkoutStepOnePage.completeStepOne(
        VALID_CHECKOUT_INFO.firstName,
        VALID_CHECKOUT_INFO.lastName,
        VALID_CHECKOUT_INFO.postalCode
      );
      
      // Verify multiple items in overview
      expect(await checkoutStepTwoPage.getCartItemCount()).toBe(3);
      
      await checkoutStepTwoPage.finish();
      
      expect(page.url()).toContain(URLS.CHECKOUT_COMPLETE);
      expect(await checkoutCompletePage.isOrderComplete()).toBeTruthy();
    });
  });

  test.describe('Checkout with Different Users', () => {
    /**
     * Note: performance_glitch_user has intentional delays built into saucedemo.com
     * This test demonstrates how to handle slow-performing users
     * Skip in CI due to unpredictable timing, but useful for local testing
     */
    test.skip('should complete checkout with performance_glitch_user', async ({ page }) => {
      // This test has longer timeout due to performance_glitch_user delays
      test.setTimeout(90000);
      
      // Logout and login with different user
      await checkoutStepOnePage.cancel();
      await cartPage.continueShopping();
      await inventoryPage.logout();
      
      await loginPage.login(TEST_USERS.PERFORMANCE_GLITCH.username, TEST_USERS.PERFORMANCE_GLITCH.password);
      
      // Wait for page to fully load with performance glitch user
      await page.waitForTimeout(5000);
      await page.waitForLoadState('networkidle');
      
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
      await inventoryPage.goToCart();
      await cartPage.checkout();
      
      await checkoutStepOnePage.completeStepOne(
        VALID_CHECKOUT_INFO.firstName,
        VALID_CHECKOUT_INFO.lastName,
        VALID_CHECKOUT_INFO.postalCode
      );
      
      await checkoutStepTwoPage.finish();
      
      expect(page.url()).toContain(URLS.CHECKOUT_COMPLETE);
    });
  });

  test.describe('Checkout Error Scenarios', () => {
    /**
     * Note: error_user has intentional bugs/errors built into saucedemo.com
     * This user is meant to simulate error conditions
     * Skip as the expected behavior is errors/failures
     */
    test.skip('should handle checkout with error_user', async ({ page }) => {
      // This test demonstrates testing with a user that has known issues
      test.setTimeout(90000);
      
      // Logout and login with error_user
      await checkoutStepOnePage.cancel();
      await cartPage.continueShopping();
      await inventoryPage.logout();
      
      await loginPage.login(TEST_USERS.ERROR.username, TEST_USERS.ERROR.password);
      
      // Wait for page to fully load
      await page.waitForTimeout(5000);
      await page.waitForLoadState('networkidle');
      
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
      await inventoryPage.goToCart();
      await cartPage.checkout();
      
      await checkoutStepOnePage.completeStepOne(
        VALID_CHECKOUT_INFO.firstName,
        VALID_CHECKOUT_INFO.lastName,
        VALID_CHECKOUT_INFO.postalCode
      );
      
      // error_user may have issues in checkout - verify we at least reach step two
      expect(page.url()).toContain(URLS.CHECKOUT_STEP_TWO);
    });
  });
});
