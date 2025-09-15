import { test, expect } from '@playwright/test';

test.describe('Feedback Components Visual Tests', () => {
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

  test('feedback components display', async ({ page }) => {
    await page.goto('/test-feedback-display');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('feedback-test-page.png', {
      fullPage: true,
    });
  });

  test('feedback components responsive', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1024, height: 768, name: 'desktop' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/test-feedback-display');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      
      await expect(page).toHaveScreenshot(`feedback-test-${viewport.name}.png`, {
        fullPage: true,
      });
    }
  });

  test('toast notifications', async ({ page }) => {
    await page.goto('/test-feedback-display');
    await page.waitForLoadState('networkidle');
    
    // Look for toast trigger buttons
    const toastTriggers = page.locator('button', { hasText: /toast|notification|show/i });
    const triggerCount = await toastTriggers.count();
    
    for (let i = 0; i < Math.min(triggerCount, 3); i++) {
      const trigger = toastTriggers.nth(i);
      const triggerText = await trigger.textContent();
      const cleanName = triggerText?.toLowerCase().replace(/[^a-z0-9]/g, '-') || `toast-${i}`;
      
      await trigger.click();
      await page.waitForTimeout(500);
      
      // Take screenshot with toast visible
      await expect(page).toHaveScreenshot(`toast-${cleanName}-visible.png`);
      
      // Wait for toast to disappear or manually dismiss
      await page.waitForTimeout(1000);
    }
  });

  test('alert and progress states', async ({ page }) => {
    await page.goto('/test-feedback-display');
    await page.waitForLoadState('networkidle');
    
    // Test alert variations
    const alerts = page.locator('[role="alert"], .alert, [class*="alert"]');
    const alertCount = await alerts.count();
    
    for (let i = 0; i < Math.min(alertCount, 5); i++) {
      const alert = alerts.nth(i);
      await expect(alert).toHaveScreenshot(`alert-${i}.png`);
    }
    
    // Test progress components
    const progressElements = page.locator('progress, [role="progressbar"], [class*="progress"]');
    const progressCount = await progressElements.count();
    
    for (let i = 0; i < Math.min(progressCount, 3); i++) {
      const progress = progressElements.nth(i);
      await expect(progress).toHaveScreenshot(`progress-${i}.png`);
    }
  });
});