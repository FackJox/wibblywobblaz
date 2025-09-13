/**
 * Gesture recognition utilities for touch and mouse events
 * Handles swipe detection, velocity calculation, and gesture thresholds
 */

export interface TouchPoint {
  x: number
  y: number
  timestamp: number
}

export interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down'
  velocity: number
  distance: number
  startPoint: TouchPoint
  endPoint: TouchPoint
  duration: number
}

export interface GestureConfig {
  minDistance: number
  minVelocity: number
  maxDuration: number
  touchTimeout: number
}

export const DEFAULT_GESTURE_CONFIG: GestureConfig = {
  minDistance: 50, // Minimum swipe distance in pixels
  minVelocity: 0.3, // Minimum velocity in pixels/ms
  maxDuration: 1000, // Maximum gesture duration in ms
  touchTimeout: 300, // Touch timeout for gesture recognition
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(start: TouchPoint, end: TouchPoint): number {
  const dx = end.x - start.x
  const dy = end.y - start.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Calculate velocity between two points
 */
export function calculateVelocity(start: TouchPoint, end: TouchPoint): number {
  const distance = calculateDistance(start, end)
  const duration = end.timestamp - start.timestamp
  return duration > 0 ? distance / duration : 0
}

/**
 * Determine swipe direction based on start and end points
 */
export function getSwipeDirection(start: TouchPoint, end: TouchPoint): 'left' | 'right' | 'up' | 'down' {
  const dx = end.x - start.x
  const dy = end.y - start.y
  
  // Determine primary direction based on larger delta
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left'
  } else {
    return dy > 0 ? 'down' : 'up'
  }
}

/**
 * Check if gesture meets minimum requirements for swipe recognition
 */
export function isValidSwipeGesture(
  start: TouchPoint,
  end: TouchPoint,
  config: GestureConfig = DEFAULT_GESTURE_CONFIG
): boolean {
  const distance = calculateDistance(start, end)
  const velocity = calculateVelocity(start, end)
  const duration = end.timestamp - start.timestamp
  
  return (
    distance >= config.minDistance &&
    velocity >= config.minVelocity &&
    duration <= config.maxDuration
  )
}

/**
 * Create a SwipeGesture object from start and end points
 */
export function createSwipeGesture(
  start: TouchPoint,
  end: TouchPoint
): SwipeGesture | null {
  if (!isValidSwipeGesture(start, end)) {
    return null
  }
  
  return {
    direction: getSwipeDirection(start, end),
    velocity: calculateVelocity(start, end),
    distance: calculateDistance(start, end),
    startPoint: start,
    endPoint: end,
    duration: end.timestamp - start.timestamp
  }
}

/**
 * Extract touch point from touch event
 */
export function extractTouchPoint(event: TouchEvent | MouseEvent): TouchPoint {
  const timestamp = Date.now()
  
  if ('touches' in event && event.touches.length > 0) {
    const touch = event.touches[0]
    return { x: touch.clientX, y: touch.clientY, timestamp }
  } else if ('clientX' in event) {
    return { x: event.clientX, y: event.clientY, timestamp }
  } else {
    return { x: 0, y: 0, timestamp }
  }
}

/**
 * Check if device supports touch events
 */
export function supportsTouchEvents(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * Prevent default behavior for gesture events
 */
export function preventGestureDefault(event: Event): void {
  event.preventDefault()
  event.stopPropagation()
}

/**
 * Clamp velocity to prevent overly aggressive gestures
 */
export function clampVelocity(velocity: number, max: number = 2.0): number {
  return Math.min(Math.max(velocity, 0), max)
}

/**
 * Calculate gesture progress for visual feedback
 */
export function calculateGestureProgress(
  start: TouchPoint,
  current: TouchPoint,
  config: GestureConfig = DEFAULT_GESTURE_CONFIG
): number {
  const distance = calculateDistance(start, current)
  return Math.min(distance / config.minDistance, 1)
}

/**
 * Debounce gesture events to prevent rapid firing
 */
export function debounceGesture<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout | null = null
  
  return ((...args: unknown[]) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}