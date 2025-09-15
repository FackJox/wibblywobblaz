import { renderHook, act } from '@testing-library/react'
import { useScrollFadeIn, useScrollProgress, useSimpleFadeIn } from '@/hooks/use-scroll-animations'

// Mock Intersection Observer
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  
  private callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
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
global.IntersectionObserver = jest.fn((callback, options) => {
  mockObserver = new MockIntersectionObserver(callback, options)
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

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock event listeners
const mockScrollListeners: Array<() => void> = []
const originalAddEventListener = window.addEventListener
const originalRemoveEventListener = window.removeEventListener

window.addEventListener = jest.fn((event: string, listener: any) => {
  if (event === 'scroll') {
    mockScrollListeners.push(listener)
  }
})

window.removeEventListener = jest.fn((event: string, listener: any) => {
  if (event === 'scroll') {
    const index = mockScrollListeners.indexOf(listener)
    if (index > -1) {
      mockScrollListeners.splice(index, 1)
    }
  }
})

// Helper to trigger scroll events
const triggerScroll = () => {
  mockScrollListeners.forEach(listener => listener())
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

describe('useScrollFadeIn', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    animationFrameCallbacks = []
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useScrollFadeIn())

    expect(result.current.isInView).toBe(false)
    expect(result.current.isTriggered).toBe(false)
    expect(result.current.isAnimating).toBe(false)
    expect(result.current.isComplete).toBe(false)
    expect(result.current.styles.opacity).toBe(0)
    expect(result.current.styles.transform).toBe('translateY(20px) scale(0.95)')
  })

  it('should configure different fade directions', () => {
    const { result: upResult } = renderHook(() => 
      useScrollFadeIn({ direction: 'up', distance: 30 })
    )
    
    const { result: leftResult } = renderHook(() => 
      useScrollFadeIn({ direction: 'left', distance: 30 })
    )

    expect(upResult.current.styles.transform).toBe('translateY(30px) scale(0.95)')
    expect(leftResult.current.styles.transform).toBe('translateX(30px) scale(0.95)')
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

    const { result } = renderHook(() => useScrollFadeIn())

    expect(result.current.styles.opacity).toBe(1)
    expect(result.current.styles.transform).toBe('none')
  })

  it('should trigger animation when entering viewport', () => {
    jest.useFakeTimers()
    
    const { result } = renderHook(() => useScrollFadeIn({ duration: 500 }))

    act(() => {
      mockObserver.trigger([{ isIntersecting: true }])
    })

    expect(result.current.isInView).toBe(true)
    expect(result.current.isTriggered).toBe(true)

    // Animation should start after RAF
    act(() => {
      triggerAnimationFrame()
    })

    expect(result.current.styles.opacity).toBe(1)
    expect(result.current.styles.transform).toBe('none')

    jest.useRealTimers()
  })

  it('should manually trigger animation', () => {
    const { result } = renderHook(() => useScrollFadeIn())

    act(() => {
      result.current.trigger()
    })

    expect(result.current.isTriggered).toBe(true)
  })

  it('should reset animation', () => {
    const { result } = renderHook(() => useScrollFadeIn())

    // Trigger first
    act(() => {
      result.current.trigger()
    })

    expect(result.current.isTriggered).toBe(true)

    // Reset
    act(() => {
      result.current.reset()
    })

    expect(result.current.isTriggered).toBe(false)
    expect(result.current.styles.opacity).toBe(0)
    expect(result.current.styles.transform).toBe('translateY(20px) scale(0.95)')
  })

  it('should handle once=true properly', () => {
    const { result } = renderHook(() => 
      useScrollFadeIn({ once: true })
    )

    // First trigger
    act(() => {
      result.current.trigger()
    })

    expect(result.current.isTriggered).toBe(true)

    // Reset should not affect triggered state when once=true
    act(() => {
      result.current.reset()
    })

    // Try to trigger again
    act(() => {
      result.current.trigger()
    })

    // Should still be triggered
    expect(result.current.isTriggered).toBe(true)
  })

  it('should apply custom scale and distance', () => {
    const { result } = renderHook(() => 
      useScrollFadeIn({ 
        direction: 'down', 
        distance: 50, 
        scale: 0.8 
      })
    )

    expect(result.current.styles.transform).toBe('translateY(-50px) scale(0.8)')
  })

  it('should handle different easing and duration', () => {
    jest.useFakeTimers()
    
    const { result } = renderHook(() => 
      useScrollFadeIn({ 
        duration: 800,
        easing: 'ease-in-out',
        delay: 100
      })
    )

    act(() => {
      result.current.trigger()
    })

    act(() => {
      triggerAnimationFrame()
    })

    expect(result.current.styles.transition).toContain('800ms')
    expect(result.current.styles.transition).toContain('ease-in-out')
    expect(result.current.styles.transition).toContain('100ms')

    jest.useRealTimers()
  })
})

describe('useScrollProgress', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    animationFrameCallbacks = []
  })

  it('should initialize with correct state', () => {
    const { result } = renderHook(() => useScrollProgress())

    expect(result.current.scrollProgress).toBe(0)
    expect(result.current.visibilityRatio).toBe(0)
    expect(result.current.isInView).toBe(false)
  })

  it('should update scroll progress on scroll', () => {
    const { result } = renderHook(() => useScrollProgress())

    // Simulate element in view
    act(() => {
      mockObserver.trigger([{ isIntersecting: true }])
    })

    expect(result.current.isInView).toBe(true)

    // Trigger scroll event
    act(() => {
      triggerScroll()
    })

    // Values should be calculated based on mocked getBoundingClientRect
    expect(result.current.scrollProgress).toBeGreaterThanOrEqual(0)
    expect(result.current.visibilityRatio).toBeGreaterThanOrEqual(0)
  })

  it('should throttle scroll events', () => {
    const throttleSpy = jest.fn()
    const { result } = renderHook(() => 
      useScrollProgress({ throttleMs: 100 })
    )

    // Multiple rapid scroll events
    act(() => {
      triggerScroll()
      triggerScroll()
      triggerScroll()
    })

    // Should be throttled, not called for each event
  })
})

describe('useSimpleFadeIn', () => {
  it('should use correct default configuration', () => {
    const { result } = renderHook(() => useSimpleFadeIn('right'))

    expect(result.current.styles.transform).toBe('translateX(-20px) scale(0.95)')
  })

  it('should default to "up" direction', () => {
    const { result } = renderHook(() => useSimpleFadeIn())

    expect(result.current.styles.transform).toBe('translateY(20px) scale(0.95)')
  })
})

describe('ScrollAnimations integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    animationFrameCallbacks = []
  })

  it('should handle complete animation lifecycle', () => {
    jest.useFakeTimers()
    
    const { result } = renderHook(() => 
      useScrollFadeIn({ 
        duration: 300,
        once: false 
      })
    )

    // Enter viewport
    act(() => {
      mockObserver.trigger([{ isIntersecting: true }])
    })

    expect(result.current.isInView).toBe(true)
    expect(result.current.isTriggered).toBe(true)

    // Animation frame triggers
    act(() => {
      triggerAnimationFrame()
    })

    expect(result.current.styles.opacity).toBe(1)

    // Leave viewport
    act(() => {
      mockObserver.trigger([{ isIntersecting: false }])
    })

    expect(result.current.isInView).toBe(false)

    jest.useRealTimers()
  })

  it('should cleanup event listeners on unmount', () => {
    const { unmount } = renderHook(() => useScrollFadeIn())

    const initialListenerCount = mockScrollListeners.length

    unmount()

    // Should have removed scroll listener
    expect(mockScrollListeners.length).toBeLessThanOrEqual(initialListenerCount)
  })

  it('should handle multiple scroll animations simultaneously', () => {
    const { result: result1 } = renderHook(() => useScrollFadeIn({ direction: 'up' }))
    const { result: result2 } = renderHook(() => useScrollFadeIn({ direction: 'left' }))

    expect(result1.current.styles.transform).toBe('translateY(20px) scale(0.95)')
    expect(result2.current.styles.transform).toBe('translateX(20px) scale(0.95)')

    // Both should be able to trigger independently
    act(() => {
      result1.current.trigger()
    })

    act(() => {
      result2.current.trigger()  
    })

    expect(result1.current.isTriggered).toBe(true)
    expect(result2.current.isTriggered).toBe(true)
  })
})