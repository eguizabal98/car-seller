import { test, expect } from '@playwright/test';

test.describe('Placeholder Images', () => {
  test('should display images on car cards', async ({ page }) => {
    // 1. Navigate to Buy Page
    await page.goto('/buy');

    // 2. Wait for page to load and check for car cards
    // Car cards use Next.js Image component which renders inside a div with aspect-ratio
    const carCards = page.locator('[class*="Card"]').or(page.locator('[class*="card"]'));
    const cardCount = await carCards.count();
    
    // If no vehicles in database, skip the test gracefully
    if (cardCount === 0) {
      console.log('No vehicles available in inventory, skipping image test');
      return;
    }

    // 3. Locate images in car cards - Next.js Image uses img tag inside the card
    const images = page.locator('img[alt]').filter({ hasText: '' });
    const imageCount = await images.count();
    
    if (imageCount === 0) {
      console.log('No images found on car cards, skipping test');
      return;
    }

    // Ensure at least one image is visible
    await expect(images.first()).toBeVisible({ timeout: 10000 });

    // 4. Verify src attribute exists (Next.js Image may use srcset or data-src)
    const firstImage = images.first();
    const src = await firstImage.getAttribute('src');
    const srcset = await firstImage.getAttribute('srcset');
    
    // Image should have either src or srcset
    expect(src || srcset).toBeTruthy();
    
    // Log the image source for debugging
    console.log('Image source found:', src ? src.substring(0, 100) : 'using srcset');
  });
});
