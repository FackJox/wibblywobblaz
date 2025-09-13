"use client"

import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cx, css } from "../../styled-system/css"

const ContextMenu = ContextMenuPrimitive.Root

const ContextMenuTrigger = ContextMenuPrimitive.Trigger

const ContextMenuGroup = ContextMenuPrimitive.Group

const ContextMenuPortal = ContextMenuPrimitive.Portal

const ContextMenuSub = ContextMenuPrimitive.Sub

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cx(
      css({
        display: "flex",
        cursor: "default",
        userSelect: "none",
        alignItems: "center",
        borderRadius: "sm",
        paddingX: "2",
        paddingY: "1.5",
        fontSize: "sm",
        outline: "none",
        _focus: { bg: "accent", color: "accent.foreground" },
        "&[data-state=open]": { bg: "accent", color: "accent.foreground" }
      }),
      inset && css({ paddingLeft: "8" }),
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className={css({ marginLeft: "auto", height: "4", width: "4" })} />
  </ContextMenuPrimitive.SubTrigger>
))
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cx(
      css({
        zIndex: "50",
        minWidth: "32",
        overflow: "hidden",
        borderRadius: "md",
        border: "1px solid",
        borderColor: "border",
        bg: "popover",
        padding: "1",
        color: "popover.foreground",
        boxShadow: "md",
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
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cx(
        css({
          zIndex: "50",
          minWidth: "32",
          overflow: "hidden",
          borderRadius: "md",
          border: "1px solid",
          borderColor: "border",
          bg: "popover",
          padding: "1",
          color: "popover.foreground",
          boxShadow: "md",
          animationName: "in",
          animationDuration: "0.2s",
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
  </ContextMenuPrimitive.Portal>
))
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cx(
      css({
        position: "relative",
        display: "flex",
        cursor: "default",
        userSelect: "none",
        alignItems: "center",
        borderRadius: "sm",
        paddingX: "2",
        paddingY: "1.5",
        fontSize: "sm",
        outline: "none",
        _focus: { bg: "accent", color: "accent.foreground" },
        "&[data-disabled]": { pointerEvents: "none", opacity: "0.5" }
      }),
      inset && css({ paddingLeft: "8" }),
      className
    )}
    {...props}
  />
))
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cx(
      css({
        position: "relative",
        display: "flex",
        cursor: "default",
        userSelect: "none",
        alignItems: "center",
        borderRadius: "sm",
        paddingY: "1.5",
        paddingLeft: "8",
        paddingRight: "2",
        fontSize: "sm",
        outline: "none",
        _focus: { bg: "accent", color: "accent.foreground" },
        "&[data-disabled]": { pointerEvents: "none", opacity: "0.5" }
      }),
      className
    )}
    checked={checked}
    {...props}
  >
    <span className={css({ position: "absolute", left: "2", display: "flex", height: "3.5", width: "3.5", alignItems: "center", justifyContent: "center" })}>
      <ContextMenuPrimitive.ItemIndicator>
        <Check className={css({ height: "4", width: "4" })} />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
))
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cx(
      css({
        position: "relative",
        display: "flex",
        cursor: "default",
        userSelect: "none",
        alignItems: "center",
        borderRadius: "sm",
        paddingY: "1.5",
        paddingLeft: "8",
        paddingRight: "2",
        fontSize: "sm",
        outline: "none",
        _focus: { bg: "accent", color: "accent.foreground" },
        "&[data-disabled]": { pointerEvents: "none", opacity: "0.5" }
      }),
      className
    )}
    {...props}
  >
    <span className={css({ position: "absolute", left: "2", display: "flex", height: "3.5", width: "3.5", alignItems: "center", justifyContent: "center" })}>
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className={css({ height: "2", width: "2", fill: "current" })} />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
))
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cx(
      css({
        paddingX: "2",
        paddingY: "1.5",
        fontSize: "sm",
        fontWeight: "semibold",
        color: "foreground"
      }),
      inset && css({ paddingLeft: "8" }),
      className
    )}
    {...props}
  />
))
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cx(css({ marginX: "-1", marginY: "1", height: "px", bg: "border" }), className)}
    {...props}
  />
))
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

const ContextMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cx(
        css({
          marginLeft: "auto",
          fontSize: "xs",
          letterSpacing: "widest",
          color: "muted.foreground"
        }),
        className
      )}
      {...props}
    />
  )
}
ContextMenuShortcut.displayName = "ContextMenuShortcut"

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}