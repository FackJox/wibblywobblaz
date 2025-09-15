import { useRef, useCallback, useEffect } from 'react'
import {
  TouchPoint,
  SwipeGesture,
  GestureConfig,
  DEFAULT_GESTURE_CONFIG,
  extractTouchPoint,
  createSwipeGesture,
  supportsTouchEvents,
  preventGestureDefault,
  debounceGesture
} from '@/lib/gesture-utils'

export interface GestureState {
  isTracking: boolean
  startPoint: TouchPoint | null
  currentPoint: TouchPoint | null
  progress: number
}

export interface GestureHandlers {
  onSwipe?: (gesture: SwipeGesture) => void
  onSwipeStart?: (startPoint: TouchPoint) => void
  onSwipeMove?: (currentPoint: TouchPoint, progress: number) => void
  onSwipeEnd?: (gesture: SwipeGesture | null) => void
  onSwipeCancel?: () => void
}

export interface UseGesturesOptions extends Partial<GestureConfig> {
  enabled?: boolean
  preventScrollOnSwipe?: boolean
  debounceMs?: number
}

export interface UseGesturesReturn {
  gestureState: GestureState
  gestureHandlers: {
    onTouchStart: (event: TouchEvent) => void
    onTouchMove: (event: TouchEvent) => void
    onTouchEnd: (event: TouchEvent) => void
    onTouchCancel: (event: TouchEvent) => void
    onMouseDown: (event: MouseEvent) => void
    onMouseMove: (event: MouseEvent) => void
    onMouseUp: (event: MouseEvent) => void
    onMouseLeave: (event: MouseEvent) => void
  }
  cancelGesture: () => void
  resetGesture: () => void
}

/**
 * Core gesture detection hook with touch and mouse support
 * Provides unified gesture recognition for swipe interactions
 */
export function useGestures(
  handlers: GestureHandlers = {},
  options: UseGesturesOptions = {}
): UseGesturesReturn {
  const {
    enabled = true,
    preventScrollOnSwipe = true,
    debounceMs = 50,
    ...configOverrides
  } = options

  const config: GestureConfig = { ...DEFAULT_GESTURE_CONFIG, ...configOverrides }
  
  const gestureStateRef = useRef<GestureState>({
    isTracking: false,
    startPoint: null,
    currentPoint: null,
    progress: 0
  })

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMouseTrackingRef = useRef(false)

  // Debounced handlers to prevent excessive calls
  const debouncedOnSwipeMove = debounceGesture(((currentPoint: TouchPoint, progress: number) => {
    handlers.onSwipeMove?.(currentPoint, progress)
  }) as (...args: unknown[]) => void, debounceMs)

  const startGesture = useCallback((event: TouchEvent | MouseEvent) => {
    if (!enabled) return

    const startPoint = extractTouchPoint(event)
    
    gestureStateRef.current = {
      isTracking: true,
      startPoint,
      currentPoint: startPoint,
      progress: 0
    }

    // Set tracking flag for mouse events
    if ('clientX' in event) {
      isMouseTrackingRef.current = true
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // Set gesture timeout
    timeoutRef.current = setTimeout(() => {
      if (gestureStateRef.current.isTracking) {
        cancelGesture()
      }
    }, config.touchTimeout)

    handlers.onSwipeStart?.(startPoint)
  }, [enabled, config.touchTimeout, handlers])

  const updateGesture = useCallback((event: TouchEvent | MouseEvent) => {
    if (!enabled || !gestureStateRef.current.isTracking || !gestureStateRef.current.startPoint) {
      return
    }

    // For mouse events, only track if we started tracking with mouse
    if ('clientX' in event && !isMouseTrackingRef.current) {
      return
    }

    const currentPoint = extractTouchPoint(event)
    const { startPoint } = gestureStateRef.current
    
    // Calculate progress for visual feedback
    const distance = Math.sqrt(
      Math.pow(currentPoint.x - startPoint.x, 2) +
      Math.pow(currentPoint.y - startPoint.y, 2)
    )
    const progress = Math.min(distance / config.minDistance, 1)

    gestureStateRef.current = {
      ...gestureStateRef.current,
      currentPoint,
      progress
    }

    // Prevent scroll if configured
    if (preventScrollOnSwipe && progress > 0.1) {
      preventGestureDefault(event)
    }

    debouncedOnSwipeMove(currentPoint, progress)
  }, [enabled, config.minDistance, preventScrollOnSwipe, debouncedOnSwipeMove])

  const endGesture = useCallback((event: TouchEvent | MouseEvent) => {
    if (!enabled || !gestureStateRef.current.isTracking || !gestureStateRef.current.startPoint) {
      return
    }

    const endPoint = extractTouchPoint(event)
    const { startPoint } = gestureStateRef.current
    
    // Create swipe gesture if valid
    const gesture = createSwipeGesture(startPoint, endPoint)
    
    // Reset state
    gestureStateRef.current = {
      isTracking: false,
      startPoint: null,
      currentPoint: null,
      progress: 0
    }
    
    isMouseTrackingRef.current = false

    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // Call handlers
    if (gesture) {
      handlers.onSwipe?.(gesture)
    }
    handlers.onSwipeEnd?.(gesture)
  }, [enabled, handlers])

  const cancelGesture = useCallback(() => {
    if (!gestureStateRef.current.isTracking) return

    gestureStateRef.current = {
      isTracking: false,
      startPoint: null,
      currentPoint: null,
      progress: 0
    }
    
    isMouseTrackingRef.current = false

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    handlers.onSwipeCancel?.()
  }, [handlers])

  const resetGesture = useCallback(() => {
    gestureStateRef.current = {
      isTracking: false,
      startPoint: null,
      currentPoint: null,
      progress: 0
    }
    
    isMouseTrackingRef.current = false

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Touch event handlers
  const onTouchStart = useCallback((event: TouchEvent) => {
    startGesture(event)
  }, [startGesture])

  const onTouchMove = useCallback((event: TouchEvent) => {
    updateGesture(event)
  }, [updateGesture])

  const onTouchEnd = useCallback((event: TouchEvent) => {
    endGesture(event)
  }, [endGesture])

  const onTouchCancel = useCallback((event: TouchEvent) => {
    cancelGesture()
  }, [cancelGesture])

  // Mouse event handlers (for desktop testing)
  const onMouseDown = useCallback((event: MouseEvent) => {
    // Only handle if touch events are not supported
    if (!supportsTouchEvents()) {
      startGesture(event)
    }
  }, [startGesture])

  const onMouseMove = useCallback((event: MouseEvent) => {
    if (!supportsTouchEvents()) {
      updateGesture(event)
    }
  }, [updateGesture])

  const onMouseUp = useCallback((event: MouseEvent) => {
    if (!supportsTouchEvents()) {
      endGesture(event)
    }
  }, [endGesture])

  const onMouseLeave = useCallback((event: MouseEvent) => {
    if (!supportsTouchEvents() && isMouseTrackingRef.current) {
      cancelGesture()
    }
  }, [cancelGesture])

  return {
    gestureState: gestureStateRef.current,
    gestureHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onTouchCancel,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave
    },
    cancelGesture,
    resetGesture
  }
}