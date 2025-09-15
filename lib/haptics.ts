/**
 * Haptic feedback utilities using the Vibration API
 * Provides fallback handling and pattern management for mobile UX
 */

export interface HapticPattern {
  /** Pattern name for identification */
  name: string
  /** Vibration pattern as array of [vibrate, pause] durations in ms */
  pattern: number[]
  /** Human-readable description */
  description: string
}

export interface HapticConfig {
  /** Whether haptics are enabled globally */
  enabled: boolean
  /** Intensity multiplier (0-1) - affects pattern timing */
  intensity: number
  /** Whether to respect user's reduced motion preference */
  respectReducedMotion: boolean
  /** Fallback for unsupported devices */
  fallback: 'none' | 'audio' | 'visual'
}

export const DEFAULT_HAPTIC_CONFIG: HapticConfig = {
  enabled: true,
  intensity: 1.0,
  respectReducedMotion: true,
  fallback: 'none'
}

/**
 * Predefined haptic patterns for common interactions
 */
export const HAPTIC_PATTERNS: Record<string, HapticPattern> = {
  // Quick feedback
  tap: {
    name: 'tap',
    pattern: [20],
    description: 'Light tap feedback'
  },
  
  // Button interactions
  buttonPress: {
    name: 'buttonPress',
    pattern: [40],
    description: 'Button press confirmation'
  },
  
  // Navigation feedback
  swipeStart: {
    name: 'swipeStart',
    pattern: [15],
    description: 'Swipe gesture initiated'
  },
  
  swipeProgress: {
    name: 'swipeProgress',
    pattern: [10],
    description: 'Swipe progress milestone'
  },
  
  swipeComplete: {
    name: 'swipeComplete',
    pattern: [30, 20, 30],
    description: 'Swipe gesture completed'
  },
  
  swipeCancel: {
    name: 'swipeCancel',
    pattern: [50],
    description: 'Swipe gesture cancelled'
  },
  
  // Long press feedback
  longPressStart: {
    name: 'longPressStart',
    pattern: [25],
    description: 'Long press initiated'
  },
  
  longPressProgress: {
    name: 'longPressProgress',
    pattern: [8],
    description: 'Long press progress'
  },
  
  longPressComplete: {
    name: 'longPressComplete',
    pattern: [50, 30, 50],
    description: 'Long press completed'
  },
  
  longPressCancel: {
    name: 'longPressCancel',
    pattern: [30],
    description: 'Long press cancelled'
  },
  
  // Error and success states
  error: {
    name: 'error',
    pattern: [100, 50, 100],
    description: 'Error notification'
  },
  
  success: {
    name: 'success',
    pattern: [30, 20, 30, 20, 60],
    description: 'Success confirmation'
  },
  
  // Page transitions
  pageEnter: {
    name: 'pageEnter',
    pattern: [20, 10, 40],
    description: 'Page enter transition'
  },
  
  pageExit: {
    name: 'pageExit',
    pattern: [40, 10, 20],
    description: 'Page exit transition'
  }
}

/**
 * Check if the Vibration API is supported in the current environment
 */
export function isVibrationSupported(): boolean {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator
}

/**
 * Check if user has reduced motion preference enabled
 */
export function hasReducedMotionPreference(): boolean {
  if (typeof window === 'undefined') return false
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Check if haptics should be disabled based on system settings
 */
export function shouldDisableHaptics(config: HapticConfig): boolean {
  if (!config.enabled) return true
  if (!isVibrationSupported()) return true
  if (config.respectReducedMotion && hasReducedMotionPreference()) return true
  
  return false
}

/**
 * Apply intensity scaling to a vibration pattern
 */
export function scalePattern(pattern: number[], intensity: number): number[] {
  // Clamp intensity between 0.1 and 1.0
  const clampedIntensity = Math.max(0.1, Math.min(1.0, intensity))
  
  return pattern.map((duration, index) => {
    // Only scale vibration durations (even indices), not pauses (odd indices)
    if (index % 2 === 0) {
      return Math.round(duration * clampedIntensity)
    }
    return duration
  })
}

/**
 * Core haptic feedback function
 */
export function triggerHaptic(
  pattern: number[] | string,
  config: HapticConfig = DEFAULT_HAPTIC_CONFIG
): boolean {
  // Early exit if haptics should be disabled
  if (shouldDisableHaptics(config)) {
    return false
  }
  
  let vibrationPattern: number[]
  
  // Resolve pattern from string key or use direct array
  if (typeof pattern === 'string') {
    const hapticPattern = HAPTIC_PATTERNS[pattern]
    if (!hapticPattern) {
      console.warn(`Unknown haptic pattern: ${pattern}`)
      return false
    }
    vibrationPattern = hapticPattern.pattern
  } else {
    vibrationPattern = pattern
  }
  
  // Apply intensity scaling
  const scaledPattern = scalePattern(vibrationPattern, config.intensity)
  
  try {
    // Trigger vibration
    const success = navigator.vibrate(scaledPattern)
    
    // Log for debugging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.debug(`Haptic feedback triggered:`, {
        pattern: typeof pattern === 'string' ? pattern : 'custom',
        scaledPattern,
        success
      })
    }
    
    return success
  } catch (error) {
    console.warn('Haptic feedback failed:', error)
    return false
  }
}

/**
 * Stop any ongoing vibration
 */
export function stopHaptic(): boolean {
  if (!isVibrationSupported()) return false
  
  try {
    navigator.vibrate(0)
    return true
  } catch (error) {
    console.warn('Failed to stop haptic feedback:', error)
    return false
  }
}

/**
 * Test haptic capabilities and patterns
 */
export function testHaptics(): void {
  if (!isVibrationSupported()) {
    console.log('Vibration API not supported')
    return
  }
  
  console.log('Testing haptic patterns...')
  
  const patterns = Object.keys(HAPTIC_PATTERNS)
  let index = 0
  
  const testNext = () => {
    if (index >= patterns.length) {
      console.log('Haptic test complete')
      return
    }
    
    const patternName = patterns[index]
    console.log(`Testing: ${patternName}`)
    triggerHaptic(patternName)
    
    index++
    setTimeout(testNext, 1000) // Wait 1 second between patterns
  }
  
  testNext()
}

/**
 * Create a custom haptic pattern
 */
export function createCustomPattern(
  name: string,
  pattern: number[],
  description: string
): HapticPattern {
  const customPattern: HapticPattern = {
    name,
    pattern,
    description
  }
  
  // Add to patterns registry
  HAPTIC_PATTERNS[name] = customPattern
  
  return customPattern
}

/**
 * Get all available haptic patterns
 */
export function getAvailablePatterns(): HapticPattern[] {
  return Object.values(HAPTIC_PATTERNS)
}

/**
 * Get haptic pattern by name
 */
export function getPattern(name: string): HapticPattern | undefined {
  return HAPTIC_PATTERNS[name]
}

/**
 * Fallback implementations for unsupported devices
 */
export const hapticFallbacks = {
  /**
   * Audio fallback using Web Audio API
   */
  audio: (pattern: number[]) => {
    if (typeof window === 'undefined' || !window.AudioContext) return
    
    try {
      const audioContext = new AudioContext()
      let time = audioContext.currentTime
      
      pattern.forEach((duration, index) => {
        if (index % 2 === 0) {
          // Vibration phase - create a brief audio pulse
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          oscillator.frequency.setValueAtTime(200, time)
          gainNode.gain.setValueAtTime(0.1, time)
          gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration / 1000)
          
          oscillator.start(time)
          oscillator.stop(time + duration / 1000)
        }
        
        time += duration / 1000
      })
    } catch (error) {
      console.warn('Audio fallback failed:', error)
    }
  },
  
  /**
   * Visual fallback using document flash
   */
  visual: (pattern: number[]) => {
    if (typeof document === 'undefined') return
    
    const body = document.body
    const originalFilter = body.style.filter
    
    let delay = 0
    
    pattern.forEach((duration, index) => {
      setTimeout(() => {
        if (index % 2 === 0) {
          // Vibration phase - flash the screen
          body.style.filter = 'brightness(1.2)'
          setTimeout(() => {
            body.style.filter = originalFilter
          }, duration)
        }
      }, delay)
      
      delay += duration
    })
  }
}