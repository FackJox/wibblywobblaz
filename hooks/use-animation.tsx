"use client"

import * as React from "react"

/**
 * Animation states that components can be in
 */
export type AnimationState = 
  | "idle" 
  | "running" 
  | "paused" 
  | "finished" 
  | "cancelled"

/**
 * Animation configuration options
 */
export interface AnimationConfig {
  /** Duration in milliseconds */
  duration?: number
  /** Delay before starting animation in milliseconds */
  delay?: number
  /** CSS easing function */
  easing?: string
  /** Whether animation should loop */
  loop?: boolean
  /** Number of iterations (if loop is true) */
  iterations?: number
  /** Fill mode for the animation */
  fillMode?: "none" | "forwards" | "backwards" | "both"
}

/**
 * Animation control methods
 */
export interface AnimationControls {
  /** Start or resume the animation */
  play: () => void
  /** Pause the animation */
  pause: () => void
  /** Stop the animation and reset to initial state */
  stop: () => void
  /** Cancel the animation */
  cancel: () => void
  /** Restart the animation from the beginning */
  restart: () => void
}

/**
 * Return type for useAnimationState hook
 */
export interface UseAnimationStateReturn extends AnimationControls {
  /** Current animation state */
  state: AnimationState
  /** Whether the animation is currently running */
  isRunning: boolean
  /** Whether the animation is paused */
  isPaused: boolean
  /** Whether the animation has finished */
  isFinished: boolean
  /** Current progress (0-1) */
  progress: number
}

/**
 * Hook for managing animation state with controls
 * 
 * @param config Animation configuration options
 * @param autoStart Whether to start animation immediately
 * @returns Animation state and controls
 * 
 * @example
 * ```tsx
 * const animation = useAnimationState({
 *   duration: 1000,
 *   easing: 'ease-in-out'
 * })
 * 
 * return (
 *   <div className={animation.isRunning ? 'animate-pulse' : ''}>
 *     <button onClick={animation.play}>Play</button>
 *     <button onClick={animation.pause}>Pause</button>
 *   </div>
 * )
 * ```
 */
export function useAnimationState(
  config: AnimationConfig = {},
  autoStart: boolean = false
): UseAnimationStateReturn {
  const [state, setState] = React.useState<AnimationState>("idle")
  const [progress, setProgress] = React.useState<number>(0)
  
  const animationRef = React.useRef<Animation | null>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = React.useRef<number>(0)
  const pausedTimeRef = React.useRef<number>(0)

  const {
    duration = 1000,
    delay = 0,
    easing = "ease",
    loop = false,
    iterations = loop ? Infinity : 1,
    fillMode = "forwards"
  } = config

  /**
   * Update progress based on elapsed time
   */
  const updateProgress = React.useCallback(() => {
    if (state !== "running" || !startTimeRef.current) return

    const now = performance.now()
    const elapsed = now - startTimeRef.current - pausedTimeRef.current
    const newProgress = Math.min(elapsed / duration, 1)
    
    setProgress(newProgress)

    if (newProgress >= 1) {
      setState("finished")
    } else {
      requestAnimationFrame(updateProgress)
    }
  }, [state, duration])

  /**
   * Clear any existing timeouts and animations
   */
  const cleanup = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (animationRef.current) {
      animationRef.current.cancel()
      animationRef.current = null
    }
  }, [])

  /**
   * Start or resume the animation
   */
  const play = React.useCallback(() => {
    if (state === "running") return

    cleanup()
    
    if (delay > 0 && state === "idle") {
      setState("idle")
      timeoutRef.current = setTimeout(() => {
        setState("running")
        startTimeRef.current = performance.now()
        updateProgress()
      }, delay)
    } else {
      setState("running")
      if (state === "paused") {
        // Resume from where we paused
        startTimeRef.current = performance.now() - (progress * duration)
      } else {
        // Start from beginning
        startTimeRef.current = performance.now()
        setProgress(0)
      }
      updateProgress()
    }
  }, [state, delay, updateProgress, cleanup, progress, duration])

  /**
   * Pause the animation
   */
  const pause = React.useCallback(() => {
    if (state !== "running") return
    
    cleanup()
    setState("paused")
    pausedTimeRef.current = performance.now() - startTimeRef.current
  }, [state, cleanup])

  /**
   * Stop the animation and reset to initial state
   */
  const stop = React.useCallback(() => {
    cleanup()
    setState("idle")
    setProgress(0)
    startTimeRef.current = 0
    pausedTimeRef.current = 0
  }, [cleanup])

  /**
   * Cancel the animation
   */
  const cancel = React.useCallback(() => {
    cleanup()
    setState("cancelled")
  }, [cleanup])

  /**
   * Restart the animation from the beginning
   */
  const restart = React.useCallback(() => {
    stop()
    // Use setTimeout to ensure state is updated before playing
    setTimeout(() => play(), 0)
  }, [stop, play])

  // Auto-start if specified
  React.useEffect(() => {
    if (autoStart && state === "idle") {
      play()
    }
  }, [autoStart, play, state])

  // Cleanup on unmount
  React.useEffect(() => {
    return cleanup
  }, [cleanup])

  // Handle loop functionality
  React.useEffect(() => {
    if (state === "finished" && loop && iterations > 1) {
      const currentIteration = Math.floor(progress / 1)
      if (currentIteration < iterations) {
        restart()
      }
    }
  }, [state, loop, iterations, progress, restart])

  const isRunning = state === "running"
  const isPaused = state === "paused"
  const isFinished = state === "finished"

  return {
    state,
    isRunning,
    isPaused,
    isFinished,
    progress,
    play,
    pause,
    stop,
    cancel,
    restart
  }
}

/**
 * Simplified hook for basic animation state management
 * 
 * @param duration Animation duration in milliseconds
 * @returns Basic animation controls and state
 * 
 * @example
 * ```tsx
 * const { isAnimating, trigger } = useSimpleAnimation(500)
 * 
 * return (
 *   <div className={isAnimating ? 'animate-bounce' : ''}>
 *     <button onClick={trigger}>Animate</button>
 *   </div>
 * )
 * ```
 */
export function useSimpleAnimation(duration: number = 1000) {
  const animation = useAnimationState({ duration })
  
  const trigger = React.useCallback(() => {
    animation.restart()
  }, [animation])

  return {
    isAnimating: animation.isRunning,
    trigger
  }
}