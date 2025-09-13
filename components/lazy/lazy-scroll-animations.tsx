"use client"

import * as React from "react"
import { useFeatureFlags, useAnimationInstance } from "../../hooks/use-feature-flags"
import { useIntersectionObserver } from "../../lib/performance-utils"

/**
 * Lazy-loaded wrapper for complex scroll animations
 * 
 * Provides viewport-based loading and performance-aware configuration
 */

interface LazyScrollAnimationsProps {
  children: React.ReactNode
  animations: Array<{
    trigger: 'enter' | 'exit' | 'progress'
    start?: number
    end?: number
    properties: Record<string, string | number | { from: number; to: number }>
  }>
  className?: string
  fallback?: React.ReactNode
  preload?: boolean
}

// Dynamic import for scroll animations component
const ScrollAnimationsComponent = React.lazy(() => 
  import('./scroll-animations-component').catch(() => ({
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>
  }))
)

export function LazyScrollAnimations({ 
  children, 
  animations, 
  className, 
  fallback,
  preload = false
}: LazyScrollAnimationsProps) {
  const { isEnabled, shouldLazyLoad, getQuality } = useFeatureFlags()
  const isActive = useAnimationInstance('scroll')
  const [isIntersecting, setIsIntersecting] = React.useState(false)
  const [shouldLoad, setShouldLoad] = React.useState(preload)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Intersection observer for viewport detection
  useIntersectionObserver(
    containerRef,
    (entries) => {
      const entry = entries[0]
      if (entry) {
        setIsIntersecting(entry.isIntersecting)
      }
    },
    {
      threshold: 0.1,
      rootMargin: '100px' // Load a bit before entering viewport
    }
  )

  // Load decision logic
  React.useEffect(() => {
    if (!isEnabled('scroll') || !isActive) {
      setShouldLoad(false)
      return
    }

    if (preload) {
      setShouldLoad(true)
    } else if (shouldLazyLoad('scroll')) {
      setShouldLoad(isIntersecting)
    } else {
      setShouldLoad(true)
    }
  }, [isEnabled, shouldLazyLoad, isActive, isIntersecting, preload])

  // Always call hooks at the top level
  const quality = getQuality('scroll')
  const optimizedAnimations = React.useMemo(() => {
    return animations.map(animation => {
      switch (quality) {
        case 'low':
          // Simplify animations for low-end devices
          return {
            ...animation,
            properties: Object.keys(animation.properties).reduce((acc, key) => {
              // Only allow basic transform properties
              if (['translateY', 'scale', 'opacity'].includes(key)) {
                acc[key] = animation.properties[key]
              }
              return acc
            }, {} as Record<string, string | number | { from: number; to: number }>)
          }
        
        case 'medium':
          // Moderate complexity
          return {
            ...animation,
            properties: Object.keys(animation.properties).reduce((acc, key) => {
              // Allow most transform properties, limit complex ones
              if (!['filter', 'backdrop-filter'].includes(key)) {
                acc[key] = animation.properties[key]
              }
              return acc
            }, {} as Record<string, string | number | { from: number; to: number }>)
          }
        
        case 'high':
        default:
          // Full animation fidelity
          return animation
      }
    })
  }, [animations, quality])

  // If disabled, show static content
  if (!isEnabled('scroll') || !isActive) {
    return (
      <div ref={containerRef} className={className}>
        {fallback || children}
      </div>
    )
  }

  // If lazy loading but not ready, show placeholder
  if (shouldLazyLoad('scroll') && !shouldLoad) {
    return (
      <div ref={containerRef} className={className}>
        {fallback || children}
      </div>
    )
  }

  return (
    <div ref={containerRef} className={className}>
      <React.Suspense fallback={fallback || children}>
        <ScrollAnimationsComponent animations={optimizedAnimations}>
          {children}
        </ScrollAnimationsComponent>
      </React.Suspense>
    </div>
  )
}

/**
 * Hook version for manual control
 */
export function useLazyScrollAnimations(
  animations: LazyScrollAnimationsProps['animations'],
  options: { preload?: boolean } = {}
) {
  const { isEnabled, shouldLazyLoad, getQuality } = useFeatureFlags()
  const isActive = useAnimationInstance('scroll')
  const [shouldLoad, setShouldLoad] = React.useState(options.preload || false)
  const [isIntersecting, setIsIntersecting] = React.useState(false)

  React.useEffect(() => {
    if (!isEnabled('scroll') || !isActive) {
      setShouldLoad(false)
      return
    }

    if (options.preload) {
      setShouldLoad(true)
    } else if (shouldLazyLoad('scroll')) {
      setShouldLoad(isIntersecting)
    } else {
      setShouldLoad(true)
    }
  }, [isEnabled, shouldLazyLoad, isActive, isIntersecting, options.preload])

  const quality = getQuality('scroll')
  const optimizedAnimations = React.useMemo(() => {
    if (!shouldLoad) return []

    return animations.map(animation => {
      switch (quality) {
        case 'low':
          return {
            ...animation,
            properties: Object.keys(animation.properties).reduce((acc, key) => {
              if (['translateY', 'scale', 'opacity'].includes(key)) {
                acc[key] = animation.properties[key]
              }
              return acc
            }, {} as Record<string, string | number | { from: number; to: number }>)
          }
        case 'medium':
          return {
            ...animation,
            properties: Object.keys(animation.properties).reduce((acc, key) => {
              if (!['filter', 'backdrop-filter'].includes(key)) {
                acc[key] = animation.properties[key]
              }
              return acc
            }, {} as Record<string, string | number | { from: number; to: number }>)
          }
        default:
          return animation
      }
    })
  }, [animations, quality, shouldLoad])

  return {
    shouldLoad,
    isActive: isEnabled('scroll') && isActive,
    animations: optimizedAnimations,
    setIsIntersecting
  }
}

/**
 * Preset configurations for common scroll animation patterns
 */
export const scrollAnimationPresets = {
  fadeIn: [{
    trigger: 'enter' as const,
    start: 0,
    end: 100,
    properties: {
      opacity: { from: 0, to: 1 },
      translateY: { from: 50, to: 0 }
    }
  }],
  
  scaleIn: [{
    trigger: 'enter' as const,
    start: 0,
    end: 100,
    properties: {
      opacity: { from: 0, to: 1 },
      scale: { from: 0.8, to: 1 }
    }
  }],
  
  slideUp: [{
    trigger: 'enter' as const,
    start: 0,
    end: 100,
    properties: {
      translateY: { from: 100, to: 0 },
      opacity: { from: 0, to: 1 }
    }
  }],
  
  parallaxSlow: [{
    trigger: 'progress' as const,
    start: 0,
    end: 100,
    properties: {
      translateY: { from: 0, to: -50 }
    }
  }],
  
  parallaxFast: [{
    trigger: 'progress' as const,
    start: 0,
    end: 100,
    properties: {
      translateY: { from: 0, to: -100 }
    }
  }]
} as const

/**
 * Convenience component for common patterns
 */
export function LazyFadeInOnScroll({ children, ...props }: Omit<LazyScrollAnimationsProps, 'animations'>) {
  return (
    <LazyScrollAnimations 
      animations={[...scrollAnimationPresets.fadeIn]}
      {...props}
    >
      {children}
    </LazyScrollAnimations>
  )
}

export function LazySlideUpOnScroll({ children, ...props }: Omit<LazyScrollAnimationsProps, 'animations'>) {
  return (
    <LazyScrollAnimations 
      animations={[...scrollAnimationPresets.slideUp]}
      {...props}
    >
      {children}
    </LazyScrollAnimations>
  )
}