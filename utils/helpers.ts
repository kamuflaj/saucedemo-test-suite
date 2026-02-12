/**
 * Helper functions for tests
 */

import { Page } from '@playwright/test';

/**
 * Wait for page to be fully loaded
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
}

/**
 * Generate random string
 */
export function generateRandomString(length: number = 10): string {
  return Math.random().toString(36).substring(2, length + 2);
}

/**
 * Generate random email
 */
export function generateRandomEmail(): string {
  return `test_${generateRandomString()}@example.com`;
}

/**
 * Format price string to number
 */
export function parsePriceToNumber(priceString: string): number {
  return parseFloat(priceString.replace('$', ''));
}

/**
 * Calculate tax (8% as per saucedemo.com)
 */
export function calculateTax(subtotal: number): number {
  return Math.round((subtotal * 0.08) * 100) / 100;
}

/**
 * Calculate total (subtotal + tax)
 */
export function calculateTotal(subtotal: number): number {
  return subtotal + calculateTax(subtotal);
}

/**
 * Take screenshot with custom name
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
}

/**
 * Wait for element to be visible and stable
 */
export async function waitForElement(page: Page, selector: string, timeout: number = 5000): Promise<void> {
  await page.waitForSelector(selector, { state: 'visible', timeout });
}

/**
 * Get text content from element
 */
export async function getTextContent(page: Page, selector: string): Promise<string> {
  const element = await page.locator(selector);
  return (await element.textContent()) || '';
}

/**
 * Get all text contents from elements
 */
export async function getAllTextContents(page: Page, selector: string): Promise<string[]> {
  const elements = await page.locator(selector).all();
  const texts: string[] = [];
  for (const element of elements) {
    const text = await element.textContent();
    if (text) texts.push(text);
  }
  return texts;
}

/**
 * Check if element exists
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
  return await page.locator(selector).count() > 0;
}

/**
 * Get localStorage item
 */
export async function getLocalStorageItem(page: Page, key: string): Promise<string | null> {
  return await page.evaluate((key) => localStorage.getItem(key), key);
}

/**
 * Set localStorage item
 */
export async function setLocalStorageItem(page: Page, key: string, value: string): Promise<void> {
  await page.evaluate(({ key, value }) => localStorage.setItem(key, value), { key, value });
}

/**
 * Clear localStorage
 */
export async function clearLocalStorage(page: Page): Promise<void> {
  await page.evaluate(() => localStorage.clear());
}

/**
 * Get sessionStorage item
 */
export async function getSessionStorageItem(page: Page, key: string): Promise<string | null> {
  return await page.evaluate((key) => sessionStorage.getItem(key), key);
}

/**
 * Clear sessionStorage
 */
export async function clearSessionStorage(page: Page): Promise<void> {
  await page.evaluate(() => sessionStorage.clear());
}
