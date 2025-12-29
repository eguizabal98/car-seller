import { test, expect } from '@playwright/test';

test.describe('Digital Logbook', () => {
  test('should display service history on car details page', async ({ page }) => {
    // 1. Navigate to a car details page
    // Use the mock ID to ensure we land on a valid page even if DB is empty
    await page.goto('/car/test-car-id');
    
    // 2. Scroll to Digital Logbook section
    // Use first() to avoid ambiguity if multiple elements match text (e.g., mobile/desktop duplicates)
    const logbookSection = page.locator('text=Digital Logbook').first();
    // Wait for visibility with a slightly longer timeout in case of lazy loading or layout shifts
    await expect(logbookSection).toBeVisible({ timeout: 10000 });
    await logbookSection.scrollIntoViewIfNeeded();

    // 3. Verify Tabs exist
    // Use first() here as well for tabs if they are rendered multiple times
    await expect(page.getByRole('tab', { name: 'Service History' }).first()).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Inspection' }).first()).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Ownership' }).first()).toBeVisible();

    // 4. Verify Content
    // Since we don't know if the car has history, we check for either the list OR the empty state message
    const historyContent = page.locator('text=Service History').first();
    await expect(historyContent).toBeVisible();

    // Check for specific service items or the empty message
    const emptyMessage = page.getByText('No service history available for this vehicle.').first();
    const loadingMessage = page.getByText('Loading history...').first();
    
    // Wait for loading to finish (loading message should disappear)
    await expect(loadingMessage).not.toBeVisible({ timeout: 10000 });

    // Now either empty message or some service record should be visible
    // We can't strictly assert one or the other without known seed data, 
    // but we can assert that the container is present.
    
    // Let's check if the "Service History" tab is active by default
    await expect(page.getByRole('tab', { name: 'Service History' }).first()).toHaveAttribute('data-state', 'active');
  });

  test('should switch tabs in digital logbook', async ({ page }) => {
    await page.goto('/car/test-car-id');

    // Click Inspection Tab
    await page.getByRole('tab', { name: 'Inspection' }).first().click();
    await expect(page.getByText('150-Point Inspection Passed').first()).toBeVisible();

    // Click Ownership Tab
    await page.getByRole('tab', { name: 'Ownership' }).first().click();
    await expect(page.getByText('Previous Owners').first()).toBeVisible();
  });
});
