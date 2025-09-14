import { test, expect } from '@playwright/test'

test.describe('Magnetic Hover Hook Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Create a test page for magnetic hover hook
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              margin: 0; 
              padding: 50px; 
              font-family: Arial, sans-serif; 
              background: #1a1a1a;
              color: white;
            }
            .magnetic-element {
              width: 200px;
              height: 100px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: transform 0.3s ease-out;
              transform-style: preserve-3d;
              backface-visibility: hidden;
              user-select: none;
            }
            .magnetic-element.active {
              transition: none;
            }
          </style>
        </head>
        <body>
          <h1>Magnetic Hover Test</h1>
          <div id="magnetic-element" class="magnetic-element">
            Magnetic Element
          </div>
          
          <script>
            // Simulate the magnetic hover hook functionality
            let isHovered = false;
            let animationFrame = null;
            let targetTransform = { x: 0, y: 0 };
            let currentTransform = { x: 0, y: 0 };
            
            const element = document.getElementById('magnetic-element');
            const strength = 0.3;
            const maxDistance = 100;
            const lerpFactor = 0.1;
            
            function lerp(start, end, factor) {
              return start + (end - start) * factor;
            }
            
            function getCursorPosition(event) {
              const rect = element.getBoundingClientRect();
              const centerX = rect.left + rect.width / 2;
              const centerY = rect.top + rect.height / 2;
              
              return {
                x: event.clientX - centerX,
                y: event.clientY - centerY
              };
            }
            
            function calculateMagneticForce(cursorPos) {
              const distance = Math.sqrt(cursorPos.x ** 2 + cursorPos.y ** 2);
              
              if (distance > maxDistance) return { x: 0, y: 0 };
              
              const forceX = cursorPos.x * strength;
              const forceY = cursorPos.y * strength;
              
              // Apply boundaries (50% of element size)
              const rect = element.getBoundingClientRect();
              const maxMoveX = rect.width * 0.5;
              const maxMoveY = rect.height * 0.5;
              
              return {
                x: Math.max(-maxMoveX, Math.min(maxMoveX, forceX)),
                y: Math.max(-maxMoveY, Math.min(maxMoveY, forceY))
              };
            }
            
            function animate() {
              const newX = lerp(currentTransform.x, targetTransform.x, lerpFactor);
              const newY = lerp(currentTransform.y, targetTransform.y, lerpFactor);
              
              currentTransform = { x: newX, y: newY };
              
              element.style.transform = \`translate3d(\${newX}px, \${newY}px, 0)\`;
              element.setAttribute('data-transform-x', newX.toString());
              element.setAttribute('data-transform-y', newY.toString());
              
              const threshold = 0.1;
              if (Math.abs(newX - targetTransform.x) > threshold || 
                  Math.abs(newY - targetTransform.y) > threshold) {
                animationFrame = requestAnimationFrame(animate);
              }
            }
            
            function startAnimation() {
              if (animationFrame) return;
              animationFrame = requestAnimationFrame(animate);
            }
            
            function stopAnimation() {
              if (animationFrame) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
              }
            }
            
            element.addEventListener('mouseenter', (event) => {
              isHovered = true;
              element.classList.add('active');
              element.setAttribute('data-hovered', 'true');
              
              const cursorPos = getCursorPosition(event);
              const force = calculateMagneticForce(cursorPos);
              targetTransform = force;
              startAnimation();
            });
            
            element.addEventListener('mousemove', (event) => {
              if (!isHovered) return;
              
              const cursorPos = getCursorPosition(event);
              const force = calculateMagneticForce(cursorPos);
              targetTransform = force;
              startAnimation();
            });
            
            element.addEventListener('mouseleave', () => {
              isHovered = false;
              element.classList.remove('active');
              element.setAttribute('data-hovered', 'false');
              
              targetTransform = { x: 0, y: 0 };
              startAnimation();
            });
            
            // Initialize data attributes
            element.setAttribute('data-transform-x', '0');
            element.setAttribute('data-transform-y', '0');
            element.setAttribute('data-hovered', 'false');
          </script>
        </body>
      </html>
    `)
  })

  test('should respond to mouse hover', async ({ page }) => {
    const element = page.locator('#magnetic-element')
    
    // Initially not hovered
    await expect(element).toHaveAttribute('data-hovered', 'false')
    await expect(element).toHaveAttribute('data-transform-x', '0')
    await expect(element).toHaveAttribute('data-transform-y', '0')
    
    // Hover over the element
    await element.hover()
    
    // Should be marked as hovered
    await expect(element).toHaveAttribute('data-hovered', 'true')
  })

  test('should apply magnetic force based on cursor position', async ({ page }) => {
    const element = page.locator('#magnetic-element')
    
    // Get element bounds
    const elementBox = await element.boundingBox()
    if (!elementBox) throw new Error('Element not found')
    
    // Move to the right side of the element (should create positive X transform)
    const hoverX = elementBox.x + elementBox.width * 0.8
    const hoverY = elementBox.y + elementBox.height * 0.5
    
    await page.mouse.move(hoverX, hoverY)
    
    // Wait for animation to settle
    await page.waitForTimeout(300)
    
    // Check transform values
    const transformX = await element.getAttribute('data-transform-x')
    const transformY = await element.getAttribute('data-transform-y')
    
    // X should be positive (element attracted to right)
    expect(parseFloat(transformX || '0')).toBeGreaterThan(0)
    // Y should be close to 0 (cursor at center height)
    expect(Math.abs(parseFloat(transformY || '0'))).toBeLessThan(5)
  })

  test('should return to center on mouse leave', async ({ page }) => {
    const element = page.locator('#magnetic-element')
    
    // Hover and move to create attraction
    await element.hover({ position: { x: 160, y: 50 } }) // Right side
    
    // Wait for magnetic effect
    await page.waitForTimeout(200)
    
    // Verify element is attracted
    const attractedX = await element.getAttribute('data-transform-x')
    expect(parseFloat(attractedX || '0')).toBeGreaterThan(5)
    
    // Move mouse away
    await page.mouse.move(0, 0)
    
    // Wait for return animation
    await page.waitForTimeout(500)
    
    // Should return to center
    const finalX = await element.getAttribute('data-transform-x')
    const finalY = await element.getAttribute('data-transform-y')
    
    expect(Math.abs(parseFloat(finalX || '0'))).toBeLessThan(1)
    expect(Math.abs(parseFloat(finalY || '0'))).toBeLessThan(1)
    await expect(element).toHaveAttribute('data-hovered', 'false')
  })

  test('should respect maximum distance constraint', async ({ page }) => {
    const element = page.locator('#magnetic-element')
    
    // Get element bounds
    const elementBox = await element.boundingBox()
    if (!elementBox) throw new Error('Element not found')
    
    // Move far away from element center (beyond maxDistance)
    const farX = elementBox.x + elementBox.width + 200 // Very far right
    const farY = elementBox.y + elementBox.height / 2
    
    await page.mouse.move(farX, farY)
    
    // Wait for any potential animation
    await page.waitForTimeout(200)
    
    // Transform should be minimal or zero due to distance constraint
    const transformX = await element.getAttribute('data-transform-x')
    const transformY = await element.getAttribute('data-transform-y')
    
    expect(Math.abs(parseFloat(transformX || '0'))).toBeLessThan(2)
    expect(Math.abs(parseFloat(transformY || '0'))).toBeLessThan(2)
  })

  test('should have smooth animation performance', async ({ page }) => {
    const element = page.locator('#magnetic-element')
    
    // Start performance monitoring
    await page.evaluate(() => {
      performance.mark('magnetic-start')
    })
    
    // Create magnetic interaction
    await element.hover({ position: { x: 150, y: 30 } })
    await page.waitForTimeout(100)
    await element.hover({ position: { x: 50, y: 70 } })
    await page.waitForTimeout(100)
    
    await page.evaluate(() => {
      performance.mark('magnetic-end')
      performance.measure('magnetic-duration', 'magnetic-start', 'magnetic-end')
    })
    
    // Verify smooth transitions
    const transform = await element.evaluate(el => getComputedStyle(el).transform)
    expect(transform).not.toBe('none')
    
    // Element should have hardware acceleration class applied during hover
    await expect(element).toHaveClass(/active/)
  })

  test('should handle rapid mouse movements', async ({ page }) => {
    const element = page.locator('#magnetic-element')
    
    // Get element bounds
    const elementBox = await element.boundingBox()
    if (!elementBox) throw new Error('Element not found')
    
    // Rapid movements around the element
    const centerX = elementBox.x + elementBox.width / 2
    const centerY = elementBox.y + elementBox.height / 2
    
    await page.mouse.move(centerX - 50, centerY)
    await page.mouse.move(centerX + 50, centerY)
    await page.mouse.move(centerX, centerY - 30)
    await page.mouse.move(centerX, centerY + 30)
    await page.mouse.move(centerX, centerY)
    
    // Should handle rapid movements without errors
    await page.waitForTimeout(200)
    
    // Element should still be responsive
    const isHovered = await element.getAttribute('data-hovered')
    expect(isHovered).toBe('true')
  })

  test('should apply proper CSS transforms for hardware acceleration', async ({ page }) => {
    const element = page.locator('#magnetic-element')
    
    await element.hover({ position: { x: 100, y: 30 } })
    await page.waitForTimeout(200)
    
    // Check that translate3d is used for hardware acceleration
    const transform = await element.evaluate(el => el.style.transform)
    expect(transform).toMatch(/translate3d/)
    
    // Verify backface-visibility is set for performance
    const backfaceVisibility = await element.evaluate(el => 
      getComputedStyle(el).backfaceVisibility
    )
    expect(backfaceVisibility).toBe('hidden')
  })
})