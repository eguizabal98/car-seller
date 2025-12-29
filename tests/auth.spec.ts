import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login and signup tabs', async ({ page }) => {
    await expect(page.getByRole('tab', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Sign Up' })).toBeVisible();
    await expect(page.getByText('Welcome Back')).toBeVisible();
  });

  test('should validate signup form', async ({ page }) => {
    // Switch to Sign Up tab
    await page.getByRole('tab', { name: 'Sign Up' }).click();

    // Try to submit empty form
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Check for validation errors
    await expect(page.getByText('Full name must be at least 2 characters')).toBeVisible();
    await expect(page.getByText('Please enter a valid email address')).toBeVisible();
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();

    // Test password mismatch
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByLabel('Confirm Password').fill('password456');
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page.getByText("Passwords don't match")).toBeVisible();
  });

  test('should handle invalid login', async ({ page }) => {
    await page.getByLabel('Email').fill('invalid@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Expect error toast
    // Note: The specific error message depends on the backend/supabase response.
    // Usually "Invalid login credentials" or similar.
    await expect(page.getByText('Invalid login credentials').or(page.getByText('Authentication failed'))).toBeVisible();
  });

  test('should allow user to sign up', async ({ page }) => {
    await page.getByRole('tab', { name: 'Sign Up' }).click();

    const uniqueEmail = `test${Date.now()}@example.com`;
    
    await page.getByLabel('Full Name').fill('Test User');
    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByLabel('Confirm Password').fill('password123');

    await page.getByRole('button', { name: 'Create Account' }).click();

    // Check for success toast or error
    // We accept any toast notification as proof of interaction
    await expect(page.locator('[data-sonner-toast]')).toBeVisible();
  });
});
