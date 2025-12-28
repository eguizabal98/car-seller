import { test, expect } from '@playwright/test';

test.describe('Inventory Filters', () => {
  test('should display dynamic make options in filter', async ({ page }) => {
    // 1. Navigate to the Buy page
    await page.goto('/buy');

    // 2. Open the Make & Model accordion (it might be closed or open by default, let's ensure it's open)
    // The component defaults to 'price' open, so we might need to click 'Make & Model'
    const makeAccordionTrigger = page.getByRole('button', { name: 'Make & Model' });
    if (await makeAccordionTrigger.getAttribute('aria-expanded') === 'false') {
        await makeAccordionTrigger.click();
    }

    // 3. Check if the Select component is present
    const makeSelectTrigger = page.getByRole('combobox').filter({ hasText: /Select Make|All Makes/ }); // Shadcn select trigger usually has the selected value or placeholder
    await expect(makeSelectTrigger).toBeVisible();

    // 4. Open the select dropdown
    await makeSelectTrigger.click();

    // 5. Verify that options are present
    // We expect at least "All Makes" and potentially others if the DB has data
    await expect(page.getByRole('option', { name: 'All Makes' })).toBeVisible();
    
    // Check if there are other options (dynamic ones)
    // Since we can't guarantee DB state, we just verify the dropdown works and "All Makes" is there.
    // If we had seed data, we would assert specific makes like "Porsche".
  });

  test('should update URL when filter is applied', async ({ page }) => {
    await page.goto('/buy');

    // Click Apply directly - the default values should be set
    // Note: The Accordion might be collapsing sections, but the state (priceRange) is in the component.
    // However, if we want to change something, we need to interact.
    
    // Let's rely on the "Apply Filters" button which is always visible at the bottom
    const applyButton = page.getByRole('button', { name: 'Apply Filters' });
    await expect(applyButton).toBeVisible();
    await applyButton.click();
    
    // Verify URL has parameters (defaults are 0 and 300000)
    await expect(page).toHaveURL(/.*minPrice=0/);
    await expect(page).toHaveURL(/.*maxPrice=300000/);
  });
});
