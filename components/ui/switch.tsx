"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cx } from "../../styled-system/css"
import { switchComponent, switchThumb } from "../../styled-system/recipes"
import { type SwitchComponentVariantProps, type SwitchThumbVariantProps } from "../../styled-system/recipes"

import { useRipple } from "@/hooks/use-ripple"

export interface SwitchProps 
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    SwitchComponentVariantProps {
  className?: string
  /** Enable ripple effect (default: true) */
  ripple?: boolean
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, size, ripple = true, disabled, ...props }, ref) => {
  const rippleHook = useRipple({
    preset: 'icon',
    centerOrigin: true,
    disabled: disabled || !ripple,
    maxSize: 120
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
    <SwitchPrimitives.Root
      className={cx(
        switchComponent({ size }),
        ripple && !disabled && "ripple-container relative overflow-hidden active-micro-scale",
        className
      )}
      disabled={disabled}
      ref={mergedRef}
      {...(ripple && !disabled ? rippleHook.getRippleProps() : {})}
      {...props}
    >
      <SwitchPrimitives.Thumb
        className={switchThumb({ size })}
      />
    </SwitchPrimitives.Root>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }