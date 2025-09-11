"use client"

import * as React from "react"
import { willChangeHelpers } from "../lib/will-change-manager"
import { animationBudget } from "../lib/animation-frame-budget"
import { 
  getCursorPosition, 
  createFollowGradient,
  lerp,
  shouldReduceMotion,
  safeRequestAnimationFrame,
  safeCancelAnimationFrame,
  throttle,
  type GradientFollowConfig,
  type Point,
  type Bounds 
} from "../lib/hover-utils"
import { usePrefersReducedMotion } from "./use-performance"

/**
 * Configuration for gradient follow effect
 */
export interface UseGradientFollowConfig extends GradientFollowConfig {
  /** Whether the effect is enabled */
  disabled?: boolean;
  /** Update frequency for smooth animation (lower = smoother, higher = more performant) */
  updateInterval?: number;
  /** Whether to show gradient only on hover */
  hoverOnly?: boolean;
  /** Custom CSS property name for the gradient */
  cssProperty?: string;
  /** Whether to use backdrop-filter instead of background */
  useBackdropFilter?: boolean;
}

/**
 * Return type for useGradientFollow hook
 */
export interface UseGradientFollowReturn {
  /** Ref to attach to the element */
  ref: React.RefObject<HTMLElement>;
  /** Current cursor position relative to element */
  cursorPosition: Point;
  /** Current gradient CSS value */
  gradientValue: string;
  /** Whether cursor is currently over the element */
  isHovered: boolean;
  /** Whether the effect is active (not disabled by reduced motion) */
  isActive: boolean;
  /** Manually set cursor position */
  setCursorPosition: (position: Point) => void;
  /** Reset gradient effect */
  reset: () => void;
}

/**
 * Hook for creating gradient effects that follow the cursor
 * 
 * @param config Gradient follow configuration
 * @returns Gradient follow state and controls
 * 
 * @example
 * ```tsx
 * const gradient = useGradientFollow({
 *   radius: 200,
 *   colors: ['rgba(255, 255, 255, 0.2)', 'transparent'],
 *   smooth: true
 * });
 * 
 * return (
 *   <div 
 *     ref={gradient.ref} 
 *     style={{ 
 *       background: gradient.isActive ? gradient.gradientValue : 'none',
 *       transition: 'background 0.3s ease'
 *     }}
 *   >
 *     Gradient follows cursor
 *   </div>
 * );
 * ```
 */
export function useGradientFollow(
  config: UseGradientFollowConfig = {}
): UseGradientFollowReturn {
  const {
    radius = 200,
    colors = ['rgba(255, 255, 255, 0.1)', 'transparent'],
    opacity = 1,
    smooth = true,
    smoothFactor = 0.1,
    disabled = false,
    updateInterval = 16,
    hoverOnly = true,
    cssProperty = 'background',
    useBackdropFilter = false
  } = config;

  const prefersReducedMotion = usePrefersReducedMotion();
  const elementRef = React.useRef<HTMLElement>(null);
  
  const [cursorPosition, setCursorPositionState] = React.useState<Point>({ x: 0, y: 0 });
  const [gradientValue, setGradientValue] = React.useState<string>('');
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Animation state
  const animationFrameRef = React.useRef<number | null>(null);
  const targetPositionRef = React.useRef<Point>({ x: 0, y: 0 });
  const currentPositionRef = React.useRef<Point>({ x: 0, y: 0 });
  const elementBoundsRef = React.useRef<Bounds>({ 
    top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 
  });
  
  const isActive = !disabled && !prefersReducedMotion && (!hoverOnly || isHovered);

  /**
   * Update element bounds cache
   */
  const updateBounds = React.useCallback(() => {
    if (!elementRef.current) return;
    
    const rect = elementRef.current.getBoundingClientRect();
    elementBoundsRef.current = {
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
      width: rect.width,
      height: rect.height
    };
  }, []);

  /**
   * Generate gradient based on current position
   */
  const generateGradient = React.useCallback((position: Point) => {
    const bounds = elementBoundsRef.current;
    if (!bounds.width || !bounds.height) return '';

    return createFollowGradient(position, bounds, {
      radius,
      colors,
      opacity
    });
  }, [radius, colors, opacity]);

  /**
   * Smooth animation update loop
   */
  const updateGradient = React.useCallback(() => {
    if (!isActive) return;

    const current = currentPositionRef.current;
    const target = targetPositionRef.current;
    
    if (smooth) {
      // Lerp towards target position
      const newX = lerp(current.x, target.x, smoothFactor);
      const newY = lerp(current.y, target.y, smoothFactor);
      
      currentPositionRef.current = { x: newX, y: newY };
      setCursorPositionState({ x: newX, y: newY });
    } else {
      currentPositionRef.current = target;
      setCursorPositionState(target);
    }
    
    const gradient = generateGradient(currentPositionRef.current);
    setGradientValue(gradient);
    
    // Apply gradient to element if cssProperty is provided
    if (elementRef.current && cssProperty) {
      if (useBackdropFilter) {
        (elementRef.current.style as any)[cssProperty] = `blur(0px) ${gradient}`;
      } else {
        (elementRef.current.style as any)[cssProperty] = gradient;
      }
    }
    
    // Continue animation if smoothing and not at target
    if (smooth) {
      const threshold = 1;
      if (
        Math.abs(currentPositionRef.current.x - target.x) > threshold ||
        Math.abs(currentPositionRef.current.y - target.y) > threshold
      ) {
        animationFrameRef.current = safeRequestAnimationFrame(updateGradient);
      }
    }
  }, [isActive, smooth, smoothFactor, generateGradient, cssProperty, useBackdropFilter]);

  /**
   * Start animation loop
   */
  const startAnimation = React.useCallback(() => {
    if (animationFrameRef.current) return;
    animationFrameRef.current = safeRequestAnimationFrame(updateGradient);
  }, [updateGradient]);

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
   * Throttled mouse move handler for performance
   */
  const handleMouseMove = React.useMemo(
    () => throttle((event: MouseEvent) => {
      if (!elementRef.current || !isActive) return;

      updateBounds();
      const cursorPos = getCursorPosition(event, elementRef.current);
      
      targetPositionRef.current = cursorPos;
      
      if (smooth) {
        startAnimation();
      } else {
        updateGradient();
      }
    }, updateInterval),
    [isActive, updateBounds, smooth, startAnimation, updateGradient, updateInterval]
  );

  /**
   * Handle mouse enter events
   */
  const handleMouseEnter = React.useCallback((event: MouseEvent) => {
    setIsHovered(true);
    updateBounds();
    handleMouseMove(event);
  }, [updateBounds, handleMouseMove]);

  /**
   * Handle mouse leave events
   */
  const handleMouseLeave = React.useCallback(() => {
    setIsHovered(false);
    
    if (hoverOnly) {
      setGradientValue('');
      if (elementRef.current && cssProperty) {
        (elementRef.current.style as any)[cssProperty] = '';
      }
    }
    
    stopAnimation();
  }, [hoverOnly, cssProperty, stopAnimation]);

  /**
   * Manually set cursor position
   */
  const setCursorPosition = React.useCallback((position: Point) => {
    targetPositionRef.current = position;
    
    if (isActive) {
      if (smooth) {
        startAnimation();
      } else {
        updateGradient();
      }
    }
  }, [isActive, smooth, startAnimation, updateGradient]);

  /**
   * Reset gradient effect
   */
  const reset = React.useCallback(() => {
    stopAnimation();
    
    targetPositionRef.current = { x: 0, y: 0 };
    currentPositionRef.current = { x: 0, y: 0 };
    setCursorPositionState({ x: 0, y: 0 });
    setGradientValue('');
    
    if (elementRef.current && cssProperty) {
      (elementRef.current.style as any)[cssProperty] = '';
    }
  }, [stopAnimation, cssProperty]);

  /**
   * Setup event listeners
   */
  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    // Update bounds on resize
    const handleResize = () => updateBounds();
    window.addEventListener('resize', handleResize);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      stopAnimation();
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave, updateBounds, stopAnimation]);

  /**
   * Reset when disabled or reduced motion
   */
  React.useEffect(() => {
    if (disabled || prefersReducedMotion) {
      reset();
    }
  }, [disabled, prefersReducedMotion, reset]);

  /**
   * Cleanup on unmount
   */
  React.useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, [stopAnimation]);

  return {
    ref: elementRef,
    cursorPosition,
    gradientValue,
    isHovered,
    isActive,
    setCursorPosition,
    reset
  };
}

/**
 * Simplified gradient follow hook with preset configurations
 * 
 * @param preset Preset configuration name
 * @param overrides Additional configuration overrides
 * @returns Gradient follow state and controls
 * 
 * @example
 * ```tsx
 * const gradient = useSimpleGradientFollow('spotlight');
 * 
 * return (
 *   <div 
 *     ref={gradient.ref}
 *     style={{ background: gradient.gradientValue }}
 *   >
 *     Content with spotlight effect
 *   </div>
 * );
 * ```
 */
export function useSimpleGradientFollow(
  preset: 'subtle' | 'spotlight' | 'glow' | 'rainbow' = 'subtle',
  overrides: Partial<UseGradientFollowConfig> = {}
): UseGradientFollowReturn {
  const presets: Record<string, UseGradientFollowConfig> = {
    subtle: {
      radius: 150,
      colors: ['rgba(255, 255, 255, 0.05)', 'transparent'],
      smooth: true,
      smoothFactor: 0.08
    },
    spotlight: {
      radius: 200,
      colors: ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.05)', 'transparent'],
      smooth: true,
      smoothFactor: 0.12
    },
    glow: {
      radius: 300,
      colors: [
        'rgba(59, 130, 246, 0.3)', 
        'rgba(139, 92, 246, 0.2)', 
        'rgba(236, 72, 153, 0.1)', 
        'transparent'
      ],
      smooth: true,
      smoothFactor: 0.1
    },
    rainbow: {
      radius: 250,
      colors: [
        'rgba(255, 0, 150, 0.2)',
        'rgba(0, 255, 150, 0.15)',
        'rgba(150, 0, 255, 0.1)',
        'transparent'
      ],
      smooth: true,
      smoothFactor: 0.15
    }
  };

  return useGradientFollow({
    ...presets[preset],
    ...overrides
  });
}