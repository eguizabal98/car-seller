import { test, expect } from '@playwright/test';

test('Listing to Booking Flow', async ({ page }) => {
  // 1. Go to Home Page
  await page.goto('/');
  await expect(page).toHaveTitle(/High-End Car Marketplace/);

  // 2. Navigate to Inventory (Buy)
  // The link text is "Buy"
  await page.click('text=Buy'); 
  await expect(page).toHaveURL(/.*buy/);

  // 3. Select a car
  // Click the first "View Details" button
  const viewDetailsButton = page.locator('text=View Details').first();
  await expect(viewDetailsButton).toBeVisible();
  await viewDetailsButton.click();

  // 4. Check Vehicle Details
  // URL should contain /car/
  await expect(page).toHaveURL(/.*\/car\/.*/);
  // Check for "Schedule Test Drive" button
  const scheduleButton = page.getByRole('button', { name: 'Schedule Test Drive' });
  await expect(scheduleButton).toBeVisible();

  // 5. Open Booking Modal
  await scheduleButton.click();
  
  // Check if modal is open
  // The modal title usually says "Schedule Test Drive" or similar
  await expect(page.getByRole('dialog')).toBeVisible();
  // Check for some text in the modal
  await expect(page.locator('dialog').getByText(/Schedule Test Drive/i).first()).toBeVisible({ timeout: 5000 });
});
