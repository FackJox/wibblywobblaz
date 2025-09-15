/**
 * Utility functions for animations
 */

/**
 * Easing functions for smooth animations
 */
export const easingFunctions = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - (--t) * t * t * t,
  easeInOutQuart: (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  easeInElastic: (t: number) => {
    if (t === 0) return 0
    if (t === 1) return 1
    const p = 0.3
    const s = p / 4
    return -(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p))
  },
  easeOutElastic: (t: number) => {
    if (t === 0) return 0
    if (t === 1) return 1
    const p = 0.3
    const s = p / 4
    return Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1
  },
  easeInOutElastic: (t: number) => {
    if (t === 0) return 0
    if (t === 1) return 1
    const p = 0.3 * 1.5
    const s = p / 4
    if (t < 1) {
      return -0.5 * (Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p))
    }
    return Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p) * 0.5 + 1
  }
} as const

export type EasingFunction = keyof typeof easingFunctions

/**
 * Interpolate between two values using an easing function
 */
export function interpolate(
  start: number,
  end: number,
  progress: number,
  easing: EasingFunction = 'easeOutQuad'
): number {
  const easedProgress = easingFunctions[easing](Math.max(0, Math.min(1, progress)))
  return start + (end - start) * easedProgress
}

/**
 * Map a value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  clamp = true
): number {
  const mapped = ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  
  if (clamp) {
    if (outMin < outMax) {
      return Math.max(outMin, Math.min(outMax, mapped))
    } else {
      return Math.max(outMax, Math.min(outMin, mapped))
    }
  }
  
  return mapped
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Calculate parallax offset based on scroll position
 */
export function calculateParallaxOffset(
  scrollY: number,
  elementTop: number,
  elementHeight: number,
  speed: number = 0.5,
  reverse: boolean = false
): number {
  const elementCenter = elementTop + elementHeight / 2
  const viewportHeight = window.innerHeight
  const viewportCenter = scrollY + viewportHeight / 2
  
  // Calculate how far the element is from viewport center
  const distance = elementCenter - viewportCenter
  
  // Apply speed multiplier and reverse if needed
  const offset = distance * speed * (reverse ? -1 : 1)
  
  return offset
}

/**
 * Check if an element is in viewport with optional threshold
 */
export function isInViewport(
  element: Element,
  threshold: number = 0
): boolean {
  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight
  const windowWidth = window.innerWidth
  
  const verticalThreshold = windowHeight * threshold
  const horizontalThreshold = windowWidth * threshold
  
  return (
    rect.top >= -verticalThreshold &&
    rect.left >= -horizontalThreshold &&
    rect.bottom <= windowHeight + verticalThreshold &&
    rect.right <= windowWidth + horizontalThreshold
  )
}

/**
 * Calculate element visibility ratio (0-1) based on viewport intersection
 */
export function getVisibilityRatio(element: Element): number {
  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight
  
  if (rect.bottom < 0 || rect.top > windowHeight) {
    return 0
  }
  
  const visibleTop = Math.max(0, rect.top)
  const visibleBottom = Math.min(windowHeight, rect.bottom)
  const visibleHeight = visibleBottom - visibleTop
  const totalHeight = rect.height
  
  return totalHeight > 0 ? visibleHeight / totalHeight : 0
}

/**
 * Throttle function to limit execution rate
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Debounce function to delay execution until after delay
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

/**
 * Request animation frame with fallback
 */
export const requestAnimFrame = (
  callback: FrameRequestCallback
): number => {
  return (window.requestAnimationFrame ||
    (window as Window & { webkitRequestAnimationFrame?: typeof requestAnimationFrame }).webkitRequestAnimationFrame ||
    function (callback: FrameRequestCallback) {
      return window.setTimeout(callback, 1000 / 60)
    })(callback)
}

/**
 * Cancel animation frame with fallback
 */
export const cancelAnimFrame = (id: number): void => {
  return (window.cancelAnimationFrame ||
    (window as Window & { webkitCancelAnimationFrame?: typeof cancelAnimationFrame }).webkitCancelAnimationFrame ||
    function (id: number) {
      clearTimeout(id)
    })(id)
}

/**
 * Generate staggered delays for list animations
 */
export function generateStaggerDelays(
  count: number,
  baseDelay: number = 0,
  staggerDelay: number = 100
): number[] {
  return Array.from({ length: count }, (_, index) => baseDelay + (index * staggerDelay))
}

/**
 * Convert transform string to object
 */
export function parseTransform(transform: string): Record<string, string> {
  const result: Record<string, string> = {}
  const regex = /(\w+)\(([^)]+)\)/g
  let match
  
  while ((match = regex.exec(transform)) !== null) {
    result[match[1]] = match[2]
  }
  
  return result
}

/**
 * Convert transform object to string
 */
export function stringifyTransform(transforms: Record<string, string | number>): string {
  return Object.entries(transforms)
    .map(([key, value]) => `${key}(${value})`)
    .join(' ')
}

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Safe wrapper for intersection observer
 */
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }
  
  return new IntersectionObserver(callback, options)
}