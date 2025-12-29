import { test, expect } from '@playwright/test';

test.describe('Booking Modal', () => {
  // Navigate to a car details page before each test
  test.beforeEach(async ({ page }) => {
    // Use the test-car-id which has mock data
    await page.goto('/car/test-car-id');
  });

  test('should display all form fields when booking modal is opened', async ({ page }) => {
    // Click the "Schedule Test Drive" button to open the modal
    const scheduleButton = page.getByRole('button', { name: /Schedule Test Drive/ });
    await scheduleButton.first().click();

    // Verify the modal is open
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Book an Appointment' })).toBeVisible();

    // Verify all form fields are present
    // 1. Appointment Type select
    await expect(page.getByLabel('Appointment Type')).toBeVisible();
    
    // 2. Date picker
    await expect(page.getByLabel('Date')).toBeVisible();
    
    // 3. Time Slot select
    await expect(page.getByLabel('Time Slot')).toBeVisible();
    
    // 4. Notes textarea (optional)
    await expect(page.getByLabel('Notes (Optional)')).toBeVisible();

    // Verify submit button is present
    await expect(page.getByRole('button', { name: 'Confirm Booking' })).toBeVisible();
  });

  test('should show validation errors when submitting empty form', async ({ page }) => {
    // Open the booking modal
    const scheduleButton = page.getByRole('button', { name: /Schedule Test Drive/ });
    await scheduleButton.first().click();

    // Wait for modal to be visible
    await expect(page.getByRole('dialog')).toBeVisible();

    // Submit the form without filling required fields
    await page.getByRole('button', { name: 'Confirm Booking' }).click();

    // Wait for validation errors to appear
    const errorMessages = page.locator('[data-slot="form-message"]');
    
    // Should show validation errors for date and time slot (type has default value)
    await expect(errorMessages.first()).toBeVisible({ timeout: 3000 });
    
    // Verify specific error messages
    await expect(page.getByText('A date is required.')).toBeVisible();
    await expect(page.getByText('Please select a time slot.')).toBeVisible();
  });

  test('should disable past dates in the calendar', async ({ page }) => {
    // Open the booking modal
    const scheduleButton = page.getByRole('button', { name: /Schedule Test Drive/ });
    await scheduleButton.first().click();

    // Wait for modal to be visible
    await expect(page.getByRole('dialog')).toBeVisible();

    // Click the date picker button to open the calendar
    // The button contains a CalendarIcon and either "Pick a date" text or a formatted date
    const datePickerButton = page.locator('button').filter({ has: page.locator('svg') }).filter({ hasText: /Pick a date|January|February|March|April|May|June|July|August|September|October|November|December/ });
    await datePickerButton.first().click();

    // Wait for calendar popover to appear
    const calendar = page.locator('[role="grid"]');
    await expect(calendar).toBeVisible();

    // Find disabled date buttons in the calendar (past dates)
    // Past dates should have aria-disabled="true" or disabled attribute
    const pastDateButtons = calendar.locator('button[disabled]');
    const pastDateCount = await pastDateButtons.count();
    
    // There should be at least some disabled dates (past dates in current month)
    expect(pastDateCount).toBeGreaterThan(0);
  });

  test('should show authentication error when submitting booking while logged out', async ({ page }) => {
    // Ensure we're logged out by clearing any auth state
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();

    // Open the booking modal
    const scheduleButton = page.getByRole('button', { name: /Schedule Test Drive/ });
    await scheduleButton.first().click();

    // Wait for modal to be visible
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Fill in the form with valid data
    // Select appointment type (already has default)
    
    // Select a date - click the date picker button
    const datePickerButton = page.locator('button').filter({ has: page.locator('svg') }).filter({ hasText: /Pick a date|January|February|March|April|May|June|July|August|September|October|November|December/ });
    await datePickerButton.first().click();
    
    // Wait for calendar and select a future date
    const calendar = page.locator('[role="grid"]');
    await expect(calendar).toBeVisible();
    
    // Click on a future date (find an enabled button in the calendar)
    const enabledDates = calendar.locator('button:not([disabled])');
    const enabledCount = await enabledDates.count();
    if (enabledCount > 0) {
      // Click the last enabled date (likely a future date)
      await enabledDates.last().click();
    }

    // Close the calendar by pressing Escape
    await page.keyboard.press('Escape');
    
    // Wait a moment for the popover to close
    await page.waitForTimeout(300);

    // Select a time slot
    await page.getByLabel('Time Slot').click();
    await page.getByRole('option', { name: '09:00 AM' }).click();

    // Submit the form
    await page.getByRole('button', { name: 'Confirm Booking' }).click();

    // Verify authentication error toast appears
    await expect(page.getByText('You must be logged in to book an appointment.')).toBeVisible({ timeout: 5000 });
  });
});
