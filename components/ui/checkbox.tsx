"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cx, css } from "../../styled-system/css"
import { checkbox, checkboxIndicator } from "../../styled-system/recipes"
import { type CheckboxVariantProps } from "../../styled-system/recipes"

export interface CheckboxProps 
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    CheckboxVariantProps {
  className?: string
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, size, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cx(checkbox({ size }), className)}
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
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }