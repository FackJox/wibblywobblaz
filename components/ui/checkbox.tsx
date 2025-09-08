"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { useRipple } from "@/hooks/use-ripple"

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /** Enable ripple effect (default: true) */
  ripple?: boolean
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, ripple = true, disabled, ...props }, ref) => {
  const rippleHook = useRipple({
    preset: 'icon',
    centerOrigin: true,
    disabled: disabled || !ripple,
    maxSize: 100
  })
  
  const mergedRef = React.useCallback((element: any) => {
    if (rippleHook.rippleRef) {
      ;(rippleHook.rippleRef as any).current = element
    }
    
    if (typeof ref === 'function') {
      ref(element)
    } else if (ref) {
      ref.current = element
    }
  }, [rippleHook.rippleRef, ref])
  
  return (
    <CheckboxPrimitive.Root
      ref={mergedRef}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        ripple && !disabled && "ripple-container relative overflow-hidden active-micro-scale",
        className
      )}
      disabled={disabled}
      {...(ripple && !disabled ? rippleHook.getRippleProps() : {})}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <Check className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
