import { test, expect } from '@playwright/test';

test.describe('Navigation and Layout', () => {
  test.describe('Navbar Links', () => {
    test('should display all expected navigation links', async ({ page }) => {
      // Visit homepage
      await page.goto('/');

      // Verify navbar contains expected links (desktop view)
      const navbar = page.locator('header');
      await expect(navbar).toBeVisible();

      // Check for Buy link (always enabled)
      await expect(navbar.getByRole('link', { name: 'Buy' })).toBeVisible();
      
      // Check for Finance link (always enabled)
      await expect(navbar.getByRole('link', { name: 'Finance' })).toBeVisible();
      
      // Sell link may be feature-flagged, check if visible
      const sellLink = navbar.getByRole('link', { name: 'Sell' });
      const sellVisible = await sellLink.isVisible().catch(() => false);
      if (sellVisible) {
        await expect(sellLink).toBeVisible();
      }
    });
  });

  test.describe('Navigation Functionality', () => {
    test('should navigate to Buy page when clicking Buy link', async ({ page }) => {
      await page.goto('/');
      
      // Click Buy link in navbar
      await page.locator('header').getByRole('link', { name: 'Buy' }).click();
      
      // Verify navigation to buy page
      await expect(page).toHaveURL(/.*\/buy/);
    });

    test('should navigate to Sell page when clicking Sell link', async ({ page }) => {
      await page.goto('/');
      
      // Check if Sell link is visible (feature-flagged)
      const sellLink = page.locator('header nav').getByRole('link', { name: 'Sell' });
      const sellVisible = await sellLink.isVisible().catch(() => false);
      
      if (!sellVisible) {
        test.skip(true, 'Sell feature is disabled');
        return;
      }
      
      // Click Sell link in navbar
      await sellLink.click();
      
      // Wait for navigation and verify
      await page.waitForURL(/.*\/sell/, { timeout: 10000 });
      await expect(page).toHaveURL(/.*\/sell/);
    });

    test('should navigate to Finance page when clicking Finance link', async ({ page }) => {
      await page.goto('/');
      
      // Click Finance link in navbar
      await page.locator('header').getByRole('link', { name: 'Finance' }).click();
      
      // Verify navigation to finance page
      await expect(page).toHaveURL(/.*\/finance/);
    });

    test('should navigate to homepage when clicking logo', async ({ page }) => {
      await page.goto('/buy');
      
      // Click logo/brand link
      await page.locator('header').getByRole('link', { name: /CarSeller/ }).click();
      
      // Verify navigation to homepage
      await expect(page).toHaveURL(/.*\//);
    });
  });

  test.describe('Mobile Menu', () => {
    test('should open mobile menu and display navigation links', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/');

      // Click mobile menu button
      const menuButton = page.getByRole('button', { name: /Toggle menu/i });
      await expect(menuButton).toBeVisible();
      await menuButton.click();

      // Verify mobile menu sheet is open - use the dialog role
      const mobileNav = page.getByRole('dialog');
      await expect(mobileNav).toBeVisible();

      // Verify navigation links in mobile menu
      await expect(mobileNav.getByRole('link', { name: 'Buy' })).toBeVisible();
      await expect(mobileNav.getByRole('link', { name: 'Finance' })).toBeVisible();
    });

    test('should navigate from mobile menu', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/');

      // Open mobile menu
      await page.getByRole('button', { name: /Toggle menu/i }).click();

      // Click Buy link in mobile menu
      const mobileNav = page.getByRole('dialog');
      await mobileNav.getByRole('link', { name: 'Buy' }).click();

      // Verify navigation
      await expect(page).toHaveURL(/.*\/buy/);
    });
  });

  test.describe('Footer Links', () => {
    test('should display footer with expected sections', async ({ page }) => {
      await page.goto('/');

      // Scroll to footer
      const footer = page.locator('footer');
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toBeVisible();

      // Verify footer brand
      await expect(footer.getByRole('link', { name: /CarSeller/ })).toBeVisible();

      // Verify Inventory section links (Browse All Cars is always visible)
      await expect(footer.getByRole('link', { name: 'Browse All Cars' })).toBeVisible();

      // Verify Services section links
      await expect(footer.getByRole('link', { name: 'Financing' })).toBeVisible();
      await expect(footer.getByRole('link', { name: 'Compare Cars' })).toBeVisible();

      // Verify social media icons are present
      await expect(footer.getByRole('link', { name: 'Facebook' })).toBeVisible();
      await expect(footer.getByRole('link', { name: 'Instagram' })).toBeVisible();
      await expect(footer.getByRole('link', { name: 'Twitter' })).toBeVisible();
      await expect(footer.getByRole('link', { name: 'YouTube' })).toBeVisible();

      // Verify copyright text
      await expect(footer.getByText(/© \d{4} CarSeller/)).toBeVisible();
    });

    test('should navigate to Compare page from footer', async ({ page }) => {
      await page.goto('/');

      // Scroll to footer and click Compare Cars link
      const footer = page.locator('footer');
      await footer.scrollIntoViewIfNeeded();
      await footer.getByRole('link', { name: 'Compare Cars' }).click();

      // Verify navigation
      await expect(page).toHaveURL(/.*\/compare/);
    });
  });
});
