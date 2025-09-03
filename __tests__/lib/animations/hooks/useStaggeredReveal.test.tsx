import { renderHook, act } from '@testing-library/react'
import { useStaggeredReveal } from '@/lib/animations/hooks/useStaggeredReveal'

// Mock IntersectionObserver
class MockIntersectionObserver {
  callback: IntersectionObserverCallback
  options?: IntersectionObserverInit
  elements: Set<Element> = new Set()
  
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback
    this.options = options
  }
  
  observe(element: Element) {
    this.elements.add(element)
  }
  
  unobserve(element: Element) {
    this.elements.delete(element)
  }
  
  disconnect() {
    this.elements.clear()
  }
  
  trigger(isIntersecting: boolean) {
    const entries = Array.from(this.elements).map(element => ({
      isIntersecting,
      target: element,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now()
    }))
    
    this.callback(entries as IntersectionObserverEntry[], this as unknown as IntersectionObserver)
  }
}

describe('useStaggeredReveal', () => {
  let mockObserver: MockIntersectionObserver
  
  beforeEach(() => {
    global.IntersectionObserver = jest.fn((callback, options) => {
      mockObserver = new MockIntersectionObserver(callback, options)
      return mockObserver as unknown as IntersectionObserver
    })
  })
  
  afterEach(() => {
    jest.clearAllMocks()
  })
  
  it('should initialize with isInView false', () => {
    const { result } = renderHook(() => useStaggeredReveal())
    
    expect(result.current.isInView).toBe(false)
    expect(result.current.hasAnimated).toBe(false)
  })
  
  it('should set isInView to true when element intersects', () => {
    const { result } = renderHook(() => useStaggeredReveal())
    
    // Set ref
    const element = document.createElement('div')
    Object.defineProperty(result.current.ref, 'current', {
      writable: true,
      value: element
    })
    
    // Trigger rerender to observe element
    const { rerender } = renderHook(() => useStaggeredReveal())
    rerender()
    
    act(() => {
      mockObserver.trigger(true)
    })
    
    expect(result.current.isInView).toBe(true)
    expect(result.current.hasAnimated).toBe(true)
  })
  
  it('should only animate once when triggerOnce is true', () => {
    const { result } = renderHook(() => useStaggeredReveal({ triggerOnce: true }))
    
    const element = document.createElement('div')
    Object.defineProperty(result.current.ref, 'current', {
      writable: true,
      value: element
    })
    
    const { rerender } = renderHook(() => useStaggeredReveal({ triggerOnce: true }))
    rerender()
    
    act(() => {
      mockObserver.trigger(true)
    })
    
    expect(result.current.isInView).toBe(true)
    expect(result.current.hasAnimated).toBe(true)
    
    act(() => {
      mockObserver.trigger(false)
    })
    
    expect(result.current.isInView).toBe(true)
    expect(result.current.hasAnimated).toBe(true)
  })
  
  it('should reanimate when triggerOnce is false', () => {
    const { result } = renderHook(() => useStaggeredReveal({ triggerOnce: false }))
    
    const element = document.createElement('div')
    Object.defineProperty(result.current.ref, 'current', {
      writable: true,
      value: element
    })
    
    const { rerender } = renderHook(() => useStaggeredReveal({ triggerOnce: false }))
    rerender()
    
    act(() => {
      mockObserver.trigger(true)
    })
    
    expect(result.current.isInView).toBe(true)
    
    act(() => {
      mockObserver.trigger(false)
    })
    
    expect(result.current.isInView).toBe(false)
    
    act(() => {
      mockObserver.trigger(true)
    })
    
    expect(result.current.isInView).toBe(true)
  })
  
  it('should use custom threshold and rootMargin', () => {
    renderHook(() => useStaggeredReveal({
      threshold: 0.5,
      rootMargin: '-100px'
    }))
    
    expect(IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: 0.5,
        rootMargin: '-100px'
      })
    )
  })
})