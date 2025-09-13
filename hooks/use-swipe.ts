import { useCallback, useRef, useState } from 'react'
import { useGestures, GestureHandlers, UseGesturesOptions } from './use-gestures'
import { SwipeGesture, TouchPoint } from '@/lib/gesture-utils'

export interface SwipeConfig {
  horizontalOnly?: boolean
  verticalOnly?: boolean
  leftToRight?: boolean
  rightToLeft?: boolean
  upToDown?: boolean
  downToUp?: boolean
  minSwipeDistance?: number
  minSwipeVelocity?: number
  enableVisualFeedback?: boolean
}

export interface SwipeHandlers {
  onSwipeLeft?: (gesture: SwipeGesture) => void
  onSwipeRight?: (gesture: SwipeGesture) => void
  onSwipeUp?: (gesture: SwipeGesture) => void
  onSwipeDown?: (gesture: SwipeGesture) => void
  onSwipeProgress?: (progress: number, direction: 'left' | 'right' | 'up' | 'down' | null) => void
}

export interface UseSwipeOptions extends UseGesturesOptions {
  swipeConfig?: SwipeConfig
}

export interface SwipeState {
  isSwaping: boolean
  direction: 'left' | 'right' | 'up' | 'down' | null
  progress: number
}

/**
 * Specialized swipe hook for directional navigation
 * Built on top of useGestures with swipe-specific logic
 */
export function useSwipe(
  handlers: SwipeHandlers = {},
  options: UseSwipeOptions = {}
): {
  swipeState: SwipeState
  gestureHandlers: ReturnType<typeof useGestures>['gestureHandlers']
  cancelSwipe: () => void
  resetSwipe: () => void
} {
  const { swipeConfig = {}, ...gestureOptions } = options
  
  const {
    horizontalOnly = false,
    verticalOnly = false,
    leftToRight = true,
    rightToLeft = true,
    upToDown = true,
    downToUp = true,
    minSwipeDistance = 50,
    minSwipeVelocity = 0.3,
    enableVisualFeedback = true
  } = swipeConfig

  const [swipeState, setSwipeState] = useState<SwipeState>({
    isSwaping: false,
    direction: null,
    progress: 0
  })

  const lastDirectionRef = useRef<'left' | 'right' | 'up' | 'down' | null>(null)
  const startPointRef = useRef<{ x: number; y: number } | null>(null)
  const startTimeRef = useRef<number>(0)

  // Determine primary swipe direction based on current gesture
  const getPrimaryDirection = useCallback((startX: number, startY: number, currentX: number, currentY: number) => {
    const dx = currentX - startX
    const dy = currentY - startY
    
    // Check if we should filter directions
    if (horizontalOnly && Math.abs(dy) > Math.abs(dx)) return null
    if (verticalOnly && Math.abs(dx) > Math.abs(dy)) return null
    
    // Determine primary direction
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && leftToRight) return 'right'
      if (dx < 0 && rightToLeft) return 'left'
    } else {
      if (dy > 0 && upToDown) return 'down'
      if (dy < 0 && downToUp) return 'up'
    }
    
    return null
  }, [horizontalOnly, verticalOnly, leftToRight, rightToLeft, upToDown, downToUp])

  const gestureHandlers: GestureHandlers = {
    onSwipeStart: useCallback((startPoint: TouchPoint) => {
      startTimeRef.current = startPoint.timestamp
      startPointRef.current = { x: startPoint.x, y: startPoint.y }
      setSwipeState({
        isSwaping: true,
        direction: null,
        progress: 0
      })
    }, []),

    onSwipeMove: useCallback((currentPoint: TouchPoint, progress: number) => {
      if (!swipeState.isSwaping || !startPointRef.current) return

      // Get the start point to calculate direction
      const { x: startX, y: startY } = startPointRef.current
      
      const direction = getPrimaryDirection(startX, startY, currentPoint.x, currentPoint.y)
      
      // Update state if direction changed or progress updated
      if (direction !== lastDirectionRef.current || progress !== swipeState.progress) {
        lastDirectionRef.current = direction
        
        setSwipeState(prev => ({
          ...prev,
          direction,
          progress
        }))

        // Call progress handler if enabled
        if (enableVisualFeedback) {
          handlers.onSwipeProgress?.(progress, direction)
        }
      }
    }, [swipeState.isSwaping, getPrimaryDirection, enableVisualFeedback, handlers]),

    onSwipe: useCallback((gesture: SwipeGesture) => {
      // Check if the swipe meets our minimum requirements
      if (gesture.distance < minSwipeDistance || gesture.velocity < minSwipeVelocity) {
        return
      }

      // Check if direction is allowed
      const { direction } = gesture
      let allowed = false
      
      switch (direction) {
        case 'left':
          allowed = rightToLeft && !verticalOnly
          break
        case 'right':
          allowed = leftToRight && !verticalOnly
          break
        case 'up':
          allowed = downToUp && !horizontalOnly
          break
        case 'down':
          allowed = upToDown && !horizontalOnly
          break
      }

      if (!allowed) return

      // Call appropriate handler
      switch (direction) {
        case 'left':
          handlers.onSwipeLeft?.(gesture)
          break
        case 'right':
          handlers.onSwipeRight?.(gesture)
          break
        case 'up':
          handlers.onSwipeUp?.(gesture)
          break
        case 'down':
          handlers.onSwipeDown?.(gesture)
          break
      }
    }, [
      minSwipeDistance,
      minSwipeVelocity,
      rightToLeft,
      leftToRight,
      downToUp,
      upToDown,
      verticalOnly,
      horizontalOnly,
      handlers
    ]),

    onSwipeEnd: useCallback((gesture: SwipeGesture | null) => {
      setSwipeState({
        isSwaping: false,
        direction: null,
        progress: 0
      })
      lastDirectionRef.current = null
      startPointRef.current = null
    }, []),

    onSwipeCancel: useCallback(() => {
      setSwipeState({
        isSwaping: false,
        direction: null,
        progress: 0
      })
      lastDirectionRef.current = null
      startPointRef.current = null
    }, [])
  }

  const gestures = useGestures(gestureHandlers, {
    minDistance: minSwipeDistance,
    minVelocity: minSwipeVelocity,
    ...gestureOptions
  })

  const cancelSwipe = useCallback(() => {
    gestures.cancelGesture()
    setSwipeState({
      isSwaping: false,
      direction: null,
      progress: 0
    })
    lastDirectionRef.current = null
    startPointRef.current = null
  }, [gestures])

  const resetSwipe = useCallback(() => {
    gestures.resetGesture()
    setSwipeState({
      isSwaping: false,
      direction: null,
      progress: 0
    })
    lastDirectionRef.current = null
    startPointRef.current = null
  }, [gestures])

  return {
    swipeState,
    gestureHandlers: gestures.gestureHandlers,
    cancelSwipe,
    resetSwipe
  }
}

/**
 * Specialized hook for horizontal page navigation
 * Optimized for left/right swipe navigation between pages
 */
export function useHorizontalSwipeNavigation(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  options: UseSwipeOptions = {}
) {
  const swipeConfig: SwipeConfig = {
    horizontalOnly: true,
    minSwipeDistance: 80, // Slightly higher threshold for page navigation
    minSwipeVelocity: 0.4,
    enableVisualFeedback: true,
    ...options.swipeConfig
  }

  return useSwipe(
    {
      onSwipeLeft: () => onSwipeLeft(),
      onSwipeRight: () => onSwipeRight(),
    },
    {
      ...options,
      swipeConfig,
      preventScrollOnSwipe: true // Always prevent scroll for page navigation
    }
  )
}

/**
 * Hook for vertical swipe navigation (e.g., content scrolling or page transitions)
 */
export function useVerticalSwipeNavigation(
  onSwipeUp: () => void,
  onSwipeDown: () => void,
  options: UseSwipeOptions = {}
) {
  const swipeConfig: SwipeConfig = {
    verticalOnly: true,
    minSwipeDistance: 60,
    minSwipeVelocity: 0.35,
    enableVisualFeedback: true,
    ...options.swipeConfig
  }

  return useSwipe(
    {
      onSwipeUp: () => onSwipeUp(),
      onSwipeDown: () => onSwipeDown(),
    },
    {
      ...options,
      swipeConfig,
      preventScrollOnSwipe: false // Allow normal scrolling for vertical swipes
    }
  )
}