import * as React from "react"
import { cx } from "@/styled-system/css"
import { 
  card,
  cardHeader,
  cardTitle,
  cardDescription,
  cardContent,
  cardFooter,
  type CardVariantProps,
  type CardHeaderVariantProps,
  type CardTitleVariantProps,
  type CardDescriptionVariantProps,
  type CardContentVariantProps,
  type CardFooterVariantProps
} from "@/styled-system/recipes"

import { useRipple, type UseRippleProps } from "@/hooks/use-ripple"
import { useMagneticHover, type UseMagneticHoverConfig } from "@/hooks/use-magnetic-hover"
import { useGradientFollow, type UseGradientFollowConfig } from "@/hooks/use-gradient-follow"
import { useTextReveal, type UseTextRevealConfig } from "@/hooks/use-text-reveal"
import { calculateParallaxOffset, getElementCenter, getCursorPosition } from "@/lib/hover-utils"

export interface CardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    CardVariantProps {
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
    elevation, 
    padding,
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
        ;(rippleHook.rippleRef as React.MutableRefObject<HTMLDivElement | null>).current = element
      }
      if (magneticHook.ref) {
        ;(magneticHook.ref as React.MutableRefObject<HTMLDivElement | null>).current = element
      }
      if (gradientHook.ref) {
        ;(gradientHook.ref as React.MutableRefObject<HTMLDivElement | null>).current = element
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
        className={cx(
          card({ elevation, padding }),
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

export interface CardHeaderProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    CardHeaderVariantProps {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, spacing, ...props }, ref) => (
    <div
      ref={ref}
      className={cx(cardHeader({ spacing }), className)}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

export interface CardTitleProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    CardTitleVariantProps {
  /** Enable text reveal animation on hover */
  textReveal?: boolean
  /** Text reveal configuration */
  textRevealConfig?: UseTextRevealConfig
}

const CardTitle = React.forwardRef<HTMLDivElement, CardTitleProps>(
  ({ className, size, textReveal = false, textRevealConfig, ...props }, ref) => {
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
        ;(textRevealHook.ref as React.MutableRefObject<HTMLDivElement | null>).current = element
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
        className={cx(
          cardTitle({ size }),
          textReveal && "cursor-pointer",
          className
        )}
        {...props}
      />
    )
  }
)
CardTitle.displayName = "CardTitle"

export interface CardDescriptionProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    CardDescriptionVariantProps {}

const CardDescription = React.forwardRef<HTMLDivElement, CardDescriptionProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cx(cardDescription({ size }), className)}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

export interface CardContentProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    CardContentVariantProps {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, spacing, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cx(cardContent({ spacing }), className)} 
      {...props} 
    />
  )
)
CardContent.displayName = "CardContent"

export interface CardFooterProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    CardFooterVariantProps {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, spacing, alignment, ...props }, ref) => (
    <div
      ref={ref}
      className={cx(cardFooter({ spacing, alignment }), className)}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  // Export the recipe functions for advanced usage
  card as cardRecipe,
  cardHeader as cardHeaderRecipe,
  cardTitle as cardTitleRecipe,
  cardDescription as cardDescriptionRecipe,
  cardContent as cardContentRecipe,
  cardFooter as cardFooterRecipe
}
export type { CardProps, CardTitleProps }
