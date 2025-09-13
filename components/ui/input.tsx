import * as React from "react"

import { cx } from "../../styled-system/css"
import { input } from "../../styled-system/recipes"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & {
  state?: 'default' | 'error' | 'success' | 'warning'
  inputSize?: 'sm' | 'md' | 'lg'
}>(
  ({ className, type, state, inputSize, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cx(input({ state, size: inputSize }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
