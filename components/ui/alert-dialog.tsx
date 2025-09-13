"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cx, css } from "@/styled-system/css"
import { button as buttonRecipe } from "@/styled-system/recipes"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cx(css({
      position: "fixed",
      inset: 0,
      zIndex: 50,
      bg: "black/80",
      "&[data-state=open]": {
        animationName: "fade-in",
        animationDuration: "150ms",
        animationFillMode: "both"
      },
      "&[data-state=closed]": {
        animationName: "fade-out",
        animationDuration: "150ms",
        animationFillMode: "both"
      }
    }), className)}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cx(css({
        position: "fixed",
        left: "50%",
        top: "50%",
        zIndex: 50,
        display: "grid",
        width: "full",
        maxWidth: "lg",
        transform: "translate(-50%, -50%)",
        gap: 4,
        border: "1px solid {colors.border}",
        bg: "background",
        p: 6,
        boxShadow: "lg",
        transitionDuration: "200ms",
        "&[data-state=open]": {
          animationName: "fade-in, zoom-in-95, slide-in-from-left-1/2, slide-in-from-top-48",
          animationDuration: "150ms",
          animationFillMode: "both"
        },
        "&[data-state=closed]": {
          animationName: "fade-out, zoom-out-95, slide-out-to-left-1/2, slide-out-to-top-48",
          animationDuration: "150ms",
          animationFillMode: "both"
        },
        sm: {
          borderRadius: "lg"
        }
      }), className)}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cx(css({
      display: "flex",
      flexDirection: "column",
      gap: 2,
      textAlign: "center",
      sm: {
        textAlign: "left"
      }
    }), className)}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cx(css({
      display: "flex",
      flexDirection: "column-reverse",
      sm: {
        flexDirection: "row",
        justifyContent: "end",
        gap: 2
      }
    }), className)}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cx(css({
      fontSize: "lg",
      fontWeight: "semibold"
    }), className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cx(css({
      fontSize: "sm",
      color: "muted.foreground"
    }), className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cx(buttonRecipe(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cx(
      buttonRecipe({ variant: "outline" }),
      css({
        mt: 2,
        sm: {
          mt: 0
        }
      }),
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
