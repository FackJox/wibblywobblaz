"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { 
  dialogOverlay,
  dialogContent, 
  dialogClose,
  dialogHeader,
  dialogFooter,
  dialogTitle,
  dialogDescription 
} from "styled-system/recipes"
import { cx } from "styled-system/css"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cx(dialogOverlay(), className)}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

type DialogContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, size, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cx(dialogContent({ size }), className)}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className={dialogClose()}>
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  alignment?: 'left' | 'center' | 'right'
}

const DialogHeader = ({
  className,
  alignment,
  ...props
}: DialogHeaderProps) => (
  <div
    className={cx(dialogHeader({ alignment }), className)}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

type DialogFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  alignment?: 'start' | 'center' | 'end' | 'between'
}

const DialogFooter = ({
  className,
  alignment,
  ...props
}: DialogFooterProps) => (
  <div
    className={cx(dialogFooter({ alignment }), className)}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

type DialogTitleProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> & {
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ className, size, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cx(dialogTitle({ size }), className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

type DialogDescriptionProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> & {
  size?: 'sm' | 'md' | 'lg'
}

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, size, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cx(dialogDescription({ size }), className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
