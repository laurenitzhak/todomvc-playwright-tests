import { test, expect } from '@playwright/test';

test.describe('Todo Persistence', () => {
    test('should persist todos after page reload', async ({ page }) => {
        // Navigate to the TodoMVC app
        await page.goto('https://demo.playwright.dev/todomvc/');

        // Add some todos
        const newTodo = page.locator('.new-todo');
        const todos = ['Persistent task 1', 'Persistent task 2', 'Persistent task 3'];

        for (const todo of todos) {
            await newTodo.fill(todo);
            await newTodo.press('Enter');
        }

        // Mark one as completed
        await page.locator('.todo-list li').nth(1).locator('.toggle').check();

        // Verify initial state
        await expect(page.locator('.todo-list li')).toHaveCount(3);
        await expect(page.locator('.todo-count')).toContainText('2 items left');

        // Reload the page
        await page.reload();

        // Verify todos persisted
        await expect(page.locator('.todo-list li')).toHaveCount(3);

        // Verify text of todos persisted
        await expect(page.locator('.todo-list li').nth(0).locator('label')).toHaveText('Persistent task 1');
        await expect(page.locator('.todo-list li').nth(1).locator('label')).toHaveText('Persistent task 2');
        await expect(page.locator('.todo-list li').nth(2).locator('label')).toHaveText('Persistent task 3');

        // Verify completed state persisted
        await expect(page.locator('.todo-list li').nth(1)).toHaveClass(/completed/);

        // Verify the counter persisted
        await expect(page.locator('.todo-count')).toContainText('2 items left');
    });

    test('should persist filter selection after reload', async ({ page }) => {
        // Navigate to the TodoMVC app
        await page.goto('https://demo.playwright.dev/todomvc/');

        // Add some todos
        const newTodo = page.locator('.new-todo');
        await newTodo.fill('Active task');
        await newTodo.press('Enter');

        await newTodo.fill('Completed task');
        await newTodo.press('Enter');

        // Mark second todo as completed
        await page.locator('.todo-list li').nth(1).locator('.toggle').check();

        // Switch to "Completed" filter
        await page.locator('.filters li').nth(2).locator('a').click();

        // Verify "Completed" filter is active
        await expect(page.locator('.filters li').nth(2).locator('a')).toHaveClass('selected');

        // Verify only completed tasks are visible
        await expect(page.locator('.todo-list li')).toHaveCount(1);

        // Reload the page
        await page.reload();

        // Verify "Completed" filter is still active
        await expect(page.locator('.filters li').nth(2).locator('a')).toHaveClass('selected');

        // Verify only completed tasks are still visible
        await expect(page.locator('.todo-list li')).toHaveCount(1);
        await expect(page.locator('.todo-list li').nth(0).locator('label')).toHaveText('Completed task');
    });

    test('should handle adding and removing todos after reload', async ({ page }) => {
        // Navigate to the TodoMVC app
        await page.goto('https://demo.playwright.dev/todomvc/');

        // Add some initial todos
        const newTodo = page.locator('.new-todo');
        await newTodo.fill('Initial task 1');
        await newTodo.press('Enter');
        await newTodo.fill('Initial task 2');
        await newTodo.press('Enter');

        // Reload the page
        await page.reload();

        // Verify initial todos persisted
        await expect(page.locator('.todo-list li')).toHaveCount(2);

        // Add another todo after reload
        await newTodo.fill('After reload task');
        await newTodo.press('Enter');

        // Verify the new todo was added
        await expect(page.locator('.todo-list li')).toHaveCount(3);
        await expect(page.locator('.todo-list li').nth(2).locator('label')).toHaveText('After reload task');

        // Delete a todo
        await page.locator('.todo-list li').nth(1).locator('.view').hover();
        await page.locator('.todo-list li').nth(1).locator('.destroy').click();

        // Verify the todo was deleted
        await expect(page.locator('.todo-list li')).toHaveCount(2);

        // Reload the page again
        await page.reload();

        // Verify changes persisted
        await expect(page.locator('.todo-list li')).toHaveCount(2);
        await expect(page.locator('.todo-list li').nth(0).locator('label')).toHaveText('Initial task 1');
        await expect(page.locator('.todo-list li').nth(1).locator('label')).toHaveText('After reload task');
    });
}); 