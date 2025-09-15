/**
 * Utopia.fyi Fluid Calculator Utilities
 * 
 * Generates fluid scales for typography and spacing using clamp() functions
 * Based on Utopia.fyi methodology for responsive design
 */

export interface FluidConfig {
  minViewport: number;
  maxViewport: number;
  minSize: number;
  maxSize: number;
}

export interface TypographyScale {
  minSize: number;
  maxSize: number;
  clamp: string;
}

export interface SpacingScale {
  minSize: number;
  maxSize: number;
  clamp: string;
}

/**
 * Calculate fluid clamp() function for given min/max sizes and viewports
 */
export function calculateFluidClamp(config: FluidConfig): string {
  const { minViewport, maxViewport, minSize, maxSize } = config;
  
  // Convert viewport values from px to rem (assuming 16px base)
  const minVw = minViewport / 16;
  const maxVw = maxViewport / 16;
  
  // Calculate the slope (rate of change)
  const slope = (maxSize - minSize) / (maxVw - minVw);
  
  // Calculate the y-intercept
  const yIntercept = minSize - slope * minVw;
  
  // Format the viewport unit calculation
  const vwValue = slope * 100;
  const vwUnit = vwValue >= 0 ? `${vwValue.toFixed(4)}vw` : `${vwValue.toFixed(4)}vw`;
  const interceptValue = yIntercept >= 0 ? ` + ${yIntercept.toFixed(4)}rem` : ` - ${Math.abs(yIntercept).toFixed(4)}rem`;
  
  return `clamp(${minSize}rem, ${vwUnit}${interceptValue}, ${maxSize}rem)`;
}

/**
 * Generate typography scale using modular scale ratios
 */
export function generateTypographyScale(): Record<string, TypographyScale> {
  const baseConfig = {
    minViewport: 320,
    maxViewport: 1920,
  };

  // Typography scale based on perfect fourth (1.333) and major third (1.25) ratios
  const scales: Record<string, { min: number; max: number }> = {
    'xs': { min: 0.75, max: 0.875 },
    'sm': { min: 0.875, max: 1 },
    'base': { min: 1, max: 1.125 },
    'lg': { min: 1.125, max: 1.25 },
    'xl': { min: 1.25, max: 1.5 },
    '2xl': { min: 1.5, max: 1.875 },
    '3xl': { min: 1.875, max: 2.25 },
    '4xl': { min: 2.25, max: 3 },
    '5xl': { min: 3, max: 3.75 },
    '6xl': { min: 3.75, max: 4.5 },
    '7xl': { min: 2, max: 6 },  // Adjusted for better mobile scaling (32px to 96px)
    '8xl': { min: 6, max: 8 },
    '9xl': { min: 8, max: 12 },
  };

  const result: Record<string, TypographyScale> = {};

  for (const [key, { min, max }] of Object.entries(scales)) {
    const clamp = calculateFluidClamp({
      ...baseConfig,
      minSize: min,
      maxSize: max,
    });

    result[key] = {
      minSize: min,
      maxSize: max,
      clamp,
    };
  }

  return result;
}

/**
 * Generate spacing scale using consistent ratios
 */
export function generateSpacingScale(): Record<string, SpacingScale> {
  const baseConfig = {
    minViewport: 320,
    maxViewport: 1920,
  };

  // Spacing scale with fluid behavior
  const scales: Record<string, { min: number; max: number }> = {
    'xs': { min: 0.5, max: 0.75 },
    'sm': { min: 0.75, max: 1 },
    'md': { min: 1, max: 1.5 },
    'lg': { min: 1.5, max: 2 },
    'xl': { min: 2, max: 3 },
    '2xl': { min: 3, max: 4 },
    '3xl': { min: 4, max: 6 },
    '4xl': { min: 6, max: 8 },
    '5xl': { min: 8, max: 12 },
    '6xl': { min: 12, max: 16 },
    '7xl': { min: 16, max: 24 },
    '8xl': { min: 24, max: 32 },
    '9xl': { min: 32, max: 48 },
  };

  const result: Record<string, SpacingScale> = {};

  for (const [key, { min, max }] of Object.entries(scales)) {
    const clamp = calculateFluidClamp({
      ...baseConfig,
      minSize: min,
      maxSize: max,
    });

    result[key] = {
      minSize: min,
      maxSize: max,
      clamp,
    };
  }

  return result;
}

/**
 * Generate custom fluid value with specific parameters
 */
export function createFluidValue(
  minSize: number,
  maxSize: number,
  minViewport: number = 320,
  maxViewport: number = 1920
): string {
  return calculateFluidClamp({
    minViewport,
    maxViewport,
    minSize,
    maxSize,
  });
}

/**
 * Generate responsive pairs (min/max combinations)
 */
export function generateResponsivePairs(): Record<string, SpacingScale> {
  const baseConfig = {
    minViewport: 320,
    maxViewport: 1920,
  };

  // Common responsive pairs used in design systems
  const pairs: Record<string, { min: number; max: number }> = {
    'xs-sm': { min: 0.5, max: 0.75 },
    'sm-md': { min: 0.75, max: 1 },
    'md-lg': { min: 1, max: 1.5 },
    'lg-xl': { min: 1.5, max: 2 },
    'xl-2xl': { min: 2, max: 3 },
    '2xl-3xl': { min: 3, max: 4 },
    '3xl-4xl': { min: 4, max: 6 },
    '4xl-5xl': { min: 6, max: 8 },
    '5xl-6xl': { min: 8, max: 12 },
    '6xl-7xl': { min: 12, max: 16 },
    '7xl-8xl': { min: 16, max: 24 },
    '8xl-9xl': { min: 24, max: 32 },
  };

  const result: Record<string, SpacingScale> = {};

  for (const [key, { min, max }] of Object.entries(pairs)) {
    const clamp = calculateFluidClamp({
      ...baseConfig,
      minSize: min,
      maxSize: max,
    });

    result[key] = {
      minSize: min,
      maxSize: max,
      clamp,
    };
  }

  return result;
}

/**
 * Viewport range configuration
 */
export const VIEWPORT_RANGE = {
  min: 320, // Mobile minimum
  max: 1920, // Desktop maximum
} as const;

/**
 * Typography ratios
 */
export const TYPOGRAPHY_RATIOS = {
  minorSecond: 1.067,
  majorSecond: 1.125,
  minorThird: 1.2,
  majorThird: 1.25,
  perfectFourth: 1.333,
  tritone: 1.414,
  perfectFifth: 1.5,
  goldenRatio: 1.618,
} as const;

/**
 * Pre-calculated scales for immediate use
 */
export const FLUID_TYPOGRAPHY = generateTypographyScale();
export const FLUID_SPACING = generateSpacingScale();
export const FLUID_PAIRS = generateResponsivePairs();