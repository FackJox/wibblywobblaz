"use client"

import * as React from "react"
import { useFeatureFlags, useAnimationInstance, AnimationType } from "../../hooks/use-feature-flags"
import { useIntersectionObserver } from "../../lib/performance-utils"

/**
 * General-purpose lazy animation wrapper
 * 
 * A flexible wrapper that can lazy-load any animation component
 * based on feature flags and viewport intersection.
 */

interface LazyAnimationWrapperProps {
  children: React.ReactNode
  animationType: AnimationType
  lazyComponent: React.LazyExoticComponent<React.ComponentType<any>>
  componentProps?: Record<string, any>
  fallback?: React.ReactNode
  className?: string
  preload?: boolean
  intersectionOptions?: {
    threshold?: number
    rootMargin?: string
  }
}

export function LazyAnimationWrapper({
  children,
  animationType,
  lazyComponent: LazyComponent,
  componentProps = {},
  fallback,
  className,
  preload = false,
  intersectionOptions = {}
}: LazyAnimationWrapperProps) {
  const { isEnabled, shouldLazyLoad } = useFeatureFlags()
  const isActive = useAnimationInstance(animationType)
  const [isIntersecting, setIsIntersecting] = React.useState(false)
  const [shouldLoad, setShouldLoad] = React.useState(preload)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Intersection observer setup
  useIntersectionObserver(
    containerRef,
    (entries) => {
      const entry = entries[0]
      if (entry) {
        setIsIntersecting(entry.isIntersecting)
      }
    },
    {
      threshold: intersectionOptions.threshold || 0.1,
      rootMargin: intersectionOptions.rootMargin || '50px'
    }
  )

  // Loading decision logic
  React.useEffect(() => {
    if (!isEnabled(animationType) || !isActive) {
      setShouldLoad(false)
      return
    }

    if (preload) {
      setShouldLoad(true)
    } else if (shouldLazyLoad(animationType)) {
      setShouldLoad(isIntersecting)
    } else {
      setShouldLoad(true)
    }
  }, [isEnabled, shouldLazyLoad, isActive, isIntersecting, preload, animationType])

  // Fallback content
  const staticContent = fallback || children

  // If animation disabled or not active, show static content
  if (!isEnabled(animationType) || !isActive) {
    return (
      <div ref={containerRef} className={className}>
        {staticContent}
      </div>
    )
  }

  // If lazy loading and not ready, show static content
  if (shouldLazyLoad(animationType) && !shouldLoad) {
    return (
      <div ref={containerRef} className={className}>
        {staticContent}
      </div>
    )
  }

  // Load the animation component
  return (
    <div ref={containerRef} className={className}>
      <React.Suspense fallback={staticContent}>
        <LazyComponent {...componentProps}>
          {children}
        </LazyComponent>
      </React.Suspense>
    </div>
  )
}

/**
 * Hook version for manual control
 */
export function useLazyAnimation(
  animationType: AnimationType,
  options: {
    preload?: boolean
    intersectionThreshold?: number
    rootMargin?: string
  } = {}
) {
  const { isEnabled, shouldLazyLoad, getQuality } = useFeatureFlags()
  const isActive = useAnimationInstance(animationType)
  const [shouldLoad, setShouldLoad] = React.useState(options.preload || false)
  const [isIntersecting, setIsIntersecting] = React.useState(false)

  React.useEffect(() => {
    if (!isEnabled(animationType) || !isActive) {
      setShouldLoad(false)
      return
    }

    if (options.preload) {
      setShouldLoad(true)
    } else if (shouldLazyLoad(animationType)) {
      setShouldLoad(isIntersecting)
    } else {
      setShouldLoad(true)
    }
  }, [isEnabled, shouldLazyLoad, isActive, isIntersecting, options.preload, animationType])

  const quality = getQuality(animationType)

  return {
    shouldLoad,
    isActive: isEnabled(animationType) && isActive,
    quality,
    setIsIntersecting,
    intersectionObserverOptions: {
      threshold: options.intersectionThreshold || 0.1,
      rootMargin: options.rootMargin || '50px'
    }
  }
}

/**
 * Higher-order component for creating lazy animated components
 */
export function withLazyAnimation<P extends object>(
  Component: React.ComponentType<P>,
  animationType: AnimationType,
  defaultProps?: Partial<P>
) {
  const LazyAnimatedComponent = React.lazy(() => 
    Promise.resolve({ default: Component })
  )

  const WrappedComponent = React.forwardRef<any, P & {
    lazy?: boolean
    lazyOptions?: {
      preload?: boolean
      intersectionThreshold?: number
      rootMargin?: string
    }
    fallback?: React.ReactNode
  }>((props, ref) => {
    const { lazy = true, lazyOptions = {}, fallback, ...componentProps } = props

    if (!lazy) {
      return <Component {...(componentProps as P)} ref={ref} />
    }

    return (
      <LazyAnimationWrapper
        animationType={animationType}
        lazyComponent={LazyAnimatedComponent}
        componentProps={{ ...defaultProps, ...componentProps, ref }}
        fallback={fallback}
        preload={lazyOptions.preload}
        intersectionOptions={{
          threshold: lazyOptions.intersectionThreshold,
          rootMargin: lazyOptions.rootMargin
        }}
      >
        {null}
      </LazyAnimationWrapper>
    )
  })

  WrappedComponent.displayName = `withLazyAnimation(${Component.displayName || Component.name})`

  return WrappedComponent
}

/**
 * Utility for creating animation component factories
 */
export function createLazyAnimationFactory(
  animationType: AnimationType,
  defaultIntersectionOptions?: {
    threshold?: number
    rootMargin?: string
  }
) {
  return function createLazyAnimation<P extends object>(
    lazyComponent: React.LazyExoticComponent<React.ComponentType<P>>,
    defaultProps?: Partial<P>
  ) {
    return React.forwardRef<any, P & {
      children?: React.ReactNode
      fallback?: React.ReactNode
      preload?: boolean
      className?: string
    }>((props, ref) => {
      const { children, fallback, preload, className, ...componentProps } = props

      return (
        <LazyAnimationWrapper
          animationType={animationType}
          lazyComponent={lazyComponent}
          componentProps={{ ...defaultProps, ...componentProps, ref }}
          fallback={fallback}
          preload={preload}
          className={className}
          intersectionOptions={defaultIntersectionOptions}
        >
          {children}
        </LazyAnimationWrapper>
      )
    })
  }
}

/**
 * Pre-configured factories for different animation types
 */
export const createLazyMicroAnimation = createLazyAnimationFactory('micro', { threshold: 0 })
export const createLazyHoverAnimation = createLazyAnimationFactory('hover', { threshold: 0 })
export const createLazyTransitionAnimation = createLazyAnimationFactory('transition', { threshold: 0.1 })
export const createLazyScrollAnimation = createLazyAnimationFactory('scroll', { threshold: 0.1, rootMargin: '100px' })
export const createLazyComplexAnimation = createLazyAnimationFactory('complex', { threshold: 0.3, rootMargin: '50px' })