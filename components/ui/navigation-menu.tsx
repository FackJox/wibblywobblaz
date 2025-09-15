import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { ChevronDown } from "lucide-react"

import { cx, css } from "../../styled-system/css"

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cx(
      css({
        position: "relative",
        zIndex: "10",
        display: "flex",
        maxWidth: "max-content",
        flex: "1",
        alignItems: "center",
        justifyContent: "center"
      }),
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cx(
      css({
        display: "flex",
        flex: "1",
        listStyle: "none",
        alignItems: "center",
        justifyContent: "center",
        gap: "1"
      }),
      "group",
      className
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = () => css({
  display: "inline-flex",
  height: "10",
  width: "max-content",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "md",
  backgroundColor: "background",
  paddingX: "4",
  paddingY: "2",
  fontSize: "sm",
  fontWeight: "medium",
  transition: "colors",
  _hover: { backgroundColor: "accent", color: "accent.foreground" },
  _focus: { backgroundColor: "accent", color: "accent.foreground", outline: "none" },
  _disabled: { pointerEvents: "none", opacity: "0.5" },
  "&[data-active]": { backgroundColor: "accent/50" },
  "&[data-state=open]": { backgroundColor: "accent/50" }
})

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cx(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDown
      className={css({ 
        position: "relative",
        top: "1px",
        marginLeft: "1",
        height: "3",
        width: "3",
        transition: "transform",
        transitionDuration: "200ms",
        ".group[data-state=open] &": { transform: "rotate(180deg)" }
      })}
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cx(
      css({
        left: "0",
        top: "0",
        width: "full",
        "&[data-motion^='from-']": { animation: "in" },
        "&[data-motion^='to-']": { animation: "out" },
        "&[data-motion='from-end']": { animation: "slide-in-from-right-52" },
        "&[data-motion='from-start']": { animation: "slide-in-from-left-52" },
        "&[data-motion='to-end']": { animation: "slide-out-to-right-52" },
        "&[data-motion='to-start']": { animation: "slide-out-to-left-52" },
        md: { position: "absolute", width: "auto" }
      }),
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={css({ position: "absolute", left: "0", top: "full", display: "flex", justifyContent: "center" })}>
    <NavigationMenuPrimitive.Viewport
      className={cx(
        css({
          transformOrigin: "top center",
          position: "relative",
          marginTop: "1.5",
          height: "var(--radix-navigation-menu-viewport-height)",
          width: "full",
          overflow: "hidden",
          borderRadius: "md",
          border: "1px solid",
          borderColor: "border",
          backgroundColor: "popover",
          color: "popover.foreground",
          boxShadow: "lg",
          "&[data-state=open]": { animation: "in zoom-in-90" },
          "&[data-state=closed]": { animation: "out zoom-out-95" },
          md: { width: "var(--radix-navigation-menu-viewport-width)" }
        }),
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cx(
      css({
        top: "full",
        zIndex: "1",
        display: "flex",
        height: "1.5",
        alignItems: "end",
        justifyContent: "center",
        overflow: "hidden",
        "&[data-state=visible]": { animation: "in fade-in" },
        "&[data-state=hidden]": { animation: "out fade-out" }
      }),
      className
    )}
    {...props}
  >
    <div className={css({ 
      position: "relative", 
      top: "60%", 
      height: "2", 
      width: "2", 
      transform: "rotate(45deg)", 
      borderTopLeftRadius: "sm", 
      backgroundColor: "border", 
      boxShadow: "md" 
    })} />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}
