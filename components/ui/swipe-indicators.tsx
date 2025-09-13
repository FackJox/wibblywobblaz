"use client"

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface SwipeIndicatorProps {
  /** Current swipe direction */
  direction?: 'left' | 'right' | 'up' | 'down' | null
  /** Swipe progress from 0 to 1 */
  progress?: number
  /** Whether swipe is currently active */
  isActive?: boolean
  /** Position of the indicator */
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center'
  /** Size of the indicator */
  size?: 'sm' | 'md' | 'lg'
  /** Color theme */
  variant?: 'default' | 'primary' | 'secondary' | 'accent'
  /** Whether to show arrow hints */
  showArrows?: boolean
  /** Whether to show progress bar */
  showProgress?: boolean
  /** Custom className */
  className?: string
}

/**
 * Visual indicator for swipe gestures with progress feedback
 */
export function SwipeIndicator({
  direction = null,
  progress = 0,
  isActive = false,
  position = 'center',
  size = 'md',
  variant = 'default',
  showArrows = true,
  showProgress = true,
  className
}: SwipeIndicatorProps) {
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'active' | 'complete' | 'cancel'>('idle')

  // Update animation phase based on props
  useEffect(() => {
    if (isActive) {
      setAnimationPhase('active')
    } else if (progress >= 1) {
      setAnimationPhase('complete')
      // Reset to idle after animation
      setTimeout(() => setAnimationPhase('idle'), 300)
    } else if (progress > 0) {
      setAnimationPhase('cancel')
      setTimeout(() => setAnimationPhase('idle'), 200)
    } else {
      setAnimationPhase('idle')
    }
  }, [isActive, progress])

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  }

  const positionClasses = {
    top: 'top-8 left-1/2 -translate-x-1/2',
    bottom: 'bottom-8 left-1/2 -translate-x-1/2',
    left: 'left-8 top-1/2 -translate-y-1/2',
    right: 'right-8 top-1/2 -translate-y-1/2',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  }

  const variantClasses = {
    default: 'bg-black/10 border-black/20 text-black/70',
    primary: 'bg-primary/10 border-primary/20 text-primary',
    secondary: 'bg-secondary/10 border-secondary/20 text-secondary-foreground',
    accent: 'bg-accent/10 border-accent/20 text-accent-foreground'
  }

  const getDirectionIcon = () => {
    switch (direction) {
      case 'left':
        return '←'
      case 'right':
        return '→'
      case 'up':
        return '↑'
      case 'down':
        return '↓'
      default:
        return '◇'
    }
  }

  const getRotation = () => {
    switch (direction) {
      case 'left':
        return '-rotate-90'
      case 'right':
        return 'rotate-90'
      case 'up':
        return 'rotate-180'
      case 'down':
        return 'rotate-0'
      default:
        return ''
    }
  }

  // Don't render if not active and no progress
  if (!isActive && progress === 0 && animationPhase === 'idle') {
    return null
  }

  return (
    <div
      className={cn(
        'fixed z-50 pointer-events-none',
        'transition-all duration-200 ease-out',
        positionClasses[position],
        className
      )}
      style={{
        opacity: isActive ? Math.max(0.3, progress) : animationPhase === 'complete' ? 1 : 0.5,
        scale: isActive ? 1 + progress * 0.2 : animationPhase === 'complete' ? 1.3 : 1
      }}
    >
      {/* Main indicator circle */}
      <div
        className={cn(
          'relative flex items-center justify-center',
          'rounded-full border-2 backdrop-blur-sm',
          'transition-all duration-200 ease-out',
          sizeClasses[size],
          variantClasses[variant],
          {
            'animate-pulse': animationPhase === 'active',
            'animate-ping': animationPhase === 'complete'
          }
        )}
      >
        {/* Progress ring */}
        {showProgress && (
          <svg
            className={cn(
              'absolute inset-0 w-full h-full -rotate-90 transition-all duration-100',
              getRotation()
            )}
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              className="fill-none stroke-current stroke-1 opacity-20"
            />
            <circle
              cx="50"
              cy="50"
              r="48"
              className="fill-none stroke-current stroke-2 transition-all duration-200"
              strokeDasharray={`${progress * 301.6} 301.6`}
              strokeLinecap="round"
            />
          </svg>
        )}
        
        {/* Direction arrow */}
        {showArrows && (
          <div className={cn(
            'text-2xl font-bold transition-all duration-200',
            {
              'animate-bounce': animationPhase === 'active' && progress > 0.3,
              'scale-125': animationPhase === 'complete'
            }
          )}>
            {getDirectionIcon()}
          </div>
        )}
      </div>
    </div>
  )
}

export interface SwipeHintsProps {
  /** Whether to show the tutorial hints */
  show?: boolean
  /** Which gestures to show hints for */
  gestures?: ('swipe-left' | 'swipe-right' | 'swipe-up' | 'swipe-down' | 'long-press')[]
  /** Position of hints */
  position?: 'top' | 'bottom' | 'center'
  /** Auto-hide timeout in ms */
  autoHide?: number
  /** Callback when hints are dismissed */
  onDismiss?: () => void
  /** Custom className */
  className?: string
}

/**
 * Tutorial hints for first-time users
 */
export function SwipeHints({
  show = false,
  gestures = ['swipe-left', 'swipe-right'],
  position = 'bottom',
  autoHide = 5000,
  onDismiss,
  className
}: SwipeHintsProps) {
  const [visible, setVisible] = useState(show)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setVisible(show)
    
    if (show && autoHide > 0) {
      timeoutRef.current = setTimeout(() => {
        setVisible(false)
        onDismiss?.()
      }, autoHide)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [show, autoHide, onDismiss])

  const positionClasses = {
    top: 'top-16',
    bottom: 'bottom-16',
    center: 'top-1/2 -translate-y-1/2'
  }

  const getGestureHint = (gesture: string) => {
    switch (gesture) {
      case 'swipe-left':
        return { icon: '←', text: 'Swipe left' }
      case 'swipe-right':
        return { icon: '→', text: 'Swipe right' }
      case 'swipe-up':
        return { icon: '↑', text: 'Swipe up' }
      case 'swipe-down':
        return { icon: '↓', text: 'Swipe down' }
      case 'long-press':
        return { icon: '⌐', text: 'Long press' }
      default:
        return { icon: '◇', text: 'Gesture' }
    }
  }

  if (!visible) return null

  return (
    <div
      className={cn(
        'fixed left-1/2 -translate-x-1/2 z-40',
        'bg-black/80 backdrop-blur-md text-white',
        'px-6 py-4 rounded-2xl shadow-lg',
        'transition-all duration-300 ease-out',
        'animate-in fade-in slide-in-from-bottom-4',
        positionClasses[position],
        className
      )}
    >
      <div className="flex items-center gap-4">
        {gestures.map((gesture) => {
          const hint = getGestureHint(gesture)
          return (
            <div key={gesture} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold animate-pulse">
                {hint.icon}
              </div>
              <span className="text-sm font-medium">{hint.text}</span>
            </div>
          )
        })}
        
        {/* Dismiss button */}
        <button
          onClick={() => {
            setVisible(false)
            onDismiss?.()
          }}
          className="ml-4 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs transition-colors"
          aria-label="Dismiss hints"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export interface SwipeProgressBarProps {
  /** Current progress from 0 to 1 */
  progress?: number
  /** Whether progress bar is active */
  isActive?: boolean
  /** Direction of the progress */
  direction?: 'horizontal' | 'vertical'
  /** Position of the progress bar */
  position?: 'top' | 'bottom' | 'left' | 'right'
  /** Color variant */
  variant?: 'default' | 'primary' | 'success' | 'warning'
  /** Custom className */
  className?: string
}

/**
 * Progress bar for swipe gestures
 */
export function SwipeProgressBar({
  progress = 0,
  isActive = false,
  direction = 'horizontal',
  position = 'bottom',
  variant = 'primary',
  className
}: SwipeProgressBarProps) {
  const positionClasses = {
    top: direction === 'horizontal' ? 'top-0 left-0 right-0' : 'top-0 left-0 bottom-0',
    bottom: direction === 'horizontal' ? 'bottom-0 left-0 right-0' : 'bottom-0 right-0 top-0',
    left: direction === 'horizontal' ? 'left-0 top-0 bottom-0' : 'left-0 top-0 right-0',
    right: direction === 'horizontal' ? 'right-0 top-0 bottom-0' : 'right-0 top-0 left-0'
  }

  const variantClasses = {
    default: 'bg-gray-500',
    primary: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500'
  }

  const sizeClasses = direction === 'horizontal' ? 'h-1' : 'w-1'

  if (!isActive && progress === 0) return null

  return (
    <div
      className={cn(
        'fixed z-30 bg-black/10',
        sizeClasses,
        positionClasses[position],
        className
      )}
    >
      <div
        className={cn(
          'h-full transition-all duration-200 ease-out',
          variantClasses[variant],
          {
            'animate-pulse': isActive && progress > 0
          }
        )}
        style={{
          width: direction === 'horizontal' ? `${progress * 100}%` : '100%',
          height: direction === 'vertical' ? `${progress * 100}%` : '100%'
        }}
      />
    </div>
  )
}

/**
 * Comprehensive swipe indicator system combining multiple feedback types
 */
export interface SwipeIndicatorSystemProps {
  /** Current swipe state */
  swipeState?: {
    isSwaping: boolean
    direction: 'left' | 'right' | 'up' | 'down' | null
    progress: number
  }
  /** Whether to show visual indicators */
  showIndicators?: boolean
  /** Whether to show progress bar */
  showProgressBar?: boolean
  /** Whether to show tutorial hints */
  showHints?: boolean
  /** Hints configuration */
  hintsConfig?: Partial<SwipeHintsProps>
  /** Custom className */
  className?: string
}

export function SwipeIndicatorSystem({
  swipeState = { isSwaping: false, direction: null, progress: 0 },
  showIndicators = true,
  showProgressBar = true,
  showHints = false,
  hintsConfig = {},
  className
}: SwipeIndicatorSystemProps) {
  return (
    <div className={cn('pointer-events-none', className)}>
      {/* Main swipe indicator */}
      {showIndicators && (
        <SwipeIndicator
          direction={swipeState.direction}
          progress={swipeState.progress}
          isActive={swipeState.isSwaping}
          position="center"
          size="md"
          variant="primary"
        />
      )}

      {/* Progress bar */}
      {showProgressBar && (swipeState.direction === 'left' || swipeState.direction === 'right') && (
        <SwipeProgressBar
          progress={swipeState.progress}
          isActive={swipeState.isSwaping}
          direction="horizontal"
          position="bottom"
          variant="primary"
        />
      )}

      {/* Vertical progress for up/down swipes */}
      {showProgressBar && (swipeState.direction === 'up' || swipeState.direction === 'down') && (
        <SwipeProgressBar
          progress={swipeState.progress}
          isActive={swipeState.isSwaping}
          direction="vertical"
          position={swipeState.direction === 'up' ? 'left' : 'right'}
          variant="primary"
        />
      )}

      {/* Tutorial hints */}
      {showHints && (
        <SwipeHints
          show={showHints}
          gestures={['swipe-left', 'swipe-right']}
          position="bottom"
          autoHide={5000}
          {...hintsConfig}
        />
      )}
    </div>
  )
}