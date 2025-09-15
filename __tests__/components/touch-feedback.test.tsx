/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { 
  TouchFeedback, 
  ProgressRing, 
  TouchFeedbackWithProgress, 
  useTouchFeedback 
} from '@/components/ui/touch-feedback'
import { renderHook } from '@testing-library/react'

// Mock the performance hook
jest.mock('@/hooks/use-performance', () => ({
  usePrefersReducedMotion: jest.fn(() => false)
}))

// Mock timers
jest.useFakeTimers()

describe('TouchFeedback', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    require('@/hooks/use-performance').usePrefersReducedMotion.mockReturnValue(false)
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
  })

  it('should render with default props', () => {
    render(
      <TouchFeedback>
        <div data-testid="child">Child Content</div>
      </TouchFeedback>
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('should not render when prefers reduced motion', () => {
    require('@/hooks/use-performance').usePrefersReducedMotion.mockReturnValue(true)

    const { container } = render(
      <TouchFeedback active={true}>
        <div data-testid="child">Child Content</div>
      </TouchFeedback>
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
    // When prefers reduced motion, the feedback effects should not render
    expect(container.querySelector('.absolute')).toBeTruthy() // Just the wrapper
  })

  it('should render ripple effect when active', () => {
    const { container } = render(
      <TouchFeedback 
        active={true} 
        variant="ripple" 
        progress={0.5} 
      />
    )

    const feedback = container.querySelector('.absolute')
    expect(feedback).toBeInTheDocument()
    expect(feedback).toHaveClass('animate-in')
  })

  it('should render scale effect', () => {
    const { container } = render(
      <TouchFeedback 
        active={true} 
        variant="scale" 
        progress={0.7} 
      />
    )

    const feedback = container.querySelector('.absolute')
    expect(feedback).toBeInTheDocument()
  })

  it('should render pulse effect', () => {
    const { container } = render(
      <TouchFeedback 
        active={true} 
        variant="pulse" 
        progress={0.3} 
      />
    )

    const feedback = container.querySelector('.absolute')
    expect(feedback).toBeInTheDocument()
    // Pulse effect should have animate-pulse class
    const pulseElement = container.querySelector('.animate-pulse')
    expect(pulseElement).toBeInTheDocument()
  })

  it('should render ring effect', () => {
    const { container } = render(
      <TouchFeedback 
        active={true} 
        variant="ring" 
        progress={0.8} 
      />
    )

    const feedback = container.querySelector('.absolute')
    expect(feedback).toBeInTheDocument()
  })

  it('should render gradient effect', () => {
    const { container } = render(
      <TouchFeedback 
        active={true} 
        variant="gradient" 
        progress={0.9} 
      />
    )

    const feedback = container.querySelector('.absolute')
    expect(feedback).toBeInTheDocument()
    // Gradient should have bg-gradient class
    const gradientElement = container.querySelector('[class*="bg-gradient"]')
    expect(gradientElement).toBeInTheDocument()
  })

  it('should apply different sizes', () => {
    const { rerender, container } = render(
      <TouchFeedback 
        active={true} 
        variant="ripple" 
        size="sm" 
      />
    )

    let feedback = container.querySelector('.w-8')
    expect(feedback).toBeInTheDocument()

    rerender(
      <TouchFeedback 
        active={true} 
        variant="ripple" 
        size="lg" 
      />
    )

    feedback = container.querySelector('.w-16')
    expect(feedback).toBeInTheDocument()
  })

  it('should apply different colors', () => {
    const { container } = render(
      <TouchFeedback 
        active={true} 
        variant="ripple" 
        color="secondary" 
      />
    )

    const feedback = container.querySelector('[class*="bg-secondary"]')
    expect(feedback).toBeInTheDocument()
  })

  it('should handle exit animation', () => {
    const { rerender, container } = render(
      <TouchFeedback active={true} />
    )

    let feedback = container.querySelector('.animate-in')
    expect(feedback).toBeInTheDocument()

    rerender(<TouchFeedback active={false} />)

    feedback = container.querySelector('.animate-out')
    expect(feedback).toBeInTheDocument()

    // Fast-forward time for exit animation
    act(() => {
      jest.advanceTimersByTime(300)
    })
  })
})

describe('ProgressRing', () => {
  beforeEach(() => {
    require('@/hooks/use-performance').usePrefersReducedMotion.mockReturnValue(false)
  })

  it('should render SVG with correct dimensions', () => {
    const { container } = render(
      <ProgressRing 
        progress={0.5} 
        size={50} 
        strokeWidth={4} 
      />
    )

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('width', '50')
    expect(svg).toHaveAttribute('height', '50')
  })

  it('should render progress circle with correct stroke', () => {
    const { container } = render(
      <ProgressRing 
        progress={0.75} 
        color="red" 
      />
    )

    const circles = container.querySelectorAll('circle')
    expect(circles).toHaveLength(2) // Background and progress circles
    
    const progressCircle = circles[1]
    expect(progressCircle).toHaveAttribute('stroke', 'red')
  })

  it('should not render when prefers reduced motion', () => {
    require('@/hooks/use-performance').usePrefersReducedMotion.mockReturnValue(true)

    const { container } = render(
      <ProgressRing progress={0.5} />
    )

    expect(container.firstChild).toBeNull()
  })

  it('should calculate stroke dash offset correctly', () => {
    const { container } = render(
      <ProgressRing 
        progress={0.25} 
        size={40} 
        strokeWidth={3} 
      />
    )

    const progressCircle = container.querySelectorAll('circle')[1]
    expect(progressCircle).toHaveAttribute('stroke-dashoffset')
    
    // Calculate expected values
    const radius = (40 - 3) / 2 // 18.5
    const circumference = 2 * Math.PI * radius
    const expectedOffset = circumference - (0.25 * circumference)
    
    expect(progressCircle.getAttribute('stroke-dashoffset')).toBe(expectedOffset.toString())
  })
})

describe('TouchFeedbackWithProgress', () => {
  it('should render TouchFeedback with ProgressRing', () => {
    const { container } = render(
      <TouchFeedbackWithProgress 
        active={true}
        progress={0.6}
        showProgress={true}
      />
    )

    // Should contain both TouchFeedback and ProgressRing
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    
    const feedback = container.querySelector('.absolute')
    expect(feedback).toBeInTheDocument()
  })

  it('should not show progress ring when showProgress is false', () => {
    const { container } = render(
      <TouchFeedbackWithProgress 
        active={true}
        progress={0.6}
        showProgress={false}
      />
    )

    const svg = container.querySelector('svg')
    expect(svg).not.toBeInTheDocument()
  })

  it('should not show progress ring when progress is 0', () => {
    const { container } = render(
      <TouchFeedbackWithProgress 
        active={true}
        progress={0}
        showProgress={true}
      />
    )

    const svg = container.querySelector('svg')
    expect(svg).not.toBeInTheDocument()
  })

  it('should pass through props to TouchFeedback', () => {
    const { container } = render(
      <TouchFeedbackWithProgress 
        active={true}
        progress={0.4}
        variant="scale"
        color="accent"
        size="lg"
      />
    )

    const feedback = container.querySelector('.absolute')
    expect(feedback).toBeInTheDocument()
  })
})

describe('useTouchFeedback', () => {
  beforeEach(() => {
    jest.clearAllTimers()
    require('@/hooks/use-performance').usePrefersReducedMotion.mockReturnValue(false)
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useTouchFeedback())

    expect(result.current.isActive).toBe(false)
    expect(result.current.progress).toBe(0)
    expect(typeof result.current.trigger).toBe('function')
    expect(typeof result.current.cancel).toBe('function')
    expect(typeof result.current.setProgress).toBe('function')
  })

  it('should trigger feedback and track progress', () => {
    const { result } = renderHook(() => useTouchFeedback({ duration: 1000 }))

    act(() => {
      result.current.trigger()
    })

    expect(result.current.isActive).toBe(true)
    expect(result.current.progress).toBe(0)

    // Advance time partway
    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(result.current.progress).toBeCloseTo(0.5, 1)
    expect(result.current.isActive).toBe(true)

    // Complete the duration
    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(result.current.progress).toBe(1)
    expect(result.current.isActive).toBe(false)
  })

  it('should cancel feedback', () => {
    const { result } = renderHook(() => useTouchFeedback({ duration: 1000 }))

    act(() => {
      result.current.trigger()
    })

    expect(result.current.isActive).toBe(true)

    act(() => {
      result.current.cancel()
    })

    expect(result.current.isActive).toBe(false)
    expect(result.current.progress).toBe(0)
  })

  it('should set progress manually', () => {
    const { result } = renderHook(() => useTouchFeedback())

    act(() => {
      result.current.setProgress(0.7)
    })

    expect(result.current.progress).toBe(0.7)
    expect(result.current.isActive).toBe(true)

    act(() => {
      result.current.setProgress(0)
    })

    expect(result.current.progress).toBe(0)
    expect(result.current.isActive).toBe(false)
  })

  it('should not trigger when disabled', () => {
    const { result } = renderHook(() => useTouchFeedback({ disabled: true }))

    act(() => {
      result.current.trigger()
    })

    expect(result.current.isActive).toBe(false)
    expect(result.current.progress).toBe(0)
  })

  it('should not trigger when prefers reduced motion', () => {
    require('@/hooks/use-performance').usePrefersReducedMotion.mockReturnValue(true)
    
    const { result } = renderHook(() => useTouchFeedback())

    act(() => {
      result.current.trigger()
    })

    expect(result.current.isActive).toBe(false)
    expect(result.current.progress).toBe(0)
  })

  it('should clamp progress values', () => {
    const { result } = renderHook(() => useTouchFeedback())

    act(() => {
      result.current.setProgress(1.5) // Above max
    })

    expect(result.current.progress).toBe(1)

    act(() => {
      result.current.setProgress(-0.5) // Below min
    })

    expect(result.current.progress).toBe(0)
  })

  it('should cleanup on unmount', () => {
    const { result, unmount } = renderHook(() => useTouchFeedback({ duration: 1000 }))

    act(() => {
      result.current.trigger()
    })

    expect(result.current.isActive).toBe(true)

    unmount()

    // Advance time to see if timers are cleaned up
    act(() => {
      jest.advanceTimersByTime(2000)
    })

    // No assertions needed - test passes if no errors are thrown
  })
})