import { test, expect } from '@playwright/test';

test.describe('Todo Management', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the TodoMVC app before each test
        await page.goto('https://demo.playwright.dev/todomvc/');
    });

    test('should add a new todo item', async ({ page }) => {
        // Get the new todo input field
        const newTodo = page.locator('.new-todo');

        // Type a new todo and press Enter
        await newTodo.fill('Buy groceries');
        await newTodo.press('Enter');

        // Verify that the todo was added
        const todoItems = page.locator('.todo-list li');
        await expect(todoItems).toHaveCount(1);
        await expect(todoItems.nth(0).locator('.view label')).toHaveText('Buy groceries');

        // Verify the counter shows 1 item left
        await expect(page.locator('.todo-count')).toContainText('1 item left');
    });

    test('should mark a todo as completed', async ({ page }) => {
        // Add a new todo
        const newTodo = page.locator('.new-todo');
        await newTodo.fill('Buy groceries');
        await newTodo.press('Enter');

        // Mark the todo as completed
        const todoToggle = page.locator('.todo-list li .toggle').first();
        await todoToggle.check();

        // Verify that the todo is marked as completed
        const todoItem = page.locator('.todo-list li').first();
        await expect(todoItem).toHaveClass(/completed/);

        // Verify the counter shows 0 items left
        await expect(page.locator('.todo-count')).toContainText('0 items left');
    });

    test('should edit an existing todo', async ({ page }) => {
        // Add a new todo
        const newTodo = page.locator('.new-todo');
        await newTodo.fill('Buy groceries');
        await newTodo.press('Enter');

        // Double-click on the todo to edit it
        const todoLabel = page.locator('.todo-list li label').first();
        await todoLabel.dblclick();

        // Edit the todo
        const todoEditInput = page.locator('.todo-list li .edit').first();
        await todoEditInput.fill('Buy organic groceries');
        await todoEditInput.press('Enter');

        // Verify that the todo was edited
        await expect(page.locator('.todo-list li label').first()).toHaveText('Buy organic groceries');
    });

    test('should delete a todo', async ({ page }) => {
        // Add a new todo
        const newTodo = page.locator('.new-todo');
        await newTodo.fill('Buy groceries');
        await newTodo.press('Enter');

        // Hover over the todo to reveal the destroy button
        await page.locator('.todo-list li .view').first().hover();

        // Click the destroy button
        await page.locator('.todo-list li .destroy').first().click();

        // Verify that the todo was deleted
        await expect(page.locator('.todo-list li')).toHaveCount(0);

        // Verify the counter shows 0 items left
        await expect(page.locator('.todo-count')).toContainText('0 items left');
    });

    test('should update the item count correctly', async ({ page }) => {
        // Add some todos
        const newTodo = page.locator('.new-todo');
        await newTodo.fill('Task 1');
        await newTodo.press('Enter');
        await newTodo.fill('Task 2');
        await newTodo.press('Enter');
        await newTodo.fill('Task 3');
        await newTodo.press('Enter');

        // Verify initial count
        await expect(page.locator('.todo-count')).toContainText('3 items left');

        // Complete one task
        await page.locator('.todo-list li .toggle').first().check();

        // Verify updated count
        await expect(page.locator('.todo-count')).toContainText('2 items left');

        // Complete another task
        await page.locator('.todo-list li').nth(1).locator('.toggle').check();

        // Verify updated count
        await expect(page.locator('.todo-count')).toContainText('1 item left');

        // Complete the last task
        await page.locator('.todo-list li').nth(2).locator('.toggle').check();

        // Verify final count
        await expect(page.locator('.todo-count')).toContainText('0 items left');
    });
}); 