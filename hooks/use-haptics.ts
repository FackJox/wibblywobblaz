"use client"

import { useCallback, useEffect, useState } from 'react'
import { 
  triggerHaptic, 
  stopHaptic, 
  HapticConfig, 
  DEFAULT_HAPTIC_CONFIG,
  isVibrationSupported,
  shouldDisableHaptics,
  hasReducedMotionPreference,
  hapticFallbacks
} from '@/lib/haptics'

export interface UseHapticsOptions extends Partial<HapticConfig> {
  /** Whether to store preferences in localStorage */
  persistPreferences?: boolean
  /** localStorage key for preferences */
  storageKey?: string
}

export interface HapticPreferences {
  enabled: boolean
  intensity: number
  fallback: 'none' | 'audio' | 'visual'
}

export interface UseHapticsReturn {
  /** Current haptic configuration */
  config: HapticConfig
  /** Whether haptics are supported on this device */
  isSupported: boolean
  /** Whether haptics are currently disabled due to system settings */
  isDisabled: boolean
  /** User's current preferences */
  preferences: HapticPreferences
  /** Trigger a haptic pattern */
  haptic: (pattern: number[] | string) => boolean
  /** Stop current haptic feedback */
  stop: () => boolean
  /** Update user preferences */
  updatePreferences: (preferences: Partial<HapticPreferences>) => void
  /** Reset preferences to defaults */
  resetPreferences: () => void
  /** Enable/disable haptics quickly */
  setEnabled: (enabled: boolean) => void
  /** Set intensity level */
  setIntensity: (intensity: number) => void
}

const STORAGE_KEY_DEFAULT = 'wibbly-haptic-preferences'

/**
 * Hook for managing haptic feedback with user preferences and device capabilities
 */
export function useHaptics(options: UseHapticsOptions = {}): UseHapticsReturn {
  const {
    persistPreferences = true,
    storageKey = STORAGE_KEY_DEFAULT,
    ...configOverrides
  } = options

  // Load preferences from localStorage
  const loadPreferences = useCallback((): HapticPreferences => {
    if (!persistPreferences || typeof window === 'undefined') {
      return {
        enabled: DEFAULT_HAPTIC_CONFIG.enabled,
        intensity: DEFAULT_HAPTIC_CONFIG.intensity,
        fallback: DEFAULT_HAPTIC_CONFIG.fallback
      }
    }

    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          enabled: parsed.enabled ?? DEFAULT_HAPTIC_CONFIG.enabled,
          intensity: parsed.intensity ?? DEFAULT_HAPTIC_CONFIG.intensity,
          fallback: parsed.fallback ?? DEFAULT_HAPTIC_CONFIG.fallback
        }
      }
    } catch (error) {
      console.warn('Failed to load haptic preferences:', error)
    }

    return {
      enabled: DEFAULT_HAPTIC_CONFIG.enabled,
      intensity: DEFAULT_HAPTIC_CONFIG.intensity,
      fallback: DEFAULT_HAPTIC_CONFIG.fallback
    }
  }, [persistPreferences, storageKey])

  // Save preferences to localStorage
  const savePreferences = useCallback((preferences: HapticPreferences) => {
    if (!persistPreferences || typeof window === 'undefined') return

    try {
      localStorage.setItem(storageKey, JSON.stringify(preferences))
    } catch (error) {
      console.warn('Failed to save haptic preferences:', error)
    }
  }, [persistPreferences, storageKey])

  const [preferences, setPreferences] = useState<HapticPreferences>(loadPreferences)
  const [isSupported] = useState(isVibrationSupported())

  // Build final configuration
  const config: HapticConfig = {
    ...DEFAULT_HAPTIC_CONFIG,
    ...configOverrides,
    enabled: preferences.enabled,
    intensity: preferences.intensity,
    fallback: preferences.fallback
  }

  const isDisabled = shouldDisableHaptics(config)

  // Main haptic trigger function
  const haptic = useCallback((pattern: number[] | string): boolean => {
    // Try primary haptic feedback
    const success = triggerHaptic(pattern, config)
    
    // If haptics failed but we have a fallback enabled
    if (!success && config.fallback !== 'none' && !hasReducedMotionPreference()) {
      try {
        let actualPattern: number[]
        
        if (typeof pattern === 'string') {
          const hapticPattern = require('@/lib/haptics').HAPTIC_PATTERNS[pattern]
          if (hapticPattern) {
            actualPattern = hapticPattern.pattern
          } else {
            return false
          }
        } else {
          actualPattern = pattern
        }

        // Apply fallback
        if (config.fallback === 'audio') {
          hapticFallbacks.audio(actualPattern)
        } else if (config.fallback === 'visual') {
          hapticFallbacks.visual(actualPattern)
        }
        
        return true
      } catch (error) {
        console.warn('Haptic fallback failed:', error)
        return false
      }
    }
    
    return success
  }, [config])

  // Stop haptic feedback
  const stop = useCallback((): boolean => {
    return stopHaptic()
  }, [])

  // Update preferences
  const updatePreferences = useCallback((newPreferences: Partial<HapticPreferences>) => {
    const updated = { ...preferences, ...newPreferences }
    setPreferences(updated)
    savePreferences(updated)
  }, [preferences, savePreferences])

  // Reset preferences to defaults
  const resetPreferences = useCallback(() => {
    const defaults: HapticPreferences = {
      enabled: DEFAULT_HAPTIC_CONFIG.enabled,
      intensity: DEFAULT_HAPTIC_CONFIG.intensity,
      fallback: DEFAULT_HAPTIC_CONFIG.fallback
    }
    setPreferences(defaults)
    savePreferences(defaults)
  }, [savePreferences])

  // Quick enable/disable
  const setEnabled = useCallback((enabled: boolean) => {
    updatePreferences({ enabled })
  }, [updatePreferences])

  // Quick intensity setting
  const setIntensity = useCallback((intensity: number) => {
    // Clamp intensity between 0.1 and 1.0
    const clampedIntensity = Math.max(0.1, Math.min(1.0, intensity))
    updatePreferences({ intensity: clampedIntensity })
  }, [updatePreferences])

  // Save preferences when they change
  useEffect(() => {
    savePreferences(preferences)
  }, [preferences, savePreferences])

  return {
    config,
    isSupported,
    isDisabled,
    preferences,
    haptic,
    stop,
    updatePreferences,
    resetPreferences,
    setEnabled,
    setIntensity
  }
}

/**
 * Specialized hook for swipe gesture haptics
 */
export function useSwipeHaptics(options: UseHapticsOptions = {}) {
  const haptics = useHaptics(options)

  const swipeHaptics = {
    // Swipe gesture events
    onSwipeStart: useCallback(() => {
      haptics.haptic('swipeStart')
    }, [haptics]),

    onSwipeProgress: useCallback((progress: number) => {
      // Trigger progress haptic at 25%, 50%, 75%
      if (progress === 0.25 || progress === 0.5 || progress === 0.75) {
        haptics.haptic('swipeProgress')
      }
    }, [haptics]),

    onSwipeComplete: useCallback(() => {
      haptics.haptic('swipeComplete')
    }, [haptics]),

    onSwipeCancel: useCallback(() => {
      haptics.haptic('swipeCancel')
    }, [haptics]),

    // Page transition events
    onPageEnter: useCallback(() => {
      haptics.haptic('pageEnter')
    }, [haptics]),

    onPageExit: useCallback(() => {
      haptics.haptic('pageExit')
    }, [haptics])
  }

  return {
    ...haptics,
    swipeHaptics
  }
}

/**
 * Specialized hook for long press haptics
 */
export function useLongPressHaptics(options: UseHapticsOptions = {}) {
  const haptics = useHaptics(options)

  const longPressHaptics = {
    onLongPressStart: useCallback(() => {
      haptics.haptic('longPressStart')
    }, [haptics]),

    onLongPressProgress: useCallback((progress: number) => {
      // Trigger progress haptic every 20% for long press
      const milestone = Math.floor(progress * 5) / 5
      if (milestone > 0 && milestone % 0.2 === 0) {
        haptics.haptic('longPressProgress')
      }
    }, [haptics]),

    onLongPressComplete: useCallback(() => {
      haptics.haptic('longPressComplete')
    }, [haptics]),

    onLongPressCancel: useCallback(() => {
      haptics.haptic('longPressCancel')
    }, [haptics])
  }

  return {
    ...haptics,
    longPressHaptics
  }
}

/**
 * Hook for UI interaction haptics
 */
export function useUIHaptics(options: UseHapticsOptions = {}) {
  const haptics = useHaptics(options)

  const uiHaptics = {
    // Basic interactions
    onTap: useCallback(() => {
      haptics.haptic('tap')
    }, [haptics]),

    onButtonPress: useCallback(() => {
      haptics.haptic('buttonPress')
    }, [haptics]),

    // State feedback
    onSuccess: useCallback(() => {
      haptics.haptic('success')
    }, [haptics]),

    onError: useCallback(() => {
      haptics.haptic('error')
    }, [haptics])
  }

  return {
    ...haptics,
    uiHaptics
  }
}

/**
 * Detect device haptic capabilities for UI adaptation
 */
export function useHapticCapabilities() {
  const [capabilities, setCapabilities] = useState({
    isSupported: false,
    hasReducedMotion: false,
    isIOS: false,
    isAndroid: false
  })

  useEffect(() => {
    const isSupported = isVibrationSupported()
    const hasReducedMotion = hasReducedMotionPreference()
    
    // Detect platform for platform-specific optimizations
    const userAgent = navigator.userAgent.toLowerCase()
    const isIOS = /iphone|ipad|ipod/.test(userAgent)
    const isAndroid = /android/.test(userAgent)

    setCapabilities({
      isSupported,
      hasReducedMotion,
      isIOS,
      isAndroid
    })
  }, [])

  return capabilities
}