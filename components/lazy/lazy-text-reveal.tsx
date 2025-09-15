"use client"

import * as React from "react"
import { useFeatureFlags, useAnimationInstance } from "../../hooks/use-feature-flags"
import { useIntersectionObserver } from "../../lib/performance-utils"

/**
 * Lazy-loaded wrapper for text reveal animations
 * 
 * Provides performance-aware text animations with character-by-character reveals
 */

interface LazyTextRevealProps {
  children: string
  animation?: 'typewriter' | 'fadeIn' | 'slideUp' | 'wave'
  duration?: number
  delay?: number
  className?: string
  fallback?: React.ReactNode
  preload?: boolean
}

// Dynamic import for text reveal component  
const TextRevealComponent = React.lazy(() =>
  import('./text-reveal-component').then(module => ({ default: module.default })).catch(() => ({
    default: ({ text, className }: { text: string; className?: string }) => <span className={className}>{text}</span>
  }))
)

export function LazyTextReveal({
  children,
  animation = 'fadeIn',
  duration = 1000,
  delay = 0,
  className,
  fallback,
  preload = false
}: LazyTextRevealProps) {
  const { isEnabled, shouldLazyLoad, getQuality } = useFeatureFlags()
  const isActive = useAnimationInstance('complex')
  const [isIntersecting, setIsIntersecting] = React.useState(false)
  const [shouldLoad, setShouldLoad] = React.useState(preload)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Intersection observer with appropriate thresholds
  useIntersectionObserver(
    containerRef,
    (entries) => {
      const entry = entries[0]
      if (entry) {
        setIsIntersecting(entry.isIntersecting)
      }
    },
    {
      threshold: 0.3, // Higher threshold for text animations
      rootMargin: '50px'
    }
  )

  // Loading decision
  React.useEffect(() => {
    if (!isEnabled('complex') || !isActive) {
      setShouldLoad(false)
      return
    }

    if (preload) {
      setShouldLoad(true)
    } else if (shouldLazyLoad('complex')) {
      setShouldLoad(isIntersecting)
    } else {
      setShouldLoad(true)
    }
  }, [isEnabled, shouldLazyLoad, isActive, isIntersecting, preload])

  // Quality-based animation adjustments
  const quality = getQuality('complex')
  const adjustedConfig = React.useMemo(() => {
    switch (quality) {
      case 'low':
        return {
          animation: 'fadeIn' as const, // Simplest animation
          duration: Math.max(duration * 0.5, 300), // Faster
          characterDelay: 100, // Less granular
          useSimpleChars: true
        }
      
      case 'medium':
        return {
          animation: animation === 'wave' ? 'slideUp' : animation, // Avoid complex wave
          duration,
          characterDelay: 50,
          useSimpleChars: false
        }
      
      case 'high':
        return {
          animation,
          duration,
          characterDelay: 30, // More granular timing
          useSimpleChars: false
        }
      
      default:
        return {
          animation,
          duration,
          characterDelay: 50,
          useSimpleChars: false
        }
    }
  }, [animation, duration, quality])

  // Fallback display
  const staticContent = fallback || (
    <span className={className}>{children}</span>
  )

  // If animation disabled or not active, show static text
  if (!isEnabled('complex') || !isActive) {
    return <div ref={containerRef}>{staticContent}</div>
  }

  // If lazy loading and not ready, show static content
  if (shouldLazyLoad('complex') && !shouldLoad) {
    return <div ref={containerRef}>{staticContent}</div>
  }

  return (
    <div ref={containerRef}>
      <React.Suspense fallback={staticContent}>
        <TextRevealComponent
          text={children}
          config={adjustedConfig}
          delay={delay}
          className={className}
        />
      </React.Suspense>
    </div>
  )
}

/**
 * Hook version for more control
 */
export function useLazyTextReveal(
  text: string,
  config: {
    animation?: LazyTextRevealProps['animation']
    duration?: number
    delay?: number
    preload?: boolean
  } = {}
) {
  const { isEnabled, shouldLazyLoad, getQuality } = useFeatureFlags()
  const isActive = useAnimationInstance('complex')
  const [shouldLoad, setShouldLoad] = React.useState(config.preload || false)
  const [isIntersecting, setIsIntersecting] = React.useState(false)

  React.useEffect(() => {
    if (!isEnabled('complex') || !isActive) {
      setShouldLoad(false)
      return
    }

    if (config.preload) {
      setShouldLoad(true)
    } else if (shouldLazyLoad('complex')) {
      setShouldLoad(isIntersecting)
    } else {
      setShouldLoad(true)
    }
  }, [isEnabled, shouldLazyLoad, isActive, isIntersecting, config.preload])

  const quality = getQuality('complex')
  const adjustedConfig = React.useMemo(() => {
    if (!shouldLoad) return null

    switch (quality) {
      case 'low':
        return {
          animation: 'fadeIn' as const,
          duration: Math.max(config.duration || 1000 * 0.5, 300),
          characterDelay: 100,
          useSimpleChars: true
        }
      case 'medium':
        return {
          animation: config.animation === 'wave' ? 'slideUp' : (config.animation || 'fadeIn'),
          duration: config.duration || 1000,
          characterDelay: 50,
          useSimpleChars: false
        }
      default:
        return {
          animation: config.animation || 'fadeIn',
          duration: config.duration || 1000,
          characterDelay: 30,
          useSimpleChars: false
        }
    }
  }, [config, quality, shouldLoad])

  return {
    shouldLoad,
    isActive: isEnabled('complex') && isActive,
    config: adjustedConfig,
    setIsIntersecting
  }
}

/**
 * Convenience components for common text reveal patterns
 */
export function LazyTypewriterText({ children, ...props }: Omit<LazyTextRevealProps, 'animation'>) {
  return <LazyTextReveal animation="typewriter" {...props}>{children}</LazyTextReveal>
}

export function LazyWaveText({ children, ...props }: Omit<LazyTextRevealProps, 'animation'>) {
  return <LazyTextReveal animation="wave" {...props}>{children}</LazyTextReveal>
}

export function LazySlideUpText({ children, ...props }: Omit<LazyTextRevealProps, 'animation'>) {
  return <LazyTextReveal animation="slideUp" {...props}>{children}</LazyTextReveal>
}

/**
 * Batch text reveal for multiple text elements
 */
export function LazyTextRevealGroup({
  texts,
  stagger = 200,
  ...sharedProps
}: {
  texts: string[]
  stagger?: number
} & Omit<LazyTextRevealProps, 'children' | 'delay'>) {
  return (
    <>
      {texts.map((text, index) => (
        <LazyTextReveal
          key={`${text}-${index}`}
          delay={index * stagger}
          {...sharedProps}
        >
          {text}
        </LazyTextReveal>
      ))}
    </>
  )
}