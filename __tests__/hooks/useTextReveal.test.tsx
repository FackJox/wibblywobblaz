import { renderHook, act } from '@testing-library/react'
import { useTextReveal, useSimpleTextReveal } from '@/hooks/use-text-reveal'

// Mock reduced motion media query
const mockMatchMedia = jest.fn()
global.matchMedia = mockMatchMedia

// Mock DOM methods
const mockSpan = {
  textContent: '',
  style: {},
  dataset: {},
  appendChild: jest.fn(),
  setAttribute: jest.fn()
}

const mockElement = {
  textContent: 'Test text content',
  innerHTML: '',
  appendChild: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
}

// Mock document.createElement
global.document.createElement = jest.fn((tagName) => {
  if (tagName === 'span') {
    return { ...mockSpan }
  }
  return { ...mockElement }
})

describe('useTextReveal', () => {
  beforeEach(() => {
    mockMatchMedia.mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }))
    jest.clearAllMocks()
    mockElement.textContent = 'Test text content'
    mockElement.innerHTML = ''
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useTextReveal())
    
    expect(result.current.spans).toEqual([])
    expect(result.current.isRevealed).toBe(false)
    expect(result.current.isHovered).toBe(false)
    expect(result.current.isActive).toBe(true)
  })

  it('should be inactive when disabled', () => {
    const { result } = renderHook(() => useTextReveal({ disabled: true }))
    
    expect(result.current.isActive).toBe(false)
  })

  it('should be inactive when user prefers reduced motion', () => {
    mockMatchMedia.mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }))

    const { result } = renderHook(() => useTextReveal())
    
    expect(result.current.isActive).toBe(false)
  })

  it('should manually reveal text', () => {
    const { result } = renderHook(() => useTextReveal({ triggerOn: 'manual' }))
    
    // Set the element ref to trigger initialization
    act(() => {
      ;(result.current.ref as any).current = mockElement
    })

    act(() => {
      result.current.reveal()
    })
    
    expect(result.current.isRevealed).toBe(true)
  })

  it('should manually hide text', () => {
    const { result } = renderHook(() => useTextReveal({ triggerOn: 'manual' }))
    
    // Set the element ref
    act(() => {
      ;(result.current.ref as any).current = mockElement
    })

    // First reveal
    act(() => {
      result.current.reveal()
    })
    
    expect(result.current.isRevealed).toBe(true)

    // Then hide
    act(() => {
      result.current.hide()
    })
    
    expect(result.current.isRevealed).toBe(false)
  })

  it('should toggle reveal state', () => {
    const { result } = renderHook(() => useTextReveal({ triggerOn: 'manual' }))
    
    // Set the element ref
    act(() => {
      ;(result.current.ref as any).current = mockElement
    })

    expect(result.current.isRevealed).toBe(false)

    act(() => {
      result.current.toggle()
    })
    
    expect(result.current.isRevealed).toBe(true)

    act(() => {
      result.current.toggle()
    })
    
    expect(result.current.isRevealed).toBe(false)
  })

  it('should reset to original state', () => {
    const { result } = renderHook(() => useTextReveal({ triggerOn: 'manual' }))
    
    // Set the element ref
    act(() => {
      ;(result.current.ref as any).current = mockElement
    })

    act(() => {
      result.current.reveal()
    })
    
    expect(result.current.isRevealed).toBe(true)

    act(() => {
      result.current.reset()
    })
    
    expect(result.current.isRevealed).toBe(false)
    expect(result.current.spans).toEqual([])
  })

  it('should setup event listeners for hover trigger', () => {
    const { result } = renderHook(() => useTextReveal({ triggerOn: 'hover' }))
    
    // Set the ref
    act(() => {
      ;(result.current.ref as any).current = mockElement
    })
    
    expect(mockElement.addEventListener).toHaveBeenCalledWith('mouseenter', expect.any(Function))
    expect(mockElement.addEventListener).toHaveBeenCalledWith('mouseleave', expect.any(Function))
  })

  it('should handle different animation types', () => {
    const fadeReveal = renderHook(() => useTextReveal({ type: 'fade' }))
    const slideReveal = renderHook(() => useTextReveal({ type: 'slide' }))
    const scaleReveal = renderHook(() => useTextReveal({ type: 'scale' }))
    const rotateReveal = renderHook(() => useTextReveal({ type: 'rotate' }))
    
    expect(fadeReveal.result.current.isActive).toBe(true)
    expect(slideReveal.result.current.isActive).toBe(true)
    expect(scaleReveal.result.current.isActive).toBe(true)
    expect(rotateReveal.result.current.isActive).toBe(true)
  })

  it('should handle different splitting options', () => {
    const characterSplit = renderHook(() => useTextReveal({ by: 'character' }))
    const wordSplit = renderHook(() => useTextReveal({ by: 'word' }))
    
    expect(characterSplit.result.current.isActive).toBe(true)
    expect(wordSplit.result.current.isActive).toBe(true)
  })
})

describe('useSimpleTextReveal', () => {
  beforeEach(() => {
    mockMatchMedia.mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }))
    jest.clearAllMocks()
  })

  it('should apply fade preset configuration', () => {
    const { result } = renderHook(() => useSimpleTextReveal('fade'))
    
    expect(result.current.isActive).toBe(true)
    expect(result.current.isRevealed).toBe(false)
  })

  it('should apply slide preset configuration', () => {
    const { result } = renderHook(() => useSimpleTextReveal('slide'))
    
    expect(result.current.isActive).toBe(true)
    expect(result.current.isRevealed).toBe(false)
  })

  it('should apply typewriter preset configuration', () => {
    const { result } = renderHook(() => useSimpleTextReveal('typewriter'))
    
    expect(result.current.isActive).toBe(true)
    expect(result.current.isRevealed).toBe(false)
  })

  it('should apply wave preset configuration', () => {
    const { result } = renderHook(() => useSimpleTextReveal('wave'))
    
    expect(result.current.isActive).toBe(true)
    expect(result.current.isRevealed).toBe(false)
  })

  it('should apply bounce preset configuration', () => {
    const { result } = renderHook(() => useSimpleTextReveal('bounce'))
    
    expect(result.current.isActive).toBe(true)
    expect(result.current.isRevealed).toBe(false)
  })

  it('should allow overrides to preset configuration', () => {
    const { result } = renderHook(() => useSimpleTextReveal('fade', { disabled: true }))
    
    expect(result.current.isActive).toBe(false)
  })
})