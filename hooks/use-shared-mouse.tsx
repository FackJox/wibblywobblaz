"use client"

import * as React from "react"
import { throttle } from "../lib/animation-utils"
import { usePrefersReducedMotion } from "./use-performance"

/**
 * Shared mouse position for multiple consumers
 */
export interface MousePosition {
  x: number
  y: number
}

/**
 * Configuration for shared mouse tracking
 */
export interface UseSharedMouseConfig {
  /** Throttle mouse events (ms) */
  throttleMs?: number
  /** Whether to respect reduced motion preferences */
  respectReducedMotion?: boolean
  /** Track relative to viewport (true) or document (false) */
  relativeToViewport?: boolean
}

/**
 * Hook for shared mouse position tracking
 * Single event listener for multiple consumers to improve performance
 * 
 * @param config Configuration options
 * @returns Current mouse position
 * 
 * @example
 * ```tsx
 * const mousePosition = useSharedMouse({ throttleMs: 16 })
 * 
 * // Pass to multiple children
 * <Card mousePosition={mousePosition} />
 * ```
 */
export function useSharedMouse(config: UseSharedMouseConfig = {}): MousePosition {
  const {
    throttleMs = 16, // ~60fps
    respectReducedMotion = true,
    relativeToViewport = true
  } = config

  const prefersReducedMotion = usePrefersReducedMotion()
  const [mousePosition, setMousePosition] = React.useState<MousePosition>({ x: 0, y: 0 })

  const handleMouseMove = React.useCallback(
    throttle(((event: unknown) => {
      if (respectReducedMotion && prefersReducedMotion) return

      const mouseEvent = event as MouseEvent;
      const position: MousePosition = relativeToViewport
        ? { x: mouseEvent.clientX, y: mouseEvent.clientY }
        : { x: mouseEvent.pageX, y: mouseEvent.pageY }

      setMousePosition(position)
    }) as (...args: unknown[]) => unknown, throttleMs),
    [throttleMs, respectReducedMotion, prefersReducedMotion, relativeToViewport]
  )

  React.useEffect(() => {
    if (respectReducedMotion && prefersReducedMotion) {
      setMousePosition({ x: 0, y: 0 })
      return
    }

    // Use passive listener for better performance
    document.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove, respectReducedMotion, prefersReducedMotion])

  return mousePosition
}

/**
 * Calculate parallax transform based on element position and mouse position
 * 
 * @param element The element to calculate parallax for
 * @param mousePosition Current mouse position
 * @param intensity Parallax intensity (0-1)
 * @param maxOffset Maximum offset in pixels
 * @returns Transform string for CSS
 */
export function calculateParallaxTransform(
  element: HTMLElement | null,
  mousePosition: MousePosition,
  intensity: number = 0.1,
  maxOffset: number = 50
): string {
  if (!element) return 'translate3d(0, 0, 0)'

  const rect = element.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  // Calculate offset based on mouse distance from element center
  let deltaX = (mousePosition.x - centerX) * intensity
  let deltaY = (mousePosition.y - centerY) * intensity

  // Clamp to maxOffset
  deltaX = Math.max(-maxOffset, Math.min(maxOffset, deltaX))
  deltaY = Math.max(-maxOffset, Math.min(maxOffset, deltaY))

  return `translate3d(${deltaX}px, ${deltaY}px, 0)`
}