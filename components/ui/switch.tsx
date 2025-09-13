"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cx } from "../../styled-system/css"
import { switchComponent, switchThumb } from "../../styled-system/recipes"
import { type SwitchComponentVariantProps, type SwitchThumbVariantProps } from "../../styled-system/recipes"

export interface SwitchProps 
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    SwitchComponentVariantProps {
  className?: string
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, size, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cx(switchComponent({ size }), className)}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={switchThumb({ size })}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }