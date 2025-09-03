"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button, ButtonProps } from "./button"
import { cn } from "@/lib/utils"

interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

export interface RippleButtonProps extends ButtonProps {
  disableRipple?: boolean
  asChild?: boolean
}

const rippleColors = {
  default: 'rgba(255, 255, 255, 0.5)',
  destructive: 'rgba(255, 255, 255, 0.5)',
  outline: 'rgba(0, 0, 0, 0.2)',
  secondary: 'rgba(0, 0, 0, 0.2)',
  ghost: 'rgba(0, 0, 0, 0.3)',
  link: 'transparent'
}

const MAX_CONCURRENT_RIPPLES = 5

export const RippleButton = React.forwardRef<
  HTMLButtonElement,
  RippleButtonProps
>(({ children, onClick, onMouseDown, disableRipple = false, disabled, variant = "default", className, asChild = false, ...props }, ref) => {
  const [ripples, setRipples] = React.useState<Ripple[]>([])
  const nextId = React.useRef(0)

  const handleRipple = React.useCallback((event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    if (disableRipple || disabled) return

    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    
    let clientX: number
    let clientY: number
    
    if ('touches' in event) {
      clientX = event.touches[0].clientX
      clientY = event.touches[0].clientY
    } else {
      clientX = event.clientX
      clientY = event.clientY
    }
    
    const size = Math.max(rect.width, rect.height) * 2
    const x = clientX - rect.left - size / 2
    const y = clientY - rect.top - size / 2

    const id = nextId.current++
    setRipples(prev => {
      const newRipples = [...prev, { id, x, y, size }]
      return newRipples.slice(-MAX_CONCURRENT_RIPPLES)
    })

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id))
    }, 600)
  }, [disableRipple, disabled])

  const handleMouseDown = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    // Trigger ripple on any mouse button press (left, middle, right)
    handleRipple(event)
    // Call the original onMouseDown if provided
    onMouseDown?.(event)
  }, [handleRipple, onMouseDown])

  const handleTouchStart = React.useCallback((event: React.TouchEvent<HTMLButtonElement>) => {
    handleRipple(event)
  }, [handleRipple])

  // Check if button has dark background based on className
  const hasDarkBackground = className?.includes('bg-black') || className?.includes('bg-primary')
  
  // Use white ripple for dark backgrounds, default colors for light backgrounds
  const rippleColor = variant === "link" 
    ? "transparent" 
    : hasDarkBackground 
      ? 'rgba(255, 255, 255, 0.3)'
      : rippleColors[variant as keyof typeof rippleColors] || rippleColors.default

  // If asChild is true, we need to clone the child and add ripple functionality
  if (asChild && React.isValidElement(children)) {
    const child = React.Children.only(children) as React.ReactElement<any>
    
    // Clone the child with ripple event handlers and styling
    const enhancedChild = React.cloneElement(child, {
      className: cn(
        child.props?.className,
        "relative overflow-hidden inline-flex items-center gap-2",
        className
      ),
      onMouseDown: (e: React.MouseEvent<HTMLElement>) => {
        handleMouseDown(e as React.MouseEvent<HTMLButtonElement>)
        child.props?.onMouseDown?.(e)
      },
      onTouchStart: (e: React.TouchEvent<HTMLElement>) => {
        handleTouchStart(e as React.TouchEvent<HTMLButtonElement>)
        child.props?.onTouchStart?.(e)
      },
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        onClick?.(e as React.MouseEvent<HTMLButtonElement>)
        child.props?.onClick?.(e)
      },
      children: (
        <>
          <span className="relative z-10 inline-flex items-center gap-2 w-full">{child.props?.children}</span>
          <AnimatePresence>
            {ripples.map(ripple => (
              <motion.span
                key={ripple.id}
                className="absolute pointer-events-none will-change-transform"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: ripple.size,
                  height: ripple.size,
                  backgroundColor: rippleColor,
                  borderRadius: '50%',
                  transform: 'translateZ(0)',
                  zIndex: 1,
                }}
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
            ))}
          </AnimatePresence>
        </>
      ),
    })
    
    return (
      <Button
        ref={ref}
        variant={variant}
        asChild
        disabled={disabled}
        {...props}
      >
        {enhancedChild}
      </Button>
    )
  }
  
  // Fallback for non-element children with asChild
  if (asChild) {
    return (
      <Button
        ref={ref}
        className={className}
        onClick={onClick}
        disabled={disabled}
        variant={variant}
        asChild={asChild}
        {...props}
      >
        {children}
      </Button>
    )
  }

  return (
    <Button
      ref={ref}
      className={cn(className, "!relative !overflow-hidden")}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      disabled={disabled}
      variant={variant}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2 w-full">{children}</span>
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute pointer-events-none will-change-transform"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              backgroundColor: rippleColor,
              borderRadius: '50%',
              transform: 'translateZ(0)',
              zIndex: 1,
            }}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
            }}
          />
        ))}
      </AnimatePresence>
    </Button>
  )
})

RippleButton.displayName = "RippleButton"