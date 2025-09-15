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
  config: RippleConfig = {},
  element?: HTMLElement
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
  
  // Calculate the position to center the ripple at the click point
  let left = position.x - position.size / 2
  let top = position.y - position.size / 2
  
  // If element is provided, constrain the ripple within bounds
  if (element) {
    left = Math.max(0, Math.min(left, element.offsetWidth - position.size))
    top = Math.max(0, Math.min(top, element.offsetHeight - position.size))
  }
    
  ripple.style.cssText = `
    position: absolute;
    left: ${left}px;
    top: ${top}px;
    width: ${position.size}px;
    height: ${position.size}px;
    background: ${rippleColor};
    animation-duration: ${duration}ms;
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    animation-fill-mode: forwards;
    z-index: 0;
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
  console.log('[DEBUGBUT] addRippleToElement called', {
    element,
    disabled: config.disabled,
    event: !!event,
    beforeWidth: element.offsetWidth,
    beforeStyles: {
      position: element.style.position,
      overflow: element.style.overflow,
      display: window.getComputedStyle(element).display
    }
  })
  
  if (config.disabled) {
    return () => {}
  }
  
  const position = calculateRipplePosition(event, element, config)
  const ripple = createRippleElement(position, config, element)
  
  console.log('[DEBUGBUT] Created ripple', {
    position,
    ripple,
    styles: ripple.style.cssText
  })
  
  // Note: The button component should have position:relative and overflow:hidden
  // set in its base styles to avoid layout shifts
  
  element.appendChild(ripple)
  
  console.log('[DEBUGBUT] After ripple append:', {
    afterWidth: element.offsetWidth,
    childCount: element.children.length,
    rippleAdded: true
  })
  
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