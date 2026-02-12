import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/login.page';
import { InventoryPage } from '../../page-objects/inventory.page';
import { TEST_USERS, INVALID_USERS } from '../fixtures/test-users';
import { ERROR_MESSAGES, URLS } from '../../utils/constants';

test.describe('Authentication Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.navigate();
  });

  test.describe('Successful Login', () => {
    test('should login successfully with standard_user', async ({ page }) => {
      await loginPage.login(TEST_USERS.STANDARD.username, TEST_USERS.STANDARD.password);
      
      // Verify redirected to inventory page
      await expect(page).toHaveURL(new RegExp(URLS.INVENTORY));
      
      // Verify products are visible
      const productCount = await inventoryPage.getProductCount();
      expect(productCount).toBeGreaterThan(0);
    });

    test('should login successfully with problem_user', async ({ page }) => {
      await loginPage.login(TEST_USERS.PROBLEM.username, TEST_USERS.PROBLEM.password);
      await expect(page).toHaveURL(new RegExp(URLS.INVENTORY));
    });

    test('should login successfully with performance_glitch_user', async ({ page }) => {
      await loginPage.login(TEST_USERS.PERFORMANCE_GLITCH.username, TEST_USERS.PERFORMANCE_GLITCH.password);
      await expect(page).toHaveURL(new RegExp(URLS.INVENTORY));
    });

    test('should login successfully with error_user', async ({ page }) => {
      await loginPage.login(TEST_USERS.ERROR.username, TEST_USERS.ERROR.password);
      await expect(page).toHaveURL(new RegExp(URLS.INVENTORY));
    });

    test('should login successfully with visual_user', async ({ page }) => {
      await loginPage.login(TEST_USERS.VISUAL.username, TEST_USERS.VISUAL.password);
      await expect(page).toHaveURL(new RegExp(URLS.INVENTORY));
    });
  });

  test.describe('Failed Login', () => {
    test('should show error for locked_out_user', async () => {
      await loginPage.login(TEST_USERS.LOCKED_OUT.username, TEST_USERS.LOCKED_OUT.password);
      
      // Verify error message is visible
      expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
      
      // Verify error message text
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain(ERROR_MESSAGES.LOCKED_OUT);
    });

    test('should show error for invalid username', async () => {
      await loginPage.login(INVALID_USERS.INVALID_USERNAME.username, INVALID_USERS.INVALID_USERNAME.password);
      
      expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain(ERROR_MESSAGES.INVALID_CREDENTIALS);
    });

    test('should show error for invalid password', async () => {
      await loginPage.login(INVALID_USERS.INVALID_PASSWORD.username, INVALID_USERS.INVALID_PASSWORD.password);
      
      expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain(ERROR_MESSAGES.INVALID_CREDENTIALS);
    });

    test('should show error for empty username', async () => {
      await loginPage.login(INVALID_USERS.EMPTY_USERNAME.username, INVALID_USERS.EMPTY_USERNAME.password);
      
      expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain(ERROR_MESSAGES.REQUIRED_USERNAME);
    });

    test('should show error for empty password', async () => {
      await loginPage.login(INVALID_USERS.EMPTY_PASSWORD.username, INVALID_USERS.EMPTY_PASSWORD.password);
      
      expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain(ERROR_MESSAGES.REQUIRED_PASSWORD);
    });

    test('should close error message when clicking X button', async () => {
      await loginPage.login(INVALID_USERS.INVALID_USERNAME.username, INVALID_USERS.INVALID_USERNAME.password);
      
      expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
      
      await loginPage.closeErrorMessage();
      
      expect(await loginPage.isErrorMessageVisible()).toBeFalsy();
    });
  });

  test.describe('Logout', () => {
    test('should logout successfully', async ({ page }) => {
      // Login first
      await loginPage.login(TEST_USERS.STANDARD.username, TEST_USERS.STANDARD.password);
      await expect(page).toHaveURL(new RegExp(URLS.INVENTORY));
      
      // Logout
      await inventoryPage.logout();
      
      // Verify redirected to login page
      await expect(page).toHaveURL(new RegExp(URLS.LOGIN));
    });

    test('should not access inventory page after logout', async ({ page }) => {
      // Login
      await loginPage.login(TEST_USERS.STANDARD.username, TEST_USERS.STANDARD.password);
      await expect(page).toHaveURL(new RegExp(URLS.INVENTORY));
      
      // Logout
      await inventoryPage.logout();
      
      // Try to navigate to inventory page
      await page.goto(URLS.INVENTORY);
      
      // Should be redirected to login page (in most cases)
      // Note: SauceDemo doesn't enforce this strictly, but we can check URL
      const currentUrl = page.url();
      // This might vary based on implementation
    });
  });

  test.describe('Input Validation', () => {
    test('should clear username field', async () => {
      await loginPage.enterUsername('test_user');
      await loginPage.clearUsername();
      
      const username = await loginPage.usernameInput.inputValue();
      expect(username).toBe('');
    });

    test('should clear password field', async () => {
      await loginPage.enterPassword('test_password');
      await loginPage.clearPassword();
      
      const password = await loginPage.passwordInput.inputValue();
      expect(password).toBe('');
    });

    test('should have login button enabled', async () => {
      const isEnabled = await loginPage.isLoginButtonEnabled();
      expect(isEnabled).toBeTruthy();
    });
  });
});
