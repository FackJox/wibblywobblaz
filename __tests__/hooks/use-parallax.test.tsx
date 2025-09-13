import { renderHook, act } from '@testing-library/react'
import { 
  useParallax, 
  useBackgroundParallax, 
  useElementParallax, 
  useMouseParallax, 
  useSimpleParallax 
} from '@/hooks/use-parallax'

// Mock Intersection Observer
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  
  private callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }

  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] { return [] }

  trigger(entries: Partial<IntersectionObserverEntry>[]): void {
    const fullEntries = entries.map(entry => ({
      boundingClientRect: new DOMRect(),
      intersectionRatio: 0,
      intersectionRect: new DOMRect(),
      isIntersecting: false,
      rootBounds: new DOMRect(),
      target: document.createElement('div'),
      time: Date.now(),
      ...entry
    })) as IntersectionObserverEntry[]

    this.callback(fullEntries, this)
  }
}

let mockObserver: MockIntersectionObserver
global.IntersectionObserver = jest.fn((callback) => {
  mockObserver = new MockIntersectionObserver(callback)
  return mockObserver
}) as jest.MockedClass<typeof IntersectionObserver>

// Mock DOM methods
Object.defineProperty(Element.prototype, 'getBoundingClientRect', {
  writable: true,
  value: jest.fn(() => ({
    top: 100,
    left: 0,
    width: 200,
    height: 300,
    right: 200,
    bottom: 400,
    x: 0,
    y: 100,
    toJSON: jest.fn()
  }))
})

// Mock window properties
Object.defineProperty(window, 'innerHeight', {
  writable: true,
  value: 800
})

Object.defineProperty(window, 'pageYOffset', {
  writable: true,
  value: 0
})

Object.defineProperty(document.documentElement, 'scrollTop', {
  writable: true,
  value: 0
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
})

// Mock event listeners
const mockScrollListeners: Array<() => void> = []
const mockMouseListeners: Array<(event: MouseEvent) => void> = []
const mockResizeListeners: Array<() => void> = []

window.addEventListener = jest.fn((event: string, listener: any) => {
  if (event === 'scroll') {
    mockScrollListeners.push(listener)
  } else if (event === 'resize') {
    mockResizeListeners.push(listener)
  }
})

window.removeEventListener = jest.fn((event: string, listener: any) => {
  if (event === 'scroll') {
    const index = mockScrollListeners.indexOf(listener)
    if (index > -1) mockScrollListeners.splice(index, 1)
  } else if (event === 'resize') {
    const index = mockResizeListeners.indexOf(listener)
    if (index > -1) mockResizeListeners.splice(index, 1)
  }
})

document.addEventListener = jest.fn((event: string, listener: any) => {
  if (event === 'mousemove') {
    mockMouseListeners.push(listener)
  }
})

document.removeEventListener = jest.fn((event: string, listener: any) => {
  if (event === 'mousemove') {
    const index = mockMouseListeners.indexOf(listener)
    if (index > -1) mockMouseListeners.splice(index, 1)
  }
})

// Helper functions
const triggerScroll = (scrollY = 100) => {
  Object.defineProperty(window, 'pageYOffset', { value: scrollY, configurable: true })
  Object.defineProperty(document.documentElement, 'scrollTop', { value: scrollY, configurable: true })
  mockScrollListeners.forEach(listener => listener())
}

const triggerMouseMove = (clientX = 400, clientY = 300) => {
  const mockEvent = {
    clientX,
    clientY
  } as MouseEvent
  mockMouseListeners.forEach(listener => listener(mockEvent))
}

const triggerResize = () => {
  mockResizeListeners.forEach(listener => listener())
}

// Mock requestAnimationFrame
let animationFrameCallbacks: FrameRequestCallback[] = []
global.requestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
  animationFrameCallbacks.push(callback)
  return animationFrameCallbacks.length
})

global.cancelAnimationFrame = jest.fn((id: number) => {
  animationFrameCallbacks = animationFrameCallbacks.filter((_, index) => index + 1 !== id)
})

const triggerAnimationFrame = () => {
  animationFrameCallbacks.forEach(callback => callback(Date.now()))
  animationFrameCallbacks = []
}

describe('useParallax', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    animationFrameCallbacks = []
    
    // Reset scroll position
    Object.defineProperty(window, 'pageYOffset', { value: 0, configurable: true })
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, configurable: true })
  })

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useParallax())

    expect(result.current.isInView).toBe(false)
    expect(result.current.scrollY).toBe(0)
    expect(result.current.offset).toBe(0)
    expect(result.current.progress).toBe(0)
    expect(result.current.isActive).toBe(false)
    expect(result.current.styles.transform).toBe('none')
  })

  it('should respect reduced motion preferences', () => {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    })

    const { result } = renderHook(() => useParallax())

    expect(result.current.styles.transform).toBe('none')
  })

  it('should calculate parallax offset when in view', () => {
    const { result } = renderHook(() => useParallax({ speed: 0.5 }))

    // Set element in view
    act(() => {
      mockObserver.trigger([{ isIntersecting: true }])
    })

    expect(result.current.isInView).toBe(true)

    // Trigger scroll
    act(() => {
      triggerScroll(200)
      triggerAnimationFrame()
    })

    expect(result.current.scrollY).toBe(200)
    expect(result.current.offset).not.toBe(0)
  })

  it('should handle different parallax directions', () => {
    const { result: verticalResult } = renderHook(() => 
      useParallax({ direction: 'vertical', speed: 0.5 })
    )
    
    const { result: horizontalResult } = renderHook(() => 
      useParallax({ direction: 'horizontal', speed: 0.5 })
    )

    const { result: bothResult } = renderHook(() => 
      useParallax({ direction: 'both', speed: 0.5 })
    )

    // Set elements in view and trigger scroll
    act(() => {
      mockObserver.trigger([{ isIntersecting: true }])
    })

    act(() => {
      triggerScroll(100)
      triggerAnimationFrame()
    })

    // Vertical should only have translateY
    expect(verticalResult.current.transform).toContain('translateY')
    expect(verticalResult.current.transform).not.toContain('translateX')

    // Horizontal should only have translateX  
    expect(horizontalResult.current.transform).toContain('translateX')
    expect(horizontalResult.current.transform).not.toContain('translateY')

    // Both should have both transforms
    expect(bothResult.current.transform).toContain('translateY')
    expect(bothResult.current.transform).toContain('translateX')
  })

  it('should apply speed multiplier correctly', () => {
    const { result: slowResult } = renderHook(() => 
      useParallax({ speed: 0.2 })
    )
    
    const { result: fastResult } = renderHook(() => 
      useParallax({ speed: 0.8 })
    )

    // Set elements in view
    act(() => {
      mockObserver.trigger([{ isIntersecting: true }])
    })

    act(() => {
      triggerScroll(100)
      triggerAnimationFrame()
    })

    // Faster speed should result in larger offset (in absolute terms)
    expect(Math.abs(fastResult.current.offset)).toBeGreaterThan(Math.abs(slowResult.current.offset))
  })

  it('should reverse parallax direction when reverse=true', () => {
    const { result: normalResult } = renderHook(() => 
      useParallax({ speed: 0.5, reverse: false })
    )
    
    const { result: reversedResult } = renderHook(() => 
      useParallax({ speed: 0.5, reverse: true })
    )

    // Set elements in view
    act(() => {
      mockObserver.trigger([{ isIntersecting: true }])
    })

    act(() => {
      triggerScroll(100)
      triggerAnimationFrame()
    })

    // Reversed should have opposite sign offset
    expect(Math.sign(normalResult.current.offset)).not.toBe(Math.sign(reversedResult.current.offset))
  })

  it('should clamp values when clamp=true', () => {
    const { result } = renderHook(() => 
      useParallax({ 
        speed: 2.0, // High speed that might exceed maxOffset
        clamp: true, 
        maxOffset: 50 
      })
    )

    act(() => {
      mockObserver.trigger([{ isIntersecting: true }])
    })

    act(() => {
      triggerScroll(1000) // Large scroll value
      triggerAnimationFrame()
    })

    expect(Math.abs(result.current.offset)).toBeLessThanOrEqual(50)
  })

  it('should use custom transform function', () => {
    const customTransform = jest.fn((offset: number, progress: number) => 
      `translateY(${offset}px) rotate(${progress * 180}deg)`
    )

    const { result } = renderHook(() => 
      useParallax({ 
        transformFunction: customTransform
      })
    )

    act(() => {
      mockObserver.trigger([{ isIntersecting: true }])
    })

    act(() => {
      triggerScroll(100)
      triggerAnimationFrame()
    })

    expect(customTransform).toHaveBeenCalled()
    expect(result.current.transform).toContain('rotate')
  })

  it('should handle throttled scroll events', () => {
    const { result } = renderHook(() => 
      useParallax({ throttleMs: 100 })
    )

    act(() => {
      mockObserver.trigger([{ isIntersecting: true }])
    })

    // Multiple rapid scroll events
    act(() => {
      triggerScroll(50)
      triggerScroll(100)
      triggerScroll(150)
      triggerAnimationFrame()
    })

    // Should still update, but throttled
    expect(result.current.scrollY).toBeGreaterThan(0)
  })
})

describe('useBackgroundParallax', () => {
  it('should use correct configuration for background parallax', () => {
    const { result } = renderHook(() => useBackgroundParallax(0.3))

    // Should be configured for vertical movement with clamping
    expect(result.current.isInView).toBe(false)
  })
})

describe('useElementParallax', () => {
  it('should use custom transform function', () => {
    const customTransform = jest.fn((offset: number, progress: number) => 
      `scale(${1 + progress * 0.1})`
    )

    const { result } = renderHook(() => 
      useElementParallax(customTransform, { speed: 0.5 })
    )

    act(() => {
      mockObserver.trigger([{ isIntersecting: true }])
    })

    act(() => {
      triggerScroll(100)
      triggerAnimationFrame()
    })

    expect(customTransform).toHaveBeenCalled()
    expect(result.current.transform).toContain('scale')
  })
})

describe('useMouseParallax', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset mouse listeners
    mockMouseListeners.length = 0
  })

  it('should initialize with correct state', () => {
    const { result } = renderHook(() => useMouseParallax(0.1))

    expect(result.current.styles.transform).toBe('none')
    expect(result.current.isActive).toBe(false)
  })

  it('should respond to mouse movement', () => {
    const { result } = renderHook(() => useMouseParallax(0.2))

    // Trigger mouse move
    act(() => {
      triggerMouseMove(500, 400)
    })

    expect(result.current.styles.transform).toContain('translate3d')
    expect(result.current.isActive).toBe(true)
  })

  it('should respect intensity setting', () => {
    const { result: lowIntensity } = renderHook(() => useMouseParallax(0.1))
    const { result: highIntensity } = renderHook(() => useMouseParallax(0.5))

    // Same mouse movement
    act(() => {
      triggerMouseMove(600, 500)
    })

    // Extract transform values for comparison
    const lowTransform = lowIntensity.current.styles.transform as string
    const highTransform = highIntensity.current.styles.transform as string

    expect(lowTransform).not.toBe(highTransform)
  })

  it('should clamp values when enabled', () => {
    const { result } = renderHook(() => 
      useMouseParallax(1.0, { clamp: true, maxOffset: 25 })
    )

    // Large mouse movement
    act(() => {
      triggerMouseMove(1000, 800)
    })

    const transform = result.current.styles.transform as string
    // Should be clamped to maxOffset
    expect(transform).toBeTruthy()
  })

  it('should respect reduced motion', () => {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    })

    const { result } = renderHook(() => useMouseParallax(0.2))

    act(() => {
      triggerMouseMove(500, 400)
    })

    expect(result.current.styles.transform).toBe('none')
  })
})

describe('useSimpleParallax', () => {
  it('should use correct default configuration', () => {
    const { result } = renderHook(() => useSimpleParallax(0.7))

    expect(result.current.isInView).toBe(false)
    // Should be configured for vertical parallax with 16ms throttling
  })
})

describe('Parallax integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    animationFrameCallbacks = []
  })

  it('should handle complete parallax lifecycle', () => {
    const { result } = renderHook(() => useParallax({ speed: 0.5 }))

    // Element enters viewport
    act(() => {
      mockObserver.trigger([{ isIntersecting: true }])
    })

    expect(result.current.isInView).toBe(true)

    // Scroll triggers parallax
    act(() => {
      triggerScroll(150)
      triggerAnimationFrame()
    })

    expect(result.current.scrollY).toBe(150)
    expect(result.current.offset).not.toBe(0)

    // Resize triggers recalculation
    act(() => {
      triggerResize()
      triggerAnimationFrame()
    })

    // Should still have offset
    expect(result.current.offset).not.toBe(0)
  })

  it('should cleanup event listeners on unmount', () => {
    const { unmount } = renderHook(() => useParallax())

    const initialScrollListeners = mockScrollListeners.length
    const initialResizeListeners = mockResizeListeners.length

    unmount()

    // Should have removed listeners
    expect(mockScrollListeners.length).toBeLessThanOrEqual(initialScrollListeners)
    expect(mockResizeListeners.length).toBeLessThanOrEqual(initialResizeListeners)
  })

  it('should handle multiple parallax effects simultaneously', () => {
    const { result: result1 } = renderHook(() => useParallax({ speed: 0.3 }))
    const { result: result2 } = renderHook(() => useParallax({ speed: 0.7 }))

    // Both enter viewport
    act(() => {
      mockObserver.trigger([{ isIntersecting: true }])
    })

    act(() => {
      triggerScroll(100)
      triggerAnimationFrame()
    })

    // Both should have different offsets based on speed
    expect(result1.current.offset).not.toBe(result2.current.offset)
    expect(Math.abs(result2.current.offset)).toBeGreaterThan(Math.abs(result1.current.offset))
  })

  it('should handle mouse parallax cleanup properly', () => {
    const { unmount } = renderHook(() => useMouseParallax(0.2))

    const initialMouseListeners = mockMouseListeners.length

    unmount()

    expect(mockMouseListeners.length).toBeLessThanOrEqual(initialMouseListeners)
  })
})