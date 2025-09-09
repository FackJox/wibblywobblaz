"use client"

import { useRef, useCallback, useEffect, useState } from 'react'
import { TouchPoint, extractTouchPoint, preventGestureDefault } from '@/lib/gesture-utils'

export interface LongPressConfig {
  /** Duration in ms to trigger long press */
  duration: number
  /** Maximum movement allowed during long press (px) */
  threshold: number
  /** Whether to prevent default touch behaviors */
  preventDefault: boolean
  /** Whether to capture move events during long press */
  captureMove: boolean
}

export const DEFAULT_LONG_PRESS_CONFIG: LongPressConfig = {
  duration: 500, // 500ms default
  threshold: 10, // 10px movement threshold
  preventDefault: true,
  captureMove: true
}

export interface LongPressState {
  /** Whether long press is currently active */
  isPressed: boolean
  /** Whether we're tracking a potential long press */
  isTracking: boolean
  /** Progress from 0 to 1 based on duration */
  progress: number
  /** Start point of the touch */
  startPoint: TouchPoint | null
  /** Current touch point */
  currentPoint: TouchPoint | null
  /** Whether touch has moved beyond threshold */
  hasMoved: boolean
}

export interface LongPressHandlers {
  /** Called when long press is triggered */
  onLongPress?: (startPoint: TouchPoint) => void
  /** Called when long press starts being tracked */
  onLongPressStart?: (startPoint: TouchPoint) => void
  /** Called during long press duration with progress */
  onLongPressProgress?: (progress: number, currentPoint: TouchPoint) => void
  /** Called when long press ends (success or cancel) */
  onLongPressEnd?: (success: boolean) => void
  /** Called when long press is cancelled due to movement */
  onLongPressCancel?: (reason: 'movement' | 'timeout' | 'release') => void
}

export interface UseLongPressOptions extends Partial<LongPressConfig> {
  /** Whether long press is enabled */
  enabled?: boolean
  /** Whether to support mouse events for desktop testing */
  supportMouse?: boolean
}

export interface UseLongPressReturn {
  /** Current long press state */
  longPressState: LongPressState
  /** Touch/mouse event handlers */
  longPressHandlers: {
    onTouchStart: (event: TouchEvent) => void
    onTouchMove: (event: TouchEvent) => void
    onTouchEnd: (event: TouchEvent) => void
    onTouchCancel: (event: TouchEvent) => void
    onMouseDown: (event: MouseEvent) => void
    onMouseMove: (event: MouseEvent) => void
    onMouseUp: (event: MouseEvent) => void
    onMouseLeave: (event: MouseEvent) => void
    onContextMenu: (event: Event) => void
  }
  /** Cancel current long press */
  cancelLongPress: () => void
  /** Trigger long press programmatically */
  triggerLongPress: () => void
}

/**
 * Hook for detecting long press gestures with configurable timing and visual feedback
 * Supports both touch and mouse events for comprehensive testing
 */
export function useLongPress(
  handlers: LongPressHandlers = {},
  options: UseLongPressOptions = {}
): UseLongPressReturn {
  const {
    enabled = true,
    supportMouse = true,
    ...configOverrides
  } = options

  const config: LongPressConfig = { ...DEFAULT_LONG_PRESS_CONFIG, ...configOverrides }
  
  const [longPressState, setLongPressState] = useState<LongPressState>({
    isPressed: false,
    isTracking: false,
    progress: 0,
    startPoint: null,
    currentPoint: null,
    hasMoved: false
  })

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isMouseTrackingRef = useRef(false)
  const startTimeRef = useRef<number>(0)

  /**
   * Calculate if touch has moved beyond threshold
   */
  const hasMovedBeyondThreshold = useCallback((start: TouchPoint, current: TouchPoint): boolean => {
    const dx = current.x - start.x
    const dy = current.y - start.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance > config.threshold
  }, [config.threshold])

  /**
   * Update progress during long press tracking
   */
  const updateProgress = useCallback(() => {
    if (!longPressState.isTracking || !longPressState.startPoint) return

    const elapsed = Date.now() - startTimeRef.current
    const progress = Math.min(elapsed / config.duration, 1)
    
    setLongPressState(prev => ({ ...prev, progress }))
    
    if (longPressState.currentPoint) {
      handlers.onLongPressProgress?.(progress, longPressState.currentPoint)
    }
    
    // Continue updating until complete
    if (progress < 1) {
      progressIntervalRef.current = setTimeout(updateProgress, 16) // ~60fps
    }
  }, [longPressState.isTracking, longPressState.startPoint, longPressState.currentPoint, config.duration, handlers])

  /**
   * Start long press tracking
   */
  const startLongPress = useCallback((event: TouchEvent | MouseEvent) => {
    if (!enabled) return

    const startPoint = extractTouchPoint(event)
    startTimeRef.current = Date.now()
    
    // Set mouse tracking flag if needed
    if ('clientX' in event) {
      isMouseTrackingRef.current = true
    }

    setLongPressState({
      isPressed: false,
      isTracking: true,
      progress: 0,
      startPoint,
      currentPoint: startPoint,
      hasMoved: false
    })

    // Prevent default behaviors if configured
    if (config.preventDefault) {
      preventGestureDefault(event)
    }

    // Start progress tracking
    updateProgress()

    // Set long press timeout
    timeoutRef.current = setTimeout(() => {
      setLongPressState(prev => ({
        ...prev,
        isPressed: true,
        progress: 1
      }))
      
      handlers.onLongPress?.(startPoint)
    }, config.duration)

    handlers.onLongPressStart?.(startPoint)
  }, [enabled, config.preventDefault, config.duration, handlers, updateProgress])

  /**
   * Update long press during movement
   */
  const updateLongPress = useCallback((event: TouchEvent | MouseEvent) => {
    if (!enabled || !longPressState.isTracking || !longPressState.startPoint) {
      return
    }

    // For mouse events, only track if we started tracking with mouse
    if ('clientX' in event && !isMouseTrackingRef.current) {
      return
    }

    if (!config.captureMove) return

    const currentPoint = extractTouchPoint(event)
    const hasMoved = hasMovedBeyondThreshold(longPressState.startPoint, currentPoint)
    
    setLongPressState(prev => ({
      ...prev,
      currentPoint,
      hasMoved
    }))

    // Cancel if moved too much
    if (hasMoved) {
      cancelLongPress('movement')
    }

    // Continue preventing default if configured
    if (config.preventDefault && longPressState.progress > 0.1) {
      preventGestureDefault(event)
    }
  }, [enabled, longPressState.isTracking, longPressState.startPoint, longPressState.progress, config.captureMove, config.preventDefault, hasMovedBeyondThreshold])

  /**
   * End long press tracking
   */
  const endLongPress = useCallback((event: TouchEvent | MouseEvent) => {
    if (!enabled || !longPressState.isTracking) {
      return
    }

    const wasSuccessful = longPressState.isPressed

    // Clean up
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (progressIntervalRef.current) {
      clearTimeout(progressIntervalRef.current)
      progressIntervalRef.current = null
    }

    // Reset state
    setLongPressState({
      isPressed: false,
      isTracking: false,
      progress: 0,
      startPoint: null,
      currentPoint: null,
      hasMoved: false
    })
    
    isMouseTrackingRef.current = false

    // Call handlers
    handlers.onLongPressEnd?.(wasSuccessful)
    
    if (!wasSuccessful) {
      handlers.onLongPressCancel?.('release')
    }
  }, [enabled, longPressState.isTracking, longPressState.isPressed, handlers])

  /**
   * Cancel long press with reason
   */
  const cancelLongPress = useCallback((reason: 'movement' | 'timeout' | 'release' = 'timeout') => {
    if (!longPressState.isTracking) return

    // Clean up timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (progressIntervalRef.current) {
      clearTimeout(progressIntervalRef.current)
      progressIntervalRef.current = null
    }

    // Reset state
    setLongPressState({
      isPressed: false,
      isTracking: false,
      progress: 0,
      startPoint: null,
      currentPoint: null,
      hasMoved: false
    })
    
    isMouseTrackingRef.current = false

    // Call handlers
    handlers.onLongPressEnd?.(false)
    handlers.onLongPressCancel?.(reason)
  }, [longPressState.isTracking, handlers])

  /**
   * Trigger long press programmatically
   */
  const triggerLongPress = useCallback(() => {
    if (!enabled || !longPressState.startPoint) return

    setLongPressState(prev => ({
      ...prev,
      isPressed: true,
      progress: 1
    }))

    handlers.onLongPress?.(longPressState.startPoint)
  }, [enabled, longPressState.startPoint, handlers])

  // Touch event handlers
  const onTouchStart = useCallback((event: TouchEvent) => {
    startLongPress(event)
  }, [startLongPress])

  const onTouchMove = useCallback((event: TouchEvent) => {
    updateLongPress(event)
  }, [updateLongPress])

  const onTouchEnd = useCallback((event: TouchEvent) => {
    endLongPress(event)
  }, [endLongPress])

  const onTouchCancel = useCallback((event: TouchEvent) => {
    cancelLongPress('timeout')
  }, [cancelLongPress])

  // Mouse event handlers (for desktop testing)
  const onMouseDown = useCallback((event: MouseEvent) => {
    if (supportMouse) {
      startLongPress(event)
    }
  }, [supportMouse, startLongPress])

  const onMouseMove = useCallback((event: MouseEvent) => {
    if (supportMouse) {
      updateLongPress(event)
    }
  }, [supportMouse, updateLongPress])

  const onMouseUp = useCallback((event: MouseEvent) => {
    if (supportMouse) {
      endLongPress(event)
    }
  }, [supportMouse, endLongPress])

  const onMouseLeave = useCallback((event: MouseEvent) => {
    if (supportMouse && isMouseTrackingRef.current) {
      cancelLongPress('release')
    }
  }, [supportMouse, cancelLongPress])

  // Context menu handler to prevent default right-click behavior
  const onContextMenu = useCallback((event: Event) => {
    if (longPressState.isTracking || longPressState.isPressed) {
      event.preventDefault()
    }
  }, [longPressState.isTracking, longPressState.isPressed])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (progressIntervalRef.current) {
        clearTimeout(progressIntervalRef.current)
      }
    }
  }, [])

  return {
    longPressState,
    longPressHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onTouchCancel,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave,
      onContextMenu
    },
    cancelLongPress,
    triggerLongPress
  }
}