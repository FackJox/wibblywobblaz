import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useRipple, useClickAnimation, type UseRippleProps } from "@/hooks/use-ripple"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ripple-container relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /** Enable ripple effect (default: true) */
  ripple?: boolean
  /** Ripple configuration */
  rippleConfig?: Omit<UseRippleProps, 'preset'>
  /** Enable click scale animation (default: true) */
  clickAnimation?: boolean
  /** Show success bounce animation */
  success?: boolean
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
      // Set both hook refs
      if (rippleHook.rippleRef) {
        ;(rippleHook.rippleRef as any).current = element
      }
      if (clickAnimationHook.clickRef) {
        ;(clickAnimationHook.clickRef as any).current = element
      }
      
      // Set external ref
      if (typeof ref === 'function') {
        ref(element)
      } else if (ref) {
        ref.current = element
      }
    }, [rippleHook.rippleRef, clickAnimationHook.clickRef, ref])
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={mergedRef}
        onClick={handleClick}
        disabled={disabled}
        {...(ripple && !disabled ? rippleHook.getRippleProps() : {})}
        {...(clickAnimation && !disabled ? clickAnimationHook.getClickProps() : {})}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
