/**
 * Fluid Design Helper Utilities
 * 
 * Helper functions for working with fluid scales in components
 */

import { createFluidValue, FLUID_TYPOGRAPHY, FLUID_SPACING, FLUID_PAIRS, type FluidConfig } from './utopia';

/**
 * Get fluid font size by key
 */
export function getFluidFontSize(size: keyof typeof FLUID_TYPOGRAPHY): string {
  return FLUID_TYPOGRAPHY[size].clamp;
}

/**
 * Get fluid spacing by key
 */
export function getFluidSpacing(size: keyof typeof FLUID_SPACING): string {
  return FLUID_SPACING[size].clamp;
}

/**
 * Get fluid spacing pair by key
 */
export function getFluidPair(pair: keyof typeof FLUID_PAIRS): string {
  return FLUID_PAIRS[pair].clamp;
}

/**
 * Create custom fluid values on the fly
 */
export function fluid(minSize: number, maxSize: number, minViewport = 320, maxViewport = 1920): string {
  return createFluidValue(minSize, maxSize, minViewport, maxViewport);
}

/**
 * Fluid scale configuration for common use cases
 */
export const FluidPresets = {
  // Common typography patterns
  typography: {
    heading: getFluidFontSize('4xl'),
    subheading: getFluidFontSize('2xl'),
    body: getFluidFontSize('base'),
    caption: getFluidFontSize('sm'),
  },
  
  // Common spacing patterns
  spacing: {
    section: getFluidSpacing('6xl'),
    container: getFluidSpacing('4xl'),
    component: getFluidSpacing('2xl'),
    element: getFluidSpacing('md'),
    tight: getFluidSpacing('xs'),
  },
  
  // Layout patterns
  layout: {
    heroSpacing: getFluidPair('4xl-5xl'),
    cardGap: getFluidPair('lg-xl'),
    listSpacing: getFluidPair('sm-md'),
    buttonPadding: getFluidPair('xs-sm'),
  },
} as const;

/**
 * Responsive breakpoint helpers
 */
export const FluidBreakpoints = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
  ultra: 1920,
} as const;

/**
 * Create fluid value with custom breakpoints
 */
export function fluidBetween(
  minSize: number,
  maxSize: number,
  startBreakpoint: keyof typeof FluidBreakpoints,
  endBreakpoint: keyof typeof FluidBreakpoints
): string {
  return createFluidValue(
    minSize,
    maxSize,
    FluidBreakpoints[startBreakpoint],
    FluidBreakpoints[endBreakpoint]
  );
}

/**
 * Generate fluid value from mobile to desktop (common pattern)
 */
export function fluidMobileDesktop(minSize: number, maxSize: number): string {
  return fluidBetween(minSize, maxSize, 'mobile', 'desktop');
}

/**
 * Generate fluid value from tablet to wide (common pattern)
 */
export function fluidTabletWide(minSize: number, maxSize: number): string {
  return fluidBetween(minSize, maxSize, 'tablet', 'wide');
}

/**
 * CSS-in-JS style object helpers
 */
export const fluidStyles = {
  /**
   * Generate fluid typography styles
   */
  typography: (size: keyof typeof FLUID_TYPOGRAPHY, lineHeight = '1.5') => ({
    fontSize: getFluidFontSize(size),
    lineHeight,
  }),
  
  /**
   * Generate fluid spacing styles
   */
  spacing: {
    padding: (size: keyof typeof FLUID_SPACING) => ({
      padding: getFluidSpacing(size),
    }),
    
    margin: (size: keyof typeof FLUID_SPACING) => ({
      margin: getFluidSpacing(size),
    }),
    
    gap: (size: keyof typeof FLUID_SPACING) => ({
      gap: getFluidSpacing(size),
    }),
  },
  
  /**
   * Generate fluid layout styles
   */
  layout: {
    container: (maxWidth = '1200px') => ({
      maxWidth,
      margin: '0 auto',
      padding: `0 ${getFluidSpacing('md')}`,
    }),
    
    section: () => ({
      padding: `${getFluidSpacing('6xl')} 0`,
    }),
    
    grid: (minColumnWidth = '300px', gap = 'lg' as keyof typeof FLUID_SPACING) => ({
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))`,
      gap: getFluidSpacing(gap),
    }),
  },
};

/**
 * Utility to check if a value is a fluid clamp function
 */
export function isFluidValue(value: string): boolean {
  return value.includes('clamp(') && value.includes('vw');
}

/**
 * Extract min, preferred, and max values from a clamp function
 */
export function parseClampValue(clampValue: string): { min: string; preferred: string; max: string } | null {
  const match = clampValue.match(/clamp\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);
  
  if (!match) return null;
  
  return {
    min: match[1].trim(),
    preferred: match[2].trim(),
    max: match[3].trim(),
  };
}