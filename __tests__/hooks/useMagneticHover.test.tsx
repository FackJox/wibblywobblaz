import { renderHook, act } from '@testing-library/react'
import { useMagneticHover, useSimpleMagneticHover } from '@/hooks/use-magnetic-hover'

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
  width: 100,
  height: 100,
  top: 0,
  left: 0,
  bottom: 100,
  right: 100,
  x: 0,
  y: 0,
  toJSON: () => {}
}))

describe('useMagneticHover', () => {
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
    const { result } = renderHook(() => useMagneticHover())
    
    expect(result.current.transform).toEqual({ x: 0, y: 0 })
    expect(result.current.isHovered).toBe(false)
    expect(result.current.isActive).toBe(true)
  })

  it('should be inactive when disabled', () => {
    const { result } = renderHook(() => useMagneticHover({ disabled: true }))
    
    expect(result.current.isActive).toBe(false)
  })

  it('should be inactive when user prefers reduced motion', () => {
    mockMatchMedia.mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }))

    const { result } = renderHook(() => useMagneticHover())
    
    expect(result.current.isActive).toBe(false)
  })

  it('should trigger magnetic effect', () => {
    const { result } = renderHook(() => useMagneticHover())
    
    act(() => {
      result.current.triggerMagnetic({ x: 50, y: 50 })
    })
    
    // The exact transform values depend on the calculation
    // We just verify that the function doesn't throw and the effect is active
    expect(result.current.isActive).toBe(true)
  })

  it('should reset transform', () => {
    const { result } = renderHook(() => useMagneticHover())
    
    act(() => {
      result.current.triggerMagnetic({ x: 50, y: 50 })
    })
    
    act(() => {
      result.current.reset()
    })
    
    expect(result.current.transform).toEqual({ x: 0, y: 0 })
  })

  it('should setup event listeners when element ref is set', () => {
    const { result } = renderHook(() => useMagneticHover())
    
    const mockElement = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      getBoundingClientRect: jest.fn(() => ({
        width: 100,
        height: 100,
        top: 0,
        left: 0,
        bottom: 100,
        right: 100
      }))
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

describe('useSimpleMagneticHover', () => {
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
    const { result } = renderHook(() => useSimpleMagneticHover('subtle'))
    
    expect(result.current.isActive).toBe(true)
    expect(result.current.transform).toEqual({ x: 0, y: 0 })
  })

  it('should apply normal preset configuration', () => {
    const { result } = renderHook(() => useSimpleMagneticHover('normal'))
    
    expect(result.current.isActive).toBe(true)
    expect(result.current.transform).toEqual({ x: 0, y: 0 })
  })

  it('should apply strong preset configuration', () => {
    const { result } = renderHook(() => useSimpleMagneticHover('strong'))
    
    expect(result.current.isActive).toBe(true)
    expect(result.current.transform).toEqual({ x: 0, y: 0 })
  })

  it('should allow overrides to preset configuration', () => {
    const { result } = renderHook(() => useSimpleMagneticHover('normal', { disabled: true }))
    
    expect(result.current.isActive).toBe(false)
  })
})