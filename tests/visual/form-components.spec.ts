import { test, expect } from '@playwright/test';

test.describe('Form Components Visual Tests', () => {
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

  test('form components layout', async ({ page }) => {
    await page.goto('/test-form');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('form-test-page.png', {
      fullPage: true,
    });
  });

  test('form controls all states', async ({ page }) => {
    await page.goto('/test-form-controls');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('form-controls-test-page.png', {
      fullPage: true,
    });
  });

  test('form input focus states', async ({ page }) => {
    await page.goto('/test-form');
    await page.waitForLoadState('networkidle');
    
    // Test input focus
    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.count() > 0) {
      await textInput.focus();
      await page.waitForTimeout(100);
      
      await expect(textInput).toHaveScreenshot('input-focus-state.png');
    }
    
    // Test textarea focus
    const textarea = page.locator('textarea').first();
    if (await textarea.count() > 0) {
      await textarea.focus();
      await page.waitForTimeout(100);
      
      await expect(textarea).toHaveScreenshot('textarea-focus-state.png');
    }
  });

  test('form validation states', async ({ page }) => {
    await page.goto('/test-form');
    await page.waitForLoadState('networkidle');
    
    // Test form submission to trigger validation
    const submitButton = page.locator('button[type="submit"]').first();
    if (await submitButton.count() > 0) {
      await submitButton.click();
      await page.waitForTimeout(500);
      
      await expect(page).toHaveScreenshot('form-validation-errors.png', {
        fullPage: true,
      });
    }
  });

  test('form responsive layout', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1024, height: 768, name: 'desktop' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/test-form');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      
      await expect(page).toHaveScreenshot(`form-test-${viewport.name}.png`, {
        fullPage: true,
      });
      
      // Also test form controls page
      await page.goto('/test-form-controls');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      
      await expect(page).toHaveScreenshot(`form-controls-${viewport.name}.png`, {
        fullPage: true,
      });
    }
  });
});