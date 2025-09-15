/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react'
import { useLongPress } from '@/hooks/use-long-press'

// Mock timers
jest.useFakeTimers()

describe('useLongPress', () => {
  beforeEach(() => {
    jest.clearAllTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useLongPress())
    
    expect(result.current.longPressState).toEqual({
      isPressed: false,
      isTracking: false,
      progress: 0,
      startPoint: null,
      currentPoint: null,
      hasMoved: false
    })
  })

  it('should handle touch start and begin tracking', () => {
    const onLongPressStart = jest.fn()
    const { result } = renderHook(() => 
      useLongPress({ onLongPressStart })
    )

    const touchEvent = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 200 } as Touch]
    })

    act(() => {
      result.current.longPressHandlers.onTouchStart(touchEvent)
    })

    expect(result.current.longPressState.isTracking).toBe(true)
    expect(result.current.longPressState.startPoint).toEqual(
      expect.objectContaining({ x: 100, y: 200 })
    )
    expect(onLongPressStart).toHaveBeenCalledWith(
      expect.objectContaining({ x: 100, y: 200 })
    )
  })

  it('should trigger long press after duration', async () => {
    const onLongPress = jest.fn()
    const onLongPressEnd = jest.fn()
    const { result } = renderHook(() => 
      useLongPress(
        { onLongPress, onLongPressEnd },
        { duration: 500 }
      )
    )

    const touchEvent = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 200 } as Touch]
    })

    act(() => {
      result.current.longPressHandlers.onTouchStart(touchEvent)
    })

    // Fast-forward time to trigger long press
    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(result.current.longPressState.isPressed).toBe(true)
    expect(result.current.longPressState.progress).toBe(1)
    expect(onLongPress).toHaveBeenCalledWith(
      expect.objectContaining({ x: 100, y: 200 })
    )
  })

  it('should track progress during long press', () => {
    const onLongPressProgress = jest.fn()
    const { result } = renderHook(() => 
      useLongPress(
        { onLongPressProgress },
        { duration: 1000 }
      )
    )

    const touchEvent = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 200 } as Touch]
    })

    act(() => {
      result.current.longPressHandlers.onTouchStart(touchEvent)
    })

    // Progress at 50%
    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(result.current.longPressState.progress).toBeCloseTo(0.5, 1)
    expect(onLongPressProgress).toHaveBeenCalled()
  })

  it('should cancel long press on movement beyond threshold', () => {
    const onLongPressCancel = jest.fn()
    const { result } = renderHook(() => 
      useLongPress(
        { onLongPressCancel },
        { threshold: 10 }
      )
    )

    // Start touch
    const startEvent = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 200 } as Touch]
    })

    act(() => {
      result.current.longPressHandlers.onTouchStart(startEvent)
    })

    // Move beyond threshold
    const moveEvent = new TouchEvent('touchmove', {
      touches: [{ clientX: 120, clientY: 220 } as Touch] // Distance > 10
    })

    act(() => {
      result.current.longPressHandlers.onTouchMove(moveEvent)
    })

    expect(result.current.longPressState.isTracking).toBe(false)
    expect(result.current.longPressState.hasMoved).toBe(true)
    expect(onLongPressCancel).toHaveBeenCalledWith('movement')
  })

  it('should handle touch end before duration completes', () => {
    const onLongPressEnd = jest.fn()
    const onLongPressCancel = jest.fn()
    const { result } = renderHook(() => 
      useLongPress(
        { onLongPressEnd, onLongPressCancel },
        { duration: 1000 }
      )
    )

    const startEvent = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 200 } as Touch]
    })

    const endEvent = new TouchEvent('touchend', {
      changedTouches: [{ clientX: 100, clientY: 200 } as Touch]
    })

    act(() => {
      result.current.longPressHandlers.onTouchStart(startEvent)
    })

    // End before duration
    act(() => {
      jest.advanceTimersByTime(300)
      result.current.longPressHandlers.onTouchEnd(endEvent)
    })

    expect(result.current.longPressState.isTracking).toBe(false)
    expect(result.current.longPressState.isPressed).toBe(false)
    expect(onLongPressEnd).toHaveBeenCalledWith(false)
    expect(onLongPressCancel).toHaveBeenCalledWith('release')
  })

  it('should support mouse events when enabled', () => {
    const onLongPressStart = jest.fn()
    const { result } = renderHook(() => 
      useLongPress(
        { onLongPressStart },
        { supportMouse: true }
      )
    )

    const mouseEvent = new MouseEvent('mousedown', {
      clientX: 150,
      clientY: 250
    })

    act(() => {
      result.current.longPressHandlers.onMouseDown(mouseEvent)
    })

    expect(result.current.longPressState.isTracking).toBe(true)
    expect(result.current.longPressState.startPoint).toEqual(
      expect.objectContaining({ x: 150, y: 250 })
    )
    expect(onLongPressStart).toHaveBeenCalled()
  })

  it('should prevent context menu when configured', () => {
    const { result } = renderHook(() => useLongPress())

    const contextMenuEvent = new Event('contextmenu')
    const preventDefaultSpy = jest.spyOn(contextMenuEvent, 'preventDefault')

    // Start tracking
    const startEvent = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 200 } as Touch]
    })

    act(() => {
      result.current.longPressHandlers.onTouchStart(startEvent)
      result.current.longPressHandlers.onContextMenu(contextMenuEvent)
    })

    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('should handle disabled state', () => {
    const onLongPressStart = jest.fn()
    const { result } = renderHook(() => 
      useLongPress(
        { onLongPressStart },
        { enabled: false }
      )
    )

    const touchEvent = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 200 } as Touch]
    })

    act(() => {
      result.current.longPressHandlers.onTouchStart(touchEvent)
    })

    expect(result.current.longPressState.isTracking).toBe(false)
    expect(onLongPressStart).not.toHaveBeenCalled()
  })

  it('should programmatically trigger long press', () => {
    const onLongPress = jest.fn()
    const { result } = renderHook(() => 
      useLongPress({ onLongPress })
    )

    // Start tracking first
    const startEvent = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 200 } as Touch]
    })

    act(() => {
      result.current.longPressHandlers.onTouchStart(startEvent)
    })

    // Trigger programmatically
    act(() => {
      result.current.triggerLongPress()
    })

    expect(result.current.longPressState.isPressed).toBe(true)
    expect(onLongPress).toHaveBeenCalledWith(
      expect.objectContaining({ x: 100, y: 200 })
    )
  })

  it('should cancel long press programmatically', () => {
    const onLongPressCancel = jest.fn()
    const { result } = renderHook(() => 
      useLongPress({ onLongPressCancel })
    )

    const startEvent = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 200 } as Touch]
    })

    act(() => {
      result.current.longPressHandlers.onTouchStart(startEvent)
    })

    expect(result.current.longPressState.isTracking).toBe(true)

    act(() => {
      result.current.cancelLongPress()
    })

    expect(result.current.longPressState.isTracking).toBe(false)
    expect(onLongPressCancel).toHaveBeenCalledWith('timeout')
  })

  it('should respect custom threshold for movement', () => {
    const onLongPressCancel = jest.fn()
    const { result } = renderHook(() => 
      useLongPress(
        { onLongPressCancel },
        { threshold: 50 } // Large threshold
      )
    )

    const startEvent = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 200 } as Touch]
    })

    act(() => {
      result.current.longPressHandlers.onTouchStart(startEvent)
    })

    // Move within threshold (should not cancel)
    const moveEvent = new TouchEvent('touchmove', {
      touches: [{ clientX: 120, clientY: 220 } as Touch] // Distance < 50
    })

    act(() => {
      result.current.longPressHandlers.onTouchMove(moveEvent)
    })

    expect(result.current.longPressState.isTracking).toBe(true)
    expect(onLongPressCancel).not.toHaveBeenCalled()
  })

  it('should handle touch cancel events', () => {
    const onLongPressCancel = jest.fn()
    const { result } = renderHook(() => 
      useLongPress({ onLongPressCancel })
    )

    const startEvent = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 200 } as Touch]
    })

    act(() => {
      result.current.longPressHandlers.onTouchStart(startEvent)
    })

    const cancelEvent = new TouchEvent('touchcancel')

    act(() => {
      result.current.longPressHandlers.onTouchCancel(cancelEvent)
    })

    expect(result.current.longPressState.isTracking).toBe(false)
    expect(onLongPressCancel).toHaveBeenCalledWith('timeout')
  })

  it('should cleanup timers on unmount', () => {
    const { result, unmount } = renderHook(() => useLongPress())

    const startEvent = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 200 } as Touch]
    })

    act(() => {
      result.current.longPressHandlers.onTouchStart(startEvent)
    })

    expect(result.current.longPressState.isTracking).toBe(true)

    // Unmount should clean up
    unmount()

    // Advancing time should not cause issues
    act(() => {
      jest.advanceTimersByTime(1000)
    })

    // No assertions needed - the test passes if no errors are thrown
  })
})