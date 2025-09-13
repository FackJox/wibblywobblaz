"use client"

import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cx, css } from "@/styled-system/css"

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cx(css({
      display: "flex",
      height: "full",
      width: "full",
      "&[data-panel-group-direction=vertical]": {
        flexDirection: "column"
      }
    }), className)}
    {...props}
  />
)

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cx(css({
      position: "relative",
      display: "flex",
      width: "1px",
      alignItems: "center",
      justifyContent: "center",
      bg: "border",
      _after: {
        content: '""',
        position: "absolute",
        top: 0,
        bottom: 0,
        left: "50%",
        width: "1rem",
        transform: "translateX(-50%)"
      },
      "&:focus-visible": {
        outline: "none",
        ring: "1px",
        ringColor: "ring",
        ringOffset: "1px"
      },
      "&[data-panel-group-direction=vertical]": {
        height: "1px",
        width: "full",
        _after: {
          left: 0,
          height: "1rem",
          width: "full",
          transform: "translateY(-50%)"
        },
        "& > div": {
          transform: "rotate(90deg)"
        }
      }
    }), className)}
    {...props}
  >
    {withHandle && (
      <div className={css({
        zIndex: 10,
        display: "flex",
        height: 4,
        width: 3,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "sm",
        border: "1px solid {colors.border}",
        bg: "border"
      })}>
        <GripVertical className={css({ h: "2.5", w: "2.5" })} />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
