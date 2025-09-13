"use client"

import * as React from "react"
import { usePrefersReducedMotion } from "./use-performance"
import { willChangeHelpers } from "../lib/will-change-manager"
import { animationBudget } from "../lib/animation-frame-budget"
import { 
  throttle, 
  calculateParallaxOffset, 
  createIntersectionObserver,
  clamp,
  mapRange
} from "../lib/animation-utils"

/**
 * Parallax configuration options
 */
export interface ParallaxConfig {
  /** Parallax speed multiplier (-1 to 1, where 0.5 = half speed, -0.5 = reverse half speed) */
  speed?: number
  /** Direction of parallax effect */
  direction?: 'vertical' | 'horizontal' | 'both'
  /** Whether to reverse the parallax direction */
  reverse?: boolean
  /** Threshold for intersection observer */
  threshold?: number
  /** Root margin for intersection observer */
  rootMargin?: string
  /** Throttle scroll events (ms) */
  throttleMs?: number
  /** Clamp parallax values to prevent extreme offsets */
  clamp?: boolean
  /** Maximum parallax offset in pixels */
  maxOffset?: number
  /** Whether to respect reduced motion preferences */
  respectReducedMotion?: boolean
  /** Custom transform function */
  transformFunction?: (offset: number, progress: number) => string
}

/**
 * Parallax state
 */
export interface ParallaxState {
  /** Whether element is in viewport */
  isInView: boolean
  /** Current scroll position */
  scrollY: number
  /** Element position relative to viewport */
  elementTop: number
  /** Element height */
  elementHeight: number
  /** Calculated parallax offset */
  offset: number
  /** Scroll progress through element (0-1) */
  progress: number
  /** Whether parallax is active */
  isActive: boolean
}

/**
 * Return type for parallax hooks
 */
export interface UseParallaxReturn<T extends HTMLElement = HTMLElement> extends ParallaxState {
  /** Element ref */
  ref: React.RefObject<T | null>
  /** CSS styles to apply */
  styles: React.CSSProperties
  /** CSS transform string */
  transform: string
}

/**
 * Hook for creating parallax scrolling effects
 * 
 * @param config Parallax configuration
 * @returns Parallax state and styles
 * 
 * @example
 * ```tsx
 * const parallax = useParallax({
 *   speed: 0.5,
 *   direction: 'vertical'
 * })
 * 
 * return (
 *   <div ref={parallax.ref} style={parallax.styles}>
 *     Background that scrolls at half speed
 *   </div>
 * )
 * ```
 */
export function useParallax<T extends HTMLElement = HTMLElement>(config: ParallaxConfig = {}): UseParallaxReturn<T> {
  const {
    speed = 0.5,
    direction = 'vertical',
    reverse = false,
    threshold = 0,
    rootMargin = "50px",
    throttleMs = 16,
    clamp: clampValues = true,
    maxOffset = 200,
    respectReducedMotion = true,
    transformFunction
  } = config

  const ref = React.useRef<T>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const observerRef = React.useRef<IntersectionObserver | null>(null)
  const rafRef = React.useRef<number | null>(null)

  const [state, setState] = React.useState<ParallaxState>({
    isInView: false,
    scrollY: 0,
    elementTop: 0,
    elementHeight: 0,
    offset: 0,
    progress: 0,
    isActive: false
  })

  const [transform, setTransform] = React.useState<string>('none')
  const [styles, setStyles] = React.useState<React.CSSProperties>({
    transform: 'none'
  })

  /**
   * Calculate parallax values
   */
  const updateParallax = React.useCallback(
    throttle(() => {
      if (!ref.current || !state.isInView) return
      if (respectReducedMotion && prefersReducedMotion) return

      const element = ref.current
      const rect = element.getBoundingClientRect()
      const scrollY = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight

      const elementTop = rect.top + scrollY
      const elementHeight = rect.height

      // Calculate scroll progress through the element
      const progress = clamp(
        mapRange(rect.top, windowHeight, -elementHeight, 0, 1),
        0,
        1
      )

      // Calculate parallax offset
      let offset = calculateParallaxOffset(
        scrollY,
        elementTop,
        elementHeight,
        speed,
        reverse
      )

      // Apply clamping if enabled
      if (clampValues) {
        offset = clamp(offset, -maxOffset, maxOffset)
      }

      // Generate transform string using translate3d for GPU acceleration
      let newTransform = 'translate3d(0, 0, 0)'
      
      if (transformFunction) {
        newTransform = transformFunction(offset, progress)
      } else {
        const transforms = []
        
        if (direction === 'vertical' || direction === 'both') {
          transforms.push(`translateY(${offset}px)`)
        }
        
        if (direction === 'horizontal' || direction === 'both') {
          transforms.push(`translateX(${offset}px)`)
        }
        
        if (transforms.length > 0) {
          // Use translate3d for better performance
          if (direction === 'vertical') {
            newTransform = `translate3d(0, ${offset}px, 0)`
          } else if (direction === 'horizontal') {
            newTransform = `translate3d(${offset}px, 0, 0)`
          } else if (direction === 'both') {
            newTransform = `translate3d(${offset}px, ${offset}px, 0)`
          }
        }
      }

      setState(prev => ({
        ...prev,
        scrollY,
        elementTop,
        elementHeight,
        offset,
        progress,
        isActive: Math.abs(offset) > 0.1
      }))

      setTransform(newTransform)
      setStyles({ 
        transform: newTransform,
        backfaceVisibility: 'hidden' // Prevent flickering
      })
    }, throttleMs),
    [
      state.isInView,
      respectReducedMotion,
      prefersReducedMotion,
      speed,
      reverse,
      direction,
      clampValues,
      maxOffset,
      transformFunction,
      throttleMs
    ]
  )

  /**
   * Handle scroll events with frame budgeting
   */
  const handleScroll = React.useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }
    
    // Use animation budget system for scroll-triggered parallax
    const taskId = `parallax-${Math.random().toString(36).substr(2, 9)}`
    animationBudget.schedule(taskId, updateParallax, 'low', 3) // Low priority, ~3ms estimated
  }, [updateParallax])

  // Set up intersection observer and will-change management
  React.useEffect(() => {
    if (!ref.current) return

    const element = ref.current

    observerRef.current = createIntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const wasInView = state.isInView
          const nowInView = entry.isIntersecting
          
          setState(prev => ({
            ...prev,
            isInView: nowInView
          }))
          
          // Manage will-change hints based on visibility
          if (nowInView && !wasInView) {
            // Element entering viewport - add will-change hints
            willChangeHelpers.prepareParallax(element)
          } else if (!nowInView && wasInView) {
            // Element leaving viewport - clean up will-change hints
            willChangeHelpers.cleanup(element)
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
      // Clean up will-change on unmount
      willChangeHelpers.cleanup(element)
    }
  }, [threshold, rootMargin])

  // Set up scroll listener with performance optimizations
  React.useEffect(() => {
    if (respectReducedMotion && prefersReducedMotion) {
      setTransform('translate3d(0, 0, 0)')
      setStyles({ transform: 'translate3d(0, 0, 0)' })
      // Clean up will-change for reduced motion
      if (ref.current) {
        willChangeHelpers.cleanup(ref.current)
      }
      return
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateParallax, { passive: true })
    
    // Initial calculation
    updateParallax()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateParallax)
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      
      // Clean up will-change hints on unmount
      if (ref.current) {
        willChangeHelpers.cleanup(ref.current)
      }
    }
  }, [handleScroll, updateParallax, respectReducedMotion, prefersReducedMotion])

  return {
    ref,
    styles,
    transform,
    ...state
  }
}

/**
 * Hook for background parallax effects
 * 
 * @param speed Parallax speed (0-1)
 * @returns Background parallax effect
 * 
 * @example
 * ```tsx
 * const bgParallax = useBackgroundParallax(0.3)
 * 
 * return (
 *   <div className="relative overflow-hidden">
 *     <div 
 *       ref={bgParallax.ref}
 *       className="absolute inset-0 bg-cover bg-center"
 *       style={{
 *         backgroundImage: 'url("/bg.jpg")',
 *         ...bgParallax.styles
 *       }}
 *     />
 *     <div className="relative z-10">
 *       Content
 *     </div>
 *   </div>
 * )
 * ```
 */
export function useBackgroundParallax<T extends HTMLElement = HTMLElement>(speed: number = 0.5) {
  return useParallax({
    speed,
    direction: 'vertical',
    clamp: true,
    maxOffset: 100
  })
}

/**
 * Hook for element parallax with custom transform
 * 
 * @param transformFn Custom transform function
 * @param config Additional parallax config
 * @returns Element parallax with custom transform
 * 
 * @example
 * ```tsx
 * const customParallax = useElementParallax(
 *   (offset, progress) => 
 *     `translateY(${offset * 0.5}px) scale(${1 + progress * 0.1}) rotate(${offset * 0.2}deg)`,
 *   { speed: 0.3 }
 * )
 * 
 * return (
 *   <div ref={customParallax.ref} style={customParallax.styles}>
 *     Custom animated element
 *   </div>
 * )
 * ```
 */
export function useElementParallax<T extends HTMLElement = HTMLElement>(
  transformFn: (offset: number, progress: number) => string,
  config: Omit<ParallaxConfig, 'transformFunction'> = {}
) {
  return useParallax({
    ...config,
    transformFunction: transformFn
  })
}

/**
 * Hook for mouse parallax effect (follows mouse movement)
 * 
 * @param intensity Intensity of mouse following (0-1)
 * @param config Additional parallax config
 * @returns Mouse-following parallax effect
 */
export function useMouseParallax<T extends HTMLElement = HTMLElement>(
  intensity: number = 0.1,
  config: Omit<ParallaxConfig, 'transformFunction' | 'direction'> = {}
): UseParallaxReturn<T> {
  const {
    respectReducedMotion = true,
    throttleMs = 16,
    clamp: clampValues = true,
    maxOffset = 50
  } = config

  const ref = React.useRef<T>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })
  const [state, setState] = React.useState<ParallaxState>({
    isInView: false,
    scrollY: 0,
    elementTop: 0,
    elementHeight: 0,
    offset: 0,
    progress: 0,
    isActive: false
  })

  const [styles, setStyles] = React.useState<React.CSSProperties>({
    transform: 'none'
  })

  const handleMouseMove = React.useCallback(
    throttle((event: MouseEvent) => {
      if (!ref.current || (respectReducedMotion && prefersReducedMotion)) return

      const element = ref.current
      const rect = element.getBoundingClientRect()
      
      // Calculate mouse position relative to element center
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = (event.clientX - centerX) * intensity
      const deltaY = (event.clientY - centerY) * intensity

      // Apply clamping if enabled
      const clampedX = clampValues ? clamp(deltaX, -maxOffset, maxOffset) : deltaX
      const clampedY = clampValues ? clamp(deltaY, -maxOffset, maxOffset) : deltaY

      const transform = `translate3d(${clampedX}px, ${clampedY}px, 0)`
      
      setMousePosition({ x: clampedX, y: clampedY })
      setStyles({ transform })
      
      setState(prev => ({
        ...prev,
        offset: Math.sqrt(clampedX * clampedX + clampedY * clampedY),
        isActive: Math.abs(clampedX) > 0.1 || Math.abs(clampedY) > 0.1
      }))
    }, throttleMs),
    [intensity, respectReducedMotion, prefersReducedMotion, clampValues, maxOffset, throttleMs]
  )

  // Set up mouse move listener
  React.useEffect(() => {
    if (respectReducedMotion && prefersReducedMotion) {
      setStyles({ transform: 'none' })
      return
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove, respectReducedMotion, prefersReducedMotion])

  return {
    ref,
    styles,
    transform: styles.transform as string || 'none',
    ...state
  }
}

/**
 * Simple parallax hook with sensible defaults
 * 
 * @param speed Parallax speed (0-1)
 * @returns Simple vertical parallax
 */
export function useSimpleParallax<T extends HTMLElement = HTMLElement>(speed: number = 0.5) {
  return useParallax({
    speed,
    direction: 'vertical',
    throttleMs: 16
  })
}