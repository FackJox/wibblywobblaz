import { test, expect } from '@playwright/test';

test.describe('Dialog Component Visual Tests', () => {
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

  test('dialog components closed state', async ({ page }) => {
    await page.goto('/test-dialog');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('dialog-test-page-closed.png', {
      fullPage: true,
    });
  });

  test('dialog open states', async ({ page }) => {
    await page.goto('/test-dialog');
    await page.waitForLoadState('networkidle');
    
    // Find and click dialog triggers
    const dialogTriggers = page.locator('button', { hasText: /open|show/i });
    const triggerCount = await dialogTriggers.count();
    
    for (let i = 0; i < Math.min(triggerCount, 5); i++) {
      const trigger = dialogTriggers.nth(i);
      const triggerText = await trigger.textContent();
      const cleanName = triggerText?.toLowerCase().replace(/[^a-z0-9]/g, '-') || `dialog-${i}`;
      
      await trigger.click();
      await page.waitForTimeout(300);
      
      // Take screenshot of the dialog
      await expect(page).toHaveScreenshot(`dialog-${cleanName}-open.png`);
      
      // Close dialog (try ESC key first, then look for close button)
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
      
      // If ESC doesn't work, try to find close button
      const closeButton = page.locator('button', { hasText: /close|cancel|✕/i }).first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
        await page.waitForTimeout(200);
      }
    }
  });

  test('dialog responsive behavior', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1024, height: 768, name: 'desktop' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/test-dialog');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      
      // Test closed state
      await expect(page).toHaveScreenshot(`dialog-test-${viewport.name}-closed.png`, {
        fullPage: true,
      });
      
      // Test one open dialog
      const firstTrigger = page.locator('button', { hasText: /open|show/i }).first();
      if (await firstTrigger.count() > 0) {
        await firstTrigger.click();
        await page.waitForTimeout(300);
        
        await expect(page).toHaveScreenshot(`dialog-test-${viewport.name}-open.png`);
        
        // Close dialog
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
      }
    }
  });
});