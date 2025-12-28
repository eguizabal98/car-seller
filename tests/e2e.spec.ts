import { test, expect } from '@playwright/test';

test('Listing to Booking Flow', async ({ page }) => {
  // 1. Go to Home Page
  await page.goto('/');
  await expect(page).toHaveTitle(/High-End Car Marketplace/);

  // 2. Navigate to Inventory (Buy)
  await page.click('text=Buy'); 
  await expect(page).toHaveURL(/.*buy/);

  // Debug: Check if "No vehicles found" is present
  const emptyState = page.getByText('No vehicles found');
  if (await emptyState.isVisible()) {
    console.log('Inventory is empty. Seed data might be missing or not loaded.');
    throw new Error('Inventory is empty');
  }

  // 3. Select a car
  // Click the first "View Details" button
  const viewDetailsButton = page.locator('text=View Details').first();
  await expect(viewDetailsButton).toBeVisible({ timeout: 10000 });
  await viewDetailsButton.click();

  // 4. Check Vehicle Details
  await expect(page).toHaveURL(/.*\/car\/.*/);
  // Check for "Schedule Test Drive" button
  const scheduleButton = page.getByRole('button', { name: 'Schedule Test Drive' });
  await expect(scheduleButton).toBeVisible();

  // 5. Open Booking Modal
  await scheduleButton.click();
  
  // Check if modal is open
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('div[role="dialog"]').getByText(/Book an Appointment/i).first()).toBeVisible();
});
