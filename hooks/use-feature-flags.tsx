"use client"

import * as React from "react"
import { 
  FeatureFlags, 
  AnimationType, 
  featureFlagManager, 
  isAnimationEnabled,
  shouldLazyLoadAnimation,
  getAnimationQuality,
  canCreateAnimationInstance
} from "../lib/feature-flags"

/**
 * React hook for feature flag management
 * 
 * Provides reactive access to animation feature flags with automatic updates
 * when flags change due to device capabilities or user preferences.
 */
export function useFeatureFlags() {
  const [flags, setFlags] = React.useState<FeatureFlags>(() => 
    featureFlagManager.getFlags()
  )

  React.useEffect(() => {
    // Subscribe to flag changes
    const unsubscribe = featureFlagManager.subscribe(setFlags)
    return unsubscribe
  }, [])

  return React.useMemo(() => ({
    flags,
    isEnabled: (type: AnimationType) => isAnimationEnabled(type),
    shouldLazyLoad: (type: AnimationType) => shouldLazyLoadAnimation(type),
    getQuality: (type: AnimationType) => getAnimationQuality(type),
    canCreateInstance: (type: AnimationType) => canCreateAnimationInstance(type),
    registerInstance: (type: AnimationType) => featureFlagManager.registerInstance(type),
    unregisterInstance: (type: AnimationType) => featureFlagManager.unregisterInstance(type),
    getInstanceCounts: () => featureFlagManager.getInstanceCounts(),
    getDebugInfo: () => featureFlagManager.getDebugInfo()
  }), [flags])
}

/**
 * Hook for animation instance management with automatic registration/cleanup
 * 
 * Automatically registers animation instance on mount and unregisters on unmount.
 * Returns whether the animation should be active based on current flags and limits.
 */
export function useAnimationInstance(type: AnimationType) {
  const { isEnabled, canCreateInstance, registerInstance, unregisterInstance } = useFeatureFlags()
  const [isActive, setIsActive] = React.useState(false)
  const registeredRef = React.useRef(false)

  React.useEffect(() => {
    if (!isEnabled(type)) {
      setIsActive(false)
      return
    }

    if (!registeredRef.current && canCreateInstance(type)) {
      const success = registerInstance(type)
      if (success) {
        registeredRef.current = true
        setIsActive(true)
      }
    }

    return () => {
      if (registeredRef.current) {
        unregisterInstance(type)
        registeredRef.current = false
      }
    }
  }, [type, isEnabled, canCreateInstance, registerInstance, unregisterInstance])

  return isActive
}

/**
 * Hook for quality-aware animation configurations
 * 
 * Returns animation parameters adjusted for the current quality level.
 * Useful for adapting animation complexity based on device performance.
 */
export function useAnimationConfig(
  type: AnimationType,
  baseConfig: {
    duration?: number
    easing?: string
    complexity?: number
    frameRate?: number
  } = {}
) {
  const { getQuality, isEnabled } = useFeatureFlags()
  
  return React.useMemo(() => {
    if (!isEnabled(type)) {
      return {
        duration: 0,
        easing: 'linear',
        complexity: 0,
        frameRate: 0,
        enabled: false
      }
    }

    const quality = getQuality(type)
    const {
      duration = 300,
      easing = 'ease-out', 
      complexity = 1,
      frameRate = 60
    } = baseConfig

    // Adjust parameters based on quality level
    switch (quality) {
      case 'low':
        return {
          duration: Math.max(duration * 1.5, 200), // Slower for less jarring effect
          easing: 'ease', // Simpler easing
          complexity: Math.max(complexity * 0.5, 0.3),
          frameRate: 30, // Reduce target framerate
          enabled: true
        }
      
      case 'medium':
        return {
          duration,
          easing,
          complexity: complexity * 0.8,
          frameRate: 45, // Balanced framerate
          enabled: true
        }
      
      case 'high':
        return {
          duration,
          easing,
          complexity,
          frameRate,
          enabled: true
        }
      
      default:
        return {
          duration,
          easing,
          complexity,
          frameRate,
          enabled: true
        }
    }
  }, [type, baseConfig, getQuality, isEnabled])
}

/**
 * Hook for progressive enhancement of animations
 * 
 * Provides a fallback system where animations gracefully degrade
 * on low-end devices or when disabled.
 */
export function useProgressiveAnimation(
  type: AnimationType,
  enhancedAnimation: () => any,
  fallbackAnimation?: () => any
) {
  const { isEnabled, getQuality } = useFeatureFlags()
  
  return React.useMemo(() => {
    if (!isEnabled(type)) {
      return fallbackAnimation?.() || null
    }

    const quality = getQuality(type)
    
    // On low quality, prefer fallback if available
    if (quality === 'low' && fallbackAnimation) {
      return fallbackAnimation()
    }

    return enhancedAnimation()
  }, [type, enhancedAnimation, fallbackAnimation, isEnabled, getQuality])
}

/**
 * Context for animation feature flags
 */
const FeatureFlagsContext = React.createContext<ReturnType<typeof useFeatureFlags> | null>(null)

/**
 * Provider component for feature flags context
 */
export function FeatureFlagsProvider({ children }: { children: React.ReactNode }) {
  const flags = useFeatureFlags()
  
  return (
    <FeatureFlagsContext.Provider value={flags}>
      {children}
    </FeatureFlagsContext.Provider>
  )
}

/**
 * Hook to consume feature flags from context
 * 
 * Provides better performance when multiple components need the same flag data
 */
export function useFeatureFlagsContext() {
  const context = React.useContext(FeatureFlagsContext)
  
  if (!context) {
    // Fallback to direct hook if not in context
    return useFeatureFlags()
  }
  
  return context
}

/**
 * HOC for conditional animation rendering based on feature flags
 */
export function withAnimationFeatureFlag<P extends object>(
  Component: React.ComponentType<P>,
  animationType: AnimationType,
  fallbackComponent?: React.ComponentType<P>
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
    const { isEnabled } = useFeatureFlagsContext()
    
    if (!isEnabled(animationType)) {
      if (fallbackComponent) {
        const FallbackComponent = fallbackComponent
        return <FallbackComponent {...(props as any)} ref={ref} />
      }
      return null
    }
    
    return <Component {...(props as any)} ref={ref} />
  })
  
  WrappedComponent.displayName = `withAnimationFeatureFlag(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

/**
 * Hook for debugging feature flags in development
 */
export function useFeatureFlagsDebug() {
  const flags = useFeatureFlags()
  
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Add to window for console debugging
      ;(window as any).animationFlags = {
        ...flags,
        manager: featureFlagManager
      }
    }
  }, [flags])

  return React.useMemo(() => {
    if (process.env.NODE_ENV !== 'development') {
      return null
    }

    return {
      logFlags: () => console.table(flags.flags),
      logDebugInfo: () => console.log('Animation Debug Info:', flags.getDebugInfo()),
      logInstanceCounts: () => console.table(flags.getInstanceCounts()),
      toggleAnimation: (type: AnimationType) => {
        const current = flags.flags[type].enabled
        featureFlagManager.updateFlags({
          [type]: { ...flags.flags[type], enabled: !current }
        } as Partial<FeatureFlags>)
      }
    }
  }, [flags])
}

// Export AnimationType for external use
export type { AnimationType }