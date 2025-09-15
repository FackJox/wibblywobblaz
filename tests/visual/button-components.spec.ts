import { test, expect } from '@playwright/test';

test.describe('Button Component Visual Tests', () => {
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

  test('button variants and states', async ({ page }) => {
    await page.goto('/test-button');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('button-test-page.png', {
      fullPage: true,
    });
  });

  test('button hover states', async ({ page }) => {
    await page.goto('/test-button');
    await page.waitForLoadState('networkidle');
    
    // Test hover state on default button
    const defaultButton = page.locator('button', { hasText: 'Default' }).first();
    await defaultButton.hover();
    await page.waitForTimeout(100);
    
    await expect(page.locator('section').first()).toHaveScreenshot('button-default-hover.png');
    
    // Test hover state on outline button
    const outlineButton = page.locator('button', { hasText: 'Outline' }).first();
    await outlineButton.hover();
    await page.waitForTimeout(100);
    
    await expect(page.locator('section').first()).toHaveScreenshot('button-outline-hover.png');
  });

  test('button focus states', async ({ page }) => {
    await page.goto('/test-button');
    await page.waitForLoadState('networkidle');
    
    // Test focus state on different button variants
    const buttons = [
      { text: 'Default', name: 'default' },
      { text: 'Destructive', name: 'destructive' },
      { text: 'Outline', name: 'outline' },
      { text: 'Secondary', name: 'secondary' },
      { text: 'Ghost', name: 'ghost' }
    ];
    
    for (const button of buttons) {
      const element = page.locator('button', { hasText: button.text }).first();
      await element.focus();
      await page.waitForTimeout(100);
      
      await expect(element).toHaveScreenshot(`button-${button.name}-focus.png`);
    }
  });

  test('button responsive layout', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1024, height: 768, name: 'desktop' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/test-button');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      
      await expect(page).toHaveScreenshot(`button-test-${viewport.name}.png`, {
        fullPage: true,
      });
    }
  });
});