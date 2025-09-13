"use client"

import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cx, css } from "../../styled-system/css"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cx(
      css({
        display: "flex",
        height: "full",
        width: "full",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: "md",
        backgroundColor: "popover",
        color: "popover.foreground"
      }),
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className={css({ overflow: "hidden", padding: "0", boxShadow: "lg" })}>
        <Command className={css({
          "& [cmdk-group-heading]": { paddingX: "2", fontWeight: "medium", color: "muted.foreground" },
          "& [cmdk-group]:not([hidden]) ~ [cmdk-group]": { paddingTop: "0" },
          "& [cmdk-group]": { paddingX: "2" },
          "& [cmdk-input-wrapper] svg": { height: "5", width: "5" },
          "& [cmdk-input]": { height: "12" },
          "& [cmdk-item]": { paddingX: "2", paddingY: "3" },
          "& [cmdk-item] svg": { height: "5", width: "5" }
        })}>
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className={css({ display: "flex", alignItems: "center", borderBottom: "1px solid", borderColor: "border", paddingX: "3" })} cmdk-input-wrapper="">
    <Search className={css({ marginRight: "2", height: "4", width: "4", flexShrink: "0", opacity: "0.5" })} />
    <CommandPrimitive.Input
      ref={ref}
      className={cx(
        css({
          display: "flex",
          height: "11",
          width: "full",
          borderRadius: "md",
          backgroundColor: "transparent",
          paddingY: "3",
          fontSize: "sm",
          outline: "none",
          _placeholder: { color: "muted.foreground" },
          _disabled: { cursor: "not-allowed", opacity: "0.5" }
        }),
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cx(css({ maxHeight: "300px", overflowY: "auto", overflowX: "hidden" }), className)}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className={css({ paddingY: "6", textAlign: "center", fontSize: "sm" })}
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cx(
      css({
        overflow: "hidden",
        padding: "1",
        color: "foreground",
        "& [cmdk-group-heading]": {
          paddingX: "2",
          paddingY: "1.5",
          fontSize: "xs",
          fontWeight: "medium",
          color: "muted.foreground"
        }
      }),
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cx(css({ marginX: "-1", height: "1px", backgroundColor: "border" }), className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cx(
      css({
        position: "relative",
        display: "flex",
        cursor: "default",
        gap: "2",
        userSelect: "none",
        alignItems: "center",
        borderRadius: "sm",
        paddingX: "2",
        paddingY: "1.5",
        fontSize: "sm",
        outline: "none",
        "&[data-disabled=true]": { pointerEvents: "none", opacity: "0.5" },
        "&[data-selected='true']": { backgroundColor: "accent", color: "accent.foreground" },
        "&[data-selected=true]": { backgroundColor: "accent", color: "accent.foreground" },
        "& svg": { pointerEvents: "none", width: "4", height: "4", flexShrink: "0" }
      }),
      className
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
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
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
