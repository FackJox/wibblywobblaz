/**
 * Ripple Effect Utilities
 * 
 * Utility functions for calculating and managing ripple effects
 * for interactive elements with touch and click feedback.
 */

export interface RippleConfig {
  /** Color of the ripple effect */
  color?: string
  /** Duration of the ripple animation in milliseconds */
  duration?: number
  /** Maximum size of the ripple as a percentage of element size */
  maxSize?: number
  /** Whether ripples should originate from click point or center */
  centerOrigin?: boolean
  /** Whether to disable ripples (accessibility) */
  disabled?: boolean
  /** Additional CSS classes for ripple element */
  className?: string
}

export interface RipplePosition {
  x: number
  y: number
  size: number
}

/**
 * Calculate ripple position and size based on event and element
 */
export function calculateRipplePosition(
  event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement> | null,
  element: HTMLElement,
  config: RippleConfig = {}
): RipplePosition {
  const { centerOrigin = false, maxSize = 200 } = config
  const rect = element.getBoundingClientRect()
  
  let x: number
  let y: number
  
  if (centerOrigin || !event) {
    // Center origin
    x = rect.width / 2
    y = rect.height / 2
  } else {
    // Get event position relative to element
    const clientX = 'touches' in event && event.touches.length > 0 
      ? event.touches[0].clientX 
      : 'clientX' in event 
      ? event.clientX 
      : rect.left + rect.width / 2
      
    const clientY = 'touches' in event && event.touches.length > 0 
      ? event.touches[0].clientY 
      : 'clientY' in event 
      ? event.clientY 
      : rect.top + rect.height / 2
    
    x = clientX - rect.left
    y = clientY - rect.top
  }
  
  // Calculate size based on element dimensions
  const maxDimension = Math.max(rect.width, rect.height)
  const size = Math.min(maxDimension * (maxSize / 100), 300)
  
  return { x, y, size }
}

/**
 * Create a ripple element with the specified position and config
 */
export function createRippleElement(
  position: RipplePosition,
  config: RippleConfig = {}
): HTMLElement {
  const {
    color = 'currentColor',
    duration = 600,
    className = ''
  } = config
  
  const ripple = document.createElement('span')
  ripple.className = `absolute rounded-full pointer-events-none animate-ripple ${className}`
  
  // Use rgba for better visibility
  const rippleColor = color === 'currentColor' 
    ? 'rgba(255, 255, 255, 0.5)' 
    : color;
    
  ripple.style.cssText = `
    left: ${position.x - position.size / 2}px;
    top: ${position.y - position.size / 2}px;
    width: ${position.size}px;
    height: ${position.size}px;
    background: ${rippleColor};
    animation-duration: ${duration}ms;
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    animation-fill-mode: forwards;
    z-index: 1;
  `
  
  return ripple
}

/**
 * Add a ripple effect to an element
 */
export function addRippleToElement(
  element: HTMLElement,
  event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement> | null,
  config: RippleConfig = {}
): () => void {
  console.log('[RIPPLE-UTILS] addRippleToElement called', {
    element,
    disabled: config.disabled,
    event: !!event
  })
  
  if (config.disabled) {
    return () => {}
  }
  
  const position = calculateRipplePosition(event, element, config)
  const ripple = createRippleElement(position, config)
  
  console.log('[RIPPLE-UTILS] Created ripple', {
    position,
    ripple,
    styles: ripple.style.cssText
  })
  
  // Ensure element has relative positioning for ripple positioning
  const originalPosition = element.style.position
  if (!element.style.position || element.style.position === 'static') {
    element.style.position = 'relative'
  }
  
  // Add overflow hidden to contain ripples
  const originalOverflow = element.style.overflow
  element.style.overflow = 'hidden'
  
  element.appendChild(ripple)
  
  // Remove ripple after animation completes
  const cleanup = () => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple)
    }
  }
  
  // Cleanup after animation duration + buffer
  setTimeout(cleanup, (config.duration || 600) + 100)
  
  // Return immediate cleanup function
  return () => {
    cleanup()
    // Restore original styles if no other ripples
    const remainingRipples = element.querySelectorAll('.animate-ripple')
    if (remainingRipples.length === 0) {
      element.style.position = originalPosition || ''
      element.style.overflow = originalOverflow || ''
    }
  }
}

/**
 * Cleanup all ripples from an element
 */
export function cleanupRipples(element: HTMLElement): void {
  const ripples = element.querySelectorAll('.animate-ripple')
  ripples.forEach(ripple => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple)
    }
  })
}

/**
 * Default ripple configurations for different use cases
 */
export const ripplePresets = {
  default: {
    color: 'currentColor',
    duration: 600,
    maxSize: 200,
    centerOrigin: false
  },
  button: {
    color: 'rgba(255, 255, 255, 0.3)',
    duration: 500,
    maxSize: 150,
    centerOrigin: false
  },
  icon: {
    color: 'currentColor',
    duration: 400,
    maxSize: 100,
    centerOrigin: true
  },
  card: {
    color: 'rgba(0, 0, 0, 0.1)',
    duration: 800,
    maxSize: 300,
    centerOrigin: false
  },
  success: {
    color: 'rgba(34, 197, 94, 0.3)',
    duration: 700,
    maxSize: 200,
    centerOrigin: true
  },
  warning: {
    color: 'rgba(251, 191, 36, 0.3)',
    duration: 600,
    maxSize: 180,
    centerOrigin: true
  },
  error: {
    color: 'rgba(239, 68, 68, 0.3)',
    duration: 600,
    maxSize: 180,
    centerOrigin: true
  }
} as const

export type RipplePreset = keyof typeof ripplePresets