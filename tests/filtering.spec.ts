import { test, expect } from '@playwright/test';

test.describe('Todo Filtering', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the TodoMVC app
        await page.goto('https://demo.playwright.dev/todomvc/');

        // Setup test data: Add a mix of completed and active todos
        const newTodo = page.locator('.new-todo');

        // Add first todo
        await newTodo.fill('Active task 1');
        await newTodo.press('Enter');

        // Add second todo
        await newTodo.fill('Completed task 1');
        await newTodo.press('Enter');

        // Add third todo
        await newTodo.fill('Active task 2');
        await newTodo.press('Enter');

        // Mark the second todo as completed
        await page.locator('.todo-list li').nth(1).locator('.toggle').check();
    });

    test('should filter by "All" todos', async ({ page }) => {
        // Click on the "All" filter
        await page.locator('.filters li').nth(0).locator('a').click();

        // Verify that all 3 todos are visible
        await expect(page.locator('.todo-list li')).toHaveCount(3);

        // Verify that the "All" filter is selected
        await expect(page.locator('.filters li').nth(0).locator('a')).toHaveClass('selected');
    });

    test('should filter by "Active" todos', async ({ page }) => {
        // Click on the "Active" filter
        await page.locator('.filters li').nth(1).locator('a').click();

        // Verify that only active todos are visible (2)
        await expect(page.locator('.todo-list li')).toHaveCount(2);

        // Verify that the shown todos are indeed the active ones
        await expect(page.locator('.todo-list li').nth(0).locator('label')).toHaveText('Active task 1');
        await expect(page.locator('.todo-list li').nth(1).locator('label')).toHaveText('Active task 2');

        // Verify that the "Active" filter is selected
        await expect(page.locator('.filters li').nth(1).locator('a')).toHaveClass('selected');
    });

    test('should filter by "Completed" todos', async ({ page }) => {
        // Click on the "Completed" filter
        await page.locator('.filters li').nth(2).locator('a').click();

        // Verify that only completed todos are visible (1)
        await expect(page.locator('.todo-list li')).toHaveCount(1);

        // Verify that the shown todo is indeed the completed one
        await expect(page.locator('.todo-list li').nth(0).locator('label')).toHaveText('Completed task 1');

        // Verify that the "Completed" filter is selected
        await expect(page.locator('.filters li').nth(2).locator('a')).toHaveClass('selected');
    });

    test('should show correct todos when switching between filters', async ({ page }) => {
        // Start with "All" filter (default)
        await expect(page.locator('.todo-list li')).toHaveCount(3);

        // Switch to "Active"
        await page.locator('.filters li').nth(1).locator('a').click();
        await expect(page.locator('.todo-list li')).toHaveCount(2);

        // Switch to "Completed"
        await page.locator('.filters li').nth(2).locator('a').click();
        await expect(page.locator('.todo-list li')).toHaveCount(1);

        // Back to "All"
        await page.locator('.filters li').nth(0).locator('a').click();
        await expect(page.locator('.todo-list li')).toHaveCount(3);
    });
}); 