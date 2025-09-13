import {
  getCursorPosition,
  getElementCenter,
  getDistance,
  lerp,
  clamp,
  calculateMagneticForce,
  applyTransform,
  createFollowGradient,
  calculateParallaxOffset,
  shouldReduceMotion,
  throttle,
  createHoverHandler
} from '@/lib/hover-utils'

// Mock matchMedia
const mockMatchMedia = jest.fn()
global.matchMedia = mockMatchMedia

// Mock element methods
const mockElement = {
  getBoundingClientRect: jest.fn(() => ({
    width: 100,
    height: 100,
    top: 0,
    left: 0,
    bottom: 100,
    right: 100
  })),
  style: {},
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
}

describe('hover-utils', () => {
  beforeEach(() => {
    mockMatchMedia.mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }))
    jest.clearAllMocks()
    mockElement.style = {}
  })

  describe('getCursorPosition', () => {
    it('should calculate cursor position relative to element', () => {
      const event = {
        clientX: 150,
        clientY: 200
      } as MouseEvent

      const result = getCursorPosition(event, mockElement as unknown as HTMLElement)
      
      expect(result).toEqual({ x: 150, y: 200 })
    })
  })

  describe('getElementCenter', () => {
    it('should calculate element center', () => {
      const result = getElementCenter(mockElement as unknown as HTMLElement)
      
      expect(result).toEqual({ x: 50, y: 50 })
    })
  })

  describe('getDistance', () => {
    it('should calculate distance between two points', () => {
      const point1 = { x: 0, y: 0 }
      const point2 = { x: 3, y: 4 }
      
      const result = getDistance(point1, point2)
      
      expect(result).toBe(5) // 3-4-5 triangle
    })
  })

  describe('lerp', () => {
    it('should interpolate between values', () => {
      expect(lerp(0, 10, 0)).toBe(0)
      expect(lerp(0, 10, 0.5)).toBe(5)
      expect(lerp(0, 10, 1)).toBe(10)
    })
  })

  describe('clamp', () => {
    it('should clamp values within range', () => {
      expect(clamp(-5, 0, 10)).toBe(0)
      expect(clamp(5, 0, 10)).toBe(5)
      expect(clamp(15, 0, 10)).toBe(10)
    })
  })

  describe('calculateMagneticForce', () => {
    it('should calculate magnetic attraction force', () => {
      const cursorPos = { x: 60, y: 60 }
      const elementCenter = { x: 50, y: 50 }
      
      const result = calculateMagneticForce(cursorPos, elementCenter)
      
      expect(result.x).toBeGreaterThan(0)
      expect(result.y).toBeGreaterThan(0)
    })

    it('should return zero force when cursor is too far', () => {
      const cursorPos = { x: 200, y: 200 }
      const elementCenter = { x: 50, y: 50 }
      
      const result = calculateMagneticForce(cursorPos, elementCenter, { maxDistance: 50 })
      
      expect(result).toEqual({ x: 0, y: 0 })
    })

    it('should respect boundary limits', () => {
      const cursorPos = { x: 100, y: 100 }
      const elementCenter = { x: 50, y: 50 }
      
      const result = calculateMagneticForce(cursorPos, elementCenter, {
        boundaries: { x: 0.1, y: 0.1 }
      })
      
      expect(Math.abs(result.x)).toBeLessThanOrEqual(5) // 0.1 * 50
      expect(Math.abs(result.y)).toBeLessThanOrEqual(5)
    })
  })

  describe('applyTransform', () => {
    it('should apply 3D transform when useGPU is true', () => {
      const transform = { x: 10, y: 20 }
      
      applyTransform(mockElement as unknown as HTMLElement, transform, true)
      
      expect(mockElement.style.transform).toBe('translate3d(10px, 20px, 0)')
    })

    it('should apply 2D transform when useGPU is false', () => {
      const transform = { x: 10, y: 20 }
      
      applyTransform(mockElement as unknown as HTMLElement, transform, false)
      
      expect(mockElement.style.transform).toBe('translate(10px, 20px)')
    })
  })

  describe('createFollowGradient', () => {
    it('should create radial gradient string', () => {
      const position = { x: 50, y: 50 }
      const bounds = { top: 0, left: 0, bottom: 100, right: 100, width: 100, height: 100 }
      
      const result = createFollowGradient(position, bounds)
      
      expect(result).toContain('radial-gradient')
      expect(result).toContain('50%') // Position percentages
    })

    it('should use custom colors and radius', () => {
      const position = { x: 25, y: 75 }
      const bounds = { top: 0, left: 0, bottom: 100, right: 100, width: 100, height: 100 }
      const config = {
        radius: 300,
        colors: ['rgba(255, 0, 0, 0.5)', 'transparent']
      }
      
      const result = createFollowGradient(position, bounds, config)
      
      expect(result).toContain('300px')
      expect(result).toContain('25%')
      expect(result).toContain('75%')
    })
  })

  describe('calculateParallaxOffset', () => {
    it('should calculate parallax offset and rotation', () => {
      const cursorPos = { x: 75, y: 75 }
      const elementCenter = { x: 50, y: 50 }
      const elementBounds = { top: 0, left: 0, bottom: 100, right: 100, width: 100, height: 100 }
      
      const result = calculateParallaxOffset(cursorPos, elementCenter, elementBounds, 0.2)
      
      expect(result.x).toBeGreaterThan(0)
      expect(result.y).toBeGreaterThan(0)
      expect(result.rotation).toBeGreaterThan(0)
    })

    it('should respect depth parameter', () => {
      const cursorPos = { x: 75, y: 75 }
      const elementCenter = { x: 50, y: 50 }
      const elementBounds = { top: 0, left: 0, bottom: 100, right: 100, width: 100, height: 100 }
      
      const shallowResult = calculateParallaxOffset(cursorPos, elementCenter, elementBounds, 0.1)
      const deepResult = calculateParallaxOffset(cursorPos, elementCenter, elementBounds, 0.5)
      
      expect(Math.abs(deepResult.x)).toBeGreaterThan(Math.abs(shallowResult.x))
      expect(Math.abs(deepResult.y)).toBeGreaterThan(Math.abs(shallowResult.y))
    })
  })

  describe('shouldReduceMotion', () => {
    it('should return false when reduced motion is not preferred', () => {
      expect(shouldReduceMotion()).toBe(false)
    })

    it('should return true when reduced motion is preferred', () => {
      mockMatchMedia.mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      }))

      expect(shouldReduceMotion()).toBe(true)
    })
  })

  describe('throttle', () => {
    it('should throttle function calls', (done) => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)
      
      // Call multiple times quickly
      throttledFn('arg1')
      throttledFn('arg2')
      throttledFn('arg3')
      
      // Should only call once immediately
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('arg1')
      
      // Wait for throttle delay
      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(2)
        expect(mockFn).toHaveBeenLastCalledWith('arg3')
        done()
      }, 150)
    })
  })

  describe('createHoverHandler', () => {
    it('should create event handlers and return cleanup function', () => {
      const onEnter = jest.fn()
      const onLeave = jest.fn()
      const onMove = jest.fn()
      
      const cleanup = createHoverHandler(mockElement as unknown as HTMLElement, {
        onEnter,
        onLeave,
        onMove
      })
      
      expect(mockElement.addEventListener).toHaveBeenCalledWith('mouseenter', expect.any(Function))
      expect(mockElement.addEventListener).toHaveBeenCalledWith('mouseleave', expect.any(Function))
      expect(mockElement.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function))
      
      // Call cleanup
      cleanup()
      
      expect(mockElement.removeEventListener).toHaveBeenCalledWith('mouseenter', expect.any(Function))
      expect(mockElement.removeEventListener).toHaveBeenCalledWith('mouseleave', expect.any(Function))
      expect(mockElement.removeEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function))
    })

    it('should handle partial handler configuration', () => {
      const onEnter = jest.fn()
      
      const cleanup = createHoverHandler(mockElement as unknown as HTMLElement, {
        onEnter
      })
      
      expect(mockElement.addEventListener).toHaveBeenCalledWith('mouseenter', expect.any(Function))
      expect(mockElement.addEventListener).not.toHaveBeenCalledWith('mouseleave', expect.any(Function))
      expect(mockElement.addEventListener).not.toHaveBeenCalledWith('mousemove', expect.any(Function))
      
      cleanup()
    })
  })
})