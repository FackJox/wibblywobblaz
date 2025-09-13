import * as React from "react"

import { cn } from "@/lib/utils"
import { input } from "../../styled-system/recipes"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & {
  state?: 'default' | 'error' | 'success' | 'warning'
  inputSize?: 'sm' | 'md' | 'lg'
}>(
  ({ className, type, state, inputSize, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(input({ state, size: inputSize }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
