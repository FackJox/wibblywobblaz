import * as React from "react"
import { cx } from "../../styled-system/css"
import { 
  alert, 
  alertTitle, 
  alertDescription,
  type AlertVariantProps,
  type AlertTitleVariantProps,
  type AlertDescriptionVariantProps
} from "../../styled-system/recipes"


const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & AlertVariantProps
>(({ className, variant, size, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cx(alert({ variant, size }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & AlertTitleVariantProps
>(({ className, size, ...props }, ref) => (
  <h5
    ref={ref}
    className={cx(alertTitle({ size }), className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & AlertDescriptionVariantProps
>(({ className, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cx(alertDescription({ size }), className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
