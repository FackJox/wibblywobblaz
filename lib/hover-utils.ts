/**
 * Hover Utilities for Microinteractions System
 * 
 * This module provides utility functions for cursor tracking, magnetic effects,
 * and hover-based animations. All utilities are optimized for performance
 * and support reduced motion preferences.
 */

/**
 * Point interface for cursor positions
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Rectangle bounds for element positioning
 */
export interface Bounds {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
}

/**
 * Configuration for magnetic hover effects
 */
export interface MagneticConfig {
  /** Attraction strength (0-1) */
  strength?: number;
  /** Maximum distance for attraction in pixels */
  maxDistance?: number;
  /** Movement boundaries (percentage of element size) */
  boundaries?: {
    x?: number;
    y?: number;
  };
  /** Smooth interpolation factor (0-1) */
  lerp?: number;
  /** Whether to use GPU acceleration */
  useGPU?: boolean;
}

/**
 * Configuration for gradient following effects
 */
export interface GradientFollowConfig {
  /** Gradient radius in pixels */
  radius?: number;
  /** Gradient color stops */
  colors?: string[];
  /** Opacity of the gradient effect */
  opacity?: number;
  /** Whether to smooth cursor movement */
  smooth?: boolean;
  /** Smoothing factor (0-1) */
  smoothFactor?: number;
}

/**
 * Configuration for text reveal effects
 */
export interface TextRevealConfig {
  /** Animation type */
  type?: 'fade' | 'slide' | 'scale' | 'rotate';
  /** Stagger delay between characters/words */
  stagger?: number;
  /** Animation duration per character/word */
  duration?: number;
  /** Animation easing */
  easing?: string;
  /** Whether to animate by character or word */
  by?: 'character' | 'word';
}

/**
 * Gets the current cursor position relative to an element
 */
export function getCursorPosition(event: MouseEvent, element: HTMLElement): Point {
  const rect = element.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

/**
 * Gets the center position of an element
 */
export function getElementCenter(element: HTMLElement): Point {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.width / 2,
    y: rect.height / 2
  };
}

/**
 * Calculates distance between two points
 */
export function getDistance(point1: Point, point2: Point): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/**
 * Clamps a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculates magnetic attraction force
 */
export function calculateMagneticForce(
  cursorPos: Point,
  elementCenter: Point,
  config: MagneticConfig = {}
): Point {
  const { strength = 0.3, maxDistance = 100, boundaries = { x: 0.5, y: 0.5 } } = config;
  
  const dx = cursorPos.x - elementCenter.x;
  const dy = cursorPos.y - elementCenter.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // No attraction if cursor is too far away
  if (distance > maxDistance) {
    return { x: 0, y: 0 };
  }
  
  // Calculate force with distance-based falloff
  const forceFactor = (1 - distance / maxDistance) * strength;
  
  const forceX = clamp(dx * forceFactor, -boundaries.x! * 50, boundaries.x! * 50);
  const forceY = clamp(dy * forceFactor, -boundaries.y! * 50, boundaries.y! * 50);
  
  return { x: forceX, y: forceY };
}

/**
 * Applies transform to element with performance optimization
 */
export function applyTransform(
  element: HTMLElement,
  transform: { x: number; y: number },
  useGPU: boolean = true
): void {
  const transformValue = useGPU
    ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
    : `translate(${transform.x}px, ${transform.y}px)`;
  
  element.style.transform = transformValue;
}

/**
 * Creates a CSS gradient string for cursor following
 */
export function createFollowGradient(
  position: Point,
  elementBounds: Bounds,
  config: GradientFollowConfig = {}
): string {
  const {
    radius = 200,
    colors = ['rgba(255, 255, 255, 0.1)', 'transparent'],
    opacity = 1
  } = config;
  
  // Calculate position as percentage
  const xPercent = (position.x / elementBounds.width) * 100;
  const yPercent = (position.y / elementBounds.height) * 100;
  
  // Create radial gradient
  const colorStops = colors.map((color, index) => {
    const adjustedColor = color.replace(/rgba?\([^)]+\)/, (match) => {
      const values = match.match(/[\d.]+/g);
      if (values && values.length >= 3) {
        const [r, g, b] = values;
        const alpha = values[3] ? parseFloat(values[3]) * opacity : opacity;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
      return match;
    });
    
    const stopPosition = (index / (colors.length - 1)) * 100;
    return `${adjustedColor} ${stopPosition}%`;
  }).join(', ');
  
  return `radial-gradient(${radius}px at ${xPercent}% ${yPercent}%, ${colorStops})`;
}

/**
 * Prepares text element for character/word animation
 */
export function prepareTextForReveal(
  element: HTMLElement,
  config: TextRevealConfig = {}
): HTMLElement[] {
  const { by = 'character' } = config;
  const text = element.textContent || '';
  
  // Clear existing content
  element.innerHTML = '';
  
  const spans: HTMLElement[] = [];
  
  if (by === 'character') {
    // Split by characters, preserving spaces
    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char; // Non-breaking space
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px)';
      span.style.transition = 'opacity 300ms ease, transform 300ms ease';
      span.dataset.index = index.toString();
      
      element.appendChild(span);
      spans.push(span);
    });
  } else {
    // Split by words
    text.split(' ').forEach((word, index) => {
      const span = document.createElement('span');
      span.textContent = word;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px)';
      span.style.transition = 'opacity 300ms ease, transform 300ms ease';
      span.dataset.index = index.toString();
      
      element.appendChild(span);
      spans.push(span);
      
      // Add space after each word (except the last)
      if (index < text.split(' ').length - 1) {
        element.appendChild(document.createTextNode(' '));
      }
    });
  }
  
  return spans;
}

/**
 * Animates text reveal with staggered timing
 */
export function animateTextReveal(
  spans: HTMLElement[],
  config: TextRevealConfig = {}
): void {
  const {
    type = 'slide',
    stagger = 50,
    duration = 300,
    easing = 'ease'
  } = config;
  
  spans.forEach((span, index) => {
    setTimeout(() => {
      span.style.opacity = '1';
      
      switch (type) {
        case 'slide':
          span.style.transform = 'translateY(0)';
          break;
        case 'scale':
          span.style.transform = 'scale(1)';
          break;
        case 'rotate':
          span.style.transform = 'rotateX(0deg)';
          break;
        case 'fade':
        default:
          // Opacity is already set above
          break;
      }
    }, index * stagger);
  });
}

/**
 * Resets text reveal animation
 */
export function resetTextReveal(
  spans: HTMLElement[],
  config: TextRevealConfig = {}
): void {
  const { type = 'slide' } = config;
  
  spans.forEach(span => {
    span.style.opacity = '0';
    
    switch (type) {
      case 'slide':
        span.style.transform = 'translateY(20px)';
        break;
      case 'scale':
        span.style.transform = 'scale(0.8)';
        break;
      case 'rotate':
        span.style.transform = 'rotateX(90deg)';
        break;
      case 'fade':
      default:
        // Only opacity needs to be reset
        break;
    }
  });
}

/**
 * Creates a parallax depth effect based on cursor position
 */
export function calculateParallaxOffset(
  cursorPos: Point,
  elementCenter: Point,
  elementBounds: Bounds,
  depth: number = 0.1
): { x: number; y: number; rotation: number } {
  // Normalize cursor position (-1 to 1)
  const normalizedX = ((cursorPos.x - elementCenter.x) / elementBounds.width) * 2;
  const normalizedY = ((cursorPos.y - elementCenter.y) / elementBounds.height) * 2;
  
  // Calculate parallax offsets
  const offsetX = normalizedX * depth * 20; // 20px max offset
  const offsetY = normalizedY * depth * 20;
  
  // Calculate rotation (subtle)
  const rotation = (normalizedX * depth * 5); // 5 degrees max
  
  return {
    x: offsetX,
    y: offsetY,
    rotation
  };
}

/**
 * Checks if reduced motion is preferred
 */
export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Safe requestAnimationFrame with fallback
 */
export function safeRequestAnimationFrame(callback: FrameRequestCallback): number {
  if (typeof requestAnimationFrame !== 'undefined') {
    return requestAnimationFrame(callback);
  }
  return setTimeout(callback, 16); // 60fps fallback
}

/**
 * Safe cancelAnimationFrame with fallback
 */
export function safeCancelAnimationFrame(id: number): void {
  if (typeof cancelAnimationFrame !== 'undefined') {
    cancelAnimationFrame(id);
  } else {
    clearTimeout(id);
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null;
  let previous = 0;

  return function executedFunction(...args: Parameters<T>) {
    const now = Date.now();

    if (!previous || now - previous >= wait) {
      func(...args);
      previous = now;
    } else if (!timeout) {
      timeout = setTimeout(() => {
        func(...args);
        timeout = null;
        previous = Date.now();
      }, wait - (now - previous));
    }
  };
}

/**
 * Creates optimized event handlers with cleanup
 */
export function createHoverHandler(
  element: HTMLElement,
  handlers: {
    onEnter?: (event: MouseEvent) => void;
    onLeave?: (event: MouseEvent) => void;
    onMove?: (event: MouseEvent) => void;
  }
): () => void {
  const { onEnter, onLeave, onMove } = handlers;
  
  // Throttle move handler for performance
  const throttledMove = onMove ? throttle(onMove, 16) : undefined; // 60fps
  
  const handleMouseEnter = (event: MouseEvent) => {
    onEnter?.(event);
  };
  
  const handleMouseLeave = (event: MouseEvent) => {
    onLeave?.(event);
  };
  
  const handleMouseMove = (event: MouseEvent) => {
    throttledMove?.(event);
  };
  
  // Add event listeners
  if (onEnter) element.addEventListener('mouseenter', handleMouseEnter);
  if (onLeave) element.addEventListener('mouseleave', handleMouseLeave);
  if (onMove) element.addEventListener('mousemove', handleMouseMove);
  
  // Return cleanup function
  return () => {
    if (onEnter) element.removeEventListener('mouseenter', handleMouseEnter);
    if (onLeave) element.removeEventListener('mouseleave', handleMouseLeave);
    if (onMove) element.removeEventListener('mousemove', handleMouseMove);
  };
}