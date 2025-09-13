"use client"

import { AnimationType } from "../../hooks/use-feature-flags"

/**
 * Animation presets and configuration utilities
 * 
 * Provides pre-configured animation settings optimized for different
 * performance levels and device capabilities.
 */

export interface AnimationConfig {
  duration: number
  easing: string
  delay: number
  properties: string[]
  complexity: 'low' | 'medium' | 'high'
  frameRate: number
  useGPU: boolean
}

/**
 * Base animation configurations by type
 */
export const animationPresets: Record<AnimationType, {
  low: AnimationConfig
  medium: AnimationConfig
  high: AnimationConfig
}> = {
  micro: {
    low: {
      duration: 150,
      easing: 'ease',
      delay: 0,
      properties: ['opacity', 'scale'],
      complexity: 'low',
      frameRate: 30,
      useGPU: true
    },
    medium: {
      duration: 200,
      easing: 'ease-out',
      delay: 0,
      properties: ['opacity', 'scale', 'translateY'],
      complexity: 'medium',
      frameRate: 45,
      useGPU: true
    },
    high: {
      duration: 250,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      delay: 0,
      properties: ['opacity', 'scale', 'translateY', 'rotate'],
      complexity: 'high',
      frameRate: 60,
      useGPU: true
    }
  },

  hover: {
    low: {
      duration: 200,
      easing: 'ease',
      delay: 0,
      properties: ['scale', 'opacity'],
      complexity: 'low',
      frameRate: 30,
      useGPU: true
    },
    medium: {
      duration: 300,
      easing: 'ease-out',
      delay: 0,
      properties: ['scale', 'translateY', 'opacity'],
      complexity: 'medium',
      frameRate: 45,
      useGPU: true
    },
    high: {
      duration: 400,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      delay: 0,
      properties: ['scale', 'translateY', 'rotate', 'filter'],
      complexity: 'high',
      frameRate: 60,
      useGPU: true
    }
  },

  transition: {
    low: {
      duration: 300,
      easing: 'ease',
      delay: 0,
      properties: ['opacity', 'translateX'],
      complexity: 'low',
      frameRate: 30,
      useGPU: true
    },
    medium: {
      duration: 400,
      easing: 'ease-in-out',
      delay: 0,
      properties: ['opacity', 'translateX', 'scale'],
      complexity: 'medium',
      frameRate: 45,
      useGPU: true
    },
    high: {
      duration: 500,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      delay: 0,
      properties: ['opacity', 'translateX', 'scale', 'rotate', 'filter'],
      complexity: 'high',
      frameRate: 60,
      useGPU: true
    }
  },

  scroll: {
    low: {
      duration: 0, // Scroll animations are driven by scroll position
      easing: 'linear',
      delay: 0,
      properties: ['translateY', 'opacity'],
      complexity: 'low',
      frameRate: 15, // Lower frame rate for scroll
      useGPU: true
    },
    medium: {
      duration: 0,
      easing: 'ease-out',
      delay: 0,
      properties: ['translateY', 'scale', 'opacity'],
      complexity: 'medium',
      frameRate: 30,
      useGPU: true
    },
    high: {
      duration: 0,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      delay: 0,
      properties: ['translateY', 'translateX', 'scale', 'rotate', 'opacity'],
      complexity: 'high',
      frameRate: 45, // Still capped for scroll performance
      useGPU: true
    }
  },

  complex: {
    low: {
      duration: 800,
      easing: 'ease',
      delay: 0,
      properties: ['opacity', 'scale'],
      complexity: 'low',
      frameRate: 30,
      useGPU: true
    },
    medium: {
      duration: 1200,
      easing: 'ease-in-out',
      delay: 0,
      properties: ['opacity', 'scale', 'translateY', 'rotate'],
      complexity: 'medium',
      frameRate: 45,
      useGPU: true
    },
    high: {
      duration: 1600,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      delay: 0,
      properties: ['opacity', 'scale', 'translateY', 'translateX', 'rotate', 'filter', 'backdrop-filter'],
      complexity: 'high',
      frameRate: 60,
      useGPU: true
    }
  }
}

/**
 * Create animation configuration based on type and quality
 */
export function createAnimationConfig(
  type: AnimationType,
  quality: 'low' | 'medium' | 'high',
  overrides?: Partial<AnimationConfig>
): AnimationConfig {
  const baseConfig = animationPresets[type][quality]
  return {
    ...baseConfig,
    ...overrides
  }
}

/**
 * Get CSS custom properties for animation configuration
 */
export function getAnimationCSSProps(config: AnimationConfig): Record<string, string> {
  return {
    '--animation-duration': `${config.duration}ms`,
    '--animation-easing': config.easing,
    '--animation-delay': `${config.delay}ms`,
    '--animation-frame-rate': `${1000 / config.frameRate}ms`, // Frame interval
  }
}

/**
 * Performance budget calculations
 */
export function calculateAnimationBudget(
  animationType: AnimationType,
  instanceCount: number,
  deviceCapabilities: {
    isLowEnd: boolean
    hasGoodGpu: boolean
  }
): {
  maxInstances: number
  quality: 'low' | 'medium' | 'high'
  shouldDefer: boolean
} {
  // Determine quality based on device capabilities
  let quality: 'low' | 'medium' | 'high' = 'medium'
  
  if (deviceCapabilities.isLowEnd) {
    quality = 'low'
  } else if (deviceCapabilities.hasGoodGpu) {
    quality = 'high'
  }

  // Calculate max instances based on animation type and device
  const maxInstances = (() => {
    const baseMax = {
      micro: 10,
      hover: 5,
      transition: 8,
      scroll: 4,
      complex: 2
    }[animationType]

    if (deviceCapabilities.isLowEnd) {
      return Math.max(1, Math.floor(baseMax * 0.3))
    } else if (!deviceCapabilities.hasGoodGpu) {
      return Math.floor(baseMax * 0.6)
    } else {
      return baseMax
    }
  })()

  const shouldDefer = instanceCount >= maxInstances

  return { maxInstances, quality, shouldDefer }
}

/**
 * Animation timing functions optimized for different scenarios
 */
export const easingFunctions = {
  // GPU-optimized easings (avoid complex calculations)
  gpuOptimized: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear'
  },
  
  // Performance-conscious custom easings
  efficient: {
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    sharp: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    gentle: 'cubic-bezier(0.25, 0.8, 0.25, 1)'
  },
  
  // High-quality easings (for capable devices)
  premium: {
    elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    anticipate: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    overshoot: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    backOut: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  }
}

/**
 * Get appropriate easing function based on quality level
 */
export function getEasingForQuality(
  quality: 'low' | 'medium' | 'high',
  style: 'gentle' | 'smooth' | 'bounce' | 'sharp' = 'smooth'
): string {
  switch (quality) {
    case 'low':
      return easingFunctions.gpuOptimized.easeOut
    case 'medium':
      return easingFunctions.efficient[style] || easingFunctions.efficient.smooth
    case 'high':
      return easingFunctions.premium[style as keyof typeof easingFunctions.premium] || 
             easingFunctions.premium.anticipate
    default:
      return easingFunctions.gpuOptimized.easeOut
  }
}

/**
 * Stagger animation configurations
 */
export const staggerPresets = {
  micro: {
    low: { delay: 100, overlap: 0.8 },
    medium: { delay: 80, overlap: 0.7 },
    high: { delay: 60, overlap: 0.6 }
  },
  normal: {
    low: { delay: 200, overlap: 0.6 },
    medium: { delay: 150, overlap: 0.5 },
    high: { delay: 100, overlap: 0.4 }
  },
  slow: {
    low: { delay: 400, overlap: 0.4 },
    medium: { delay: 300, overlap: 0.3 },
    high: { delay: 200, overlap: 0.2 }
  }
}

/**
 * Create stagger configuration
 */
export function createStaggerConfig(
  type: 'micro' | 'normal' | 'slow',
  quality: 'low' | 'medium' | 'high',
  itemCount: number
): {
  delays: number[]
  totalDuration: number
} {
  const preset = staggerPresets[type][quality]
  const delays = Array.from({ length: itemCount }, (_, i) => i * preset.delay * preset.overlap)
  const totalDuration = delays[delays.length - 1] + preset.delay

  return { delays, totalDuration }
}