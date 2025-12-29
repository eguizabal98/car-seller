import { test, expect } from '@playwright/test';

test.describe('Error Handling and Edge Cases', () => {
  test.describe('Non-existent Car Page', () => {
    test('should show 404 page for invalid car ID', async ({ page }) => {
      // Visit a car page with a non-existent ID
      await page.goto('/car/non-existent-car-id-12345');
      
      // Next.js returns 200 status but renders 404 content (soft 404)
      // Verify 404 page content is displayed - Next.js default shows "This page could not be found"
      // or a custom 404 message
      const notFoundText = page.getByText(/404|not found|could not be found/i);
      await expect(notFoundText.first()).toBeVisible();
    });

    test('should show 404 page for malformed car ID', async ({ page }) => {
      // Visit a car page with a malformed UUID
      await page.goto('/car/invalid-uuid-format');
      
      // Verify 404 page content is displayed
      const notFoundText = page.getByText(/404|not found|could not be found/i);
      await expect(notFoundText.first()).toBeVisible();
    });
  });

  test.describe('Disabled Feature Page', () => {
    test('should return 404 for disabled sell feature', async ({ page }) => {
      // Visit the sell page - it may be feature-flagged
      await page.goto('/sell');
      
      // Check if the page shows 404 content (feature disabled) or sell page content (feature enabled)
      const notFoundText = page.getByText(/404|not found|could not be found/i);
      const sellPageContent = page.getByText(/Sell Your Car/i);
      
      // Wait for either 404 or sell page content to appear
      const isNotFound = await notFoundText.first().isVisible().catch(() => false);
      const isSellPage = await sellPageContent.isVisible().catch(() => false);
      
      if (isNotFound) {
        // Feature is disabled - verify 404 page is shown
        await expect(notFoundText.first()).toBeVisible();
      } else if (isSellPage) {
        // Feature is enabled - skip this test
        test.skip(true, 'Sell feature is enabled, cannot test disabled state');
      } else {
        // Neither found - fail the test
        throw new Error('Expected either 404 page or Sell page content');
      }
    });
  });
});
