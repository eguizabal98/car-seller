import { test, expect } from '@playwright/test';

test.describe('Trade-In Valuation Form', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the finance page where the trade-in form is located
    await page.goto('/finance');
  });

  test('should display valuation after successful form submission', async ({ page }) => {
    // Check if the page loaded (feature might be disabled)
    const heading = page.getByRole('heading', { name: 'Trade-In Valuation' });
    if (!(await heading.isVisible())) {
      test.skip(true, 'Finance feature is disabled');
      return;
    }

    // Fill in the form with valid data
    await page.getByLabel('Registration / Plate').fill('AB12 CDE');
    await page.getByLabel('Current Mileage').fill('45000');
    await page.getByLabel('Make').fill('BMW');
    await page.getByLabel('Model').fill('3 Series');
    await page.getByLabel('Year').fill('2019');
    
    // Select condition
    await page.getByLabel('Good (Minor wear, well maintained)').click();

    // Submit the form
    await page.getByRole('button', { name: 'Get Estimate' }).click();

    // Wait for valuation to appear (form has 1.5s simulated delay)
    await expect(page.getByText('Estimated Trade-In Value')).toBeVisible({ timeout: 5000 });
    
    // Verify valuation amount is displayed (should be $15,000 for 'good' condition)
    await expect(page.getByText('$15,000')).toBeVisible();
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'Trade-In Valuation' });
    if (!(await heading.isVisible())) {
      test.skip(true, 'Finance feature is disabled');
      return;
    }

    // Find the Get Estimate button
    const getEstimateButton = page.getByRole('button', { name: 'Get Estimate' });
    
    // Submit empty form - this should trigger validation
    await getEstimateButton.click();

    // Wait for validation errors to appear
    // The form uses Zod validation which shows errors after submission attempt
    // Check for error messages using the data-slot attribute
    const errorMessages = page.locator('[data-slot="form-message"]');
    
    // Wait for at least one error message to appear
    await expect(errorMessages.first()).toBeVisible({ timeout: 3000 });
    
    // Verify multiple validation errors are shown (at least 5 required fields)
    const errorCount = await errorMessages.count();
    expect(errorCount).toBeGreaterThanOrEqual(5);
  });

  test('should show different valuations based on condition', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'Trade-In Valuation' });
    if (!(await heading.isVisible())) {
      test.skip(true, 'Finance feature is disabled');
      return;
    }

    // Helper function to fill form and get valuation
    const getValuation = async (condition: string) => {
      await page.getByLabel('Registration / Plate').fill('AB12 CDE');
      await page.getByLabel('Current Mileage').fill('45000');
      await page.getByLabel('Make').fill('BMW');
      await page.getByLabel('Model').fill('3 Series');
      await page.getByLabel('Year').fill('2019');
      await page.getByLabel(condition).click();
      await page.getByRole('button', { name: 'Get Estimate' }).click();
      
      // Wait for valuation to appear
      await expect(page.getByText('Estimated Trade-In Value')).toBeVisible({ timeout: 5000 });
      
      // Get the valuation text - it's in a p tag with text-4xl class
      const valuationElement = page.locator('p.text-4xl.font-bold');
      const valuationText = await valuationElement.textContent();
      return valuationText;
    };

    // Get valuation for 'excellent' condition
    const excellentValuation = await getValuation('Excellent (Like new, no issues)');
    
    // Reset form
    await page.getByRole('button', { name: 'Value Another Car' }).click();
    
    // Get valuation for 'poor' condition
    const poorValuation = await getValuation('Poor (Significant issues or damage)');

    // Verify valuations are different
    expect(excellentValuation).not.toEqual(poorValuation);
    
    // Excellent should be $18,000 (15000 * 1.2), Poor should be $7,500 (15000 * 0.5)
    expect(excellentValuation).toBe('$18,000');
    expect(poorValuation).toBe('$7,500');
  });

  test('should reset form when clicking "Value Another Car"', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'Trade-In Valuation' });
    if (!(await heading.isVisible())) {
      test.skip(true, 'Finance feature is disabled');
      return;
    }

    // Fill and submit form
    await page.getByLabel('Registration / Plate').fill('AB12 CDE');
    await page.getByLabel('Current Mileage').fill('45000');
    await page.getByLabel('Make').fill('BMW');
    await page.getByLabel('Model').fill('3 Series');
    await page.getByLabel('Year').fill('2019');
    await page.getByLabel('Good (Minor wear, well maintained)').click();
    await page.getByRole('button', { name: 'Get Estimate' }).click();

    // Wait for valuation
    await expect(page.getByText('Estimated Trade-In Value')).toBeVisible({ timeout: 5000 });

    // Click "Value Another Car" button
    await page.getByRole('button', { name: 'Value Another Car' }).click();

    // Verify form is reset - valuation should be hidden
    await expect(page.getByText('Estimated Trade-In Value')).not.toBeVisible();
    
    // Verify form fields are visible again
    await expect(page.getByLabel('Registration / Plate')).toBeVisible();
    await expect(page.getByLabel('Current Mileage')).toBeVisible();
    
    // Verify form fields are empty
    await expect(page.getByLabel('Registration / Plate')).toHaveValue('');
    await expect(page.getByLabel('Current Mileage')).toHaveValue('');
  });
});
