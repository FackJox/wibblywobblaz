"use client"

import * as React from "react"
import { willChangeHelpers } from "../lib/will-change-manager"
import { 
  addRippleToElement, 
  cleanupRipples, 
  ripplePresets,
  type RippleConfig,
  type RipplePreset
} from "../lib/ripple-utils"
import { usePrefersReducedMotion } from "./use-performance"

/**
 * Props for useRipple hook
 */
export interface UseRippleProps extends RippleConfig {
  /** Preset configuration to use */
  preset?: RipplePreset
  /** Whether ripple is disabled */
  disabled?: boolean
  /** Callback when ripple is triggered */
  onRipple?: (event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void
}

/**
 * Return type for useRipple hook
 */
export interface UseRippleReturn<T extends HTMLElement = HTMLElement> {
  /** Add ripple event handlers to props */
  getRippleProps: () => {
    onMouseDown: (event: React.MouseEvent<HTMLElement>) => void
    onTouchStart: (event: React.TouchEvent<HTMLElement>) => void
    style?: React.CSSProperties
  }
  /** Trigger ripple programmatically */
  triggerRipple: (event?: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void
  /** Clear all ripples */
  clearRipples: () => void
  /** Reference to attach to the element */
  rippleRef: React.RefObject<T | null>
}

/**
 * Hook for adding ripple effects to interactive elements
 * 
 * @param props Ripple configuration options
 * @returns Ripple handlers and utilities
 * 
 * @example
 * ```tsx
 * const ripple = useRipple({ preset: 'button' })
 * 
 * return (
 *   <button 
 *     ref={ripple.rippleRef}
 *     {...ripple.getRippleProps()}
 *     onClick={() => console.log('clicked')}
 *   >
 *     Click me
 *   </button>
 * )
 * ```
 */
export function useRipple<T extends HTMLElement = HTMLElement>(props: UseRippleProps = {}): UseRippleReturn<T> {
  const {
    preset,
    disabled = false,
    onRipple,
    ...rippleConfig
  } = props

  const rippleRef = React.useRef<T>(null)
  const cleanupFunctionsRef = React.useRef<(() => void)[]>([])
  const prefersReducedMotion = usePrefersReducedMotion()

  // Get final config by merging preset with custom config
  const finalConfig = React.useMemo(() => {
    const baseConfig = preset ? ripplePresets[preset] : ripplePresets.default
    return {
      ...baseConfig,
      ...rippleConfig,
      disabled: disabled || prefersReducedMotion
    }
  }, [preset, rippleConfig, disabled, prefersReducedMotion])

  /**
   * Add ripple effect to the element
   */
  const addRipple = React.useCallback((
    event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement> | null
  ) => {
    console.log('[RIPPLE] addRipple called', { 
      hasRef: !!rippleRef.current, 
      disabled: finalConfig.disabled,
      element: rippleRef.current
    })
    
    if (!rippleRef.current || finalConfig.disabled) return

    // Call onRipple callback if provided
    if (event && onRipple) {
      onRipple(event)
    }

    // Add ripple effect
    const cleanup = addRippleToElement(rippleRef.current, event, finalConfig)
    cleanupFunctionsRef.current.push(cleanup)

    // Clean up old cleanup functions
    if (cleanupFunctionsRef.current.length > 5) {
      const oldCleanup = cleanupFunctionsRef.current.shift()
      if (oldCleanup) oldCleanup()
    }
  }, [finalConfig, onRipple])

  /**
   * Handle mouse down events
   */
  const handleMouseDown = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    addRipple(event)
  }, [addRipple])

  /**
   * Handle touch start events
   */
  const handleTouchStart = React.useCallback((event: React.TouchEvent<HTMLElement>) => {
    addRipple(event)
  }, [addRipple])

  /**
   * Trigger ripple programmatically
   */
  const triggerRipple = React.useCallback((
    event?: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
  ) => {
    addRipple(event || null)
  }, [addRipple])

  /**
   * Clear all ripples from the element
   */
  const clearRipples = React.useCallback(() => {
    if (rippleRef.current) {
      cleanupRipples(rippleRef.current)
    }
    // Clear all cleanup functions
    cleanupFunctionsRef.current.forEach(cleanup => cleanup())
    cleanupFunctionsRef.current = []
  }, [])

  /**
   * Get props to spread on the element
   */
  const getRippleProps = React.useCallback(() => {
    const baseProps = {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
    }

    // Add positioning styles if needed
    const style: React.CSSProperties = {}
    
    return { ...baseProps, ...(Object.keys(style).length > 0 ? { style } : {}) }
  }, [handleMouseDown, handleTouchStart])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      clearRipples()
    }
  }, [clearRipples])

  return {
    getRippleProps,
    triggerRipple,
    clearRipples,
    rippleRef
  }
}

/**
 * Simplified hook for basic ripple effects
 * 
 * @param preset The ripple preset to use
 * @returns Simplified ripple interface
 * 
 * @example
 * ```tsx
 * const [ref, triggerRipple] = useSimpleRipple('button')
 * 
 * return (
 *   <button 
 *     ref={ref}
 *     onMouseDown={triggerRipple}
 *     onTouchStart={triggerRipple}
 *   >
 *     Click me
 *   </button>
 * )
 * ```
 */
export function useSimpleRipple<T extends HTMLElement = HTMLElement>(
  preset: RipplePreset = 'default'
): [React.RefObject<T | null>, (event?: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void] {
  const ripple = useRipple<T>({ preset })
  
  return [ripple.rippleRef, ripple.triggerRipple]
}

/**
 * Hook for click animations with scale and opacity effects
 */
export interface UseClickAnimationProps {
  /** Scale factor during click (0-1) */
  scaleDown?: number
  /** Duration of the click animation */
  duration?: number
  /** Whether animation is disabled */
  disabled?: boolean
}

export function useClickAnimation<T extends HTMLElement = HTMLElement>(props: UseClickAnimationProps = {}) {
  const {
    scaleDown = 0.95,
    duration = 150,
    disabled = false
  } = props

  const elementRef = React.useRef<T>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const isAnimatingRef = React.useRef(false)

  const animate = React.useCallback(() => {
    if (!elementRef.current || disabled || prefersReducedMotion || isAnimatingRef.current) {
      return
    }

    const element = elementRef.current
    isAnimatingRef.current = true
    
    console.log('[DEBUGBUT] ClickAnimation starting:', {
      element,
      beforeTransform: element.style.transform,
      scaleDown
    })

    // Apply click animation while preserving existing transforms
    const currentTransform = element.style.transform || ''
    const hasTranslate = currentTransform.includes('translate')
    
    // Preserve any existing translate and apply scale
    if (hasTranslate) {
      // Remove any existing scale and add new one
      const cleanedTransform = currentTransform.replace(/scale\([^)]*\)/g, '').trim()
      element.style.transform = `${cleanedTransform} scale(${scaleDown})`
    } else {
      element.style.transform = `scale(${scaleDown})`
    }
    element.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
    
    console.log('[DEBUGBUT] ClickAnimation applied:', {
      afterTransform: element.style.transform,
      transition: element.style.transition
    })

    // Reset after duration
    setTimeout(() => {
      if (element) {
        const currentTransform = element.style.transform || ''
        if (currentTransform.includes('translate')) {
          // Preserve translate, reset scale
          element.style.transform = currentTransform.replace(/scale\([^)]*\)/g, '').trim() + ' scale(1)'
        } else {
          element.style.transform = 'scale(1)'
        }
        
        console.log('[DEBUGBUT] ClickAnimation resetting:', {
          transform: element.style.transform
        })
        
        setTimeout(() => {
          if (element) {
            // Clean up scale(1) as it's the default
            element.style.transform = element.style.transform.replace(/\s*scale\(1\)/g, '')
            element.style.transition = ''
            isAnimatingRef.current = false
            
            console.log('[DEBUGBUT] ClickAnimation complete:', {
              finalTransform: element.style.transform
            })
          }
        }, duration)
      }
    }, duration * 0.3) // Quick down, slower up
  }, [scaleDown, duration, disabled, prefersReducedMotion])

  const getClickProps = React.useCallback(() => ({
    onMouseDown: animate,
    onTouchStart: animate,
  }), [animate])

  return {
    clickRef: elementRef,
    triggerClick: animate,
    getClickProps
  } as {
    clickRef: React.RefObject<T | null>
    triggerClick: () => void
    getClickProps: () => { onMouseDown: () => void; onTouchStart: () => void }
  }
}