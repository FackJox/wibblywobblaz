import * as React from "react"
import { cx } from "../../styled-system/css"
import { badge, type BadgeVariantProps } from "../../styled-system/recipes"


export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BadgeVariantProps {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cx(badge({ variant, size }), className)} {...props} />
  )
}

export { Badge }
