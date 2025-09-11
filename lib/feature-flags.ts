"use client"

/**
 * Feature Flag System for Animation Performance Control
 * 
 * Controls animation groups based on:
 * - Environment settings
 * - Device capabilities 
 * - User preferences
 * - Performance budgets
 */

import { isLowEndDevice, getDeviceInfo } from './performance-utils'

// Animation complexity levels
export type AnimationType = 'micro' | 'scroll' | 'hover' | 'transition' | 'complex'

// Environment-based feature flags
export interface EnvironmentFlags {
  enableAllAnimations: boolean
  enableComplexAnimations: boolean
  enableScrollAnimations: boolean
  enableHoverAnimations: boolean
  enableMicroAnimations: boolean
  enableTransitionAnimations: boolean
  forceReducedMotion: boolean
  debugMode: boolean
}

// Device-based capabilities
export interface DeviceCapabilities {
  hasGoodCpu: boolean
  hasGoodGpu: boolean
  hasEnoughMemory: boolean
  supportsTouchEvents: boolean
  supportsHover: boolean
  prefersReducedMotion: boolean
  isLowEndDevice: boolean
  devicePixelRatio: number
}

// Animation group configurations
export interface AnimationGroupConfig {
  enabled: boolean
  quality: 'low' | 'medium' | 'high'
  maxInstances: number
  lazyLoad: boolean
  requiresViewport: boolean
}

// Complete feature flag state
export interface FeatureFlags {
  micro: AnimationGroupConfig
  scroll: AnimationGroupConfig
  hover: AnimationGroupConfig
  transition: AnimationGroupConfig
  complex: AnimationGroupConfig
}

/**
 * Get environment-based flags from environment variables and local storage
 */
function getEnvironmentFlags(): EnvironmentFlags {
  // Development vs Production defaults
  const isDev = process.env.NODE_ENV === 'development'
  
  // Environment variable overrides
  const envFlags: EnvironmentFlags = {
    enableAllAnimations: process.env.NEXT_PUBLIC_ENABLE_ALL_ANIMATIONS !== 'false',
    enableComplexAnimations: process.env.NEXT_PUBLIC_ENABLE_COMPLEX_ANIMATIONS !== 'false',
    enableScrollAnimations: process.env.NEXT_PUBLIC_ENABLE_SCROLL_ANIMATIONS !== 'false', 
    enableHoverAnimations: process.env.NEXT_PUBLIC_ENABLE_HOVER_ANIMATIONS !== 'false',
    enableMicroAnimations: process.env.NEXT_PUBLIC_ENABLE_MICRO_ANIMATIONS !== 'false',
    enableTransitionAnimations: process.env.NEXT_PUBLIC_ENABLE_TRANSITION_ANIMATIONS !== 'false',
    forceReducedMotion: process.env.NEXT_PUBLIC_FORCE_REDUCED_MOTION === 'true',
    debugMode: isDev && process.env.NEXT_PUBLIC_ANIMATION_DEBUG === 'true'
  }

  // Local storage overrides (client-side only)
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('animation-feature-flags')
      if (stored) {
        const localFlags = JSON.parse(stored)
        return { ...envFlags, ...localFlags }
      }
    } catch (error) {
      console.warn('Failed to parse animation feature flags from localStorage:', error)
    }
  }

  return envFlags
}

/**
 * Detect device capabilities for progressive enhancement
 */
function getDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === 'undefined') {
    // Server-side defaults - assume modern device
    return {
      hasGoodCpu: true,
      hasGoodGpu: true,
      hasEnoughMemory: true,
      supportsTouchEvents: false,
      supportsHover: true,
      prefersReducedMotion: false,
      isLowEndDevice: false,
      devicePixelRatio: 1
    }
  }

  const deviceInfo = getDeviceInfo()
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isLowEnd = isLowEndDevice()

  return {
    hasGoodCpu: deviceInfo.cpu.cores > 2,
    hasGoodGpu: deviceInfo.gpu.renderer !== 'software',
    hasEnoughMemory: deviceInfo.memory.deviceMemory > 2,
    supportsTouchEvents: 'ontouchstart' in window,
    supportsHover: window.matchMedia('(hover: hover)').matches,
    prefersReducedMotion,
    isLowEndDevice: isLowEnd,
    devicePixelRatio: window.devicePixelRatio || 1
  }
}

/**
 * Generate animation group configurations based on environment and device
 */
function generateAnimationConfigs(
  envFlags: EnvironmentFlags, 
  deviceCaps: DeviceCapabilities
): FeatureFlags {
  // Base quality level based on device capabilities
  const baseQuality: 'low' | 'medium' | 'high' = deviceCaps.isLowEndDevice 
    ? 'low' 
    : deviceCaps.hasGoodGpu && deviceCaps.hasGoodCpu 
    ? 'high' 
    : 'medium'

  // Reduced motion override
  const globalDisabled = envFlags.forceReducedMotion || 
                        deviceCaps.prefersReducedMotion || 
                        !envFlags.enableAllAnimations

  return {
    micro: {
      enabled: globalDisabled ? false : envFlags.enableMicroAnimations,
      quality: baseQuality,
      maxInstances: deviceCaps.isLowEndDevice ? 3 : 10,
      lazyLoad: false, // Micro animations are always loaded
      requiresViewport: false
    },
    
    hover: {
      enabled: globalDisabled ? false : 
               envFlags.enableHoverAnimations && deviceCaps.supportsHover,
      quality: baseQuality,
      maxInstances: deviceCaps.isLowEndDevice ? 2 : 5,
      lazyLoad: false, // Hover animations need immediate response
      requiresViewport: false
    },
    
    transition: {
      enabled: globalDisabled ? false : envFlags.enableTransitionAnimations,
      quality: baseQuality,
      maxInstances: deviceCaps.isLowEndDevice ? 5 : 15,
      lazyLoad: deviceCaps.isLowEndDevice,
      requiresViewport: false
    },
    
    scroll: {
      enabled: globalDisabled ? false : envFlags.enableScrollAnimations,
      quality: deviceCaps.isLowEndDevice ? 'low' : baseQuality,
      maxInstances: deviceCaps.isLowEndDevice ? 2 : 8,
      lazyLoad: true, // Always lazy load scroll animations
      requiresViewport: true
    },
    
    complex: {
      enabled: globalDisabled ? false : 
               envFlags.enableComplexAnimations && !deviceCaps.isLowEndDevice,
      quality: deviceCaps.hasGoodGpu ? baseQuality : 'low',
      maxInstances: deviceCaps.isLowEndDevice ? 0 : deviceCaps.hasGoodGpu ? 3 : 1,
      lazyLoad: true, // Always lazy load complex animations
      requiresViewport: true
    }
  }
}

/**
 * Feature Flag Manager Class
 */
export class FeatureFlagManager {
  private static instance: FeatureFlagManager | null = null
  private flags: FeatureFlags
  private envFlags: EnvironmentFlags
  private deviceCaps: DeviceCapabilities
  private listeners: Set<(flags: FeatureFlags) => void> = new Set()
  private animationCounts: Map<AnimationType, number> = new Map()

  constructor() {
    this.envFlags = getEnvironmentFlags()
    this.deviceCaps = getDeviceCapabilities()
    this.flags = generateAnimationConfigs(this.envFlags, this.deviceCaps)
    
    // Initialize counters
    this.animationCounts.set('micro', 0)
    this.animationCounts.set('hover', 0)
    this.animationCounts.set('transition', 0)
    this.animationCounts.set('scroll', 0)
    this.animationCounts.set('complex', 0)

    this.setupEventListeners()
  }

  static getInstance(): FeatureFlagManager {
    if (!FeatureFlagManager.instance) {
      FeatureFlagManager.instance = new FeatureFlagManager()
    }
    return FeatureFlagManager.instance
  }

  /**
   * Get current feature flags
   */
  getFlags(): FeatureFlags {
    return { ...this.flags }
  }

  /**
   * Check if animation type is enabled
   */
  isEnabled(type: AnimationType): boolean {
    return this.flags[type].enabled
  }

  /**
   * Check if animation should be lazy loaded
   */
  shouldLazyLoad(type: AnimationType): boolean {
    return this.flags[type].lazyLoad
  }

  /**
   * Get quality level for animation type
   */
  getQuality(type: AnimationType): 'low' | 'medium' | 'high' {
    return this.flags[type].quality
  }

  /**
   * Check if animation type has available instance slot
   */
  canCreateInstance(type: AnimationType): boolean {
    const config = this.flags[type]
    if (!config.enabled) return false
    
    const currentCount = this.animationCounts.get(type) || 0
    return currentCount < config.maxInstances
  }

  /**
   * Register animation instance creation
   */
  registerInstance(type: AnimationType): boolean {
    if (!this.canCreateInstance(type)) {
      if (this.envFlags.debugMode) {
        console.warn(`Animation instance limit reached for ${type}`)
      }
      return false
    }
    
    const currentCount = this.animationCounts.get(type) || 0
    this.animationCounts.set(type, currentCount + 1)
    
    if (this.envFlags.debugMode) {
      console.log(`Registered ${type} animation instance (${currentCount + 1}/${this.flags[type].maxInstances})`)
    }
    
    return true
  }

  /**
   * Unregister animation instance
   */
  unregisterInstance(type: AnimationType): void {
    const currentCount = this.animationCounts.get(type) || 0
    if (currentCount > 0) {
      this.animationCounts.set(type, currentCount - 1)
      
      if (this.envFlags.debugMode) {
        console.log(`Unregistered ${type} animation instance (${currentCount - 1}/${this.flags[type].maxInstances})`)
      }
    }
  }

  /**
   * Get current instance counts for debugging
   */
  getInstanceCounts(): Record<AnimationType, number> {
    return {
      micro: this.animationCounts.get('micro') || 0,
      hover: this.animationCounts.get('hover') || 0,  
      transition: this.animationCounts.get('transition') || 0,
      scroll: this.animationCounts.get('scroll') || 0,
      complex: this.animationCounts.get('complex') || 0
    }
  }

  /**
   * Update feature flags programmatically
   */
  updateFlags(updates: Partial<FeatureFlags>): void {
    this.flags = { ...this.flags, ...updates }
    this.notifyListeners()
    
    if (this.envFlags.debugMode) {
      console.log('Feature flags updated:', this.flags)
    }
  }

  /**
   * Override environment flags (useful for testing)
   */
  setEnvironmentFlags(updates: Partial<EnvironmentFlags>): void {
    this.envFlags = { ...this.envFlags, ...updates }
    this.flags = generateAnimationConfigs(this.envFlags, this.deviceCaps)
    this.notifyListeners()
  }

  /**
   * Subscribe to flag changes
   */
  subscribe(callback: (flags: FeatureFlags) => void): () => void {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  /**
   * Save current flags to localStorage
   */
  saveFlagsToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('animation-feature-flags', JSON.stringify(this.envFlags))
      } catch (error) {
        console.warn('Failed to save feature flags to localStorage:', error)
      }
    }
  }

  /**
   * Get debug information
   */
  getDebugInfo(): {
    flags: FeatureFlags
    envFlags: EnvironmentFlags
    deviceCaps: DeviceCapabilities
    instanceCounts: Record<AnimationType, number>
  } {
    return {
      flags: this.getFlags(),
      envFlags: this.envFlags,
      deviceCaps: this.deviceCaps,
      instanceCounts: this.getInstanceCounts()
    }
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return

    // Listen for reduced motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionChange = () => {
      this.deviceCaps.prefersReducedMotion = mediaQuery.matches
      this.flags = generateAnimationConfigs(this.envFlags, this.deviceCaps)
      this.notifyListeners()
    }
    
    mediaQuery.addEventListener('change', handleMotionChange)

    // Listen for page visibility changes to pause/resume animations
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Pause all animations when page is hidden
        this.updateFlags({
          micro: { ...this.flags.micro, enabled: false },
          hover: { ...this.flags.hover, enabled: false },
          transition: { ...this.flags.transition, enabled: false },
          scroll: { ...this.flags.scroll, enabled: false },
          complex: { ...this.flags.complex, enabled: false }
        })
      } else {
        // Restore original flags when page is visible
        this.flags = generateAnimationConfigs(this.envFlags, this.deviceCaps)
        this.notifyListeners()
      }
    })
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.flags))
  }
}

// Singleton instance
export const featureFlagManager = FeatureFlagManager.getInstance()

// Helper functions for easy access
export function isAnimationEnabled(type: AnimationType): boolean {
  return featureFlagManager.isEnabled(type)
}

export function shouldLazyLoadAnimation(type: AnimationType): boolean {
  return featureFlagManager.shouldLazyLoad(type)
}

export function getAnimationQuality(type: AnimationType): 'low' | 'medium' | 'high' {
  return featureFlagManager.getQuality(type)
}

export function canCreateAnimationInstance(type: AnimationType): boolean {
  return featureFlagManager.canCreateInstance(type)
}