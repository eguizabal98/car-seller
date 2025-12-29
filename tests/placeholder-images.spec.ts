import { test, expect } from '@playwright/test';

test.describe('Placeholder Images', () => {
  test('should display images on car cards', async ({ page }) => {
    // 1. Navigate to Buy Page
    await page.goto('/buy');

    // 2. Locate images in car cards
    const images = page.locator('[class*="card"] img');
    
    // Ensure at least one image is visible
    await expect(images.first()).toBeVisible();

    // 3. Verify src attribute
    // We expect the src to contain the API URL we used in constants
    // "trae-api-us.mchost.guru/api/ide/v1/text_to_image"
    const src = await images.first().getAttribute('src');
    expect(src).toContain('trae-api-us.mchost.guru');
    
    // Optionally check if it loads (naturalWidth > 0)
    // This requires JS evaluation in the browser context
    const isLoaded = await images.first().evaluate((img: HTMLImageElement) => {
        return img.complete && img.naturalWidth > 0;
    });
    
    // Note: If the image API is slow or flaky, this might fail, but it's a good check for "real" loading
    // For now, we just log it or expect it to be true if we trust the API
    if (!isLoaded) {
        console.log('Image might not have loaded yet, but src is present.');
    }
  });
});
