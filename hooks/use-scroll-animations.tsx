"use client"

import * as React from "react"
import { usePrefersReducedMotion } from "./use-performance"
import { willChangeHelpers } from "../lib/will-change-manager"
import { 
  throttle, 
  clamp, 
  mapRange,
  createIntersectionObserver,
  getVisibilityRatio
} from "../lib/animation-utils"

/**
 * Scroll animation configuration
 */
export interface ScrollAnimationConfig {
  /** Threshold to trigger animation (0-1) */
  threshold?: number
  /** Root margin for intersection observer */
  rootMargin?: string
  /** Whether to animate only once */
  once?: boolean
  /** Animation duration in ms */
  duration?: number
  /** Animation delay in ms */
  delay?: number
  /** CSS easing function */
  easing?: string
  /** Respect reduced motion preferences */
  respectReducedMotion?: boolean
  /** Throttle scroll events (ms) */
  throttleMs?: number
}

/**
 * Fade in animation configuration
 */
export interface FadeInConfig extends ScrollAnimationConfig {
  /** Direction to fade in from */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  /** Distance to translate from (px) */
  distance?: number
  /** Starting scale */
  scale?: number
}

/**
 * Animation state
 */
export interface ScrollAnimationState {
  /** Whether element is in viewport */
  isInView: boolean
  /** Whether animation has been triggered */
  isTriggered: boolean
  /** Whether animation is currently running */
  isAnimating: boolean
  /** Whether animation is complete */
  isComplete: boolean
  /** Visibility ratio (0-1) */
  visibilityRatio: number
  /** Scroll progress through element (0-1) */
  scrollProgress: number
}

/**
 * Return type for scroll animation hooks
 */
export interface UseScrollAnimationReturn extends ScrollAnimationState {
  /** Element ref */
  ref: React.RefObject<HTMLElement>
  /** CSS styles to apply */
  styles: React.CSSProperties
  /** Manually trigger animation */
  trigger: () => void
  /** Reset animation */
  reset: () => void
}

/**
 * Hook for scroll-triggered fade in animations
 * 
 * @param config Animation configuration
 * @returns Scroll animation state and styles
 * 
 * @example
 * ```tsx
 * const fadeIn = useScrollFadeIn({
 *   direction: 'up',
 *   distance: 30,
 *   duration: 600
 * })
 * 
 * return (
 *   <div ref={fadeIn.ref} style={fadeIn.styles}>
 *     Content that fades in from bottom
 *   </div>
 * )
 * ```
 */
export function useScrollFadeIn(config: FadeInConfig = {}): UseScrollAnimationReturn {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -10% 0px",
    once = true,
    duration = 600,
    delay = 0,
    easing = "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    respectReducedMotion = true,
    throttleMs = 16,
    direction = 'up',
    distance = 20,
    scale = 0.95
  } = config

  const ref = React.useRef<HTMLElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const observerRef = React.useRef<IntersectionObserver | null>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const animationRef = React.useRef<number | null>(null)

  const [state, setState] = React.useState<ScrollAnimationState>({
    isInView: false,
    isTriggered: false,
    isAnimating: false,
    isComplete: false,
    visibilityRatio: 0,
    scrollProgress: 0
  })

  const [styles, setStyles] = React.useState<React.CSSProperties>(() => {
    if (respectReducedMotion && prefersReducedMotion) {
      return { opacity: 1, transform: 'translate3d(0, 0, 0)' }
    }

    const initialTransform = []
    
    if (direction === 'up') initialTransform.push(`translateY(${distance}px)`)
    else if (direction === 'down') initialTransform.push(`translateY(-${distance}px)`)
    else if (direction === 'left') initialTransform.push(`translateX(${distance}px)`)
    else if (direction === 'right') initialTransform.push(`translateX(-${distance}px)`)
    
    if (scale !== 1) initialTransform.push(`scale3d(${scale}, ${scale}, 1)`)
    
    // Always include translateZ for GPU acceleration
    const transform = initialTransform.length > 0 
      ? `${initialTransform.join(' ')} translateZ(0)`
      : 'translate3d(0, 0, 0)'

    return {
      opacity: 0,
      transform,
      transition: 'none',
      backfaceVisibility: 'hidden'
    }
  })

  /**
   * Calculate visibility and scroll progress
   */
  const updateProgress = React.useCallback(
    throttle(() => {
      if (!ref.current) return

      const element = ref.current
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate visibility ratio
      const visibilityRatio = getVisibilityRatio(element)

      // Calculate scroll progress through element
      const scrollProgress = clamp(
        mapRange(rect.top, windowHeight, -rect.height, 0, 1),
        0,
        1
      )

      setState(prev => ({
        ...prev,
        visibilityRatio,
        scrollProgress
      }))
    }, throttleMs),
    [throttleMs]
  )

  /**
   * Trigger animation
   */
  const trigger = React.useCallback(() => {
    if (state.isTriggered && once) return
    if (respectReducedMotion && prefersReducedMotion) return

    setState(prev => ({ ...prev, isTriggered: true }))

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, isAnimating: true }))
      
      setStyles(prev => ({
        ...prev,
        transition: `all ${duration}ms ${easing} ${delay}ms`
      }))

      // Use RAF to trigger actual animation with GPU acceleration
      animationRef.current = requestAnimationFrame(() => {
        setStyles({
          opacity: 1,
          transform: 'translate3d(0, 0, 0)',
          transition: `all ${duration}ms ${easing} ${delay}ms`,
          backfaceVisibility: 'hidden'
        })
      })

      // Mark as complete after animation
      const completeTimeout = setTimeout(() => {
        setState(prev => ({ 
          ...prev, 
          isAnimating: false, 
          isComplete: true 
        }))
      }, duration + delay)

      return () => clearTimeout(completeTimeout)
    }, 0)
  }, [state.isTriggered, once, respectReducedMotion, prefersReducedMotion, duration, delay, easing])

  /**
   * Reset animation
   */
  const reset = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    setState({
      isInView: false,
      isTriggered: false,
      isAnimating: false,
      isComplete: false,
      visibilityRatio: 0,
      scrollProgress: 0
    })

    if (respectReducedMotion && prefersReducedMotion) {
      setStyles({ opacity: 1, transform: 'translate3d(0, 0, 0)' })
      if (ref.current) {
        willChangeHelpers.cleanup(ref.current)
      }
      return
    }

    const initialTransform = []
    
    if (direction === 'up') initialTransform.push(`translateY(${distance}px)`)
    else if (direction === 'down') initialTransform.push(`translateY(-${distance}px)`)
    else if (direction === 'left') initialTransform.push(`translateX(${distance}px)`)
    else if (direction === 'right') initialTransform.push(`translateX(-${distance}px)`)
    
    if (scale !== 1) initialTransform.push(`scale3d(${scale}, ${scale}, 1)`)
    
    // Always include translateZ for GPU acceleration
    const transform = initialTransform.length > 0 
      ? `${initialTransform.join(' ')} translateZ(0)`
      : 'translate3d(0, 0, 0)'

    setStyles({
      opacity: 0,
      transform,
      transition: 'none',
      backfaceVisibility: 'hidden'
    })
    
    // Re-add will-change hints after reset
    if (ref.current) {
      willChangeHelpers.prepareComplex(ref.current)
    }
  }, [respectReducedMotion, prefersReducedMotion, direction, distance, scale])

  // Set up intersection observer with will-change management
  React.useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    
    // Prepare will-change hints for potential animation
    if (!respectReducedMotion || !prefersReducedMotion) {
      willChangeHelpers.prepareComplex(element)
    }

    observerRef.current = createIntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const wasInView = state.isInView
          const nowInView = entry.isIntersecting

          setState(prev => ({ ...prev, isInView: nowInView }))

          if (nowInView && !wasInView) {
            // Element entering viewport - trigger animation
            trigger()
          } else if (!nowInView && wasInView) {
            if (!once) {
              reset()
            } else {
              // Animation complete and won't run again - clean up
              setTimeout(() => willChangeHelpers.cleanup(element), duration + delay + 100)
            }
          }
        })
      },
      {
        threshold,
        rootMargin
      }
    )

    if (observerRef.current) {
      observerRef.current.observe(element)
    }

    // Set up scroll listener for progress tracking
    const handleScroll = updateProgress
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      window.removeEventListener('scroll', handleScroll)
      
      // Clean up will-change on unmount
      willChangeHelpers.cleanup(element)
    }
  }, [state.isInView, trigger, reset, once, threshold, rootMargin, updateProgress, duration, delay, respectReducedMotion, prefersReducedMotion])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return {
    ref,
    styles,
    trigger,
    reset,
    ...state
  }
}

/**
 * Hook for continuous scroll-based animations (like parallax)
 * 
 * @param config Scroll animation configuration
 * @returns Scroll animation state with continuous updates
 * 
 * @example
 * ```tsx
 * const scroll = useScrollProgress({
 *   throttleMs: 16
 * })
 * 
 * const parallaxOffset = scroll.scrollProgress * 50
 * 
 * return (
 *   <div 
 *     ref={scroll.ref}
 *     style={{
 *       transform: `translateY(${parallaxOffset}px)`
 *     }}
 *   >
 *     Parallax content
 *   </div>
 * )
 * ```
 */
export function useScrollProgress(config: ScrollAnimationConfig = {}): UseScrollAnimationReturn {
  const {
    threshold = 0,
    rootMargin = "0px",
    throttleMs = 16
  } = config

  const ref = React.useRef<HTMLElement>(null)
  const observerRef = React.useRef<IntersectionObserver | null>(null)

  const [state, setState] = React.useState<ScrollAnimationState>({
    isInView: false,
    isTriggered: false,
    isAnimating: false,
    isComplete: false,
    visibilityRatio: 0,
    scrollProgress: 0
  })

  /**
   * Update scroll progress continuously
   */
  const updateProgress = React.useCallback(
    throttle(() => {
      if (!ref.current) return

      const element = ref.current
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate visibility ratio
      const visibilityRatio = getVisibilityRatio(element)

      // Calculate scroll progress through element
      const scrollProgress = clamp(
        mapRange(rect.top, windowHeight, -rect.height, 0, 1),
        0,
        1
      )

      setState(prev => ({
        ...prev,
        visibilityRatio,
        scrollProgress,
        isTriggered: visibilityRatio > 0,
        isAnimating: visibilityRatio > 0 && visibilityRatio < 1,
        isComplete: visibilityRatio >= 1
      }))
    }, throttleMs),
    [throttleMs]
  )

  // Set up intersection observer and scroll listener
  React.useEffect(() => {
    if (!ref.current) return

    const element = ref.current

    observerRef.current = createIntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setState(prev => ({ ...prev, isInView: entry.isIntersecting }))
        })
      },
      {
        threshold,
        rootMargin
      }
    )

    if (observerRef.current) {
      observerRef.current.observe(element)
    }

    const handleScroll = updateProgress
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Initial calculation
    updateProgress()

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      window.removeEventListener('scroll', handleScroll)
    }
  }, [threshold, rootMargin, updateProgress])

  return {
    ref,
    styles: {},
    trigger: () => {},
    reset: () => {},
    ...state
  }
}

/**
 * Simple fade in hook with sensible defaults
 * 
 * @param direction Direction to fade in from
 * @returns Simple fade in animation
 */
export function useSimpleFadeIn(direction: FadeInConfig['direction'] = 'up') {
  return useScrollFadeIn({
    direction,
    distance: 20,
    duration: 500,
    threshold: 0.1
  })
}