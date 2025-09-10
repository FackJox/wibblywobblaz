/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react'
import { 
  isVibrationSupported,
  hasReducedMotionPreference,
  shouldDisableHaptics,
  triggerHaptic,
  stopHaptic,
  scalePattern,
  createCustomPattern,
  HAPTIC_PATTERNS,
  DEFAULT_HAPTIC_CONFIG
} from '@/lib/haptics'
import { useHaptics, useSwipeHaptics, useLongPressHaptics } from '@/hooks/use-haptics'

// Mock navigator.vibrate
const mockVibrate = jest.fn()

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))
})

describe('Haptic Library', () => {
  beforeEach(() => {
    // Reset mocks
    mockVibrate.mockClear()
    mockLocalStorage.getItem.mockClear()
    mockLocalStorage.setItem.mockClear()
    
    // Mock navigator
    Object.defineProperty(navigator, 'vibrate', {
      writable: true,
      value: mockVibrate
    })
    
    // Mock successful vibration
    mockVibrate.mockReturnValue(true)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('isVibrationSupported', () => {
    it('should return true when vibrate API is available', () => {
      expect(isVibrationSupported()).toBe(true)
    })

    it('should return false when vibrate API is not available', () => {
      const originalVibrate = navigator.vibrate
      Object.defineProperty(navigator, 'vibrate', {
        value: undefined,
        configurable: true
      })
      expect(isVibrationSupported()).toBe(false)
      
      // Restore original
      Object.defineProperty(navigator, 'vibrate', {
        value: originalVibrate,
        configurable: true
      })
    })
  })

  describe('hasReducedMotionPreference', () => {
    it('should return false when user has no reduced motion preference', () => {
      expect(hasReducedMotionPreference()).toBe(false)
    })

    it('should return true when user prefers reduced motion', () => {
      // @ts-ignore
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)'
      }))

      expect(hasReducedMotionPreference()).toBe(true)
    })
  })

  describe('shouldDisableHaptics', () => {
    it('should disable haptics when disabled in config', () => {
      const config = { ...DEFAULT_HAPTIC_CONFIG, enabled: false }
      expect(shouldDisableHaptics(config)).toBe(true)
    })

    it('should disable haptics when vibration is not supported', () => {
      const originalVibrate = navigator.vibrate
      Object.defineProperty(navigator, 'vibrate', {
        value: undefined,
        configurable: true
      })
      expect(shouldDisableHaptics(DEFAULT_HAPTIC_CONFIG)).toBe(true)
      
      // Restore original
      Object.defineProperty(navigator, 'vibrate', {
        value: originalVibrate,
        configurable: true
      })
    })

    it('should disable haptics when respecting reduced motion', () => {
      // @ts-ignore
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)'
      }))

      const config = { ...DEFAULT_HAPTIC_CONFIG, respectReducedMotion: true }
      expect(shouldDisableHaptics(config)).toBe(true)
    })
  })

  describe('scalePattern', () => {
    it('should scale vibration durations correctly', () => {
      const pattern = [100, 50, 200, 30]
      const scaled = scalePattern(pattern, 0.5)
      
      // Even indices (vibrations) should be scaled, odd indices (pauses) unchanged
      expect(scaled).toEqual([50, 50, 100, 30])
    })

    it('should clamp intensity between 0.1 and 1.0', () => {
      const pattern = [100]
      
      const tooLow = scalePattern(pattern, 0.05)
      expect(tooLow).toEqual([10]) // 100 * 0.1
      
      const tooHigh = scalePattern(pattern, 2.0)
      expect(tooHigh).toEqual([100]) // 100 * 1.0
    })
  })

  describe('triggerHaptic', () => {
    it('should trigger haptic with direct pattern', () => {
      const pattern = [100, 50, 100]
      const result = triggerHaptic(pattern)
      
      expect(result).toBe(true)
      expect(mockVibrate).toHaveBeenCalledWith(pattern)
    })

    it('should trigger haptic with pattern name', () => {
      const result = triggerHaptic('tap')
      
      expect(result).toBe(true)
      expect(mockVibrate).toHaveBeenCalledWith(HAPTIC_PATTERNS.tap.pattern)
    })

    it('should apply intensity scaling', () => {
      const config = { ...DEFAULT_HAPTIC_CONFIG, intensity: 0.5 }
      triggerHaptic('tap', config)
      
      const expectedPattern = scalePattern(HAPTIC_PATTERNS.tap.pattern, 0.5)
      expect(mockVibrate).toHaveBeenCalledWith(expectedPattern)
    })

    it('should return false for unknown pattern', () => {
      const result = triggerHaptic('unknown-pattern')
      
      expect(result).toBe(false)
      expect(mockVibrate).not.toHaveBeenCalled()
    })

    it('should return false when haptics are disabled', () => {
      const config = { ...DEFAULT_HAPTIC_CONFIG, enabled: false }
      const result = triggerHaptic('tap', config)
      
      expect(result).toBe(false)
      expect(mockVibrate).not.toHaveBeenCalled()
    })
  })

  describe('stopHaptic', () => {
    it('should stop vibration', () => {
      const result = stopHaptic()
      
      expect(result).toBe(true)
      expect(mockVibrate).toHaveBeenCalledWith(0)
    })
  })

  describe('createCustomPattern', () => {
    it('should create and register custom pattern', () => {
      const pattern = createCustomPattern('custom', [50, 25, 50], 'Custom pattern')
      
      expect(pattern.name).toBe('custom')
      expect(pattern.pattern).toEqual([50, 25, 50])
      expect(HAPTIC_PATTERNS.custom).toBe(pattern)
    })
  })
})

describe('useHaptics Hook', () => {
  beforeEach(() => {
    mockVibrate.mockClear()
    mockLocalStorage.getItem.mockClear()
    mockLocalStorage.setItem.mockClear()
    mockVibrate.mockReturnValue(true)
  })

  it('should initialize with default preferences', () => {
    const { result } = renderHook(() => useHaptics())
    
    expect(result.current.isSupported).toBe(true)
    expect(result.current.preferences.enabled).toBe(true)
    expect(result.current.preferences.intensity).toBe(1.0)
  })

  it('should load preferences from localStorage', () => {
    const storedPrefs = {
      enabled: false,
      intensity: 0.5,
      fallback: 'audio'
    }
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedPrefs))
    
    const { result } = renderHook(() => useHaptics())
    
    expect(result.current.preferences.enabled).toBe(false)
    expect(result.current.preferences.intensity).toBe(0.5)
    expect(result.current.preferences.fallback).toBe('audio')
  })

  it('should trigger haptic feedback', () => {
    const { result } = renderHook(() => useHaptics())
    
    act(() => {
      result.current.haptic('tap')
    })
    
    expect(mockVibrate).toHaveBeenCalledWith(HAPTIC_PATTERNS.tap.pattern)
  })

  it('should update preferences', () => {
    const { result } = renderHook(() => useHaptics())
    
    act(() => {
      result.current.updatePreferences({ enabled: false })
    })
    
    expect(result.current.preferences.enabled).toBe(false)
    expect(mockLocalStorage.setItem).toHaveBeenCalled()
  })

  it('should set enabled state', () => {
    const { result } = renderHook(() => useHaptics())
    
    act(() => {
      result.current.setEnabled(false)
    })
    
    expect(result.current.preferences.enabled).toBe(false)
  })

  it('should set intensity', () => {
    const { result } = renderHook(() => useHaptics())
    
    act(() => {
      result.current.setIntensity(0.5)
    })
    
    expect(result.current.preferences.intensity).toBe(0.5)
  })

  it('should clamp intensity values', () => {
    const { result } = renderHook(() => useHaptics())
    
    act(() => {
      result.current.setIntensity(2.0) // Too high
    })
    
    expect(result.current.preferences.intensity).toBe(1.0)
    
    act(() => {
      result.current.setIntensity(0.05) // Too low
    })
    
    expect(result.current.preferences.intensity).toBe(0.1)
  })

  it('should reset preferences', () => {
    const { result } = renderHook(() => useHaptics())
    
    // Change preferences
    act(() => {
      result.current.updatePreferences({ enabled: false, intensity: 0.5 })
    })
    
    // Reset
    act(() => {
      result.current.resetPreferences()
    })
    
    expect(result.current.preferences.enabled).toBe(DEFAULT_HAPTIC_CONFIG.enabled)
    expect(result.current.preferences.intensity).toBe(DEFAULT_HAPTIC_CONFIG.intensity)
  })
})

describe('useSwipeHaptics Hook', () => {
  beforeEach(() => {
    mockVibrate.mockClear()
    mockVibrate.mockReturnValue(true)
  })

  it('should provide swipe-specific haptic functions', () => {
    const { result } = renderHook(() => useSwipeHaptics())
    
    expect(result.current.swipeHaptics.onSwipeStart).toBeDefined()
    expect(result.current.swipeHaptics.onSwipeProgress).toBeDefined()
    expect(result.current.swipeHaptics.onSwipeComplete).toBeDefined()
    expect(result.current.swipeHaptics.onSwipeCancel).toBeDefined()
  })

  it('should trigger swipe start haptic', () => {
    const { result } = renderHook(() => useSwipeHaptics())
    
    act(() => {
      result.current.swipeHaptics.onSwipeStart()
    })
    
    expect(mockVibrate).toHaveBeenCalledWith(HAPTIC_PATTERNS.swipeStart.pattern)
  })

  it('should trigger progress haptic at milestones', () => {
    const { result } = renderHook(() => useSwipeHaptics())
    
    // Should trigger at 25%
    act(() => {
      result.current.swipeHaptics.onSwipeProgress(0.25)
    })
    expect(mockVibrate).toHaveBeenCalledWith(HAPTIC_PATTERNS.swipeProgress.pattern)
    
    mockVibrate.mockClear()
    
    // Should not trigger at 30%
    act(() => {
      result.current.swipeHaptics.onSwipeProgress(0.30)
    })
    expect(mockVibrate).not.toHaveBeenCalled()
    
    // Should trigger at 50%
    act(() => {
      result.current.swipeHaptics.onSwipeProgress(0.50)
    })
    expect(mockVibrate).toHaveBeenCalledWith(HAPTIC_PATTERNS.swipeProgress.pattern)
  })

  it('should trigger completion haptic', () => {
    const { result } = renderHook(() => useSwipeHaptics())
    
    act(() => {
      result.current.swipeHaptics.onSwipeComplete()
    })
    
    expect(mockVibrate).toHaveBeenCalledWith(HAPTIC_PATTERNS.swipeComplete.pattern)
  })
})

describe('useLongPressHaptics Hook', () => {
  beforeEach(() => {
    mockVibrate.mockClear()
    mockVibrate.mockReturnValue(true)
  })

  it('should provide long press-specific haptic functions', () => {
    const { result } = renderHook(() => useLongPressHaptics())
    
    expect(result.current.longPressHaptics.onLongPressStart).toBeDefined()
    expect(result.current.longPressHaptics.onLongPressProgress).toBeDefined()
    expect(result.current.longPressHaptics.onLongPressComplete).toBeDefined()
    expect(result.current.longPressHaptics.onLongPressCancel).toBeDefined()
  })

  it('should trigger long press start haptic', () => {
    const { result } = renderHook(() => useLongPressHaptics())
    
    act(() => {
      result.current.longPressHaptics.onLongPressStart()
    })
    
    expect(mockVibrate).toHaveBeenCalledWith(HAPTIC_PATTERNS.longPressStart.pattern)
  })

  it('should trigger progress haptic at 20% intervals', () => {
    const { result } = renderHook(() => useLongPressHaptics())
    
    // Should trigger at 20%
    act(() => {
      result.current.longPressHaptics.onLongPressProgress(0.2)
    })
    expect(mockVibrate).toHaveBeenCalledWith(HAPTIC_PATTERNS.longPressProgress.pattern)
    
    mockVibrate.mockClear()
    
    // Should not trigger at 25%
    act(() => {
      result.current.longPressHaptics.onLongPressProgress(0.25)
    })
    expect(mockVibrate).not.toHaveBeenCalled()
    
    // Should trigger at 40%
    act(() => {
      result.current.longPressHaptics.onLongPressProgress(0.4)
    })
    expect(mockVibrate).toHaveBeenCalledWith(HAPTIC_PATTERNS.longPressProgress.pattern)
  })
})

describe('Haptic Patterns', () => {
  it('should have all required patterns defined', () => {
    const requiredPatterns = [
      'tap', 'buttonPress',
      'swipeStart', 'swipeProgress', 'swipeComplete', 'swipeCancel',
      'longPressStart', 'longPressProgress', 'longPressComplete', 'longPressCancel',
      'error', 'success',
      'pageEnter', 'pageExit'
    ]
    
    requiredPatterns.forEach(pattern => {
      expect(HAPTIC_PATTERNS[pattern]).toBeDefined()
      expect(HAPTIC_PATTERNS[pattern].pattern).toBeInstanceOf(Array)
      expect(HAPTIC_PATTERNS[pattern].pattern.length).toBeGreaterThan(0)
    })
  })

  it('should have valid pattern structures', () => {
    Object.values(HAPTIC_PATTERNS).forEach(pattern => {
      expect(pattern.name).toBeTruthy()
      expect(pattern.pattern).toBeInstanceOf(Array)
      expect(pattern.description).toBeTruthy()
      
      // All pattern values should be positive numbers
      pattern.pattern.forEach(duration => {
        expect(typeof duration).toBe('number')
        expect(duration).toBeGreaterThan(0)
      })
    })
  })
})