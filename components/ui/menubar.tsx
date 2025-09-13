"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cx, css } from "../../styled-system/css"

const MenubarMenu = MenubarPrimitive.Menu

const MenubarGroup = MenubarPrimitive.Group

const MenubarPortal = MenubarPrimitive.Portal

const MenubarSub = MenubarPrimitive.Sub

const MenubarRadioGroup = MenubarPrimitive.RadioGroup

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cx(
      css({
        display: "flex",
        height: "10",
        alignItems: "center",
        gap: "1",
        borderRadius: "md",
        border: "1px solid",
        borderColor: "border",
        bg: "background",
        padding: "1"
      }),
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cx(
      css({
        display: "flex",
        cursor: "default",
        userSelect: "none",
        alignItems: "center",
        borderRadius: "sm",
        paddingX: "3",
        paddingY: "1.5",
        fontSize: "sm",
        fontWeight: "medium",
        outline: "none",
        _focus: { bg: "accent", color: "accent.foreground" },
        "&[data-state=open]": { bg: "accent", color: "accent.foreground" }
      }),
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
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
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
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
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cx(
          css({
            zIndex: "50",
            minWidth: "48",
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
    </MenubarPrimitive.Portal>
  )
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
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
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
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
      <MenubarPrimitive.ItemIndicator>
        <Check className={css({ height: "4", width: "4" })} />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
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
      <MenubarPrimitive.ItemIndicator>
        <Circle className={css({ height: "2", width: "2", fill: "current" })} />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cx(
      css({
        paddingX: "2",
        paddingY: "1.5",
        fontSize: "sm",
        fontWeight: "semibold"
      }),
      inset && css({ paddingLeft: "8" }),
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cx(css({ marginX: "-1", marginY: "1", height: "px", bg: "muted" }), className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
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
MenubarShortcut.displayName = "MenubarShortcut"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}