import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cx } from "@/styled-system/css"
import { button, type ButtonVariantProps } from "@/styled-system/recipes"
import { useRipple, useClickAnimation, type UseRippleProps } from "@/hooks/use-ripple"
import { useMagneticHover, type UseMagneticHoverConfig } from "@/hooks/use-magnetic-hover"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {
  asChild?: boolean
  /** Enable ripple effect (default: true) */
  ripple?: boolean
  /** Ripple configuration */
  rippleConfig?: Omit<UseRippleProps, 'preset'>
  /** Enable click scale animation (default: true) */
  clickAnimation?: boolean
  /** Show success bounce animation */
  success?: boolean
  /** Enable magnetic hover effect */
  magnetic?: boolean
  /** Magnetic hover configuration */
  magneticConfig?: UseMagneticHoverConfig
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    ripple = true,
    rippleConfig,
    clickAnimation = true,
    success = false,
    magnetic = false,
    magneticConfig,
    onClick,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Get ripple preset based on button variant
    const getRipplePreset = () => {
      switch (variant) {
        case 'destructive':
          return 'error'
        case 'outline':
        case 'ghost':
          return 'default'
        case 'secondary':
          return 'default'
        default:
          return 'button'
      }
    }
    
    // Setup ripple effect
    const rippleHook = useRipple({
      preset: getRipplePreset(),
      disabled: disabled || !ripple,
      ...rippleConfig
    })
    
    // Setup click animation
    const clickAnimationHook = useClickAnimation({
      disabled: disabled || !clickAnimation
    })
    
    // Setup magnetic hover effect
    const magneticHook = useMagneticHover({
      strength: 0.25,
      maxDistance: 100,
      boundaries: { x: 0.4, y: 0.4 },
      lerp: 0.12,
      returnToCenter: true,
      disabled: disabled || !magnetic,
      ...magneticConfig
    })
    
    // Success animation effect
    React.useEffect(() => {
      if (success && rippleHook.rippleRef.current) {
        rippleHook.rippleRef.current.classList.add('animate-success-bounce')
        const timer = setTimeout(() => {
          rippleHook.rippleRef.current?.classList.remove('animate-success-bounce')
        }, 400)
        return () => clearTimeout(timer)
      }
    }, [success, rippleHook.rippleRef])
    
    // Combine click handlers
    const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return
      
      // Trigger success ripple if success prop is true
      if (success) {
        rippleHook.triggerRipple()
      }
      
      onClick?.(event)
    }, [disabled, success, rippleHook, onClick])
    
    // Merge refs
    const mergedRef = React.useCallback((element: HTMLButtonElement | null) => {
      // Debug logging for button dimensions
      if (element) {
        const computedStyle = window.getComputedStyle(element)
        console.log('[DEBUGBUT] Button mounted:', {
          element,
          width: element.offsetWidth,
          height: element.offsetHeight,
          display: computedStyle.display,
          position: computedStyle.position,
          overflow: computedStyle.overflow,
          className: element.className,
          variant,
          size
        })
      }
      
      // Set all hook refs
      if (rippleHook.rippleRef) {
        (rippleHook.rippleRef as React.MutableRefObject<HTMLButtonElement | null>).current = element
      }
      if (clickAnimationHook.clickRef) {
        (clickAnimationHook.clickRef as React.MutableRefObject<HTMLButtonElement | null>).current = element
      }
      if (magneticHook.ref) {
        (magneticHook.ref as React.MutableRefObject<HTMLButtonElement | null>).current = element
      }
      
      // Set external ref
      if (typeof ref === 'function') {
        ref(element)
      } else if (ref) {
        ref.current = element
      }
    }, [rippleHook.rippleRef, clickAnimationHook.clickRef, magneticHook.ref, ref, variant, size])
    
    // Merge all event handlers
    const handleMouseDown = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      console.log('[DEBUGBUT] handleMouseDown triggered')
      const target = event.currentTarget
      const beforeStyle = window.getComputedStyle(target)
      const beforeWidth = target.offsetWidth
      
      console.log('[DEBUGBUT] Before click:', {
        width: beforeWidth,
        display: beforeStyle.display,
        position: beforeStyle.position,
        overflow: beforeStyle.overflow
      })
      
      if (!disabled) {
        // Call ripple handler
        if (ripple) {
          const rippleProps = rippleHook.getRippleProps()
          console.log('[DEBUGBUT] Calling ripple onMouseDown')
          rippleProps.onMouseDown?.(event as React.MouseEvent<HTMLElement>)
          
          // Check after ripple
          setTimeout(() => {
            const afterStyle = window.getComputedStyle(target)
            const afterWidth = target.offsetWidth
            console.log('[DEBUGBUT] After ripple:', {
              width: afterWidth,
              widthChanged: afterWidth !== beforeWidth,
              display: afterStyle.display,
              position: afterStyle.position,
              overflow: afterStyle.overflow
            })
          }, 10)
        }
        // Call click animation handler
        if (clickAnimation) {
          const clickProps = clickAnimationHook.getClickProps()
          clickProps.onMouseDown?.()
          
          // Check after click animation
          setTimeout(() => {
            const afterStyle = window.getComputedStyle(target)
            const afterWidth = target.offsetWidth
            console.log('[DEBUGBUT] After clickAnimation:', {
              width: afterWidth,
              widthChanged: afterWidth !== beforeWidth,
              transform: afterStyle.transform
            })
          }, 20)
        }
      }
      // Call parent's handler if exists
      props.onMouseDown?.(event)
    }, [disabled, ripple, clickAnimation, rippleHook, clickAnimationHook, props])
    
    const handleTouchStart = React.useCallback((event: React.TouchEvent<HTMLButtonElement>) => {
      if (!disabled) {
        // Call ripple handler
        if (ripple) {
          const rippleProps = rippleHook.getRippleProps()
          rippleProps.onTouchStart?.(event as React.TouchEvent<HTMLElement>)
        }
        // Call click animation handler
        if (clickAnimation) {
          const clickProps = clickAnimationHook.getClickProps()
          clickProps.onTouchStart?.()
        }
      }
      // Call parent's handler if exists
      props.onTouchStart?.(event)
    }, [disabled, ripple, clickAnimation, rippleHook, clickAnimationHook, props])
    
    return (
      <Comp
        className={cx(button({ variant, size }), className)}
        ref={mergedRef}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        disabled={disabled}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, button as buttonRecipe }

// Legacy export for compatibility
export const buttonVariants = button
