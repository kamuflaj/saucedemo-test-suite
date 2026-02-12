import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/login.page';
import { InventoryPage } from '../../page-objects/inventory.page';
import { ProductDetailsPage } from '../../page-objects/product-details.page';
import { TEST_USERS } from '../fixtures/test-users';
import { PRODUCT_NAMES, SORT_OPTIONS } from '../../utils/constants';

test.describe('Product Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let productDetailsPage: ProductDetailsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    productDetailsPage = new ProductDetailsPage(page);
    
    // Login before each test
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.STANDARD.username, TEST_USERS.STANDARD.password);
  });

  test.describe('Product Display', () => {
    test('should display all products on inventory page', async () => {
      const productCount = await inventoryPage.getProductCount();
      expect(productCount).toBe(6); // SauceDemo has 6 products
    });

    test('should display product names', async () => {
      const productNames = await inventoryPage.getProductNames();
      expect(productNames.length).toBeGreaterThan(0);
      
      // Verify some expected products
      expect(productNames.some(name => name.includes('Backpack'))).toBeTruthy();
      expect(productNames.some(name => name.includes('Bike Light'))).toBeTruthy();
    });

    test('should display product prices', async () => {
      const prices = await inventoryPage.getProductPrices();
      expect(prices.length).toBeGreaterThan(0);
      
      // Verify all prices are positive numbers
      prices.forEach(price => {
        expect(price).toBeGreaterThan(0);
      });
    });

    test('should display product details for each item', async () => {
      const productDetails = await inventoryPage.getProductDetails(0);
      
      expect(productDetails.name).toBeTruthy();
      expect(productDetails.description).toBeTruthy();
      expect(productDetails.price).toBeGreaterThan(0);
    });
  });

  test.describe('Product Sorting', () => {
    test('should sort products by name A to Z', async () => {
      await inventoryPage.sortProducts(SORT_OPTIONS.NAME_A_TO_Z);
      
      const productNames = await inventoryPage.getProductNames();
      const sortedNames = [...productNames].sort();
      
      expect(productNames).toEqual(sortedNames);
    });

    test('should sort products by name Z to A', async () => {
      await inventoryPage.sortProducts(SORT_OPTIONS.NAME_Z_TO_A);
      
      const productNames = await inventoryPage.getProductNames();
      const sortedNames = [...productNames].sort().reverse();
      
      expect(productNames).toEqual(sortedNames);
    });

    test('should sort products by price low to high', async () => {
      await inventoryPage.sortProducts(SORT_OPTIONS.PRICE_LOW_TO_HIGH);
      
      const prices = await inventoryPage.getProductPrices();
      const sortedPrices = [...prices].sort((a, b) => a - b);
      
      expect(prices).toEqual(sortedPrices);
    });

    test('should sort products by price high to low', async () => {
      await inventoryPage.sortProducts(SORT_OPTIONS.PRICE_HIGH_TO_LOW);
      
      const prices = await inventoryPage.getProductPrices();
      const sortedPrices = [...prices].sort((a, b) => b - a);
      
      expect(prices).toEqual(sortedPrices);
    });

    test('should maintain selected sort option', async () => {
      await inventoryPage.sortProducts(SORT_OPTIONS.PRICE_HIGH_TO_LOW);
      
      const currentSort = await inventoryPage.getCurrentSortOption();
      expect(currentSort).toBe(SORT_OPTIONS.PRICE_HIGH_TO_LOW);
    });
  });

  test.describe('Product Details Page', () => {
    test('should navigate to product details page', async ({ page }) => {
      const productNames = await inventoryPage.getProductNames();
      const firstProductName = productNames[0];
      
      await inventoryPage.clickProductByName(firstProductName);
      
      // Verify URL contains inventory-item
      expect(page.url()).toContain('inventory-item.html');
    });

    test('should display correct product details', async () => {
      // Get product details from inventory page
      const inventoryProductDetails = await inventoryPage.getProductDetails(0);
      
      // Navigate to product details page
      await inventoryPage.clickProductByName(inventoryProductDetails.name);
      
      // Get product details from details page
      const detailsPageProduct = await productDetailsPage.getProductDetails();
      
      // Verify details match
      expect(detailsPageProduct.name).toBe(inventoryProductDetails.name);
      expect(detailsPageProduct.description).toBe(inventoryProductDetails.description);
      expect(detailsPageProduct.price).toBe(inventoryProductDetails.price);
    });

    test('should navigate back to products from details page', async ({ page }) => {
      await inventoryPage.clickProductByName('Sauce Labs Backpack');
      await productDetailsPage.clickBackToProducts();
      
      // Verify back on inventory page
      expect(page.url()).toContain('inventory.html');
    });

    test('should add product to cart from details page', async () => {
      await inventoryPage.clickProductByName('Sauce Labs Backpack');
      await productDetailsPage.addToCart();
      
      // Verify product is in cart
      const isInCart = await productDetailsPage.isProductInCart();
      expect(isInCart).toBeTruthy();
      
      // Verify cart badge shows 1
      const cartCount = await productDetailsPage.getCartItemCount();
      expect(cartCount).toBe(1);
    });

    test('should remove product from cart from details page', async () => {
      await inventoryPage.clickProductByName('Sauce Labs Backpack');
      await productDetailsPage.addToCart();
      
      // Verify added
      expect(await productDetailsPage.isProductInCart()).toBeTruthy();
      
      // Remove
      await productDetailsPage.removeFromCart();
      
      // Verify removed
      expect(await productDetailsPage.isProductInCart()).toBeFalsy();
    });
  });

  test.describe('Add to Cart from Inventory', () => {
    test('should add single product to cart', async () => {
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
      
      // Verify item is in cart
      const isInCart = await inventoryPage.isItemInCart(PRODUCT_NAMES.BACKPACK);
      expect(isInCart).toBeTruthy();
      
      // Verify cart badge shows 1
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(1);
    });

    test('should add multiple products to cart', async () => {
      const itemsToAdd = [
        PRODUCT_NAMES.BACKPACK,
        PRODUCT_NAMES.BIKE_LIGHT,
        PRODUCT_NAMES.BOLT_TSHIRT,
      ];
      
      await inventoryPage.addMultipleItemsToCart(itemsToAdd);
      
      // Verify cart badge shows correct count
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(itemsToAdd.length);
    });

    test('should add all products to cart', async () => {
      const allProducts = [
        PRODUCT_NAMES.BACKPACK,
        PRODUCT_NAMES.BIKE_LIGHT,
        PRODUCT_NAMES.BOLT_TSHIRT,
        PRODUCT_NAMES.FLEECE_JACKET,
        PRODUCT_NAMES.ONESIE,
        PRODUCT_NAMES.RED_TSHIRT,
      ];
      
      await inventoryPage.addMultipleItemsToCart(allProducts);
      
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(6);
    });

    test('should remove product from cart', async () => {
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
      expect(await inventoryPage.isItemInCart(PRODUCT_NAMES.BACKPACK)).toBeTruthy();
      
      await inventoryPage.removeItemFromCart(PRODUCT_NAMES.BACKPACK);
      
      expect(await inventoryPage.isItemInCart(PRODUCT_NAMES.BACKPACK)).toBeFalsy();
      expect(await inventoryPage.isCartBadgeVisible()).toBeFalsy();
    });

    test('should update cart badge when adding/removing items', async () => {
      // Add item
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BACKPACK);
      expect(await inventoryPage.getCartItemCount()).toBe(1);
      
      // Add another item
      await inventoryPage.addItemToCart(PRODUCT_NAMES.BIKE_LIGHT);
      expect(await inventoryPage.getCartItemCount()).toBe(2);
      
      // Remove item
      await inventoryPage.removeItemFromCart(PRODUCT_NAMES.BACKPACK);
      expect(await inventoryPage.getCartItemCount()).toBe(1);
      
      // Remove last item
      await inventoryPage.removeItemFromCart(PRODUCT_NAMES.BIKE_LIGHT);
      expect(await inventoryPage.isCartBadgeVisible()).toBeFalsy();
    });
  });

  test.describe('Product Images', () => {
    test('should display product images', async ({ page }) => {
      const images = await page.locator('.inventory_item_img img').all();
      expect(images.length).toBeGreaterThan(0);
      
      // Verify first image has src attribute
      const firstImageSrc = await images[0].getAttribute('src');
      expect(firstImageSrc).toBeTruthy();
    });
  });
});
