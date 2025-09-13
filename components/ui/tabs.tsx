"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cx, css } from "../../styled-system/css"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cx(
      css({
        display: "inline-flex",
        height: "10",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "md",
        backgroundColor: "muted",
        padding: "1",
        color: "muted.foreground"
      }),
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cx(
      css({
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
        borderRadius: "sm",
        paddingX: "3",
        paddingY: "1.5",
        fontSize: "sm",
        fontWeight: "medium",
        transition: "all",
        _focusVisible: {
          outline: "none",
          ring: "2",
          ringColor: "ring",
          ringOffset: "2"
        },
        _disabled: {
          pointerEvents: "none",
          opacity: "0.5"
        },
        "&[data-state=active]": {
          backgroundColor: "background",
          color: "foreground",
          boxShadow: "sm"
        }
      }),
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cx(
      css({
        marginTop: "2",
        _focusVisible: {
          outline: "none",
          ring: "2",
          ringColor: "ring",
          ringOffset: "2"
        }
      }),
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
