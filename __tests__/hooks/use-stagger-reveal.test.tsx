import { renderHook, act } from '@testing-library/react'
import { useStaggerReveal, useSimpleStaggerReveal } from '@/hooks/use-stagger-reveal'

// Mock Intersection Observer
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  
  private callback: IntersectionObserverCallback
  private elements: Set<Element> = new Set()

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback
  }

  observe(target: Element): void {
    this.elements.add(target)
  }

  unobserve(target: Element): void {
    this.elements.delete(target)
  }

  disconnect(): void {
    this.elements.clear()
  }

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  // Helper method to trigger intersection
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

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now())
  }
})

// Mock requestAnimationFrame
let animationFrameCallbacks: FrameRequestCallback[] = []
global.requestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
  animationFrameCallbacks.push(callback)
  return animationFrameCallbacks.length
})

global.cancelAnimationFrame = jest.fn((id: number) => {
  animationFrameCallbacks = animationFrameCallbacks.filter((_, index) => index + 1 !== id)
})

// Mock IntersectionObserver
let mockObserver: MockIntersectionObserver
global.IntersectionObserver = jest.fn((callback, options) => {
  mockObserver = new MockIntersectionObserver(callback, options)
  return mockObserver
}) as jest.MockedClass<typeof IntersectionObserver>

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

describe('useStaggerReveal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    animationFrameCallbacks = []
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  it('should initialize with correct number of items', () => {
    const { result } = renderHook(() => useStaggerReveal(3))

    expect(result.current.items).toHaveLength(3)
    expect(result.current.isTriggered).toBe(false)
    expect(result.current.isInView).toBe(false)
  })

  it('should initialize items with correct default state', () => {
    const { result } = renderHook(() => useStaggerReveal(2))

    const firstItem = result.current.items[0]
    expect(firstItem.shouldAnimate).toBe(false)
    expect(firstItem.isAnimating).toBe(false)
    expect(firstItem.isComplete).toBe(false)
    expect(firstItem.opacity).toBe(0)
    expect(firstItem.transform).toBe('translateY(20px) scale(0.95)')
    expect(firstItem.transition).toBe('none')
  })

  it('should generate correct delays for staggered animation', () => {
    const { result } = renderHook(() => 
      useStaggerReveal(3, { baseDelay: 100, staggerDelay: 150 })
    )

    expect(result.current.items[0].delay).toBe(100)
    expect(result.current.items[1].delay).toBe(250)
    expect(result.current.items[2].delay).toBe(400)
  })

  it('should trigger animation when element enters viewport', async () => {
    jest.useFakeTimers()
    
    const { result } = renderHook(() => 
      useStaggerReveal(2, { duration: 500, staggerDelay: 100 })
    )

    // Simulate element entering viewport
    act(() => {
      mockObserver.trigger([{ isIntersecting: true }])
    })

    expect(result.current.isTriggered).toBe(true)
    expect(result.current.isInView).toBe(true)

    // Fast forward timers to trigger first item animation
    act(() => {
      jest.advanceTimersByTime(50)
    })

    // Trigger animation frame callbacks
    act(() => {
      animationFrameCallbacks.forEach(callback => callback(Date.now()))
      animationFrameCallbacks = []
    })

    expect(result.current.items[0].isAnimating).toBe(true)

    jest.useRealTimers()
  })

  it('should manually trigger animation', () => {
    jest.useFakeTimers()
    
    const { result } = renderHook(() => useStaggerReveal(1))

    act(() => {
      result.current.trigger()
    })

    expect(result.current.isTriggered).toBe(true)

    jest.useRealTimers()
  })

  it('should reset animation state', () => {
    const { result } = renderHook(() => useStaggerReveal(2))

    // Trigger first
    act(() => {
      result.current.trigger()
    })

    expect(result.current.isTriggered).toBe(true)

    // Then reset
    act(() => {
      result.current.reset()
    })

    expect(result.current.isTriggered).toBe(false)
    expect(result.current.items[0].opacity).toBe(0)
    expect(result.current.items[0].isComplete).toBe(false)
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

    const { result } = renderHook(() => useStaggerReveal(1))

    expect(result.current.items[0].opacity).toBe(1)
    expect(result.current.items[0].transform).toBe('none')
  })

  it('should handle animation only once when once=true', () => {
    jest.useFakeTimers()
    
    const { result } = renderHook(() => 
      useStaggerReveal(1, { once: true })
    )

    // First trigger
    act(() => {
      result.current.trigger()
    })

    expect(result.current.isTriggered).toBe(true)

    // Second trigger should be ignored
    act(() => {
      result.current.trigger()
    })

    // Should still be triggered from first call
    expect(result.current.isTriggered).toBe(true)

    jest.useRealTimers()
  })

  it('should update item count when changed', () => {
    const { result, rerender } = renderHook(
      ({ count }) => useStaggerReveal(count),
      { initialProps: { count: 2 } }
    )

    expect(result.current.items).toHaveLength(2)

    // Change item count
    rerender({ count: 4 })

    expect(result.current.items).toHaveLength(4)
  })
})

describe('useSimpleStaggerReveal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with correct configuration', () => {
    const { result } = renderHook(() => useSimpleStaggerReveal(3, 200))

    expect(result.current.items).toHaveLength(3)
    expect(result.current.items[0].delay).toBe(0)
    expect(result.current.items[1].delay).toBe(200)
    expect(result.current.items[2].delay).toBe(400)
  })

  it('should use default stagger delay', () => {
    const { result } = renderHook(() => useSimpleStaggerReveal(2))

    expect(result.current.items[0].delay).toBe(0)
    expect(result.current.items[1].delay).toBe(100)
  })
})

describe('StaggerReveal integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    animationFrameCallbacks = []
  })

  it('should handle complete animation lifecycle', async () => {
    jest.useFakeTimers()
    
    const { result } = renderHook(() => 
      useStaggerReveal(2, { 
        staggerDelay: 100, 
        duration: 300,
        once: false 
      })
    )

    // Element enters viewport
    act(() => {
      mockObserver.trigger([{ isIntersecting: true }])
    })

    expect(result.current.isInView).toBe(true)
    expect(result.current.isTriggered).toBe(true)

    // First item should start animating after delay
    act(() => {
      jest.advanceTimersByTime(50)
    })

    // Trigger RAF callback
    act(() => {
      animationFrameCallbacks.forEach(callback => callback(Date.now()))
      animationFrameCallbacks = []
    })

    expect(result.current.items[0].isAnimating).toBe(true)

    // Complete first animation
    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current.items[0].isComplete).toBe(true)

    // Element leaves viewport (should reset since once=false)
    act(() => {
      mockObserver.trigger([{ isIntersecting: false }])
    })

    expect(result.current.isInView).toBe(false)

    jest.useRealTimers()
  })

  it('should cleanup timeouts and animation frames on unmount', () => {
    jest.useFakeTimers()
    
    const { result, unmount } = renderHook(() => useStaggerReveal(2))

    // Trigger animation
    act(() => {
      result.current.trigger()
    })

    // Unmount component
    unmount()

    // Advance timers to see if any cleanup issues occur
    act(() => {
      jest.advanceTimersByTime(1000)
    })

    // Should not throw errors
    expect(() => {
      animationFrameCallbacks.forEach(callback => callback(Date.now()))
    }).not.toThrow()

    jest.useRealTimers()
  })
})