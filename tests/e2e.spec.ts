import { test, expect } from '@playwright/test';

test('Listing to Booking Flow', async ({ page }) => {
  // 1. Go to Home Page
  await page.goto('/');
  await expect(page).toHaveTitle(/High-End Car Marketplace/);

  // 2. Navigate directly to the mock car page for reliable testing
  // Instead of relying on potentially empty inventory
  await page.goto('/car/test-car-id');

  // 4. Check Vehicle Details
  await expect(page).toHaveURL(/.*\/car\/test-car-id/);
  // Check for "Schedule Test Drive" button
  // Note: We might have multiple buttons due to mobile/desktop layouts. 
  // We want to click one that is visible.
  const scheduleButton = page.getByRole('button', { name: 'Schedule Test Drive' }).first();
  
  // Ensure it's visible before clicking
  await expect(scheduleButton).toBeVisible({ timeout: 10000 });
  
  // 5. Open Booking Modal
  await scheduleButton.click();
  
  // Check if modal is open
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('div[role="dialog"]').getByText(/Book an Appointment/i).first()).toBeVisible();
});
