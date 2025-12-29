import { test, expect } from '@playwright/test';

test.describe('Admin Leads Page', () => {
  test.beforeEach(async ({ page }) => {
    // Attempt to login as admin
    await page.goto('/login');
    
    if (await page.getByLabel('Email').isVisible()) {
      await page.getByLabel('Email').fill('admin@example.com');
      await page.getByLabel('Password').fill('password');
      await page.getByRole('button', { name: 'Sign In' }).click();
      
      // Wait for navigation away from login
      await page.waitForURL('**/*', { timeout: 5000 }).catch(() => {});
    }
  });

  test('should display leads table with correct structure', async ({ page }) => {
    // Navigate to admin leads page
    await page.goto('/admin/leads');
    
    // Check if we are redirected to login (auth failed)
    if (page.url().includes('/login')) {
      test.skip(true, 'Cannot access admin page without valid credentials');
      return;
    }

    // Verify page heading
    await expect(page.getByRole('heading', { name: 'Leads & Inquiries' })).toBeVisible();
    await expect(page.getByText('Track test drives and customer interest.')).toBeVisible();

    // Verify table structure with all expected column headers
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Check for all column headers
    await expect(page.getByRole('columnheader', { name: 'Customer' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Vehicle' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Type' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Date & Time' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Created At' })).toBeVisible();
  });

  test('should display lead information correctly when leads exist', async ({ page }) => {
    // Navigate to admin leads page
    await page.goto('/admin/leads');
    
    // Check if we are redirected to login (auth failed)
    if (page.url().includes('/login')) {
      test.skip(true, 'Cannot access admin page without valid credentials');
      return;
    }

    // Wait for table to load
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Check for table rows
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();

    if (rowCount === 0 || await page.getByText('No leads found yet.').isVisible()) {
      // Empty state is valid - verify the empty message
      await expect(page.getByText('No leads found yet.')).toBeVisible();
      return;
    }

    // If leads exist, verify the first row has expected data structure
    const firstRow = rows.first();
    
    // Customer cell should have name and email
    const customerCell = firstRow.locator('td').first();
    await expect(customerCell.locator('.font-medium')).toBeVisible();
    
    // Vehicle cell should be visible
    const vehicleCell = firstRow.locator('td').nth(1);
    await expect(vehicleCell).toBeVisible();
    
    // Type cell should be visible
    const typeCell = firstRow.locator('td').nth(2);
    await expect(typeCell).toBeVisible();
    
    // Date & Time cell should be visible
    const dateCell = firstRow.locator('td').nth(3);
    await expect(dateCell).toBeVisible();
    
    // Status cell should have a badge
    const statusCell = firstRow.locator('td').nth(4);
    await expect(statusCell.locator('[class*="badge"], [class*="Badge"]')).toBeVisible();
  });
});
