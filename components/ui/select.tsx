"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { css, cx } from "../../styled-system/css"
import { selectTrigger } from "../../styled-system/recipes"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    state?: 'default' | 'error' | 'success' | 'warning'
    selectSize?: 'sm' | 'md' | 'lg'
  }
>(({ className, children, state, selectSize, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cx(selectTrigger({ state, size: selectSize }), className)}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className={css({ height: "4", width: "4", opacity: "0.5" })} />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cx(
      css({
        display: "flex",
        cursor: "default",
        alignItems: "center",
        justifyContent: "center",
        paddingY: "1"
      }),
      className
    )}
    {...props}
  >
    <ChevronUp className={css({ height: "4", width: "4" })} />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cx(
      css({
        display: "flex",
        cursor: "default",
        alignItems: "center",
        justifyContent: "center",
        paddingY: "1"
      }),
      className
    )}
    {...props}
  >
    <ChevronDown className={css({ height: "4", width: "4" })} />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cx(
        css({
          position: "relative",
          zIndex: "50",
          maxHeight: "96",
          minWidth: "32",
          overflow: "hidden",
          borderRadius: "md",
          border: "1px solid",
          backgroundColor: "popover",
          color: "popover.foreground",
          boxShadow: "md",
          "&[data-state=open]": {
            animationName: "fade-in",
            animationDuration: "0.15s"
          },
          "&[data-state=closed]": {
            animationName: "fade-out",
            animationDuration: "0.15s"
          }
        }),
        position === "popper" && css({
          "&[data-side=bottom]": { transform: "translateY(4px)" },
          "&[data-side=left]": { transform: "translateX(-4px)" },
          "&[data-side=right]": { transform: "translateX(4px)" },
          "&[data-side=top]": { transform: "translateY(-4px)" }
        }),
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cx(
          css({ padding: "1" }),
          position === "popper" && css({
            height: "var(--radix-select-trigger-height)",
            width: "full",
            minWidth: "var(--radix-select-trigger-width)"
          })
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cx(
      css({
        paddingY: "1.5",
        paddingLeft: "8",
        paddingRight: "2",
        fontSize: "sm",
        fontWeight: "semibold"
      }),
      className
    )}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cx(
      css({
        position: "relative",
        display: "flex",
        width: "full",
        cursor: "default",
        userSelect: "none",
        alignItems: "center",
        borderRadius: "sm",
        paddingY: "1.5",
        paddingLeft: "8",
        paddingRight: "2",
        fontSize: "sm",
        outline: "none",
        "&:focus": {
          backgroundColor: "accent",
          color: "accent.foreground"
        },
        "&[data-disabled]": {
          pointerEvents: "none",
          opacity: "0.5"
        }
      }),
      className
    )}
    {...props}
  >
    <span className={css({
      position: "absolute",
      left: "2",
      display: "flex",
      height: "3.5",
      width: "3.5",
      alignItems: "center",
      justifyContent: "center"
    })}>
      <SelectPrimitive.ItemIndicator>
        <Check className={css({ height: "4", width: "4" })} />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cx(
      css({
        marginX: "-1",
        marginY: "1",
        height: "1px",
        backgroundColor: "muted"
      }),
      className
    )}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
