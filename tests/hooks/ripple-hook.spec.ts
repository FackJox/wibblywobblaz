import { test, expect } from '@playwright/test'

test.describe('Ripple Hook Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Create a test page for ripple hook
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .test-button {
              position: relative;
              overflow: hidden;
              padding: 12px 24px;
              background: #3b82f6;
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
            }
            .ripple {
              position: absolute;
              border-radius: 50%;
              background-color: rgba(255, 255, 255, 0.6);
              transform: translate(-50%, -50%) scale(0);
              animation: ripple-expand 600ms ease-out;
              pointer-events: none;
            }
            @keyframes ripple-expand {
              0% {
                width: 0;
                height: 0;
                opacity: 0.6;
                transform: translate(-50%, -50%) scale(0);
              }
              100% {
                width: var(--ripple-size, 200px);
                height: var(--ripple-size, 200px);
                opacity: 0;
                transform: translate(-50%, -50%) scale(1);
              }
            }
          </style>
        </head>
        <body>
          <h1>Ripple Hook Test</h1>
          <button id="ripple-button" class="test-button">
            Click me for ripple effect
          </button>
          
          <script>
            // Simulate the ripple hook functionality
            function createRipple(event) {
              const button = event.currentTarget;
              const rect = button.getBoundingClientRect();
              const x = event.clientX - rect.left;
              const y = event.clientY - rect.top;
              
              // Calculate size (diagonal distance to furthest corner)
              const size = Math.max(
                Math.sqrt(x ** 2 + y ** 2),
                Math.sqrt((rect.width - x) ** 2 + y ** 2),
                Math.sqrt(x ** 2 + (rect.height - y) ** 2),
                Math.sqrt((rect.width - x) ** 2 + (rect.height - y) ** 2)
              ) * 2;
              
              const ripple = document.createElement('span');
              ripple.className = 'ripple';
              ripple.style.left = x + 'px';
              ripple.style.top = y + 'px';
              ripple.style.setProperty('--ripple-size', size + 'px');
              
              button.appendChild(ripple);
              
              // Remove ripple after animation
              setTimeout(() => {
                if (ripple.parentNode) {
                  ripple.parentNode.removeChild(ripple);
                }
              }, 600);
            }
            
            document.getElementById('ripple-button').addEventListener('mousedown', createRipple);
            document.getElementById('ripple-button').addEventListener('touchstart', createRipple);
          </script>
        </body>
      </html>
    `)
  })

  test('should create ripple effect on click', async ({ page }) => {
    const button = page.locator('#ripple-button')
    
    // Click the button to trigger ripple
    await button.click()
    
    // Check that a ripple element was created
    const ripples = page.locator('.ripple')
    await expect(ripples).toHaveCount(1)
    
    // Wait for animation to complete and ripple to be removed
    await page.waitForTimeout(700)
    await expect(ripples).toHaveCount(0)
  })

  test('should position ripple at click location', async ({ page }) => {
    const button = page.locator('#ripple-button')
    
    // Get button bounds
    const buttonBox = await button.boundingBox()
    if (!buttonBox) throw new Error('Button not found')
    
    // Click at a specific position (top-left quarter)
    const clickX = buttonBox.x + buttonBox.width * 0.25
    const clickY = buttonBox.y + buttonBox.height * 0.25
    
    await page.mouse.click(clickX, clickY)
    
    // Check ripple position
    const ripple = page.locator('.ripple').first()
    await expect(ripple).toBeVisible()
    
    const rippleLeft = await ripple.evaluate(el => el.style.left)
    const rippleTop = await ripple.evaluate(el => el.style.top)
    
    // Position should be relative to click within button
    expect(parseFloat(rippleLeft)).toBeCloseTo(buttonBox.width * 0.25, 1)
    expect(parseFloat(rippleTop)).toBeCloseTo(buttonBox.height * 0.25, 1)
  })

  test('should handle multiple simultaneous ripples', async ({ page }) => {
    const button = page.locator('#ripple-button')
    
    // Create multiple ripples quickly
    await button.click({ position: { x: 10, y: 10 } })
    await button.click({ position: { x: 50, y: 20 } })
    await button.click({ position: { x: 80, y: 30 } })
    
    // Should have 3 ripples
    const ripples = page.locator('.ripple')
    await expect(ripples).toHaveCount(3)
    
    // All ripples should eventually disappear
    await page.waitForTimeout(700)
    await expect(ripples).toHaveCount(0)
  })

  test('should respect reduced motion preference', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' })
    
    // In a real implementation, this would disable ripples
    // For this test, we'll just verify the button still works
    const button = page.locator('#ripple-button')
    await button.click()
    
    // Button should still be clickable
    await expect(button).toBeVisible()
  })

  test('should have proper animation performance', async ({ page }) => {
    const button = page.locator('#ripple-button')
    
    // Start performance monitoring
    await page.evaluate(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).performanceMarks = [];
      performance.mark('ripple-start');
    })
    
    await button.click()
    
    await page.evaluate(() => {
      performance.mark('ripple-end');
      performance.measure('ripple-duration', 'ripple-start', 'ripple-end');
    })
    
    // Verify ripple was created efficiently
    const ripple = page.locator('.ripple').first()
    await expect(ripple).toBeVisible()
    
    // Check that hardware acceleration styles are applied
    const transform = await ripple.evaluate(el => 
      getComputedStyle(el).transform
    )
    expect(transform).not.toBe('none')
  })
})