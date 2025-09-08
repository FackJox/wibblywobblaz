import * as React from "react"

import { cn } from "@/lib/utils"
import { useRipple, type UseRippleProps } from "@/hooks/use-ripple"
import { useMagneticHover, type UseMagneticHoverConfig } from "@/hooks/use-magnetic-hover"
import { useGradientFollow, type UseGradientFollowConfig } from "@/hooks/use-gradient-follow"
import { useTextReveal, type UseTextRevealConfig } from "@/hooks/use-text-reveal"
import { calculateParallaxOffset, getElementCenter, getCursorPosition } from "@/lib/hover-utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Enable ripple effect for interactive cards */
  ripple?: boolean
  /** Ripple configuration */
  rippleConfig?: UseRippleProps
  /** Whether the card is clickable/interactive */
  interactive?: boolean
  /** Enable magnetic hover effect */
  magnetic?: boolean
  /** Magnetic hover configuration */
  magneticConfig?: UseMagneticHoverConfig
  /** Enable gradient follow effect */
  gradientFollow?: boolean
  /** Gradient follow configuration */
  gradientConfig?: UseGradientFollowConfig
  /** Enable parallax depth effect */
  parallax?: boolean
  /** Parallax depth intensity (0-1) */
  parallaxDepth?: number
  /** Enable enhanced hover animations */
  enhancedHover?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    ripple = false, 
    rippleConfig, 
    interactive = false, 
    magnetic = false, 
    magneticConfig, 
    gradientFollow = false, 
    gradientConfig, 
    parallax = false, 
    parallaxDepth = 0.1, 
    enhancedHover = false,
    onClick, 
    ...props 
  }, ref) => {
    const shouldUseRipple = ripple || interactive
    const shouldUseMagnetic = magnetic || enhancedHover
    const shouldUseGradient = gradientFollow || enhancedHover
    const shouldUseParallax = parallax || enhancedHover
    
    const rippleHook = useRipple({
      preset: 'card',
      disabled: !shouldUseRipple,
      ...rippleConfig
    })
    
    const magneticHook = useMagneticHover({
      strength: 0.2,
      maxDistance: 80,
      boundaries: { x: 0.3, y: 0.3 },
      disabled: !shouldUseMagnetic,
      ...magneticConfig
    })
    
    const gradientHook = useGradientFollow({
      radius: 150,
      colors: ['rgba(255, 255, 255, 0.08)', 'transparent'],
      smooth: true,
      hoverOnly: true,
      disabled: !shouldUseGradient,
      cssProperty: '',
      ...gradientConfig
    })
    
    // Parallax state
    const [parallaxTransform, setParallaxTransform] = React.useState({ x: 0, y: 0, rotation: 0 })
    
    const mergedRef = React.useCallback((element: HTMLDivElement | null) => {
      // Set refs for all hooks
      if (rippleHook.rippleRef) {
        ;(rippleHook.rippleRef as any).current = element
      }
      if (magneticHook.ref) {
        ;(magneticHook.ref as any).current = element
      }
      if (gradientHook.ref) {
        ;(gradientHook.ref as any).current = element
      }
      
      if (typeof ref === 'function') {
        ref(element)
      } else if (ref) {
        ref.current = element
      }
    }, [rippleHook.rippleRef, magneticHook.ref, gradientHook.ref, ref])
    
    const handleClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
      if (shouldUseRipple) {
        rippleHook.triggerRipple(event)
      }
      onClick?.(event)
    }, [shouldUseRipple, rippleHook, onClick])
    
    // Handle mouse move for parallax effect
    const handleMouseMove = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
      if (!shouldUseParallax || !magneticHook.ref.current) return
      
      const element = magneticHook.ref.current
      const cursorPos = getCursorPosition(event.nativeEvent, element)
      const elementCenter = getElementCenter(element)
      const elementBounds = element.getBoundingClientRect()
      
      const parallaxData = calculateParallaxOffset(
        cursorPos, 
        elementCenter, 
        {
          top: 0,
          left: 0,
          bottom: elementBounds.height,
          right: elementBounds.width,
          width: elementBounds.width,
          height: elementBounds.height
        }, 
        parallaxDepth
      )
      
      setParallaxTransform(parallaxData)
    }, [shouldUseParallax, magneticHook.ref, parallaxDepth])
    
    const handleMouseLeave = React.useCallback(() => {
      if (shouldUseParallax) {
        setParallaxTransform({ x: 0, y: 0, rotation: 0 })
      }
    }, [shouldUseParallax])
    
    // Combine transforms for enhanced effects
    const combinedTransform = React.useMemo(() => {
      const magnetic = magneticHook.transform
      const parallaxX = shouldUseParallax ? parallaxTransform.x : 0
      const parallaxY = shouldUseParallax ? parallaxTransform.y : 0
      const rotation = shouldUseParallax ? parallaxTransform.rotation : 0
      
      return {
        transform: `translate3d(${
          magnetic.x + parallaxX
        }px, ${
          magnetic.y + parallaxY
        }px, 0) rotateX(${rotation}deg)`,
        background: gradientHook.isActive && gradientHook.gradientValue ? 
          `${gradientHook.gradientValue}, var(--card)` : undefined
      }
    }, [magneticHook.transform, parallaxTransform, shouldUseParallax, gradientHook.isActive, gradientHook.gradientValue])
    
    return (
      <div
        ref={mergedRef}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          shouldUseRipple && "ripple-container relative overflow-hidden",
          interactive && "cursor-pointer transition-all duration-300 ease-out",
          (shouldUseMagnetic || shouldUseParallax) && "will-change-transform",
          enhancedHover && "hover:shadow-lg transition-shadow duration-300",
          className
        )}
        style={{
          ...combinedTransform,
          ...props.style
        }}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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

interface CardTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Enable text reveal animation on hover */
  textReveal?: boolean
  /** Text reveal configuration */
  textRevealConfig?: UseTextRevealConfig
}

const CardTitle = React.forwardRef<HTMLDivElement, CardTitleProps>(
  ({ className, textReveal = false, textRevealConfig, ...props }, ref) => {
    const textRevealHook = useTextReveal({
      type: 'slide',
      by: 'character',
      stagger: 30,
      duration: 200,
      disabled: !textReveal,
      ...textRevealConfig
    })
    
    const mergedRef = React.useCallback((element: HTMLDivElement | null) => {
      if (textRevealHook.ref) {
        ;(textRevealHook.ref as any).current = element
      }
      
      if (typeof ref === 'function') {
        ref(element)
      } else if (ref) {
        ref.current = element
      }
    }, [textRevealHook.ref, ref])
    
    return (
      <div
        ref={mergedRef}
        className={cn(
          "text-2xl font-semibold leading-none tracking-tight",
          textReveal && "cursor-pointer",
          className
        )}
        {...props}
      />
    )
  }
)
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
export type { CardProps, CardTitleProps }
