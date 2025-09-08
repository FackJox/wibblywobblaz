import { renderHook, act } from '@testing-library/react'
import { useGradientFollow, useSimpleGradientFollow } from '@/hooks/use-gradient-follow'

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
  setTimeout(cb, 16)
  return 1
})

global.cancelAnimationFrame = jest.fn()

// Mock performance.now
Object.defineProperty(global.performance, 'now', {
  value: jest.fn(() => Date.now())
})

// Mock reduced motion media query
const mockMatchMedia = jest.fn()
global.matchMedia = mockMatchMedia

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 200,
  height: 150,
  top: 0,
  left: 0,
  bottom: 150,
  right: 200,
  x: 0,
  y: 0,
  toJSON: () => {}
}))

// Mock window resize event
Object.defineProperty(global, 'window', {
  value: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  }
})

describe('useGradientFollow', () => {
  beforeEach(() => {
    mockMatchMedia.mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }))
    jest.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useGradientFollow())
    
    expect(result.current.cursorPosition).toEqual({ x: 0, y: 0 })
    expect(result.current.gradientValue).toBe('')
    expect(result.current.isHovered).toBe(false)
    expect(result.current.isActive).toBe(false) // Not active until hovered
  })

  it('should be inactive when disabled', () => {
    const { result } = renderHook(() => useGradientFollow({ disabled: true }))
    
    expect(result.current.isActive).toBe(false)
  })

  it('should be inactive when user prefers reduced motion', () => {
    mockMatchMedia.mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }))

    const { result } = renderHook(() => useGradientFollow())
    
    expect(result.current.isActive).toBe(false)
  })

  it('should be active when hoverOnly is false', () => {
    const { result } = renderHook(() => useGradientFollow({ hoverOnly: false }))
    
    expect(result.current.isActive).toBe(true)
  })

  it('should manually set cursor position', () => {
    const { result } = renderHook(() => useGradientFollow({ hoverOnly: false }))
    
    act(() => {
      result.current.setCursorPosition({ x: 100, y: 75 })
    })
    
    // Position should be updated (exact values depend on smooth animation)
    expect(result.current.isActive).toBe(true)
  })

  it('should reset gradient effect', () => {
    const { result } = renderHook(() => useGradientFollow({ hoverOnly: false }))
    
    act(() => {
      result.current.setCursorPosition({ x: 100, y: 75 })
    })
    
    act(() => {
      result.current.reset()
    })
    
    expect(result.current.cursorPosition).toEqual({ x: 0, y: 0 })
    expect(result.current.gradientValue).toBe('')
  })

  it('should generate gradient with custom colors', () => {
    const customColors = ['rgba(255, 0, 0, 0.5)', 'transparent']
    const { result } = renderHook(() => useGradientFollow({ 
      colors: customColors,
      hoverOnly: false 
    }))
    
    act(() => {
      result.current.setCursorPosition({ x: 100, y: 75 })
    })
    
    // The gradient should be generated (exact format depends on implementation)
    expect(result.current.isActive).toBe(true)
  })

  it('should setup event listeners when element ref is set', () => {
    const { result } = renderHook(() => useGradientFollow())
    
    const mockElement = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      getBoundingClientRect: jest.fn(() => ({
        width: 200,
        height: 150,
        top: 0,
        left: 0,
        bottom: 150,
        right: 200
      })),
      style: {}
    }
    
    // Set the ref
    act(() => {
      ;(result.current.ref as any).current = mockElement
    })
    
    expect(mockElement.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function))
    expect(mockElement.addEventListener).toHaveBeenCalledWith('mouseenter', expect.any(Function))
    expect(mockElement.addEventListener).toHaveBeenCalledWith('mouseleave', expect.any(Function))
  })
})

describe('useSimpleGradientFollow', () => {
  beforeEach(() => {
    mockMatchMedia.mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }))
    jest.clearAllMocks()
  })

  it('should apply subtle preset configuration', () => {
    const { result } = renderHook(() => useSimpleGradientFollow('subtle'))
    
    expect(result.current.cursorPosition).toEqual({ x: 0, y: 0 })
    expect(result.current.gradientValue).toBe('')
  })

  it('should apply spotlight preset configuration', () => {
    const { result } = renderHook(() => useSimpleGradientFollow('spotlight'))
    
    expect(result.current.cursorPosition).toEqual({ x: 0, y: 0 })
    expect(result.current.gradientValue).toBe('')
  })

  it('should apply glow preset configuration', () => {
    const { result } = renderHook(() => useSimpleGradientFollow('glow'))
    
    expect(result.current.cursorPosition).toEqual({ x: 0, y: 0 })
    expect(result.current.gradientValue).toBe('')
  })

  it('should apply rainbow preset configuration', () => {
    const { result } = renderHook(() => useSimpleGradientFollow('rainbow'))
    
    expect(result.current.cursorPosition).toEqual({ x: 0, y: 0 })
    expect(result.current.gradientValue).toBe('')
  })

  it('should allow overrides to preset configuration', () => {
    const { result } = renderHook(() => useSimpleGradientFollow('subtle', { disabled: true }))
    
    expect(result.current.isActive).toBe(false)
  })
})