"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { css, cx } from "@/styled-system/css"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cx(css({ position: "relative", overflow: "hidden" }), className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className={css({ height: "100%", width: "100%", borderRadius: "inherit" })}>
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cx(
      css({ display: "flex", touchAction: "none", userSelect: "none", transition: "colors" }),
      orientation === "vertical" && css({
        height: "100%",
        width: "0.625rem",
        borderLeft: "1px solid transparent",
        padding: "1px"
      }),
      orientation === "horizontal" && css({
        height: "0.625rem",
        flexDirection: "column",
        borderTop: "1px solid transparent",
        padding: "1px"
      }),
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className={css({
      position: "relative",
      flex: "1",
      borderRadius: "50%",
      backgroundColor: "border"
    })} />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
