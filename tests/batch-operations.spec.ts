import { test, expect } from '@playwright/test';

test.describe('Todo Batch Operations', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the TodoMVC app
        await page.goto('https://demo.playwright.dev/todomvc/');

        // Add multiple todos
        const newTodo = page.locator('.new-todo');
        const todos = ['Task 1', 'Task 2', 'Task 3', 'Task 4'];

        for (const todo of todos) {
            await newTodo.fill(todo);
            await newTodo.press('Enter');
        }
    });

    test('should mark all items as complete', async ({ page }) => {
        // Verify initial state
        await expect(page.locator('.todo-list li')).toHaveCount(4);
        await expect(page.locator('.todo-count')).toContainText('4 items left');

        // Click the "toggle-all" checkbox
        await page.locator('#toggle-all').check();

        // Verify all todos are marked as completed
        const todoItems = page.locator('.todo-list li');
        await expect(todoItems).toHaveCount(4);

        // Verify each todo has the "completed" class
        for (let i = 0; i < 4; i++) {
            await expect(todoItems.nth(i)).toHaveClass(/completed/);
        }

        // Verify count shows 0 items left
        await expect(page.locator('.todo-count')).toContainText('0 items left');
    });

    test('should mark all items as active', async ({ page }) => {
        // First mark all as complete
        await page.locator('#toggle-all').check();

        // Verify all are completed
        await expect(page.locator('.todo-count')).toContainText('0 items left');

        // Now uncheck the toggle-all to mark all as active
        await page.locator('#toggle-all').uncheck();

        // Verify all todos are marked as active
        const todoItems = page.locator('.todo-list li');

        // Verify none of the todos has the "completed" class
        for (let i = 0; i < 4; i++) {
            await expect(todoItems.nth(i)).not.toHaveClass(/completed/);
        }

        // Verify count shows 4 items left
        await expect(page.locator('.todo-count')).toContainText('4 items left');
    });

    test('should clear completed items', async ({ page }) => {
        // Mark some items as completed
        await page.locator('.todo-list li').nth(0).locator('.toggle').check();
        await page.locator('.todo-list li').nth(2).locator('.toggle').check();

        // Verify count
        await expect(page.locator('.todo-count')).toContainText('2 items left');

        // Clear completed
        await page.getByRole('button', { name: 'Clear completed' }).click();

        // Verify only the active todos remain
        const todoItems = page.locator('.todo-list li');
        await expect(todoItems).toHaveCount(2);
        await expect(todoItems.nth(0).locator('label')).toHaveText('Task 2');
        await expect(todoItems.nth(1).locator('label')).toHaveText('Task 4');

        // Verify count is still correct
        await expect(page.locator('.todo-count')).toContainText('2 items left');
    });

    test('should toggle between all completed and all active', async ({ page }) => {
        // Toggle all to completed
        await page.locator('#toggle-all').check();
        await expect(page.locator('.todo-count')).toContainText('0 items left');

        // Toggle back to all active
        await page.locator('#toggle-all').uncheck();
        await expect(page.locator('.todo-count')).toContainText('4 items left');

        // Toggle to all completed again
        await page.locator('#toggle-all').check();
        await expect(page.locator('.todo-count')).toContainText('0 items left');
    });
}); 