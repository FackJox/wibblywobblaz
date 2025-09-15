import * as React from "react"

import { cx } from "../../styled-system/css"
import { textarea } from "../../styled-system/recipes"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & {
    state?: 'default' | 'error' | 'success' | 'warning'
    textareaSize?: 'sm' | 'md' | 'lg'
  }
>(({ className, state, textareaSize, ...props }, ref) => {
  return (
    <textarea
      className={cx(textarea({ state, size: textareaSize }), className)}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
