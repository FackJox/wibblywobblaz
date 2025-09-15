/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react'
import { useLongPress } from '@/hooks/use-long-press'

// Mock performance and timing
jest.useFakeTimers()

// Mock the performance hook
jest.mock('@/hooks/use-performance', () => ({
  usePrefersReducedMotion: jest.fn(() => false)
}))

describe('useLongPress - Advanced Scenarios', () => {
  beforeEach(() => {
    jest.clearAllTimers()
    require('@/hooks/use-performance').usePrefersReducedMotion.mockReturnValue(false)
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
  })

  describe('Multi-touch scenarios', () => {
    it('should handle multiple touches correctly (use first touch)', () => {
      const onLongPressStart = jest.fn()
      const { result } = renderHook(() => 
        useLongPress({ onLongPressStart })
      )

      // Start with multiple touches
      const multiTouchEvent = new TouchEvent('touchstart', {
        touches: [
          { clientX: 100, clientY: 200 } as Touch,
          { clientX: 150, clientY: 250 } as Touch,
          { clientX: 200, clientY: 300 } as Touch
        ]
      })

      act(() => {
        result.current.longPressHandlers.onTouchStart(multiTouchEvent)
      })

      expect(result.current.longPressState.isTracking).toBe(true)
      expect(result.current.longPressState.startPoint).toEqual(
        expect.objectContaining({ x: 100, y: 200 }) // Should use first touch
      )
      expect(onLongPressStart).toHaveBeenCalledWith(
        expect.objectContaining({ x: 100, y: 200 })
      )
    })

    it('should handle touch events with no touches gracefully', () => {
      const onLongPressStart = jest.fn()
      const { result } = renderHook(() => 
        useLongPress({ onLongPressStart })
      )

      const emptyTouchEvent = new TouchEvent('touchstart', {
        touches: []
      })

      act(() => {
        result.current.longPressHandlers.onTouchStart(emptyTouchEvent)
      })

      expect(result.current.longPressState.isTracking).toBe(true)
      expect(result.current.longPressState.startPoint).toEqual(
        expect.objectContaining({ x: 0, y: 0 }) // Fallback values
      )
    })

    it('should track correct touch during multi-touch movement', () => {
      const onLongPressProgress = jest.fn()
      const { result } = renderHook(() => 
        useLongPress({ onLongPressProgress }, { captureMove: true })
      )

      // Start touch
      const startEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 200 } as Touch]
      })

      act(() => {
        result.current.longPressHandlers.onTouchStart(startEvent)
      })

      // Move with multiple touches
      const moveEvent = new TouchEvent('touchmove', {
        touches: [
          { clientX: 105, clientY: 205 } as Touch, // First touch moved slightly
          { clientX: 300, clientY: 400 } as Touch  // Second touch elsewhere
        ]
      })

      act(() => {
        result.current.longPressHandlers.onTouchMove(moveEvent)
      })

      expect(result.current.longPressState.isTracking).toBe(true)
      expect(result.current.longPressState.currentPoint).toEqual(
        expect.objectContaining({ x: 105, y: 205 }) // Should track first touch
      )
    })
  })

  describe('Edge cases and error conditions', () => {
    it('should handle rapid start/stop cycles', () => {
      const onLongPress = jest.fn()
      const onLongPressCancel = jest.fn()
      const { result } = renderHook(() => 
        useLongPress({ onLongPress, onLongPressCancel }, { duration: 500 })
      )

      const startEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 200 } as Touch]
      })

      const endEvent = new TouchEvent('touchend', {
        changedTouches: [{ clientX: 100, clientY: 200 } as Touch]
      })

      // Rapid start/stop cycles
      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.longPressHandlers.onTouchStart(startEvent)
        })

        act(() => {
          jest.advanceTimersByTime(50) // Short duration
          result.current.longPressHandlers.onTouchEnd(endEvent)
        })
      }

      expect(result.current.longPressState.isTracking).toBe(false)
      expect(onLongPress).not.toHaveBeenCalled()
      expect(onLongPressCancel).toHaveBeenCalled()
    })

    it('should handle events while already pressed', () => {
      const onLongPress = jest.fn()
      const { result } = renderHook(() => 
        useLongPress({ onLongPress }, { duration: 500 })
      )

      const startEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 200 } as Touch]
      })

      act(() => {
        result.current.longPressHandlers.onTouchStart(startEvent)
      })

      // Complete long press
      act(() => {
        jest.advanceTimersByTime(500)
      })

      expect(result.current.longPressState.isPressed).toBe(true)
      expect(onLongPress).toHaveBeenCalledTimes(1)

      // Try to start another long press while already pressed
      act(() => {
        result.current.longPressHandlers.onTouchStart(startEvent)
      })

      // Should not start a new long press
      expect(onLongPress).toHaveBeenCalledTimes(1)
    })

    it('should handle mouse events mixed with touch events', () => {
      const onLongPressStart = jest.fn()
      const { result } = renderHook(() => 
        useLongPress({ onLongPressStart }, { supportMouse: true })
      )

      // Start with touch
      const touchEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 200 } as Touch]
      })

      act(() => {
        result.current.longPressHandlers.onTouchStart(touchEvent)
      })

      expect(result.current.longPressState.isTracking).toBe(true)

      // Try to interfere with mouse event (should be ignored)
      const mouseEvent = new MouseEvent('mousedown', {
        clientX: 150,
        clientY: 250
      })

      act(() => {
        result.current.longPressHandlers.onMouseDown(mouseEvent)
      })

      // Original touch tracking should continue
      expect(result.current.longPressState.startPoint).toEqual(
        expect.objectContaining({ x: 100, y: 200 })
      )
    })

    it('should handle preventDefault configuration correctly', () => {
      const { result } = renderHook(() => 
        useLongPress({}, { preventDefault: false })
      )

      const touchEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 200 } as Touch]
      })

      const preventDefaultSpy = jest.spyOn(touchEvent, 'preventDefault')
      const stopPropagationSpy = jest.spyOn(touchEvent, 'stopPropagation')

      act(() => {
        result.current.longPressHandlers.onTouchStart(touchEvent)
      })

      expect(preventDefaultSpy).not.toHaveBeenCalled()
      expect(stopPropagationSpy).not.toHaveBeenCalled()
    })

    it('should handle very small threshold values', () => {
      const onLongPressCancel = jest.fn()
      const { result } = renderHook(() => 
        useLongPress({ onLongPressCancel }, { threshold: 1 }) // Very small threshold
      )

      const startEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 200 } as Touch]
      })

      act(() => {
        result.current.longPressHandlers.onTouchStart(startEvent)
      })

      // Very small movement should cancel
      const moveEvent = new TouchEvent('touchmove', {
        touches: [{ clientX: 101.5, clientY: 200.5 } as Touch] // ~1.58 pixels
      })

      act(() => {
        result.current.longPressHandlers.onTouchMove(moveEvent)
      })

      expect(result.current.longPressState.isTracking).toBe(false)
      expect(onLongPressCancel).toHaveBeenCalledWith('movement')
    })

    it('should handle very large threshold values', () => {
      const onLongPressCancel = jest.fn()
      const { result } = renderHook(() => 
        useLongPress({ onLongPressCancel }, { threshold: 1000 }) // Very large threshold
      )

      const startEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 200 } as Touch]
      })

      act(() => {
        result.current.longPressHandlers.onTouchStart(startEvent)
      })

      // Large movement should not cancel
      const moveEvent = new TouchEvent('touchmove', {
        touches: [{ clientX: 500, clientY: 600 } as Touch] // Large movement
      })

      act(() => {
        result.current.longPressHandlers.onTouchMove(moveEvent)
      })

      expect(result.current.longPressState.isTracking).toBe(true)
      expect(onLongPressCancel).not.toHaveBeenCalled()
    })

    it('should handle zero and negative durations', () => {
      const onLongPress = jest.fn()
      const { result } = renderHook(() => 
        useLongPress({ onLongPress }, { duration: 0 })
      )

      const startEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 200 } as Touch]
      })

      act(() => {
        result.current.longPressHandlers.onTouchStart(startEvent)
      })

      // Should trigger immediately
      act(() => {
        jest.advanceTimersByTime(0)
      })

      expect(onLongPress).toHaveBeenCalled()
    })
  })

  describe('Performance and accessibility', () => {
    it('should respect reduced motion preference', () => {
      require('@/hooks/use-performance').usePrefersReducedMotion.mockReturnValue(true)
      
      const onLongPress = jest.fn()
      const { result } = renderHook(() => 
        useLongPress({ onLongPress })
      )

      const startEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 200 } as Touch]
      })

      act(() => {
        result.current.longPressHandlers.onTouchStart(startEvent)
      })

      // Should still track but without visual feedback considerations
      expect(result.current.longPressState.isTracking).toBe(true)

      act(() => {
        jest.advanceTimersByTime(500)
      })

      expect(onLongPress).toHaveBeenCalled()
    })

    it('should handle memory pressure by cleanup', () => {
      const { result, unmount } = renderHook(() => useLongPress())

      // Start multiple gestures
      for (let i = 0; i < 10; i++) {
        const startEvent = new TouchEvent('touchstart', {
          touches: [{ clientX: 100 + i, clientY: 200 + i } as Touch]
        })

        act(() => {
          result.current.longPressHandlers.onTouchStart(startEvent)
        })

        act(() => {
          result.current.cancelLongPress()
        })
      }

      // Unmount should clean everything up
      unmount()

      // Advance significant time to test cleanup
      act(() => {
        jest.advanceTimersByTime(10000)
      })

      // Test passes if no memory leaks or errors occur
    })

    it('should handle concurrent gesture instances', () => {
      // Simulate multiple component instances
      const { result: result1 } = renderHook(() => useLongPress())
      const { result: result2 } = renderHook(() => useLongPress())

      const event1 = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 200 } as Touch]
      })

      const event2 = new TouchEvent('touchstart', {
        touches: [{ clientX: 300, clientY: 400 } as Touch]
      })

      act(() => {
        result1.current.longPressHandlers.onTouchStart(event1)
        result2.current.longPressHandlers.onTouchStart(event2)
      })

      expect(result1.current.longPressState.isTracking).toBe(true)
      expect(result2.current.longPressState.isTracking).toBe(true)

      // Each should track independently
      expect(result1.current.longPressState.startPoint?.x).toBe(100)
      expect(result2.current.longPressState.startPoint?.x).toBe(300)
    })
  })

  describe('Progress tracking accuracy', () => {
    it('should provide accurate progress at different intervals', () => {
      const progressHistory: number[] = []
      const onLongPressProgress = jest.fn((progress) => {
        progressHistory.push(progress)
      })

      const { result } = renderHook(() => 
        useLongPress({ onLongPressProgress }, { duration: 1000 })
      )

      const startEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 200 } as Touch]
      })

      act(() => {
        result.current.longPressHandlers.onTouchStart(startEvent)
      })

      // Test progress at different intervals
      const testIntervals = [100, 250, 500, 750, 1000]
      
      for (const interval of testIntervals) {
        act(() => {
          jest.advanceTimersByTime(interval === 100 ? 100 : interval - (testIntervals[testIntervals.indexOf(interval) - 1] || 0))
        })

        const expectedProgress = interval / 1000
        expect(result.current.longPressState.progress).toBeCloseTo(expectedProgress, 1)
      }

      expect(progressHistory.length).toBeGreaterThan(0)
    })

    it('should handle progress updates at high frequency', () => {
      const onLongPressProgress = jest.fn()
      const { result } = renderHook(() => 
        useLongPress({ onLongPressProgress }, { duration: 1000 })
      )

      const startEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 200 } as Touch]
      })

      act(() => {
        result.current.longPressHandlers.onTouchStart(startEvent)
      })

      // Advance time in small increments to test high-frequency updates
      for (let i = 0; i < 60; i++) { // ~60fps for 1 second
        act(() => {
          jest.advanceTimersByTime(16) // ~16ms per frame
        })
      }

      expect(result.current.longPressState.progress).toBeCloseTo(0.96, 1) // 60 * 16 = 960ms
      expect(onLongPressProgress).toHaveBeenCalledTimes(60)
    })
  })
})