import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    // Navigate to the TodoMVC app before each test
    await page.goto('https://demo.playwright.dev/todomvc/');
});

test.describe('TodoMVC', () => {
    test('should have the correct title', async ({ page }) => {
        // Basic test to verify the page loads correctly
        await expect(page.locator('h1')).toHaveText('todos');
    });
}); 