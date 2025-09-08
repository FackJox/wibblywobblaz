"use client"

import * as React from "react"
import { 
  getCursorPosition, 
  getElementCenter, 
  calculateMagneticForce, 
  applyTransform,
  lerp,
  shouldReduceMotion,
  safeRequestAnimationFrame,
  safeCancelAnimationFrame,
  type MagneticConfig,
  type Point 
} from "@/lib/hover-utils"
import { usePrefersReducedMotion } from "@/hooks/use-performance"

/**
 * Configuration for magnetic hover effect
 */
export interface UseMagneticHoverConfig extends MagneticConfig {
  /** Whether the effect is enabled */
  disabled?: boolean;
  /** Whether to return to center when not hovering */
  returnToCenter?: boolean;
  /** Speed of return animation (0-1) */
  returnSpeed?: number;
  /** Reset position on mouse leave */
  resetOnLeave?: boolean;
}

/**
 * Return type for useMagneticHover hook
 */
export interface UseMagneticHoverReturn {
  /** Ref to attach to the magnetic element */
  ref: React.RefObject<HTMLElement>;
  /** Current transform values */
  transform: Point;
  /** Whether the element is currently being hovered */
  isHovered: boolean;
  /** Whether the effect is active (not disabled by reduced motion) */
  isActive: boolean;
  /** Manually trigger magnetic effect */
  triggerMagnetic: (cursorPos: Point) => void;
  /** Reset to center position */
  reset: () => void;
}

/**
 * Hook for creating magnetic hover effects that attract elements to cursor
 * 
 * @param config Magnetic hover configuration
 * @returns Magnetic hover state and controls
 * 
 * @example
 * ```tsx
 * const magnetic = useMagneticHover({
 *   strength: 0.3,
 *   maxDistance: 100,
 *   boundaries: { x: 0.5, y: 0.5 }
 * });
 * 
 * return (
 *   <div ref={magnetic.ref} className="magnetic-element">
 *     Hover me!
 *   </div>
 * );
 * ```
 */
export function useMagneticHover(
  config: UseMagneticHoverConfig = {}
): UseMagneticHoverReturn {
  const {
    strength = 0.3,
    maxDistance = 100,
    boundaries = { x: 0.5, y: 0.5 },
    lerp: lerpFactor = 0.1,
    useGPU = true,
    disabled = false,
    returnToCenter = true,
    returnSpeed = 0.05,
    resetOnLeave = true
  } = config;

  const prefersReducedMotion = usePrefersReducedMotion();
  const elementRef = React.useRef<HTMLElement>(null);
  
  const [transform, setTransform] = React.useState<Point>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Animation state
  const animationFrameRef = React.useRef<number | null>(null);
  const targetTransformRef = React.useRef<Point>({ x: 0, y: 0 });
  const currentTransformRef = React.useRef<Point>({ x: 0, y: 0 });
  
  const isActive = !disabled && !prefersReducedMotion;

  /**
   * Smooth animation loop using lerp
   */
  const animate = React.useCallback(() => {
    if (!elementRef.current || !isActive) return;

    const current = currentTransformRef.current;
    const target = targetTransformRef.current;
    
    // Lerp towards target position
    const newX = lerp(current.x, target.x, lerpFactor);
    const newY = lerp(current.y, target.y, lerpFactor);
    
    currentTransformRef.current = { x: newX, y: newY };
    setTransform({ x: newX, y: newY });
    
    // Apply transform to element
    applyTransform(elementRef.current, { x: newX, y: newY }, useGPU);
    
    // Continue animation if not at target
    const threshold = 0.1;
    if (Math.abs(newX - target.x) > threshold || Math.abs(newY - target.y) > threshold) {
      animationFrameRef.current = safeRequestAnimationFrame(animate);
    }
  }, [isActive, lerpFactor, useGPU]);

  /**
   * Start animation loop
   */
  const startAnimation = React.useCallback(() => {
    if (animationFrameRef.current) return;
    animationFrameRef.current = safeRequestAnimationFrame(animate);
  }, [animate]);

  /**
   * Stop animation loop
   */
  const stopAnimation = React.useCallback(() => {
    if (animationFrameRef.current) {
      safeCancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  /**
   * Handle mouse move events
   */
  const handleMouseMove = React.useCallback((event: MouseEvent) => {
    if (!elementRef.current || !isActive) return;

    const cursorPos = getCursorPosition(event, elementRef.current);
    const elementCenter = getElementCenter(elementRef.current);
    
    const force = calculateMagneticForce(cursorPos, elementCenter, {
      strength,
      maxDistance,
      boundaries
    });
    
    targetTransformRef.current = force;
    startAnimation();
  }, [isActive, strength, maxDistance, boundaries, startAnimation]);

  /**
   * Handle mouse enter events
   */
  const handleMouseEnter = React.useCallback((event: MouseEvent) => {
    if (!isActive) return;
    
    setIsHovered(true);
    handleMouseMove(event);
  }, [isActive, handleMouseMove]);

  /**
   * Handle mouse leave events
   */
  const handleMouseLeave = React.useCallback(() => {
    setIsHovered(false);
    
    if (!isActive) return;

    if (resetOnLeave || returnToCenter) {
      targetTransformRef.current = { x: 0, y: 0 };
      startAnimation();
    }
  }, [isActive, resetOnLeave, returnToCenter, startAnimation]);

  /**
   * Manually trigger magnetic effect
   */
  const triggerMagnetic = React.useCallback((cursorPos: Point) => {
    if (!elementRef.current || !isActive) return;

    const elementCenter = getElementCenter(elementRef.current);
    const force = calculateMagneticForce(cursorPos, elementCenter, {
      strength,
      maxDistance,
      boundaries
    });
    
    targetTransformRef.current = force;
    startAnimation();
  }, [isActive, strength, maxDistance, boundaries, startAnimation]);

  /**
   * Reset to center position
   */
  const reset = React.useCallback(() => {
    targetTransformRef.current = { x: 0, y: 0 };
    currentTransformRef.current = { x: 0, y: 0 };
    setTransform({ x: 0, y: 0 });
    
    if (elementRef.current) {
      applyTransform(elementRef.current, { x: 0, y: 0 }, useGPU);
    }
    
    stopAnimation();
  }, [useGPU, stopAnimation]);

  /**
   * Return to center animation when not hovering
   */
  React.useEffect(() => {
    if (!isHovered && returnToCenter && isActive) {
      const returnInterval = setInterval(() => {
        const current = currentTransformRef.current;
        const target = { x: 0, y: 0 };
        
        const newX = lerp(current.x, target.x, returnSpeed);
        const newY = lerp(current.y, target.y, returnSpeed);
        
        currentTransformRef.current = { x: newX, y: newY };
        setTransform({ x: newX, y: newY });
        
        if (elementRef.current) {
          applyTransform(elementRef.current, { x: newX, y: newY }, useGPU);
        }
        
        // Stop when close enough to center
        const threshold = 0.1;
        if (Math.abs(newX) < threshold && Math.abs(newY) < threshold) {
          clearInterval(returnInterval);
          reset();
        }
      }, 16); // ~60fps
      
      return () => clearInterval(returnInterval);
    }
  }, [isHovered, returnToCenter, returnSpeed, isActive, useGPU, reset]);

  /**
   * Setup event listeners
   */
  React.useEffect(() => {
    const element = elementRef.current;
    if (!element || !isActive) return;

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      stopAnimation();
    };
  }, [isActive, handleMouseMove, handleMouseEnter, handleMouseLeave, stopAnimation]);

  /**
   * Cleanup on unmount or disabled
   */
  React.useEffect(() => {
    if (disabled || prefersReducedMotion) {
      reset();
    }
  }, [disabled, prefersReducedMotion, reset]);

  /**
   * Cleanup animation on unmount
   */
  React.useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, [stopAnimation]);

  return {
    ref: elementRef,
    transform,
    isHovered,
    isActive,
    triggerMagnetic,
    reset
  };
}

/**
 * Simplified magnetic hover hook with preset configurations
 * 
 * @param preset Preset configuration name
 * @param overrides Additional configuration overrides
 * @returns Magnetic hover state and controls
 * 
 * @example
 * ```tsx
 * const magnetic = useSimpleMagneticHover('strong');
 * 
 * return (
 *   <button ref={magnetic.ref}>
 *     Magnetic Button
 *   </button>
 * );
 * ```
 */
export function useSimpleMagneticHover(
  preset: 'subtle' | 'normal' | 'strong' = 'normal',
  overrides: Partial<UseMagneticHoverConfig> = {}
): UseMagneticHoverReturn {
  const presets: Record<string, UseMagneticHoverConfig> = {
    subtle: {
      strength: 0.15,
      maxDistance: 80,
      boundaries: { x: 0.3, y: 0.3 },
      lerp: 0.08
    },
    normal: {
      strength: 0.3,
      maxDistance: 100,
      boundaries: { x: 0.5, y: 0.5 },
      lerp: 0.1
    },
    strong: {
      strength: 0.5,
      maxDistance: 150,
      boundaries: { x: 0.8, y: 0.8 },
      lerp: 0.15
    }
  };

  return useMagneticHover({
    ...presets[preset],
    ...overrides
  });
}