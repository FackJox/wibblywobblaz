import * as React from "react"

import { cn } from "@/lib/utils"
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
      className={cn(textarea({ state, size: textareaSize }), className)}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
