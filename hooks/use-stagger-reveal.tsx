"use client"

import * as React from "react"
import { usePrefersReducedMotion } from "./use-performance"
import { generateStaggerDelays, createIntersectionObserver } from "../lib/animation-utils"

/**
 * Configuration for stagger reveal animations
 */
export interface StaggerRevealConfig {
  /** Base delay before starting animations (ms) */
  baseDelay?: number
  /** Delay between each item animation (ms) */
  staggerDelay?: number
  /** Duration of each item's animation (ms) */
  duration?: number
  /** Intersection threshold to trigger animation */
  threshold?: number
  /** Root margin for intersection observer */
  rootMargin?: string
  /** Whether to animate only once or every time elements come into view */
  once?: boolean
  /** Custom easing function */
  easing?: string
  /** Disable animation on reduced motion preference */
  respectReducedMotion?: boolean
}

/**
 * Animation state for each item
 */
export interface StaggerItem {
  /** Whether this item should be animated */
  shouldAnimate: boolean
  /** Delay before this item starts animating */
  delay: number
  /** Whether this item is currently animating */
  isAnimating: boolean
  /** Whether this item has finished animating */
  isComplete: boolean
  /** CSS transform values */
  transform: string
  /** CSS opacity value */
  opacity: number
  /** CSS transition values */
  transition: string
}

/**
 * Return type for useStaggerReveal hook
 */
export interface UseStaggerRevealReturn {
  /** Container ref to attach to parent element */
  containerRef: React.RefObject<HTMLElement>
  /** Array of animation states for each item */
  items: StaggerItem[]
  /** Whether the animation has been triggered */
  isTriggered: boolean
  /** Manually trigger the animation */
  trigger: () => void
  /** Reset the animation */
  reset: () => void
  /** Whether the container is in viewport */
  isInView: boolean
}

/**
 * Hook for creating staggered reveal animations for lists
 * 
 * @param itemCount Number of items to animate
 * @param config Configuration options
 * @returns Stagger reveal state and controls
 * 
 * @example
 * ```tsx
 * const stagger = useStaggerReveal(4, {
 *   staggerDelay: 150,
 *   duration: 600
 * })
 * 
 * return (
 *   <div ref={stagger.containerRef}>
 *     {items.map((item, index) => (
 *       <div
 *         key={item.id}
 *         style={{
 *           opacity: stagger.items[index]?.opacity ?? 0,
 *           transform: stagger.items[index]?.transform ?? 'translateY(20px)',
 *           transition: stagger.items[index]?.transition ?? 'none'
 *         }}
 *       >
 *         {item.content}
 *       </div>
 *     ))}
 *   </div>
 * )
 * ```
 */
export function useStaggerReveal(
  itemCount: number,
  config: StaggerRevealConfig = {}
): UseStaggerRevealReturn {
  const {
    baseDelay = 0,
    staggerDelay = 100,
    duration = 600,
    threshold = 0.1,
    rootMargin = "0px 0px -10% 0px",
    once = true,
    easing = "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    respectReducedMotion = true
  } = config

  const containerRef = React.useRef<HTMLElement>(null)
  const [isInView, setIsInView] = React.useState(false)
  const [isTriggered, setIsTriggered] = React.useState(false)
  const [hasAnimated, setHasAnimated] = React.useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  
  const observerRef = React.useRef<IntersectionObserver | null>(null)
  const timeoutRefs = React.useRef<NodeJS.Timeout[]>([])
  const animationRefs = React.useRef<number[]>([])

  // Generate delays for each item
  const delays = React.useMemo(() => 
    generateStaggerDelays(itemCount, baseDelay, staggerDelay),
    [itemCount, baseDelay, staggerDelay]
  )

  // Initialize items state
  const [items, setItems] = React.useState<StaggerItem[]>(() =>
    Array.from({ length: itemCount }, (_, index) => ({
      shouldAnimate: false,
      delay: delays[index] || 0,
      isAnimating: false,
      isComplete: false,
      transform: respectReducedMotion && prefersReducedMotion ? 'none' : 'translateY(20px) scale(0.95)',
      opacity: respectReducedMotion && prefersReducedMotion ? 1 : 0,
      transition: 'none'
    }))
  )

  /**
   * Start animation for a specific item
   */
  const animateItem = React.useCallback((index: number, delay: number) => {
    if (respectReducedMotion && prefersReducedMotion) {
      // Skip animation for reduced motion
      setItems(prev => prev.map((item, i) => 
        i === index ? {
          ...item,
          shouldAnimate: true,
          isAnimating: false,
          isComplete: true,
          transform: 'none',
          opacity: 1,
          transition: 'none'
        } : item
      ))
      return
    }

    const timeoutId = setTimeout(() => {
      // Start animation
      setItems(prev => prev.map((item, i) => 
        i === index ? {
          ...item,
          shouldAnimate: true,
          isAnimating: true,
          transform: 'translateY(20px) scale(0.95)',
          opacity: 0,
          transition: `all ${duration}ms ${easing}`
        } : item
      ))

      // Trigger actual animation with RAF
      const animationId = requestAnimationFrame(() => {
        setItems(prev => prev.map((item, i) => 
          i === index && item.isAnimating ? {
            ...item,
            transform: 'translateY(0) scale(1)',
            opacity: 1
          } : item
        ))
      })

      animationRefs.current[index] = animationId

      // Mark as complete after duration
      const completeTimeoutId = setTimeout(() => {
        setItems(prev => prev.map((item, i) => 
          i === index ? {
            ...item,
            isAnimating: false,
            isComplete: true
          } : item
        ))
      }, duration)

      timeoutRefs.current[index + itemCount] = completeTimeoutId
    }, delay)

    timeoutRefs.current[index] = timeoutId
  }, [duration, easing, prefersReducedMotion, respectReducedMotion, itemCount])

  /**
   * Trigger all animations
   */
  const trigger = React.useCallback(() => {
    if (isTriggered && once) return
    if (hasAnimated && once) return

    setIsTriggered(true)
    setHasAnimated(true)

    // Start animations for all items with their respective delays
    delays.forEach((delay, index) => {
      animateItem(index, delay)
    })
  }, [isTriggered, hasAnimated, once, delays, animateItem])

  /**
   * Reset animations
   */
  const reset = React.useCallback(() => {
    // Clear all timeouts and animation frames
    timeoutRefs.current.forEach(id => {
      if (id) clearTimeout(id)
    })
    animationRefs.current.forEach(id => {
      if (id) cancelAnimationFrame(id)
    })
    timeoutRefs.current = []
    animationRefs.current = []

    setIsTriggered(false)
    setHasAnimated(false)

    // Reset items state
    setItems(Array.from({ length: itemCount }, (_, index) => ({
      shouldAnimate: false,
      delay: delays[index] || 0,
      isAnimating: false,
      isComplete: false,
      transform: respectReducedMotion && prefersReducedMotion ? 'none' : 'translateY(20px) scale(0.95)',
      opacity: respectReducedMotion && prefersReducedMotion ? 1 : 0,
      transition: 'none'
    })))
  }, [itemCount, delays, prefersReducedMotion, respectReducedMotion])

  // Set up intersection observer
  React.useEffect(() => {
    if (!containerRef.current) return

    const element = containerRef.current

    observerRef.current = createIntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const wasInView = isInView
          const nowInView = entry.isIntersecting

          setIsInView(nowInView)

          if (nowInView && !wasInView) {
            // Element entered viewport
            trigger()
          } else if (!nowInView && once && hasAnimated) {
            // Element left viewport but already animated once
            return
          } else if (!nowInView && !once) {
            // Element left viewport and we should reset for next time
            reset()
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

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [threshold, rootMargin, isInView, trigger, reset, once, hasAnimated])

  // Update items when itemCount changes
  React.useEffect(() => {
    const newDelays = generateStaggerDelays(itemCount, baseDelay, staggerDelay)
    
    setItems(Array.from({ length: itemCount }, (_, index) => ({
      shouldAnimate: false,
      delay: newDelays[index] || 0,
      isAnimating: false,
      isComplete: false,
      transform: respectReducedMotion && prefersReducedMotion ? 'none' : 'translateY(20px) scale(0.95)',
      opacity: respectReducedMotion && prefersReducedMotion ? 1 : 0,
      transition: 'none'
    })))
  }, [itemCount, baseDelay, staggerDelay, prefersReducedMotion, respectReducedMotion])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(id => {
        if (id) clearTimeout(id)
      })
      animationRefs.current.forEach(id => {
        if (id) cancelAnimationFrame(id)
      })
    }
  }, [])

  return {
    containerRef,
    items,
    isTriggered,
    trigger,
    reset,
    isInView
  }
}

/**
 * Simplified hook for basic stagger reveal
 * 
 * @param itemCount Number of items to animate
 * @param staggerDelay Delay between each item (ms)
 * @returns Basic stagger reveal functionality
 * 
 * @example
 * ```tsx
 * const stagger = useSimpleStaggerReveal(socialLinks.length, 100)
 * 
 * return (
 *   <div ref={stagger.containerRef}>
 *     {socialLinks.map((link, index) => (
 *       <div
 *         key={link.id}
 *         className="transition-all duration-500"
 *         style={{
 *           opacity: stagger.items[index]?.opacity ?? 0,
 *           transform: stagger.items[index]?.transform ?? 'translateY(20px)'
 *         }}
 *       >
 *         {link.content}
 *       </div>
 *     ))}
 *   </div>
 * )
 * ```
 */
export function useSimpleStaggerReveal(itemCount: number, staggerDelay: number = 100) {
  return useStaggerReveal(itemCount, {
    staggerDelay,
    duration: 500,
    threshold: 0.1
  })
}