"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cx } from "../../styled-system/css"
import { label } from "../../styled-system/recipes"
import { type LabelVariantProps } from "../../styled-system/recipes"

export interface LabelProps 
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    LabelVariantProps {
  className?: string
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, size, weight, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cx(label({ size, weight }), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }