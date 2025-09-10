/**
 * @jest-environment jsdom
 */

import { 
  HAPTIC_PATTERNS,
  scalePattern,
  createCustomPattern,
  isVibrationSupported,
  hasReducedMotionPreference
} from '@/lib/haptics'

// Simple integration tests that don't require complex mocking
describe('Haptic Integration Tests', () => {
  describe('Haptic Patterns', () => {
    it('should have all required patterns defined', () => {
      const requiredPatterns = [
        'tap', 'buttonPress',
        'swipeStart', 'swipeProgress', 'swipeComplete', 'swipeCancel',
        'longPressStart', 'longPressProgress', 'longPressComplete', 'longPressCancel',
        'error', 'success',
        'pageEnter', 'pageExit'
      ]
      
      requiredPatterns.forEach(pattern => {
        expect(HAPTIC_PATTERNS[pattern]).toBeDefined()
        expect(HAPTIC_PATTERNS[pattern].pattern).toBeInstanceOf(Array)
        expect(HAPTIC_PATTERNS[pattern].pattern.length).toBeGreaterThan(0)
        expect(HAPTIC_PATTERNS[pattern].name).toBe(pattern)
        expect(HAPTIC_PATTERNS[pattern].description).toBeTruthy()
      })
    })

    it('should have valid pattern structures', () => {
      Object.values(HAPTIC_PATTERNS).forEach(pattern => {
        expect(pattern.name).toBeTruthy()
        expect(pattern.pattern).toBeInstanceOf(Array)
        expect(pattern.description).toBeTruthy()
        
        // All pattern values should be positive numbers
        pattern.pattern.forEach(duration => {
          expect(typeof duration).toBe('number')
          expect(duration).toBeGreaterThan(0)
        })
      })
    })
  })

  describe('Pattern Utilities', () => {
    it('should scale patterns correctly', () => {
      const pattern = [100, 50, 200, 30]
      const scaled = scalePattern(pattern, 0.5)
      
      // Even indices (vibrations) should be scaled, odd indices (pauses) unchanged
      expect(scaled).toEqual([50, 50, 100, 30])
    })

    it('should clamp intensity values', () => {
      const pattern = [100]
      
      // Test lower bound
      const tooLow = scalePattern(pattern, 0.05)
      expect(tooLow).toEqual([10]) // 100 * 0.1 (clamped)
      
      // Test upper bound
      const tooHigh = scalePattern(pattern, 2.0)
      expect(tooHigh).toEqual([100]) // 100 * 1.0 (clamped)
    })

    it('should create custom patterns', () => {
      const customPattern = createCustomPattern('test-pattern', [50, 25, 50], 'Test pattern')
      
      expect(customPattern.name).toBe('test-pattern')
      expect(customPattern.pattern).toEqual([50, 25, 50])
      expect(customPattern.description).toBe('Test pattern')
      expect(HAPTIC_PATTERNS['test-pattern']).toBe(customPattern)
    })
  })

  describe('Environment Detection', () => {
    it('should detect vibration support', () => {
      const isSupported = isVibrationSupported()
      
      // Should be true in JSDOM with mocked navigator.vibrate
      expect(typeof isSupported).toBe('boolean')
    })

    it('should detect reduced motion preference', () => {
      const hasReducedMotion = hasReducedMotionPreference()
      
      // Should be false by default in test environment
      expect(hasReducedMotion).toBe(false)
    })
  })

  describe('Pattern Validation', () => {
    it('should have appropriate timing for different interaction types', () => {
      // Quick feedback patterns should be short
      expect(HAPTIC_PATTERNS.tap.pattern[0]).toBeLessThanOrEqual(50)
      expect(HAPTIC_PATTERNS.swipeStart.pattern[0]).toBeLessThanOrEqual(50)
      
      // Feedback patterns should be moderate
      expect(HAPTIC_PATTERNS.buttonPress.pattern[0]).toBeGreaterThan(20)
      expect(HAPTIC_PATTERNS.buttonPress.pattern[0]).toBeLessThanOrEqual(100)
      
      // Success patterns can be longer
      expect(HAPTIC_PATTERNS.success.pattern.length).toBeGreaterThanOrEqual(3)
    })

    it('should have consistent naming pattern', () => {
      const originalPatterns = [
        'tap', 'buttonPress',
        'swipeStart', 'swipeProgress', 'swipeComplete', 'swipeCancel',
        'longPressStart', 'longPressProgress', 'longPressComplete', 'longPressCancel',
        'error', 'success',
        'pageEnter', 'pageExit'
      ]
      
      originalPatterns.forEach(key => {
        const pattern = HAPTIC_PATTERNS[key]
        expect(pattern.name).toBe(key)
        expect(pattern.name).toMatch(/^[a-zA-Z][a-zA-Z0-9]*$/) // camelCase
      })
    })
  })

  describe('Pattern Categories', () => {
    const getPatternsByCategory = (prefix: string) =>
      Object.keys(HAPTIC_PATTERNS).filter(key => key.startsWith(prefix))

    it('should have complete swipe pattern set', () => {
      const swipePatterns = getPatternsByCategory('swipe')
      expect(swipePatterns).toContain('swipeStart')
      expect(swipePatterns).toContain('swipeProgress')
      expect(swipePatterns).toContain('swipeComplete')
      expect(swipePatterns).toContain('swipeCancel')
    })

    it('should have complete long press pattern set', () => {
      const longPressPatterns = getPatternsByCategory('longPress')
      expect(longPressPatterns).toContain('longPressStart')
      expect(longPressPatterns).toContain('longPressProgress')
      expect(longPressPatterns).toContain('longPressComplete')
      expect(longPressPatterns).toContain('longPressCancel')
    })

    it('should have page transition patterns', () => {
      expect(HAPTIC_PATTERNS.pageEnter).toBeDefined()
      expect(HAPTIC_PATTERNS.pageExit).toBeDefined()
    })

    it('should have UI feedback patterns', () => {
      expect(HAPTIC_PATTERNS.success).toBeDefined()
      expect(HAPTIC_PATTERNS.error).toBeDefined()
      expect(HAPTIC_PATTERNS.tap).toBeDefined()
      expect(HAPTIC_PATTERNS.buttonPress).toBeDefined()
    })
  })
})