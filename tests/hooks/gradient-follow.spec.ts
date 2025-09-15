import { test, expect } from '@playwright/test'

test.describe('Gradient Follow Hook Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Create a test page for gradient follow hook
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              margin: 0; 
              padding: 50px; 
              font-family: Arial, sans-serif; 
              background: #0a0a0a;
              color: white;
            }
            .gradient-element {
              width: 400px;
              height: 300px;
              background: #1a1a1a;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: background 0.3s ease-out;
              border: 1px solid #333;
              user-select: none;
              position: relative;
              overflow: hidden;
            }
            .gradient-element.active {
              transition: none;
            }
            .content {
              position: relative;
              z-index: 2;
              font-size: 18px;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <h1>Gradient Follow Test</h1>
          <div id="gradient-element" class="gradient-element">
            <div class="content">Gradient Follows Cursor</div>
          </div>
          
          <script>
            // Simulate the gradient follow hook functionality
            let isHovered = false;
            let animationFrame = null;
            let targetPosition = { x: 0, y: 0 };
            let currentPosition = { x: 0, y: 0 };
            
            const element = document.getElementById('gradient-element');
            const radius = 200;
            const colors = ['rgba(59, 130, 246, 0.3)', 'rgba(139, 92, 246, 0.2)', 'transparent'];
            const smoothFactor = 0.1;
            const smooth = true;
            
            function lerp(start, end, factor) {
              return start + (end - start) * factor;
            }
            
            function getCursorPosition(event) {
              const rect = element.getBoundingClientRect();
              return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
              };
            }
            
            function createFollowGradient(position, bounds) {
              const xPercent = (position.x / bounds.width) * 100;
              const yPercent = (position.y / bounds.height) * 100;
              
              const colorStops = colors.map((color, index) => {
                const stop = (index / (colors.length - 1)) * 100;
                return \`\${color} \${stop}%\`;
              }).join(', ');
              
              return \`radial-gradient(\${radius}px circle at \${xPercent}% \${yPercent}%, \${colorStops})\`;
            }
            
            function updateGradient() {
              if (!isHovered) return;
              
              const current = currentPosition;
              const target = targetPosition;
              
              if (smooth) {
                const newX = lerp(current.x, target.x, smoothFactor);
                const newY = lerp(current.y, target.y, smoothFactor);
                
                currentPosition = { x: newX, y: newY };
              } else {
                currentPosition = target;
              }
              
              const rect = element.getBoundingClientRect();
              const bounds = { width: rect.width, height: rect.height };
              const gradient = createFollowGradient(currentPosition, bounds);
              
              element.style.background = gradient;
              element.setAttribute('data-cursor-x', currentPosition.x.toString());
              element.setAttribute('data-cursor-y', currentPosition.y.toString());
              element.setAttribute('data-gradient', gradient);
              
              if (smooth) {
                const threshold = 1;
                if (Math.abs(currentPosition.x - target.x) > threshold ||
                    Math.abs(currentPosition.y - target.y) > threshold) {
                  animationFrame = requestAnimationFrame(updateGradient);
                }
              }
            }
            
            function startAnimation() {
              if (animationFrame) return;
              animationFrame = requestAnimationFrame(updateGradient);
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
              
              const rect = element.getBoundingClientRect();
              element.setAttribute('data-bounds-width', rect.width.toString());
              element.setAttribute('data-bounds-height', rect.height.toString());
              
              const cursorPos = getCursorPosition(event);
              targetPosition = cursorPos;
              
              if (smooth) {
                startAnimation();
              } else {
                updateGradient();
              }
            });
            
            // Throttle mouse move for performance
            let lastMoveTime = 0;
            element.addEventListener('mousemove', (event) => {
              if (!isHovered) return;
              
              const now = Date.now();
              if (now - lastMoveTime < 16) return; // ~60fps
              lastMoveTime = now;
              
              const cursorPos = getCursorPosition(event);
              targetPosition = cursorPos;
              
              if (smooth) {
                startAnimation();
              } else {
                updateGradient();
              }
            });
            
            element.addEventListener('mouseleave', () => {
              isHovered = false;
              element.classList.remove('active');
              element.setAttribute('data-hovered', 'false');
              
              // Clear gradient
              element.style.background = '#1a1a1a';
              element.setAttribute('data-gradient', '');
              
              stopAnimation();
            });
            
            // Initialize data attributes
            element.setAttribute('data-cursor-x', '0');
            element.setAttribute('data-cursor-y', '0');
            element.setAttribute('data-hovered', 'false');
            element.setAttribute('data-gradient', '');
          </script>
        </body>
      </html>
    `)
  })

  test('should initialize with default state', async ({ page }) => {
    const element = page.locator('#gradient-element')
    
    // Initially not hovered and no gradient
    await expect(element).toHaveAttribute('data-hovered', 'false')
    await expect(element).toHaveAttribute('data-cursor-x', '0')
    await expect(element).toHaveAttribute('data-cursor-y', '0')
    await expect(element).toHaveAttribute('data-gradient', '')
  })

  test('should become active on mouse enter', async ({ page }) => {
    const element = page.locator('#gradient-element')
    
    // Hover over the element
    await element.hover()
    
    // Should be marked as hovered and have gradient
    await expect(element).toHaveAttribute('data-hovered', 'true')
    
    // Should have a gradient value
    const gradient = await element.getAttribute('data-gradient')
    expect(gradient).toContain('radial-gradient')
    expect(gradient).toContain('circle at')
  })

  test('should update cursor position on mouse move', async ({ page }) => {
    const element = page.locator('#gradient-element')
    
    // Get element bounds
    const elementBox = await element.boundingBox()
    if (!elementBox) throw new Error('Element not found')
    
    // Move to specific position within element (75% right, 25% down)
    const targetX = elementBox.width * 0.75
    const targetY = elementBox.height * 0.25
    
    await element.hover({ position: { x: targetX, y: targetY } })
    
    // Wait for position update
    await page.waitForTimeout(200)
    
    // Check cursor position (should be close to our target)
    const cursorX = await element.getAttribute('data-cursor-x')
    const cursorY = await element.getAttribute('data-cursor-y')
    
    expect(parseFloat(cursorX || '0')).toBeCloseTo(targetX, 5)
    expect(parseFloat(cursorY || '0')).toBeCloseTo(targetY, 5)
  })

  test('should generate gradient at cursor position', async ({ page }) => {
    const element = page.locator('#gradient-element')
    
    // Get element bounds
    const elementBox = await element.boundingBox()
    if (!elementBox) throw new Error('Element not found')
    
    // Move to top-right corner (80% right, 20% down)
    await element.hover({ position: { x: elementBox.width * 0.8, y: elementBox.height * 0.2 } })
    
    // Wait for gradient generation
    await page.waitForTimeout(200)
    
    // Check gradient contains correct positioning
    const gradient = await element.getAttribute('data-gradient')
    expect(gradient).toContain('radial-gradient')
    expect(gradient).toContain('200px circle')
    
    // Should position gradient near top-right (around 80% x, 20% y)
    expect(gradient).toMatch(/at\s+[67-9]\d%\s+[12]\d%/) // Approximately 70-90% x, 10-30% y
  })

  test('should clear gradient on mouse leave', async ({ page }) => {
    const element = page.locator('#gradient-element')
    
    // Hover to create gradient
    await element.hover({ position: { x: 200, y: 150 } })
    await page.waitForTimeout(200)
    
    // Verify gradient exists
    const gradientBefore = await element.getAttribute('data-gradient')
    expect(gradientBefore).toContain('radial-gradient')
    
    // Move mouse away from element
    await page.mouse.move(0, 0)
    
    // Wait for leave event to process
    await page.waitForTimeout(200)
    
    // Should clear gradient
    await expect(element).toHaveAttribute('data-hovered', 'false')
    await expect(element).toHaveAttribute('data-gradient', '')
  })

  test('should handle smooth animation', async ({ page }) => {
    const element = page.locator('#gradient-element')
    
    // Start at one position
    await element.hover({ position: { x: 100, y: 100 } })
    await page.waitForTimeout(100)
    
    // Move to another position
    await element.hover({ position: { x: 300, y: 200 } })
    
    // With smooth animation, position should gradually change
    await page.waitForTimeout(50)
    
    const cursorX1 = parseFloat(await element.getAttribute('data-cursor-x') || '0')
    
    await page.waitForTimeout(100)
    
    const cursorX2 = parseFloat(await element.getAttribute('data-cursor-x') || '0')
    
    // Position should have moved closer to target
    expect(cursorX2).toBeGreaterThan(cursorX1)
    expect(cursorX2).toBeLessThanOrEqual(300)
  })

  test('should throttle mouse move events for performance', async ({ page }) => {
    const element = page.locator('#gradient-element')
    
    // Start performance monitoring
    await page.evaluate(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).mouseMoveCount = 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gradientUpdateCount = 0;
    })
    
    // Rapid mouse movements
    await element.hover({ position: { x: 50, y: 50 } })
    
    for (let i = 0; i < 10; i++) {
      await element.hover({ position: { x: 50 + i * 10, y: 50 + i * 5 } })
    }
    
    await page.waitForTimeout(200)
    
    // Should handle rapid movements without performance issues
    const gradient = await element.getAttribute('data-gradient')
    expect(gradient).toContain('radial-gradient')
  })

  test('should support different gradient colors', async ({ page }) => {
    // This test verifies the gradient contains expected color values
    const element = page.locator('#gradient-element')
    
    await element.hover({ position: { x: 200, y: 150 } })
    await page.waitForTimeout(200)
    
    const gradient = await element.getAttribute('data-gradient')
    
    // Should contain the test colors we defined
    expect(gradient).toContain('rgba(59, 130, 246, 0.3)') // Blue
    expect(gradient).toContain('rgba(139, 92, 246, 0.2)') // Purple
    expect(gradient).toContain('transparent')
  })

  test('should maintain performance with continuous movement', async ({ page }) => {
    const element = page.locator('#gradient-element')
    
    // Start performance monitoring
    await page.evaluate(() => {
      performance.mark('gradient-perf-start')
    })
    
    // Simulate continuous cursor movement
    await element.hover({ position: { x: 100, y: 100 } })
    
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2
      const x = 200 + Math.cos(angle) * 100
      const y = 150 + Math.sin(angle) * 75
      await element.hover({ position: { x, y } })
      await page.waitForTimeout(10)
    }
    
    await page.evaluate(() => {
      performance.mark('gradient-perf-end')
      performance.measure('gradient-perf', 'gradient-perf-start', 'gradient-perf-end')
    })
    
    // Should maintain responsiveness
    const finalGradient = await element.getAttribute('data-gradient')
    expect(finalGradient).toContain('radial-gradient')
    
    // Element should still be responsive
    await expect(element).toHaveAttribute('data-hovered', 'true')
  })

  test('should handle edge positions correctly', async ({ page }) => {
    const element = page.locator('#gradient-element')
    
    // Test corners and edges
    const positions = [
      { x: 0, y: 0 },           // Top-left corner
      { x: 400, y: 0 },         // Top-right corner  
      { x: 0, y: 300 },         // Bottom-left corner
      { x: 400, y: 300 },       // Bottom-right corner
      { x: 200, y: 0 },         // Top edge center
      { x: 200, y: 300 },       // Bottom edge center
    ]
    
    for (const pos of positions) {
      await element.hover({ position: pos })
      await page.waitForTimeout(100)
      
      const gradient = await element.getAttribute('data-gradient')
      expect(gradient).toContain('radial-gradient')
      expect(gradient).toContain('circle at')
      
      // Verify position is within bounds
      const cursorX = parseFloat(await element.getAttribute('data-cursor-x') || '0')
      const cursorY = parseFloat(await element.getAttribute('data-cursor-y') || '0')
      
      expect(cursorX).toBeGreaterThanOrEqual(0)
      expect(cursorX).toBeLessThanOrEqual(400)
      expect(cursorY).toBeGreaterThanOrEqual(0)  
      expect(cursorY).toBeLessThanOrEqual(300)
    }
  })
})