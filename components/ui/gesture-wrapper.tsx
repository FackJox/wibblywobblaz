"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useLongPress, type LongPressHandlers, type UseLongPressOptions } from "@/hooks/use-long-press"
import { useGestures, type GestureHandlers, type UseGesturesOptions } from "@/hooks/use-gestures"
import { TouchFeedbackWithProgress, type TouchFeedbackWithProgressProps } from "./touch-feedback"
import { usePrefersReducedMotion } from "@/hooks/use-performance"

export interface GestureWrapperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'contextMenu'> {
  /** Whether gestures are enabled */
  enabled?: boolean
  /** Long press configuration */
  longPress?: {
    enabled?: boolean
    handlers?: LongPressHandlers
    options?: UseLongPressOptions
  }
  /** Swipe gesture configuration */
  swipe?: {
    enabled?: boolean
    handlers?: GestureHandlers
    options?: UseGesturesOptions
  }
  /** Visual feedback configuration */
  feedback?: {
    enabled?: boolean
    variant?: TouchFeedbackWithProgressProps['variant']
    showProgress?: boolean
    color?: TouchFeedbackWithProgressProps['color']
  }
  /** Context menu items for long press */
  contextMenuItems?: Array<{
    label: string
    icon?: React.ReactNode
    action: () => void
    disabled?: boolean
  }>
  /** Whether to prevent text selection */
  preventSelection?: boolean
  /** Custom className for the wrapper */
  className?: string
  /** Children content */
  children?: React.ReactNode
}

/**
 * Wrapper component that provides gesture handling and visual feedback
 * Combines long press, swipe gestures, and touch feedback in a reusable component
 */
export const GestureWrapper = React.forwardRef<HTMLDivElement, GestureWrapperProps>(
  ({
    enabled = true,
    longPress = { enabled: true },
    swipe = { enabled: false },
    feedback = { enabled: true, variant: 'ripple', showProgress: true },
    contextMenuItems = [],
    preventSelection = true,
    className,
    children,
    onClick,
    onContextMenu,
    ...props
  }, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion()
    const [showContextMenu, setShowContextMenu] = React.useState(false)
    const [contextMenuPosition, setContextMenuPosition] = React.useState({ x: 0, y: 0 })
    const wrapperRef = React.useRef<HTMLDivElement>(null)
    const combinedRef = React.useCallback((node: HTMLDivElement | null) => {
      wrapperRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }, [ref])

    // Long press handlers with context menu integration
    const longPressHandlers: LongPressHandlers = React.useMemo(() => ({
      onLongPress: (startPoint) => {
        if (contextMenuItems.length > 0) {
          setContextMenuPosition({ x: startPoint.x, y: startPoint.y })
          setShowContextMenu(true)
        }
        longPress.handlers?.onLongPress?.(startPoint)
      },
      onLongPressStart: (startPoint) => {
        longPress.handlers?.onLongPressStart?.(startPoint)
      },
      onLongPressProgress: (progress, currentPoint) => {
        longPress.handlers?.onLongPressProgress?.(progress, currentPoint)
      },
      onLongPressEnd: (success) => {
        longPress.handlers?.onLongPressEnd?.(success)
      },
      onLongPressCancel: (reason) => {
        longPress.handlers?.onLongPressCancel?.(reason)
      }
    }), [longPress.handlers, contextMenuItems.length])

    // Initialize long press hook
    const {
      longPressState,
      longPressHandlers: longPressEventHandlers
    } = useLongPress(
      longPress.enabled ? longPressHandlers : {},
      { enabled: enabled && longPress.enabled, ...longPress.options }
    )

    // Initialize gesture/swipe hook
    const {
      gestureState,
      gestureHandlers: swipeEventHandlers
    } = useGestures(
      swipe.enabled ? swipe.handlers : {},
      { enabled: enabled && swipe.enabled, ...swipe.options }
    )

    // Combine event handlers
    const eventHandlers = React.useMemo(() => {
      const handlers: Record<string, (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => void> = {}

      if (longPress.enabled && enabled) {
        handlers.onTouchStart = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
          if ('touches' in event) {
            longPressEventHandlers.onTouchStart((event as React.TouchEvent<HTMLDivElement>).nativeEvent)
            if (swipe.enabled) {
              swipeEventHandlers.onTouchStart((event as React.TouchEvent<HTMLDivElement>).nativeEvent)
            }
          }
        }
        
        handlers.onTouchMove = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
          if ('touches' in event) {
            longPressEventHandlers.onTouchMove((event as React.TouchEvent<HTMLDivElement>).nativeEvent)
            if (swipe.enabled) {
              swipeEventHandlers.onTouchMove((event as React.TouchEvent<HTMLDivElement>).nativeEvent)
            }
          }
        }
        
        handlers.onTouchEnd = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
          if ('touches' in event) {
            longPressEventHandlers.onTouchEnd((event as React.TouchEvent<HTMLDivElement>).nativeEvent)
            if (swipe.enabled) {
              swipeEventHandlers.onTouchEnd((event as React.TouchEvent<HTMLDivElement>).nativeEvent)
            }
          }
        }
        
        handlers.onTouchCancel = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
          if ('touches' in event) {
            longPressEventHandlers.onTouchCancel((event as React.TouchEvent<HTMLDivElement>).nativeEvent)
            if (swipe.enabled) {
              swipeEventHandlers.onTouchCancel((event as React.TouchEvent<HTMLDivElement>).nativeEvent)
            }
          }
        }

        handlers.onMouseDown = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
          if (!('touches' in event)) {
            longPressEventHandlers.onMouseDown((event as React.MouseEvent<HTMLDivElement>).nativeEvent)
            if (swipe.enabled) {
              swipeEventHandlers.onMouseDown((event as React.MouseEvent<HTMLDivElement>).nativeEvent)
            }
          }
        }
        
        handlers.onMouseMove = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
          if (!('touches' in event)) {
            longPressEventHandlers.onMouseMove((event as React.MouseEvent<HTMLDivElement>).nativeEvent)
            if (swipe.enabled) {
              swipeEventHandlers.onMouseMove((event as React.MouseEvent<HTMLDivElement>).nativeEvent)
            }
          }
        }
        
        handlers.onMouseUp = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
          if (!('touches' in event)) {
            longPressEventHandlers.onMouseUp((event as React.MouseEvent<HTMLDivElement>).nativeEvent)
            if (swipe.enabled) {
              swipeEventHandlers.onMouseUp((event as React.MouseEvent<HTMLDivElement>).nativeEvent)
            }
          }
        }
        
        handlers.onMouseLeave = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
          if (!('touches' in event)) {
            longPressEventHandlers.onMouseLeave((event as React.MouseEvent<HTMLDivElement>).nativeEvent)
            if (swipe.enabled) {
              swipeEventHandlers.onMouseLeave((event as React.MouseEvent<HTMLDivElement>).nativeEvent)
            }
          }
        }

        handlers.onContextMenu = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
          if (!('touches' in event)) {
            longPressEventHandlers.onContextMenu((event as React.MouseEvent<HTMLDivElement>).nativeEvent)
            onContextMenu?.(event as React.MouseEvent<HTMLDivElement>)
          }
        }
      } else if (swipe.enabled && enabled) {
        // Only swipe handlers if long press is disabled
        handlers.onTouchStart = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
          if ('touches' in event) {
            swipeEventHandlers.onTouchStart((event as React.TouchEvent<HTMLDivElement>).nativeEvent)
          }
        }
        
        handlers.onTouchMove = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
          if ('touches' in event) {
            swipeEventHandlers.onTouchMove((event as React.TouchEvent<HTMLDivElement>).nativeEvent)
          }
        }
        
        handlers.onTouchEnd = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
          if ('touches' in event) {
            swipeEventHandlers.onTouchEnd((event as React.TouchEvent<HTMLDivElement>).nativeEvent)
          }
        }
        
        handlers.onTouchCancel = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
          if ('touches' in event) {
            swipeEventHandlers.onTouchCancel((event as React.TouchEvent<HTMLDivElement>).nativeEvent)
          }
        }

        handlers.onMouseDown = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
          if (!('touches' in event)) {
            swipeEventHandlers.onMouseDown((event as React.MouseEvent<HTMLDivElement>).nativeEvent)
          }
        }
        
        handlers.onMouseMove = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
          if (!('touches' in event)) {
            swipeEventHandlers.onMouseMove((event as React.MouseEvent<HTMLDivElement>).nativeEvent)
          }
        }
        
        handlers.onMouseUp = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
          if (!('touches' in event)) {
            swipeEventHandlers.onMouseUp((event as React.MouseEvent<HTMLDivElement>).nativeEvent)
          }
        }
        
        handlers.onMouseLeave = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
          if (!('touches' in event)) {
            swipeEventHandlers.onMouseLeave((event as React.MouseEvent<HTMLDivElement>).nativeEvent)
          }
        }
      }

      return handlers
    }, [
      enabled,
      longPress.enabled,
      swipe.enabled,
      longPressEventHandlers,
      swipeEventHandlers,
      onContextMenu
    ])

    // Handle clicks with gesture coordination
    const handleClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
      // Prevent click if gesture is in progress
      if (longPressState.isTracking || gestureState.isTracking) {
        event.preventDefault()
        return
      }
      
      onClick?.(event)
    }, [longPressState.isTracking, gestureState.isTracking, onClick])

    // Close context menu on outside click
    React.useEffect(() => {
      const handleClickOutside = () => {
        if (showContextMenu) {
          setShowContextMenu(false)
        }
      }

      if (showContextMenu) {
        document.addEventListener('click', handleClickOutside)
        document.addEventListener('touchstart', handleClickOutside)
        return () => {
          document.removeEventListener('click', handleClickOutside)
          document.removeEventListener('touchstart', handleClickOutside)
        }
      }
    }, [showContextMenu])

    // Calculate if feedback should be active
    const feedbackActive = longPressState.isTracking || gestureState.isTracking
    const feedbackProgress = longPressState.progress

    return (
      <>
        <div
          ref={combinedRef}
          className={cn(
            "relative",
            preventSelection && "select-none",
            // Touch action for better gesture handling
            "touch-manipulation",
            // Cursor feedback
            longPress.enabled && "cursor-pointer",
            className
          )}
          {...eventHandlers}
          onClick={handleClick}
          {...props}
        >
          {children}
          
          {/* Visual feedback overlay */}
          {feedback.enabled && !prefersReducedMotion && (
            <TouchFeedbackWithProgress
              active={feedbackActive}
              progress={feedbackProgress}
              variant={feedback.variant}
              showProgress={feedback.showProgress && longPress.enabled}
              color={feedback.color}
              className="absolute inset-0 pointer-events-none"
            />
          )}
        </div>

        {/* Context menu portal */}
        {showContextMenu && contextMenuItems.length > 0 && (
          <ContextMenuPortal
            items={contextMenuItems}
            position={contextMenuPosition}
            onClose={() => setShowContextMenu(false)}
          />
        )}
      </>
    )
  }
)

GestureWrapper.displayName = "GestureWrapper"

/**
 * Context menu portal component
 */
interface ContextMenuPortalProps {
  items: Array<{
    label: string
    icon?: React.ReactNode
    action: () => void
    disabled?: boolean
  }>
  position: { x: number; y: number }
  onClose: () => void
}

const ContextMenuPortal: React.FC<ContextMenuPortalProps> = ({ 
  items, 
  position, 
  onClose 
}) => {
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Adjust position to keep menu on screen
  const adjustedPosition = React.useMemo(() => {
    if (!menuRef.current) return position

    const menu = menuRef.current
    const menuRect = menu.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let { x, y } = position

    // Adjust horizontal position
    if (x + menuRect.width > viewportWidth) {
      x = viewportWidth - menuRect.width - 8
    }
    if (x < 8) {
      x = 8
    }

    // Adjust vertical position
    if (y + menuRect.height > viewportHeight) {
      y = y - menuRect.height
    }
    if (y < 8) {
      y = 8
    }

    return { x, y }
  }, [position])

  const handleItemClick = React.useCallback((item: typeof items[0]) => {
    if (!item.disabled) {
      item.action()
      onClose()
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={onClose}
      onTouchStart={onClose}
    >
      <div
        ref={menuRef}
        className={cn(
          "absolute bg-popover border rounded-md shadow-lg",
          "min-w-[120px] p-1",
          "animate-in slide-in-from-top-1 duration-200"
        )}
        style={{
          left: adjustedPosition.x,
          top: adjustedPosition.y,
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        {items.map((item, index) => (
          <button
            key={index}
            className={cn(
              "flex items-center gap-2 w-full px-2 py-1.5 text-sm",
              "hover:bg-accent hover:text-accent-foreground",
              "rounded-sm transition-colors",
              item.disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => handleItemClick(item)}
            disabled={item.disabled}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * Simple gesture wrapper for basic long press functionality
 */
export interface SimpleGestureWrapperProps extends Omit<GestureWrapperProps, 'longPress' | 'swipe'> {
  /** Long press callback */
  onLongPress?: (startPoint: { x: number; y: number }) => void
  /** Long press duration in ms */
  duration?: number
}

export const SimpleGestureWrapper = React.forwardRef<HTMLDivElement, SimpleGestureWrapperProps>(
  ({ onLongPress, duration = 500, ...props }, ref) => {
    return (
      <GestureWrapper
        ref={ref}
        longPress={{
          enabled: !!onLongPress,
          handlers: {
            onLongPress: onLongPress
          },
          options: {
            duration
          }
        }}
        {...props}
      />
    )
  }
)

SimpleGestureWrapper.displayName = "SimpleGestureWrapper"