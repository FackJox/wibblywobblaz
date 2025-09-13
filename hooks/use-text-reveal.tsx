"use client"

import * as React from "react"
import { willChangeHelpers } from "../lib/will-change-manager"
import { animationBudget } from "../lib/animation-frame-budget"
import { 
  prepareTextForReveal, 
  animateTextReveal, 
  resetTextReveal,
  shouldReduceMotion,
  type TextRevealConfig 
} from "../lib/hover-utils"
import { usePrefersReducedMotion } from "./use-performance"

/**
 * Configuration for text reveal effect
 */
export interface UseTextRevealConfig extends TextRevealConfig {
  /** Whether the effect is enabled */
  disabled?: boolean;
  /** Whether to reset animation when mouse leaves */
  resetOnLeave?: boolean;
  /** Whether to trigger on hover or manually */
  triggerOn?: 'hover' | 'manual';
  /** Direction of reveal animation */
  direction?: 'forward' | 'reverse' | 'center-out' | 'random';
  /** Whether to preserve original HTML content */
  preserveContent?: boolean;
}

/**
 * Return type for useTextReveal hook
 */
export interface UseTextRevealReturn<T extends HTMLElement = HTMLElement> {
  /** Ref to attach to the text element */
  ref: React.RefObject<T | null>;
  /** Array of span elements for each character/word */
  spans: HTMLElement[];
  /** Whether the text is currently revealed */
  isRevealed: boolean;
  /** Whether the effect is active (not disabled by reduced motion) */
  isActive: boolean;
  /** Whether the element is currently being hovered */
  isHovered: boolean;
  /** Manually trigger the reveal animation */
  reveal: () => void;
  /** Manually hide the text */
  hide: () => void;
  /** Reset to original state */
  reset: () => void;
  /** Toggle reveal state */
  toggle: () => void;
}

/**
 * Hook for creating text reveal animations on hover
 * 
 * @param config Text reveal configuration
 * @returns Text reveal state and controls
 * 
 * @example
 * ```tsx
 * const textReveal = useTextReveal({
 *   type: 'slide',
 *   by: 'character',
 *   stagger: 50,
 *   direction: 'forward'
 * });
 * 
 * return (
 *   <h1 ref={textReveal.ref}>
 *     Text that reveals character by character
 *   </h1>
 * );
 * ```
 */
export function useTextReveal<T extends HTMLElement = HTMLElement>(
  config: UseTextRevealConfig = {}
): UseTextRevealReturn<T> {
  const {
    type = 'slide',
    stagger = 50,
    duration = 300,
    easing = 'ease',
    by = 'character',
    disabled = false,
    resetOnLeave = true,
    triggerOn = 'hover',
    direction = 'forward',
    preserveContent = false
  } = config;

  const prefersReducedMotion = usePrefersReducedMotion();
  const elementRef = React.useRef<T>(null);
  
  const [spans, setSpans] = React.useState<HTMLElement[]>([]);
  const [isRevealed, setIsRevealed] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Store original content for restoration
  const originalContentRef = React.useRef<string>('');
  const isInitializedRef = React.useRef(false);
  
  const isActive = !disabled && !prefersReducedMotion;

  /**
   * Initialize text spans for animation
   */
  const initializeText = React.useCallback(() => {
    if (!elementRef.current || !isActive || isInitializedRef.current) return;

    // Store original content
    originalContentRef.current = elementRef.current.textContent || '';
    
    if (!originalContentRef.current.trim()) return;

    // Prepare text for reveal animation
    const spanElements = prepareTextForReveal(elementRef.current, {
      type,
      by,
      stagger,
      duration,
      easing
    });
    
    // Apply direction-based ordering
    let orderedSpans = [...spanElements];
    switch (direction) {
      case 'reverse':
        orderedSpans = orderedSpans.reverse();
        break;
      case 'center-out':
        const center = Math.floor(orderedSpans.length / 2);
        const leftSide = orderedSpans.slice(0, center).reverse();
        const rightSide = orderedSpans.slice(center);
        orderedSpans = [];
        
        // Interleave from center outward
        for (let i = 0; i < Math.max(leftSide.length, rightSide.length); i++) {
          if (rightSide[i]) orderedSpans.push(rightSide[i]);
          if (leftSide[i]) orderedSpans.push(leftSide[i]);
        }
        break;
      case 'random':
        // Shuffle array
        for (let i = orderedSpans.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [orderedSpans[i], orderedSpans[j]] = [orderedSpans[j], orderedSpans[i]];
        }
        break;
      // 'forward' is default order
    }
    
    setSpans(orderedSpans);
    isInitializedRef.current = true;
  }, [isActive, type, by, stagger, duration, easing, direction]);

  /**
   * Reveal text animation
   */
  const reveal = React.useCallback(() => {
    if (!isActive || isRevealed || spans.length === 0) return;

    setIsRevealed(true);
    
    // Use reduced motion settings if preferred
    const animationConfig = prefersReducedMotion 
      ? { ...config, stagger: 20, duration: 150, type: 'fade' as const }
      : { type, stagger, duration, easing };
    
    animateTextReveal(spans, animationConfig);
  }, [isActive, isRevealed, spans, prefersReducedMotion, config, type, stagger, duration, easing]);

  /**
   * Hide text animation
   */
  const hide = React.useCallback(() => {
    if (!isActive || !isRevealed || spans.length === 0) return;

    setIsRevealed(false);
    
    // Reverse the animation order for hide
    const reverseSpans = [...spans].reverse();
    
    const hideConfig = prefersReducedMotion
      ? { type: 'fade' as const, stagger: 10, duration: 100, easing }
      : { type, stagger: stagger / 2, duration: duration / 2, easing };
    
    resetTextReveal(reverseSpans, hideConfig);
  }, [isActive, isRevealed, spans, prefersReducedMotion, type, stagger, duration, easing]);

  /**
   * Reset to original state
   */
  const reset = React.useCallback(() => {
    if (!elementRef.current) return;

    setIsRevealed(false);
    setSpans([]);
    isInitializedRef.current = false;
    
    // Restore original content
    if (originalContentRef.current && preserveContent) {
      elementRef.current.textContent = originalContentRef.current;
    }
  }, [preserveContent]);

  /**
   * Toggle reveal state
   */
  const toggle = React.useCallback(() => {
    if (isRevealed) {
      hide();
    } else {
      reveal();
    }
  }, [isRevealed, hide, reveal]);

  /**
   * Handle mouse enter events
   */
  const handleMouseEnter = React.useCallback(() => {
    setIsHovered(true);
    
    if (triggerOn === 'hover' && isActive) {
      reveal();
    }
  }, [triggerOn, isActive, reveal]);

  /**
   * Handle mouse leave events
   */
  const handleMouseLeave = React.useCallback(() => {
    setIsHovered(false);
    
    if (triggerOn === 'hover' && resetOnLeave && isActive) {
      hide();
    }
  }, [triggerOn, resetOnLeave, isActive, hide]);

  /**
   * Initialize text when element is ready
   */
  React.useEffect(() => {
    if (elementRef.current && isActive) {
      initializeText();
    }
  }, [initializeText, isActive]);

  /**
   * Setup event listeners
   */
  React.useEffect(() => {
    const element = elementRef.current;
    if (!element || triggerOn !== 'hover') return;

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [triggerOn, handleMouseEnter, handleMouseLeave]);

  /**
   * Reset when disabled or reduced motion changes
   */
  React.useEffect(() => {
    if (disabled || (prefersReducedMotion && !isActive)) {
      reset();
    }
  }, [disabled, prefersReducedMotion, isActive, reset]);

  /**
   * Auto-reveal if not hover-triggered
   */
  React.useEffect(() => {
    if (triggerOn === 'manual' && isActive && spans.length > 0 && !isRevealed) {
      // Optional: Auto-reveal on mount for manual trigger mode
      // Uncomment if desired: reveal();
    }
  }, [triggerOn, isActive, spans.length, isRevealed, reveal]);

  return {
    ref: elementRef,
    spans,
    isRevealed,
    isActive,
    isHovered,
    reveal,
    hide,
    reset,
    toggle
  };
}

/**
 * Simplified text reveal hook with preset configurations
 * 
 * @param preset Preset configuration name
 * @param overrides Additional configuration overrides
 * @returns Text reveal state and controls
 * 
 * @example
 * ```tsx
 * const textReveal = useSimpleTextReveal('typewriter');
 * 
 * return (
 *   <h2 ref={textReveal.ref}>
 *     Text with typewriter effect
 *   </h2>
 * );
 * ```
 */
export function useSimpleTextReveal<T extends HTMLElement = HTMLElement>(
  preset: 'fade' | 'slide' | 'typewriter' | 'wave' | 'bounce' = 'slide',
  overrides: Partial<UseTextRevealConfig> = {}
): UseTextRevealReturn<T> {
  const presets: Record<string, UseTextRevealConfig> = {
    fade: {
      type: 'fade',
      by: 'word',
      stagger: 100,
      duration: 300,
      direction: 'forward'
    },
    slide: {
      type: 'slide',
      by: 'character',
      stagger: 50,
      duration: 300,
      direction: 'forward'
    },
    typewriter: {
      type: 'fade',
      by: 'character',
      stagger: 80,
      duration: 200,
      direction: 'forward',
      easing: 'ease-out'
    },
    wave: {
      type: 'slide',
      by: 'character',
      stagger: 30,
      duration: 400,
      direction: 'forward',
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },
    bounce: {
      type: 'scale',
      by: 'character',
      stagger: 40,
      duration: 350,
      direction: 'center-out',
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }
  };

  return useTextReveal({
    ...presets[preset],
    ...overrides
  });
}