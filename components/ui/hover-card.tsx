"use client"

import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

import { cx, css } from "../../styled-system/css"

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cx(
      css({
        zIndex: "50",
        width: "64",
        borderRadius: "md",
        border: "1px solid",
        borderColor: "border",
        bg: "popover",
        padding: "4",
        color: "popover.foreground",
        boxShadow: "md",
        outline: "none",
        "&[data-state=open]": { animationName: "in", animationFillMode: "forwards", opacity: "1", transform: "scale(1)" },
        "&[data-state=closed]": { animationName: "out", animationFillMode: "forwards", opacity: "0", transform: "scale(0.95)" },
        "&[data-side=bottom]": { animationName: "slideInFromTop" },
        "&[data-side=left]": { animationName: "slideInFromRight" },
        "&[data-side=right]": { animationName: "slideInFromLeft" },
        "&[data-side=top]": { animationName: "slideInFromBottom" }
      }),
      className
    )}
    {...props}
  />
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardTrigger, HoverCardContent }