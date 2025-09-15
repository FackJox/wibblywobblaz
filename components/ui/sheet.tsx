"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cx, css } from "../../styled-system/css"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cx(
      css({
        position: "fixed",
        inset: "0",
        zIndex: "50",
        bg: "black/80",
        "&[data-state=open]": { animationName: "in", animationFillMode: "forwards", opacity: "1" },
        "&[data-state=closed]": { animationName: "out", animationFillMode: "forwards", opacity: "0" }
      }),
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cx(
        css({
          position: "fixed",
          zIndex: "50",
          gap: "4",
          bg: "background",
          padding: "6",
          boxShadow: "lg",
          transition: "all",
          transitionTimingFunction: "ease-in-out",
          "&[data-state=open]": { animationName: "in", animationDuration: "500ms", animationFillMode: "forwards" },
          "&[data-state=closed]": { animationName: "out", animationDuration: "300ms", animationFillMode: "forwards" }
        }),
        // Side-specific styles using PandaCSS conditionals
        side === "top" && css({
          insetX: "0",
          top: "0",
          borderBottom: "1px solid",
          borderColor: "border",
          "&[data-state=closed]": { transform: "translateY(-100%)" },
          "&[data-state=open]": { transform: "translateY(0)" }
        }),
        side === "bottom" && css({
          insetX: "0",
          bottom: "0",
          borderTop: "1px solid",
          borderColor: "border",
          "&[data-state=closed]": { transform: "translateY(100%)" },
          "&[data-state=open]": { transform: "translateY(0)" }
        }),
        side === "left" && css({
          insetY: "0",
          left: "0",
          height: "full",
          width: "3/4",
          borderRight: "1px solid",
          borderColor: "border",
          "&[data-state=closed]": { transform: "translateX(-100%)" },
          "&[data-state=open]": { transform: "translateX(0)" },
          sm: { maxWidth: "sm" }
        }),
        side === "right" && css({
          insetY: "0",
          right: "0",
          height: "full",
          width: "3/4",
          borderLeft: "1px solid",
          borderColor: "border",
          "&[data-state=closed]": { transform: "translateX(100%)" },
          "&[data-state=open]": { transform: "translateX(0)" },
          sm: { maxWidth: "sm" }
        }),
        className
      )}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className={css({
        position: "absolute",
        right: "4",
        top: "4",
        borderRadius: "sm",
        opacity: "0.7",
        ringOffset: "2",
        transition: "opacity",
        _hover: { opacity: "1" },
        _focus: { outline: "none", ringWidth: "2", ringColor: "ring", ringOffset: "2" },
        _disabled: { pointerEvents: "none" },
        "&[data-state=open]": { bg: "secondary" }
      })}>
        <X className={css({ height: "4", width: "4" })} />
        <span className={css({ srOnly: true })}>Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cx(
      css({
        display: "flex",
        flexDirection: "column",
        gap: "2",
        textAlign: "center",
        sm: { textAlign: "left" }
      }),
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cx(
      css({
        display: "flex",
        flexDirection: "column-reverse",
        sm: { flexDirection: "row", justifyContent: "flex-end", gap: "2" }
      }),
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cx(css({ fontSize: "lg", fontWeight: "semibold", color: "foreground" }), className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cx(css({ fontSize: "sm", color: "muted.foreground" }), className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}