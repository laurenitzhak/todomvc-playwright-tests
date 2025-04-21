import { test, expect } from '@playwright/test';

test.describe('TodoMVC Complete Test Suite', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the TodoMVC app before each test
        await page.goto('https://demo.playwright.dev/todomvc/');
    });

    test('should be able to perform basic todo operations', async ({ page }) => {
        // Add a new todo
        const newTodo = page.locator('.new-todo');
        await newTodo.fill('Complete test task');
        await newTodo.press('Enter');

        // Verify it was added
        await expect(page.locator('.todo-list li')).toHaveCount(1);
        await expect(page.locator('.todo-list li label')).toHaveText('Complete test task');

        // Mark it as completed
        await page.locator('.todo-list li .toggle').check();
        await expect(page.locator('.todo-list li')).toHaveClass(/completed/);

        // Verify counter shows 0 items left
        await expect(page.locator('.todo-count')).toContainText('0 items left');
    });
}); 