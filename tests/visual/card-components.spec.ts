import { test, expect } from '@playwright/test';

test.describe('Card Component Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `
    });
  });

  test('card components and layouts', async ({ page }) => {
    await page.goto('/test-card');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('card-test-page.png', {
      fullPage: true,
    });
  });

  test('card responsive behavior', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568, name: 'mobile' },
      { width:768, height: 1024, name: 'tablet' },
      { width: 1024, height: 768, name: 'desktop' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/test-card');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      
      await expect(page).toHaveScreenshot(`card-test-${viewport.name}.png`, {
        fullPage: true,
      });
    }
  });

  test('card hover effects', async ({ page }) => {
    await page.goto('/test-card');
    await page.waitForLoadState('networkidle');
    
    // Find all cards and test hover effects
    const cards = page.locator('[class*="card"]').first();
    if (await cards.count() > 0) {
      await cards.hover();
      await page.waitForTimeout(200);
      
      await expect(cards).toHaveScreenshot('card-hover-state.png');
    }
  });
});