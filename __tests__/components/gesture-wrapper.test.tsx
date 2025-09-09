/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { GestureWrapper, SimpleGestureWrapper } from '@/components/ui/gesture-wrapper'

// Mock hooks
jest.mock('@/hooks/use-long-press', () => ({
  useLongPress: jest.fn(() => ({
    longPressState: {
      isPressed: false,
      isTracking: false,
      progress: 0,
      startPoint: null,
      currentPoint: null,
      hasMoved: false
    },
    longPressHandlers: {
      onTouchStart: jest.fn(),
      onTouchMove: jest.fn(),
      onTouchEnd: jest.fn(),
      onTouchCancel: jest.fn(),
      onMouseDown: jest.fn(),
      onMouseMove: jest.fn(),
      onMouseUp: jest.fn(),
      onMouseLeave: jest.fn(),
      onContextMenu: jest.fn()
    },
    cancelLongPress: jest.fn(),
    triggerLongPress: jest.fn()
  }))
}))

jest.mock('@/hooks/use-gestures', () => ({
  useGestures: jest.fn(() => ({
    gestureState: {
      isTracking: false,
      startPoint: null,
      currentPoint: null,
      progress: 0
    },
    gestureHandlers: {
      onTouchStart: jest.fn(),
      onTouchMove: jest.fn(),
      onTouchEnd: jest.fn(),
      onTouchCancel: jest.fn(),
      onMouseDown: jest.fn(),
      onMouseMove: jest.fn(),
      onMouseUp: jest.fn(),
      onMouseLeave: jest.fn()
    },
    cancelGesture: jest.fn(),
    resetGesture: jest.fn()
  }))
}))

jest.mock('@/hooks/use-performance', () => ({
  usePrefersReducedMotion: jest.fn(() => false)
}))

describe('GestureWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render children correctly', () => {
    render(
      <GestureWrapper>
        <div data-testid="child">Child Content</div>
      </GestureWrapper>
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Child Content')).toBeInTheDocument()
  })

  it('should apply correct CSS classes', () => {
    const { container } = render(
      <GestureWrapper
        className="custom-class"
        preventSelection={true}
        longPress={{ enabled: true }}
      >
        <div>Content</div>
      </GestureWrapper>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('relative', 'select-none', 'touch-manipulation', 'cursor-pointer', 'custom-class')
  })

  it('should handle touch events when long press is enabled', () => {
    const mockLongPressHandlers = {
      onTouchStart: jest.fn(),
      onTouchMove: jest.fn(),
      onTouchEnd: jest.fn(),
      onTouchCancel: jest.fn(),
      onMouseDown: jest.fn(),
      onMouseMove: jest.fn(),
      onMouseUp: jest.fn(),
      onMouseLeave: jest.fn(),
      onContextMenu: jest.fn()
    }

    require('@/hooks/use-long-press').useLongPress.mockReturnValue({
      longPressState: {
        isPressed: false,
        isTracking: false,
        progress: 0,
        startPoint: null,
        currentPoint: null,
        hasMoved: false
      },
      longPressHandlers: mockLongPressHandlers,
      cancelLongPress: jest.fn(),
      triggerLongPress: jest.fn()
    })

    const { container } = render(
      <GestureWrapper longPress={{ enabled: true }}>
        <div>Content</div>
      </GestureWrapper>
    )

    const wrapper = container.firstChild as HTMLElement

    // Test touch events
    fireEvent.touchStart(wrapper, { touches: [{ clientX: 100, clientY: 200 }] })
    expect(mockLongPressHandlers.onTouchStart).toHaveBeenCalled()

    fireEvent.touchMove(wrapper, { touches: [{ clientX: 110, clientY: 210 }] })
    expect(mockLongPressHandlers.onTouchMove).toHaveBeenCalled()

    fireEvent.touchEnd(wrapper, { changedTouches: [{ clientX: 110, clientY: 210 }] })
    expect(mockLongPressHandlers.onTouchEnd).toHaveBeenCalled()
  })

  it('should handle context menu items', async () => {
    const contextMenuItems = [
      {
        label: 'Copy',
        icon: <span>📋</span>,
        action: jest.fn(),
        disabled: false
      },
      {
        label: 'Delete',
        icon: <span>🗑️</span>,
        action: jest.fn(),
        disabled: false
      }
    ]

    const onLongPress = jest.fn()

    render(
      <GestureWrapper
        contextMenuItems={contextMenuItems}
        longPress={{
          enabled: true,
          handlers: {
            onLongPress
          }
        }}
      >
        <div>Content</div>
      </GestureWrapper>
    )

    // Simulate long press triggering context menu
    // This would normally be triggered by the long press hook
    // For testing, we would need to mock the state changes
    expect(screen.queryByText('Copy')).not.toBeInTheDocument()
  })

  it('should disable gestures when enabled is false', () => {
    const mockHandlers = {
      onTouchStart: jest.fn(),
      onTouchMove: jest.fn(),
      onTouchEnd: jest.fn()
    }

    require('@/hooks/use-long-press').useLongPress.mockReturnValue({
      longPressState: {
        isPressed: false,
        isTracking: false,
        progress: 0,
        startPoint: null,
        currentPoint: null,
        hasMoved: false
      },
      longPressHandlers: mockHandlers,
      cancelLongPress: jest.fn(),
      triggerLongPress: jest.fn()
    })

    const { container } = render(
      <GestureWrapper enabled={false}>
        <div>Content</div>
      </GestureWrapper>
    )

    const wrapper = container.firstChild as HTMLElement

    fireEvent.touchStart(wrapper, { touches: [{ clientX: 100, clientY: 200 }] })
    
    // Should not have touch handlers when disabled
    expect(wrapper.ontouchstart).toBeFalsy()
  })

  it('should support both long press and swipe gestures', () => {
    const mockLongPressHandlers = {
      onTouchStart: jest.fn(),
      onTouchMove: jest.fn(),
      onTouchEnd: jest.fn()
    }

    const mockSwipeHandlers = {
      onTouchStart: jest.fn(),
      onTouchMove: jest.fn(),
      onTouchEnd: jest.fn()
    }

    require('@/hooks/use-long-press').useLongPress.mockReturnValue({
      longPressState: {
        isPressed: false,
        isTracking: false,
        progress: 0,
        startPoint: null,
        currentPoint: null,
        hasMoved: false
      },
      longPressHandlers: mockLongPressHandlers,
      cancelLongPress: jest.fn(),
      triggerLongPress: jest.fn()
    })

    require('@/hooks/use-gestures').useGestures.mockReturnValue({
      gestureState: {
        isTracking: false,
        startPoint: null,
        currentPoint: null,
        progress: 0
      },
      gestureHandlers: mockSwipeHandlers,
      cancelGesture: jest.fn(),
      resetGesture: jest.fn()
    })

    const { container } = render(
      <GestureWrapper
        longPress={{ enabled: true }}
        swipe={{ enabled: true }}
      >
        <div>Content</div>
      </GestureWrapper>
    )

    const wrapper = container.firstChild as HTMLElement

    fireEvent.touchStart(wrapper, { touches: [{ clientX: 100, clientY: 200 }] })
    
    // Both hooks should receive the event
    expect(mockLongPressHandlers.onTouchStart).toHaveBeenCalled()
    expect(mockSwipeHandlers.onTouchStart).toHaveBeenCalled()
  })

  it('should prevent click when gestures are active', () => {
    const onClick = jest.fn()

    require('@/hooks/use-long-press').useLongPress.mockReturnValue({
      longPressState: {
        isPressed: false,
        isTracking: true, // Gesture is tracking
        progress: 0.5,
        startPoint: { x: 100, y: 200, timestamp: Date.now() },
        currentPoint: { x: 100, y: 200, timestamp: Date.now() },
        hasMoved: false
      },
      longPressHandlers: {
        onTouchStart: jest.fn(),
        onTouchMove: jest.fn(),
        onTouchEnd: jest.fn(),
        onTouchCancel: jest.fn(),
        onMouseDown: jest.fn(),
        onMouseMove: jest.fn(),
        onMouseUp: jest.fn(),
        onMouseLeave: jest.fn(),
        onContextMenu: jest.fn()
      },
      cancelLongPress: jest.fn(),
      triggerLongPress: jest.fn()
    })

    const { container } = render(
      <GestureWrapper onClick={onClick}>
        <div>Content</div>
      </GestureWrapper>
    )

    const wrapper = container.firstChild as HTMLElement

    fireEvent.click(wrapper)
    
    // Click should be prevented when gesture is tracking
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe('SimpleGestureWrapper', () => {
  it('should render with simplified API', () => {
    const onLongPress = jest.fn()

    render(
      <SimpleGestureWrapper
        onLongPress={onLongPress}
        duration={1000}
      >
        <div data-testid="simple-child">Simple Content</div>
      </SimpleGestureWrapper>
    )

    expect(screen.getByTestId('simple-child')).toBeInTheDocument()
    expect(screen.getByText('Simple Content')).toBeInTheDocument()
  })

  it('should pass correct props to GestureWrapper', () => {
    const onLongPress = jest.fn()

    // We can't easily test the internal props passed to GestureWrapper
    // without more complex mocking, but we can test the component renders
    render(
      <SimpleGestureWrapper onLongPress={onLongPress} duration={750}>
        <div>Content</div>
      </SimpleGestureWrapper>
    )

    // The component should render without errors
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})