"use client"

import * as React from "react"

/**
 * Performance metrics for animation monitoring
 */
export interface PerformanceMetrics {
  /** Current frames per second */
  fps: number
  /** Average FPS over the monitoring period */
  averageFps: number
  /** Minimum FPS recorded */
  minFps: number
  /** Maximum FPS recorded */
  maxFps: number
  /** Number of dropped frames */
  droppedFrames: number
  /** Total frames measured */
  totalFrames: number
  /** Whether performance is considered good (>= 50 FPS) */
  isPerformant: boolean
  /** Whether performance is poor (<= 30 FPS) */
  isPoor: boolean
}

/**
 * Configuration for performance monitoring
 */
export interface PerformanceConfig {
  /** How often to update FPS calculations (ms) */
  updateInterval?: number
  /** Number of samples to keep for averaging */
  sampleSize?: number
  /** Threshold for considering performance poor */
  poorThreshold?: number
  /** Threshold for considering performance good */
  goodThreshold?: number
  /** Whether to automatically start monitoring */
  autoStart?: boolean
}

/**
 * Controls for performance monitoring
 */
export interface PerformanceControls {
  /** Start performance monitoring */
  start: () => void
  /** Stop performance monitoring */
  stop: () => void
  /** Reset all metrics */
  reset: () => void
  /** Whether monitoring is active */
  isMonitoring: boolean
}

/**
 * Return type for useAnimationPerformance hook
 */
export interface UseAnimationPerformanceReturn extends PerformanceControls {
  /** Current performance metrics */
  metrics: PerformanceMetrics
  /** Log current performance state to console */
  logPerformance: () => void
}

/**
 * Hook for monitoring animation performance and FPS
 * 
 * @param config Performance monitoring configuration
 * @returns Performance metrics and controls
 * 
 * @example
 * ```tsx
 * const performance = useAnimationPerformance({
 *   updateInterval: 1000,
 *   autoStart: true
 * })
 * 
 * return (
 *   <div>
 *     <p>FPS: {performance.metrics.fps}</p>
 *     <p>Avg: {performance.metrics.averageFps}</p>
 *     {performance.metrics.isPoor && (
 *       <div className="text-red-500">Performance Warning!</div>
 *     )}
 *   </div>
 * )
 * ```
 */
export function useAnimationPerformance(
  config: PerformanceConfig = {}
): UseAnimationPerformanceReturn {
  const {
    updateInterval = 1000,
    sampleSize = 60,
    poorThreshold = 30,
    goodThreshold = 50,
    autoStart = false
  } = config

  const [isMonitoring, setIsMonitoring] = React.useState(autoStart)
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({
    fps: 0,
    averageFps: 0,
    minFps: Infinity,
    maxFps: 0,
    droppedFrames: 0,
    totalFrames: 0,
    isPerformant: true,
    isPoor: false
  })

  const frameCountRef = React.useRef(0)
  const lastTimeRef = React.useRef(performance.now())
  const fpsHistoryRef = React.useRef<number[]>([])
  const animationFrameRef = React.useRef<number | null>(null)
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = React.useRef<number>(0)

  /**
   * Calculate FPS based on frame count and time elapsed
   */
  const calculateFPS = React.useCallback(() => {
    const now = performance.now()
    const deltaTime = now - lastTimeRef.current
    
    if (deltaTime >= updateInterval) {
      const currentFps = Math.round((frameCountRef.current * 1000) / deltaTime)
      
      // Add to history and maintain sample size
      fpsHistoryRef.current.push(currentFps)
      if (fpsHistoryRef.current.length > sampleSize) {
        fpsHistoryRef.current.shift()
      }

      // Calculate metrics
      const history = fpsHistoryRef.current
      const averageFps = Math.round(history.reduce((sum, fps) => sum + fps, 0) / history.length)
      const minFps = Math.min(...history)
      const maxFps = Math.max(...history)
      
      // Calculate dropped frames (assuming 60fps target)
      const expectedFrames = Math.round(deltaTime / 16.67) // 60fps = 16.67ms per frame
      const droppedFrames = Math.max(0, expectedFrames - frameCountRef.current)

      setMetrics(prev => ({
        fps: currentFps,
        averageFps,
        minFps: minFps === Infinity ? currentFps : minFps,
        maxFps,
        droppedFrames: prev.droppedFrames + droppedFrames,
        totalFrames: prev.totalFrames + frameCountRef.current,
        isPerformant: averageFps >= goodThreshold,
        isPoor: averageFps <= poorThreshold
      }))

      // Reset counters
      frameCountRef.current = 0
      lastTimeRef.current = now
    }
  }, [updateInterval, sampleSize, poorThreshold, goodThreshold])

  /**
   * Animation frame callback to count frames
   */
  const frameCallback = React.useCallback(() => {
    if (!isMonitoring) return

    frameCountRef.current++
    calculateFPS()
    
    animationFrameRef.current = requestAnimationFrame(frameCallback)
  }, [isMonitoring, calculateFPS])

  /**
   * Start performance monitoring
   */
  const start = React.useCallback(() => {
    if (isMonitoring) return

    setIsMonitoring(true)
    startTimeRef.current = performance.now()
    lastTimeRef.current = performance.now()
    frameCountRef.current = 0
    
    // Start frame counting
    animationFrameRef.current = requestAnimationFrame(frameCallback)
  }, [isMonitoring, frameCallback])

  /**
   * Stop performance monitoring
   */
  const stop = React.useCallback(() => {
    setIsMonitoring(false)
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  /**
   * Reset all performance metrics
   */
  const reset = React.useCallback(() => {
    fpsHistoryRef.current = []
    frameCountRef.current = 0
    
    setMetrics({
      fps: 0,
      averageFps: 0,
      minFps: Infinity,
      maxFps: 0,
      droppedFrames: 0,
      totalFrames: 0,
      isPerformant: true,
      isPoor: false
    })
  }, [])

  /**
   * Log current performance metrics to console
   */
  const logPerformance = React.useCallback(() => {
    console.group("Animation Performance Metrics")
    console.log(`Current FPS: ${metrics.fps}`)
    console.log(`Average FPS: ${metrics.averageFps}`)
    console.log(`Min/Max FPS: ${metrics.minFps}/${metrics.maxFps}`)
    console.log(`Total Frames: ${metrics.totalFrames}`)
    console.log(`Dropped Frames: ${metrics.droppedFrames}`)
    console.log(`Performance Status: ${metrics.isPerformant ? 'Good' : metrics.isPoor ? 'Poor' : 'Fair'}`)
    console.groupEnd()
  }, [metrics])

  // Auto-start if configured
  React.useEffect(() => {
    if (autoStart && !isMonitoring) {
      start()
    }
  }, [autoStart, isMonitoring, start])

  // Start/stop monitoring based on state
  React.useEffect(() => {
    if (isMonitoring) {
      animationFrameRef.current = requestAnimationFrame(frameCallback)
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isMonitoring, frameCallback])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  return {
    metrics,
    isMonitoring,
    start,
    stop,
    reset,
    logPerformance
  }
}

/**
 * Simplified hook for basic performance monitoring
 * 
 * @param threshold FPS threshold below which performance is considered poor
 * @returns Simple performance state
 * 
 * @example
 * ```tsx
 * const { fps, isPoor } = useSimplePerformance(45)
 * 
 * return (
 *   <div>
 *     {isPoor && <div className="text-red-500">Low FPS Warning!</div>}
 *     <small>FPS: {fps}</small>
 *   </div>
 * )
 * ```
 */
export function useSimplePerformance(threshold: number = 30) {
  const performance = useAnimationPerformance({
    poorThreshold: threshold,
    autoStart: true
  })

  return {
    fps: performance.metrics.fps,
    averageFps: performance.metrics.averageFps,
    isPoor: performance.metrics.isPoor,
    isGood: performance.metrics.isPerformant
  }
}

/**
 * Hook to detect if user prefers reduced motion
 * 
 * @returns Whether user has prefers-reduced-motion enabled
 * 
 * @example
 * ```tsx
 * const prefersReducedMotion = usePrefersReducedMotion()
 * 
 * return (
 *   <div className={prefersReducedMotion ? '' : 'animate-bounce'}>
 *     Content
 *   </div>
 * )
 * ```
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }
    
    // Set initial value
    handleChange()
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return prefersReducedMotion
}