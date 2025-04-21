import { test, expect } from '@playwright/test';

test.describe('Todo Edge Cases', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the TodoMVC app
        await page.goto('https://demo.playwright.dev/todomvc/');
    });

    test('should handle empty todo list correctly', async ({ page }) => {
        // Verify empty state
        await expect(page.locator('.todo-list li')).toHaveCount(0);
        await expect(page.locator('.footer')).not.toBeVisible();
        await expect(page.locator('#toggle-all')).not.toBeVisible();

        // Add a todo
        await page.locator('.new-todo').fill('First todo');
        await page.locator('.new-todo').press('Enter');

        // Verify footer and toggle-all become visible
        await expect(page.locator('.footer')).toBeVisible();
        await expect(page.locator('#toggle-all')).toBeVisible();

        // Delete the todo
        await page.locator('.todo-list li .view').hover();
        await page.locator('.todo-list li .destroy').click();

        // Verify empty state is restored
        await expect(page.locator('.todo-list li')).toHaveCount(0);
        await expect(page.locator('.footer')).not.toBeVisible();
        await expect(page.locator('#toggle-all')).not.toBeVisible();
    });

    test('should handle very long todo text', async ({ page }) => {
        // Create a very long todo text
        const longText = 'This is a very long todo item that exceeds the normal length of a todo item and tests how the application handles very long text. It should be displayed correctly without breaking the layout.'.repeat(3);

        // Add the long text todo
        await page.locator('.new-todo').fill(longText);
        await page.locator('.new-todo').press('Enter');

        // Verify the todo was added with the full text
        await expect(page.locator('.todo-list li label')).toHaveText(longText);

        // Verify we can still interact with it (e.g., mark as complete)
        await page.locator('.todo-list li .toggle').check();
        await expect(page.locator('.todo-list li')).toHaveClass(/completed/);
    });

    test('should handle special characters in todo text', async ({ page }) => {
        // Create todos with special characters
        const specialChars = [
            'Todo with < > & " \' characters',
            'Todo with emoji 😀 🚀 🎉',
            'Todo with HTML tags <div>test</div>',
            'Todo with Unicode ñáéíóú 你好 こんにちは'
        ];

        // Add the special character todos
        for (const text of specialChars) {
            await page.locator('.new-todo').fill(text);
            await page.locator('.new-todo').press('Enter');
        }

        // Verify all todos were added correctly
        for (let i = 0; i < specialChars.length; i++) {
            await expect(page.locator('.todo-list li').nth(i).locator('label')).toHaveText(specialChars[i]);
        }
    });

    test('should handle empty todo input correctly', async ({ page }) => {
        // Try to add an empty todo
        await page.locator('.new-todo').fill('');
        await page.locator('.new-todo').press('Enter');

        // Verify no todo was added
        await expect(page.locator('.todo-list li')).toHaveCount(0);

        // Try to add a todo with only whitespace
        await page.locator('.new-todo').fill('   ');
        await page.locator('.new-todo').press('Enter');

        // Verify no todo was added
        await expect(page.locator('.todo-list li')).toHaveCount(0);
    });

    test('should handle rapid additions and deletions', async ({ page }) => {
        // Rapidly add multiple todos
        const newTodo = page.locator('.new-todo');

        for (let i = 1; i <= 10; i++) {
            await newTodo.fill(`Rapid todo ${i}`);
            await newTodo.press('Enter');
        }

        // Verify all todos were added
        await expect(page.locator('.todo-list li')).toHaveCount(10);

        // Rapidly delete multiple todos
        for (let i = 0; i < 5; i++) {
            await page.locator('.todo-list li').first().locator('.view').hover();
            await page.locator('.todo-list li').first().locator('.destroy').click();
        }

        // Verify deletions worked correctly
        await expect(page.locator('.todo-list li')).toHaveCount(5);

        // Verify the remaining todos are the correct ones
        for (let i = 0; i < 5; i++) {
            await expect(page.locator('.todo-list li').nth(i).locator('label')).toHaveText(`Rapid todo ${i + 6}`);
        }
    });
}); 