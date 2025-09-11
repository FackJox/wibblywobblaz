/**
 * Lazy Loading Components for Performance Optimization
 * 
 * This module provides lazy-loaded wrappers for animation components
 * that are conditionally loaded based on:
 * - Feature flags
 * - Device capabilities
 * - Viewport intersection
 * - Performance budgets
 */

// Main lazy loading components
export { LazyParallax, useLazyParallax } from './lazy-parallax'
export { 
  LazyScrollAnimations, 
  useLazyScrollAnimations,
  LazyFadeInOnScroll,
  LazySlideUpOnScroll,
  scrollAnimationPresets
} from './lazy-scroll-animations'
export { 
  LazyTextReveal,
  useLazyTextReveal,
  LazyTypewriterText,
  LazyWaveText,
  LazySlideUpText,
  LazyTextRevealGroup
} from './lazy-text-reveal'

// General purpose lazy animation wrapper
export { LazyAnimationWrapper, useLazyAnimation } from './lazy-animation-wrapper'

// Animation presets and utilities
export { animationPresets, createAnimationConfig } from './animation-presets'