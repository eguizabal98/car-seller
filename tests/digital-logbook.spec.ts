import { test, expect } from '@playwright/test';

test.describe('Digital Logbook', () => {
  test('should display service history on car details page', async ({ page }) => {
    // 1. Navigate to a car details page
    // We'll go to the homepage and click the first car to ensure we land on a valid page
    await page.goto('/');
    
    // Wait for featured cars to load and click one
    const firstCarLink = page.locator('[class*="carousel-item"] a').first();
    // If no featured cars, try to go to buy page
    if (await firstCarLink.isVisible()) {
        await firstCarLink.click();
    } else {
        await page.goto('/buy');
        await page.click('text=View Details');
    }

    // 2. Scroll to Digital Logbook section
    const logbookSection = page.locator('text=Digital Logbook');
    await expect(logbookSection).toBeVisible();
    await logbookSection.scrollIntoViewIfNeeded();

    // 3. Verify Tabs exist
    await expect(page.getByRole('tab', { name: 'Service History' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Inspection' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Ownership' })).toBeVisible();

    // 4. Verify Content
    // Since we don't know if the car has history, we check for either the list OR the empty state message
    const historyContent = page.locator('text=Service History').first();
    await expect(historyContent).toBeVisible();

    // Check for specific service items or the empty message
    const emptyMessage = page.getByText('No service history available for this vehicle.');
    const loadingMessage = page.getByText('Loading history...');
    
    // Wait for loading to finish (loading message should disappear)
    await expect(loadingMessage).not.toBeVisible({ timeout: 10000 });

    // Now either empty message or some service record should be visible
    // We can't strictly assert one or the other without known seed data, 
    // but we can assert that the container is present.
    
    // Let's check if the "Service History" tab is active by default
    await expect(page.getByRole('tab', { name: 'Service History' })).toHaveAttribute('data-state', 'active');
  });

  test('should switch tabs in digital logbook', async ({ page }) => {
    await page.goto('/');
    const firstCarLink = page.locator('[class*="carousel-item"] a').first();
    if (await firstCarLink.isVisible()) {
        await firstCarLink.click();
    } else {
        await page.goto('/buy');
        await page.click('text=View Details');
    }

    // Click Inspection Tab
    await page.getByRole('tab', { name: 'Inspection' }).click();
    await expect(page.getByText('150-Point Inspection Passed')).toBeVisible();

    // Click Ownership Tab
    await page.getByRole('tab', { name: 'Ownership' }).click();
    await expect(page.getByText('Previous Owners')).toBeVisible();
  });
});
