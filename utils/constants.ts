/**
 * Constants used throughout the test suite
 */

// Base URL
export const BASE_URL = 'https://www.saucedemo.com';

// Page URLs
export const URLS = {
  LOGIN: '/',
  INVENTORY: '/inventory.html',
  CART: '/cart.html',
  CHECKOUT_STEP_ONE: '/checkout-step-one.html',
  CHECKOUT_STEP_TWO: '/checkout-step-two.html',
  CHECKOUT_COMPLETE: '/checkout-complete.html',
  INVENTORY_ITEM: (id: number) => `/inventory-item.html?id=${id}`,
};

// Selectors
export const SELECTORS = {
  LOGIN: {
    USERNAME_INPUT: '[data-test="username"]',
    PASSWORD_INPUT: '[data-test="password"]',
    LOGIN_BUTTON: '[data-test="login-button"]',
    ERROR_MESSAGE: '[data-test="error"]',
    ERROR_BUTTON: '.error-button',
  },
  INVENTORY: {
    ITEM: '.inventory_item',
    ITEM_NAME: '.inventory_item_name',
    ITEM_DESC: '.inventory_item_desc',
    ITEM_PRICE: '.inventory_item_price',
    ADD_TO_CART_BUTTON: (itemName: string) => `[data-test="add-to-cart-${itemName}"]`,
    REMOVE_BUTTON: (itemName: string) => `[data-test="remove-${itemName}"]`,
    SORT_CONTAINER: '.product_sort_container',
    SHOPPING_CART_BADGE: '.shopping_cart_badge',
    SHOPPING_CART_LINK: '.shopping_cart_link',
  },
  CART: {
    CART_ITEM: '.cart_item',
    CART_ITEM_NAME: '.inventory_item_name',
    CART_ITEM_PRICE: '.inventory_item_price',
    CART_QUANTITY: '.cart_quantity',
    REMOVE_BUTTON: (itemName: string) => `[data-test="remove-${itemName}"]`,
    CONTINUE_SHOPPING: '[data-test="continue-shopping"]',
    CHECKOUT_BUTTON: '[data-test="checkout"]',
  },
  CHECKOUT: {
    FIRST_NAME: '[data-test="firstName"]',
    LAST_NAME: '[data-test="lastName"]',
    POSTAL_CODE: '[data-test="postalCode"]',
    CONTINUE_BUTTON: '[data-test="continue"]',
    CANCEL_BUTTON: '[data-test="cancel"]',
    FINISH_BUTTON: '[data-test="finish"]',
    COMPLETE_HEADER: '.complete-header',
    BACK_HOME_BUTTON: '[data-test="back-to-products"]',
    ITEM_TOTAL: '.summary_subtotal_label',
    TAX: '.summary_tax_label',
    TOTAL: '.summary_total_label',
    PAYMENT_INFO: '[data-test="payment-info-value"]',
    SHIPPING_INFO: '[data-test="shipping-info-value"]',
  },
  NAVIGATION: {
    BURGER_MENU: '#react-burger-menu-btn',
    LOGOUT_LINK: '#logout_sidebar_link',
    ALL_ITEMS_LINK: '#inventory_sidebar_link',
    ABOUT_LINK: '#about_sidebar_link',
    RESET_APP_LINK: '#reset_sidebar_link',
    CLOSE_MENU: '#react-burger-cross-btn',
  },
  PRODUCT_DETAILS: {
    BACK_TO_PRODUCTS: '[data-test="back-to-products"]',
    PRODUCT_NAME: '.inventory_details_name',
    PRODUCT_DESC: '.inventory_details_desc',
    PRODUCT_PRICE: '.inventory_details_price',
    ADD_TO_CART: '.btn_inventory',
  },
};

// Test Data
export const PRODUCT_NAMES = {
  BACKPACK: 'sauce-labs-backpack',
  BIKE_LIGHT: 'sauce-labs-bike-light',
  BOLT_TSHIRT: 'sauce-labs-bolt-t-shirt',
  FLEECE_JACKET: 'sauce-labs-fleece-jacket',
  ONESIE: 'sauce-labs-onesie',
  RED_TSHIRT: 'test.allthethings()-t-shirt-(red)',
};

export const SORT_OPTIONS = {
  NAME_A_TO_Z: 'az',
  NAME_Z_TO_A: 'za',
  PRICE_LOW_TO_HIGH: 'lohi',
  PRICE_HIGH_TO_LOW: 'hilo',
};

// Error Messages
export const ERROR_MESSAGES = {
  LOCKED_OUT: 'Epic sadface: Sorry, this user has been locked out.',
  INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
  REQUIRED_USERNAME: 'Epic sadface: Username is required',
  REQUIRED_PASSWORD: 'Epic sadface: Password is required',
  REQUIRED_FIRST_NAME: 'Error: First Name is required',
  REQUIRED_LAST_NAME: 'Error: Last Name is required',
  REQUIRED_POSTAL_CODE: 'Error: Postal Code is required',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  ORDER_COMPLETE: 'Thank you for your order!',
  ORDER_DISPATCHED: 'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
};
