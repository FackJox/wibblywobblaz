import * as React from "react"

import { cn } from "@/lib/utils"
import { useRipple, type UseRippleProps } from "@/hooks/use-ripple"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Enable ripple effect for interactive cards */
  ripple?: boolean
  /** Ripple configuration */
  rippleConfig?: UseRippleProps
  /** Whether the card is clickable/interactive */
  interactive?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ripple = false, rippleConfig, interactive = false, onClick, ...props }, ref) => {
    const shouldUseRipple = ripple || interactive
    
    const rippleHook = useRipple({
      preset: 'card',
      disabled: !shouldUseRipple,
      ...rippleConfig
    })
    
    const mergedRef = React.useCallback((element: HTMLDivElement | null) => {
      if (rippleHook.rippleRef) {
        ;(rippleHook.rippleRef as any).current = element
      }
      
      if (typeof ref === 'function') {
        ref(element)
      } else if (ref) {
        ref.current = element
      }
    }, [rippleHook.rippleRef, ref])
    
    const handleClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
      if (shouldUseRipple) {
        rippleHook.triggerRipple(event)
      }
      onClick?.(event)
    }, [shouldUseRipple, rippleHook, onClick])
    
    return (
      <div
        ref={mergedRef}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          shouldUseRipple && "ripple-container relative overflow-hidden",
          interactive && "cursor-pointer hover-micro-scale transition-transform",
          className
        )}
        onClick={handleClick}
        {...(shouldUseRipple ? rippleHook.getRippleProps() : {})}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
