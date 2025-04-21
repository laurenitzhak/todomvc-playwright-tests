# TodoMVC E2E Tests with Playwright

This project contains comprehensive end-to-end tests for the TodoMVC application using Playwright.

## Setup

1. Ensure you have Node.js installed (version 14 or higher)
2. Install project dependencies:

```
npm install
```

3. Install the required browsers:

```
npx playwright install
```

## Running Tests

To run all tests:

```
npx playwright test
```

To run tests with a detailed report:

```
npx playwright test --reporter=html
npx playwright show-report
```

To run tests in UI mode:

```
npx playwright test --ui
```

To run a specific test file:

```
npx playwright test tests/todo-management.spec.ts
```

## Test Structure

The tests are organized into separate files based on functionality:

- **todo.spec.ts**: Basic verification that the app loads correctly
- **todo-management.spec.ts**: Tests for creating, editing, completing, and deleting todos
- **filtering.spec.ts**: Tests for filtering todos by All, Active, and Completed status
- **batch-operations.spec.ts**: Tests for marking all todos complete/active and clearing completed todos
- **persistence.spec.ts**: Tests for verifying todos persist after page reloads
- **edge-cases.spec.ts**: Tests for various edge cases like empty lists, long text, and special characters

Each test file follows this structure:
1. A `beforeEach` hook to navigate to the TodoMVC app and potentially set up test data
2. Individual test cases that verify specific functionality
3. Assertions to verify the expected behavior

## Test Approach

The testing approach follows these principles:

1. **Isolation**: Each test is isolated and does not depend on the state from other tests
2. **Readability**: Tests are written in a clear, readable manner with helpful comments
3. **Reliability**: Tests are designed to be reliable and not flaky
4. **Comprehensive**: Tests cover all required functionality including edge cases

## Challenges and Solutions

### Challenge 1: Working with Dynamic Elements

**Problem**: The destroy button is only visible when hovering over a todo item.

**Solution**: Used Playwright's hover action before attempting to click the destroy button:
```typescript
await page.locator('.todo-list li .view').hover();
await page.locator('.todo-list li .destroy').click();
```

### Challenge 2: Handling State Persistence

**Problem**: The TodoMVC app uses localStorage to persist state between page reloads.

**Solution**: Used page.reload() to test persistence functionality and verified the state was correctly maintained.

### Challenge 3: Testing Filter URL Fragments

**Problem**: Filters use URL fragments (e.g., #/active) which can be challenging to test.

**Solution**: Verified that the correct filter is applied by checking both the selected class on the filter link and that the visible todos match the expected filter criteria. 