"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { usePrefersReducedMotion } from "@/hooks/use-performance"

export interface TouchFeedbackProps {
  /** Whether the feedback is active */
  active?: boolean
  /** Progress from 0 to 1 for long press feedback */
  progress?: number
  /** Type of feedback effect */
  variant?: 'ripple' | 'scale' | 'pulse' | 'ring' | 'gradient'
  /** Size of the feedback effect */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Color theme */
  color?: 'primary' | 'secondary' | 'accent' | 'muted'
  /** Custom className */
  className?: string
  /** Children content */
  children?: React.ReactNode
}

/**
 * Visual feedback component for touch interactions
 * Provides various animation effects for user feedback
 */
export const TouchFeedback = React.forwardRef<HTMLDivElement, TouchFeedbackProps>(
  ({ 
    active = false,
    progress = 0, 
    variant = 'ripple',
    size = 'md',
    color = 'primary',
    className,
    children,
    ...props 
  }, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion()
    const [shouldRender, setShouldRender] = React.useState(active)
    
    // Handle render lifecycle for animations
    React.useEffect(() => {
      if (active) {
        setShouldRender(true)
      } else {
        // Delay unmounting to allow exit animations
        const timeout = setTimeout(() => setShouldRender(false), 300)
        return () => clearTimeout(timeout)
      }
    }, [active])

    if (prefersReducedMotion || !shouldRender) {
      return children ? <div ref={ref} className={className} {...props}>{children}</div> : null
    }

    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12', 
      lg: 'w-16 h-16',
      xl: 'w-20 h-20'
    }

    const colorClasses = {
      primary: 'bg-primary/20 border-primary/40',
      secondary: 'bg-secondary/20 border-secondary/40', 
      accent: 'bg-accent/20 border-accent/40',
      muted: 'bg-muted/20 border-muted-foreground/40'
    }

    const baseClasses = cn(
      "absolute inset-0 pointer-events-none",
      "flex items-center justify-center",
      active && "animate-in",
      !active && "animate-out"
    )

    const renderFeedback = () => {
      switch (variant) {
        case 'ripple':
          return (
            <div 
              className={cn(
                "absolute rounded-full transition-all duration-300 ease-out",
                sizeClasses[size],
                colorClasses[color],
                active ? "scale-150 opacity-0" : "scale-0 opacity-60"
              )}
              style={{
                animationDelay: active ? `${progress * 100}ms` : '0ms'
              }}
            />
          )

        case 'scale':
          return (
            <div 
              className={cn(
                "absolute inset-0 rounded-full transition-all duration-200 ease-out",
                colorClasses[color],
                active ? "scale-95" : "scale-100"
              )}
              style={{
                transform: `scale(${active ? 0.95 + (progress * 0.05) : 1})`
              }}
            />
          )

        case 'pulse':
          return (
            <div 
              className={cn(
                "absolute rounded-full transition-all duration-1000 ease-in-out",
                sizeClasses[size],
                colorClasses[color],
                active && "animate-pulse"
              )}
              style={{
                opacity: active ? 0.3 + (progress * 0.4) : 0
              }}
            />
          )

        case 'ring':
          return (
            <div 
              className={cn(
                "absolute rounded-full border-2 transition-all duration-300 ease-out",
                sizeClasses[size],
                colorClasses[color],
                active ? "scale-110 opacity-100" : "scale-100 opacity-0"
              )}
              style={{
                transform: `scale(${1 + (progress * 0.2)})`,
                opacity: active ? progress : 0
              }}
            />
          )

        case 'gradient':
          return (
            <div 
              className={cn(
                "absolute inset-0 rounded-full transition-all duration-300 ease-out",
                "bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20",
                active ? "opacity-60 scale-105" : "opacity-0 scale-100"
              )}
              style={{
                opacity: active ? progress * 0.6 : 0,
                transform: `scale(${1 + (progress * 0.05)})`
              }}
            />
          )

        default:
          return null
      }
    }

    return (
      <div ref={ref} className={cn(baseClasses, className)} {...props}>
        {renderFeedback()}
        {children}
      </div>
    )
  }
)

TouchFeedback.displayName = "TouchFeedback"

/**
 * Progress ring component for long press feedback
 */
export interface ProgressRingProps {
  /** Progress from 0 to 1 */
  progress: number
  /** Size of the ring */
  size?: number
  /** Stroke width */
  strokeWidth?: number
  /** Color of the progress */
  color?: string
  /** Background color */
  backgroundColor?: string
  /** Custom className */
  className?: string
}

export const ProgressRing = React.forwardRef<SVGSVGElement, ProgressRingProps>(
  ({
    progress = 0,
    size = 40,
    strokeWidth = 3,
    color = "currentColor",
    backgroundColor = "rgba(255,255,255,0.2)",
    className,
    ...props
  }, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion()
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (progress * circumference)

    if (prefersReducedMotion) {
      return null
    }

    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", className)}
        {...props}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-75 ease-out"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
    )
  }
)

ProgressRing.displayName = "ProgressRing"

/**
 * Combined touch feedback with long press progress
 */
export interface TouchFeedbackWithProgressProps extends TouchFeedbackProps {
  /** Whether to show progress ring */
  showProgress?: boolean
  /** Progress ring props */
  progressProps?: Partial<ProgressRingProps>
}

export const TouchFeedbackWithProgress = React.forwardRef<HTMLDivElement, TouchFeedbackWithProgressProps>(
  ({
    showProgress = true,
    progressProps = {},
    progress = 0,
    children,
    ...touchFeedbackProps
  }, ref) => {
    return (
      <TouchFeedback ref={ref} progress={progress} {...touchFeedbackProps}>
        {showProgress && progress > 0 && (
          <ProgressRing progress={progress} {...progressProps} />
        )}
        {children}
      </TouchFeedback>
    )
  }
)

TouchFeedbackWithProgress.displayName = "TouchFeedbackWithProgress"

/**
 * Hook for managing touch feedback state
 */
export interface UseTouchFeedbackProps {
  /** Duration of feedback in ms */
  duration?: number
  /** Whether feedback is disabled */
  disabled?: boolean
}

export interface UseTouchFeedbackReturn {
  /** Whether feedback is active */
  isActive: boolean
  /** Current progress (0-1) */
  progress: number
  /** Trigger feedback */
  trigger: () => void
  /** Cancel feedback */
  cancel: () => void
  /** Set progress manually */
  setProgress: (progress: number) => void
}

export function useTouchFeedback({
  duration = 300,
  disabled = false
}: UseTouchFeedbackProps = {}): UseTouchFeedbackReturn {
  const [isActive, setIsActive] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const cancel = React.useCallback(() => {
    setIsActive(false)
    setProgress(0)
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const trigger = React.useCallback(() => {
    if (disabled || prefersReducedMotion) return

    setIsActive(true)
    setProgress(0)
    
    const startTime = Date.now()
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const currentProgress = Math.min(elapsed / duration, 1)
      
      setProgress(currentProgress)
      
      if (currentProgress < 1) {
        intervalRef.current = setTimeout(updateProgress, 16) // ~60fps
      } else {
        setIsActive(false)
      }
    }
    
    updateProgress()
    
    // Auto-cancel after duration + buffer
    timeoutRef.current = setTimeout(cancel, duration + 100)
  }, [disabled, prefersReducedMotion, duration, cancel])

  const manualSetProgress = React.useCallback((newProgress: number) => {
    if (disabled || prefersReducedMotion) return
    
    setProgress(Math.max(0, Math.min(1, newProgress)))
    
    if (newProgress > 0 && !isActive) {
      setIsActive(true)
    } else if (newProgress === 0 && isActive) {
      setIsActive(false)
    }
  }, [disabled, prefersReducedMotion, isActive])

  // Cleanup on unmount
  React.useEffect(() => {
    return cancel
  }, [cancel])

  return {
    isActive,
    progress,
    trigger,
    cancel,
    setProgress: manualSetProgress
  }
}