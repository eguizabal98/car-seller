import { test, expect } from '@playwright/test';

test.describe('Vehicle Comparison Flow', () => {
  // Clear comparison state before each test
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to reset comparison state
    await page.goto('/buy');
    await page.evaluate(() => {
      localStorage.removeItem('comparison-storage');
    });
    // Reload to apply cleared state
    await page.reload();
  });

  test('should add vehicle to comparison and show floating bar', async ({ page }) => {
    // Navigate to buy page
    await page.goto('/buy');
    
    // Wait for car cards to load
    const carCards = page.locator('[class*="Card"]').filter({ has: page.getByRole('button', { name: /Compare/ }) });
    
    // Check if there are any cars available
    const carCount = await carCards.count();
    if (carCount === 0) {
      console.log('No vehicles available in inventory, skipping test');
      test.skip(true, 'No vehicles available in inventory');
      return;
    }

    // Click the Compare button on the first car card
    const firstCompareButton = carCards.first().getByRole('button', { name: /Compare/ });
    await firstCompareButton.click();

    // Verify the floating bar appears
    const floatingBar = page.locator('.fixed.bottom-0');
    await expect(floatingBar).toBeVisible();
    
    // Verify the floating bar shows "Compare (1/3)"
    await expect(floatingBar.getByText(/Compare \(1\/3\)/)).toBeVisible();
  });

  test('should add multiple vehicles to comparison', async ({ page }) => {
    await page.goto('/buy');
    
    const carCards = page.locator('[class*="Card"]').filter({ has: page.getByRole('button', { name: /Compare/ }) });
    const carCount = await carCards.count();
    
    if (carCount < 2) {
      console.log('Not enough vehicles available, skipping test');
      test.skip(true, 'Need at least 2 vehicles for this test');
      return;
    }

    // Add first vehicle
    await carCards.nth(0).getByRole('button', { name: /Compare/ }).click();
    
    // Add second vehicle
    await carCards.nth(1).getByRole('button', { name: /Compare/ }).click();

    // Verify floating bar shows both vehicles
    const floatingBar = page.locator('.fixed.bottom-0');
    await expect(floatingBar).toBeVisible();
    await expect(floatingBar.getByText(/Compare \(2\/3\)/)).toBeVisible();

    // If we have 3+ cars, add a third
    if (carCount >= 3) {
      await carCards.nth(2).getByRole('button', { name: /Compare/ }).click();
      await expect(floatingBar.getByText(/Compare \(3\/3\)/)).toBeVisible();
    }
  });

  test('should prevent adding more than 3 vehicles', async ({ page }) => {
    await page.goto('/buy');
    
    const carCards = page.locator('[class*="Card"]').filter({ has: page.getByRole('button', { name: /Compare/ }) });
    const carCount = await carCards.count();
    
    if (carCount < 4) {
      console.log('Not enough vehicles available, skipping test');
      test.skip(true, 'Need at least 4 vehicles for this test');
      return;
    }

    // Add 3 vehicles
    await carCards.nth(0).getByRole('button', { name: /Compare/ }).click();
    await carCards.nth(1).getByRole('button', { name: /Compare/ }).click();
    await carCards.nth(2).getByRole('button', { name: /Compare/ }).click();

    // Verify we have 3 vehicles
    const floatingBar = page.locator('.fixed.bottom-0');
    await expect(floatingBar.getByText(/Compare \(3\/3\)/)).toBeVisible();

    // Attempt to add 4th vehicle
    await carCards.nth(3).getByRole('button', { name: /Compare/ }).click();

    // Verify still only 3 vehicles (toast error should appear)
    await expect(floatingBar.getByText(/Compare \(3\/3\)/)).toBeVisible();
    
    // Verify error toast appears
    await expect(page.getByText(/You can only compare up to 3 vehicles/)).toBeVisible();
  });

  test('should display comparison table on compare page', async ({ page }) => {
    await page.goto('/buy');
    
    const carCards = page.locator('[class*="Card"]').filter({ has: page.getByRole('button', { name: /Compare/ }) });
    const carCount = await carCards.count();
    
    if (carCount < 2) {
      console.log('Not enough vehicles available, skipping test');
      test.skip(true, 'Need at least 2 vehicles for this test');
      return;
    }

    // Add vehicles to comparison
    await carCards.nth(0).getByRole('button', { name: /Compare/ }).click();
    await carCards.nth(1).getByRole('button', { name: /Compare/ }).click();

    // Navigate to compare page
    await page.goto('/compare');

    // Verify comparison table is displayed
    await expect(page.getByRole('heading', { name: 'Vehicle Comparison' })).toBeVisible();
    await expect(page.locator('table')).toBeVisible();

    // Verify table has expected columns (Feature + vehicle columns)
    const tableHeaders = page.locator('th');
    await expect(tableHeaders.first()).toContainText('Feature');
    
    // Verify spec rows are present
    await expect(page.getByRole('cell', { name: 'Price' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Year' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Mileage' })).toBeVisible();
  });

  test('should remove vehicle from comparison', async ({ page }) => {
    await page.goto('/buy');
    
    const carCards = page.locator('[class*="Card"]').filter({ has: page.getByRole('button', { name: /Compare/ }) });
    const carCount = await carCards.count();
    
    if (carCount === 0) {
      console.log('No vehicles available, skipping test');
      test.skip(true, 'No vehicles available in inventory');
      return;
    }

    // Add a vehicle
    await carCards.first().getByRole('button', { name: /Compare/ }).click();
    
    // Verify floating bar shows 1 vehicle
    const floatingBar = page.locator('.fixed.bottom-0');
    await expect(floatingBar.getByText(/Compare \(1\/3\)/)).toBeVisible();

    // Remove the vehicle by clicking the X button in the floating bar
    const removeButton = floatingBar.locator('button').filter({ has: page.locator('svg.h-3.w-3') }).first();
    await removeButton.click();

    // Verify floating bar is no longer visible (no vehicles)
    await expect(floatingBar).not.toBeVisible();

    // Navigate to compare page and verify empty state
    await page.goto('/compare');
    await expect(page.getByText(/You haven't selected any vehicles to compare yet/)).toBeVisible();
  });

  test('should clear all vehicles from comparison', async ({ page }) => {
    await page.goto('/buy');
    
    const carCards = page.locator('[class*="Card"]').filter({ has: page.getByRole('button', { name: /Compare/ }) });
    const carCount = await carCards.count();
    
    if (carCount < 2) {
      console.log('Not enough vehicles available, skipping test');
      test.skip(true, 'Need at least 2 vehicles for this test');
      return;
    }

    // Add multiple vehicles
    await carCards.nth(0).getByRole('button', { name: /Compare/ }).click();
    await carCards.nth(1).getByRole('button', { name: /Compare/ }).click();

    // Verify floating bar shows vehicles
    const floatingBar = page.locator('.fixed.bottom-0');
    await expect(floatingBar.getByText(/Compare \(2\/3\)/)).toBeVisible();

    // Click "Clear All" button
    await floatingBar.getByRole('button', { name: 'Clear All' }).click();

    // Verify floating bar is no longer visible
    await expect(floatingBar).not.toBeVisible();

    // Navigate to compare page and verify empty state
    await page.goto('/compare');
    await expect(page.getByText(/You haven't selected any vehicles to compare yet/)).toBeVisible();
  });
});
