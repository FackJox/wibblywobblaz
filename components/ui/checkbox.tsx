"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cx, css } from "../../styled-system/css"
import { checkbox, checkboxIndicator } from "../../styled-system/recipes"
import { type CheckboxVariantProps } from "../../styled-system/recipes"

import { useRipple } from "@/hooks/use-ripple"

export interface CheckboxProps 
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    CheckboxVariantProps {
  className?: string
  /** Enable ripple effect (default: true) */
  ripple?: boolean
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, size, ripple = true, disabled, ...props }, ref) => {
  const rippleHook = useRipple({
    preset: 'icon',
    centerOrigin: true,
    disabled: disabled || !ripple,
    maxSize: 100
  })
  
  const mergedRef = React.useCallback((element: HTMLButtonElement | null) => {
    if (rippleHook.rippleRef) {
      ;(rippleHook.rippleRef as React.MutableRefObject<HTMLButtonElement | null>).current = element
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
      className={cx(
        checkbox({ size }),
        ripple && !disabled && "ripple-container relative overflow-hidden active-micro-scale",
        className
      )}
      disabled={disabled}
      {...(ripple && !disabled ? rippleHook.getRippleProps() : {})}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={checkboxIndicator()}
      >
        <Check className={css({
          h: size === 'sm' ? '3' : size === 'lg' ? '4' : '4',
          w: size === 'sm' ? '3' : size === 'lg' ? '4' : '4'
        })} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }