"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cx } from "../../styled-system/css"
import { 
  progress, 
  progressIndicator,
  type ProgressVariantProps,
  type ProgressIndicatorVariantProps
} from "../../styled-system/recipes"

interface ProgressProps 
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    ProgressVariantProps {
  indicatorVariant?: ProgressIndicatorVariantProps['variant']
  animated?: ProgressIndicatorVariantProps['animated']
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant, size, indicatorVariant, animated, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cx(progress({ variant, size }), className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={progressIndicator({ variant: indicatorVariant, animated })}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
