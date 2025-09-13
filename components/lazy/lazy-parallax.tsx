"use client"

import * as React from "react"
import { useFeatureFlags, useAnimationInstance } from "../../hooks/use-feature-flags"
import { useIntersectionObserver } from "../../lib/performance-utils"

/**
 * Lazy-loaded wrapper for parallax animations
 * 
 * Only loads and activates parallax effects when:
 * - Feature flags allow it
 * - Element enters viewport
 * - Device capabilities support it
 */

interface LazyParallaxProps {
  children: React.ReactNode
  config?: {
    speed?: number
    direction?: 'vertical' | 'horizontal' | 'both'
    threshold?: number
    rootMargin?: string
  }
  fallback?: React.ReactNode
  className?: string
}

// Dynamic import for the actual parallax hook
const ParallaxComponent = React.lazy(() => 
  import('./parallax-component').catch(() => ({
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>
  }))
)

export function LazyParallax({ 
  children, 
  config, 
  fallback, 
  className 
}: LazyParallaxProps) {
  const { isEnabled, shouldLazyLoad, getQuality } = useFeatureFlags()
  const isActive = useAnimationInstance('scroll')
  const [isIntersecting, setIsIntersecting] = React.useState(false)
  const [shouldLoad, setShouldLoad] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Use intersection observer to detect when element enters viewport
  useIntersectionObserver(
    containerRef,
    (entries) => {
      const entry = entries[0]
      if (entry) {
        setIsIntersecting(entry.isIntersecting)
      }
    },
    {
      threshold: config?.threshold || 0.1,
      rootMargin: config?.rootMargin || '50px'
    }
  )

  // Determine when to load the parallax component
  React.useEffect(() => {
    if (!isEnabled('scroll') || !isActive) {
      setShouldLoad(false)
      return
    }

    // For lazy loading, only load when in viewport
    if (shouldLazyLoad('scroll')) {
      setShouldLoad(isIntersecting)
    } else {
      // Load immediately if not lazy loading
      setShouldLoad(true)
    }
  }, [isEnabled, shouldLazyLoad, isActive, isIntersecting])

  // Always call hooks at the top level
  const quality = getQuality('scroll')
  const adjustedConfig = React.useMemo(() => {
    const baseConfig = {
      speed: 0.5,
      direction: 'vertical' as const,
      threshold: 0.1,
      rootMargin: '50px',
      ...config
    }

    switch (quality) {
      case 'low':
        return {
          ...baseConfig,
          speed: Math.min(baseConfig.speed * 0.5, 0.3), // Reduce parallax intensity
          throttleMs: 32 // Reduce update frequency
        }
      case 'medium':
        return {
          ...baseConfig,
          throttleMs: 16
        }
      case 'high':
        return {
          ...baseConfig,
          throttleMs: 8 // Higher frequency for smooth effect
        }
      default:
        return baseConfig
    }
  }, [config, quality])

  // If animation is disabled or not active, return static content
  if (!isEnabled('scroll') || !isActive) {
    return (
      <div ref={containerRef} className={className}>
        {fallback || children}
      </div>
    )
  }

  // If lazy loading and not yet loaded, return placeholder
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
        <ParallaxComponent config={adjustedConfig}>
          {children}
        </ParallaxComponent>
      </React.Suspense>
    </div>
  )
}

// Export a hook version for more control
export function useLazyParallax(config?: LazyParallaxProps['config']) {
  const { isEnabled, shouldLazyLoad, getQuality } = useFeatureFlags()
  const isActive = useAnimationInstance('scroll')
  const [isIntersecting, setIsIntersecting] = React.useState(false)
  const [shouldLoad, setShouldLoad] = React.useState(false)

  // Hook version of the same logic
  React.useEffect(() => {
    if (!isEnabled('scroll') || !isActive) {
      setShouldLoad(false)
      return
    }

    if (shouldLazyLoad('scroll')) {
      setShouldLoad(isIntersecting)
    } else {
      setShouldLoad(true)
    }
  }, [isEnabled, shouldLazyLoad, isActive, isIntersecting])

  const quality = getQuality('scroll')
  const adjustedConfig = React.useMemo(() => {
    if (!shouldLoad) return null

    const baseConfig = {
      speed: 0.5,
      direction: 'vertical' as const,
      ...config
    }

    switch (quality) {
      case 'low':
        return { ...baseConfig, speed: baseConfig.speed * 0.5 }
      case 'medium':
        return baseConfig
      case 'high':
        return baseConfig
      default:
        return baseConfig
    }
  }, [config, quality, shouldLoad])

  return {
    shouldLoad,
    isActive: isEnabled('scroll') && isActive,
    config: adjustedConfig,
    setIsIntersecting
  }
}