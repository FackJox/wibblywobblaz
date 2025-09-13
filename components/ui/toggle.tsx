"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, cx, type RecipeVariantProps } from "../../styled-system/css"

const toggleVariants = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "md",
    fontSize: "sm",
    fontWeight: "medium",
    transition: "colors",
    gap: "2",
    "&:hover": {
      backgroundColor: "muted",
      color: "muted.foreground"
    },
    "&:focus-visible": {
      outline: "none",
      boxShadow: "0 0 0 2px hsl(var(--ring))"
    },
    "&:disabled": {
      pointerEvents: "none",
      opacity: "0.5"
    },
    "&[data-state=on]": {
      backgroundColor: "accent",
      color: "accent.foreground"
    },
    "& svg": {
      pointerEvents: "none",
      width: "4",
      height: "4",
      flexShrink: "0"
    }
  },
  variants: {
    variant: {
      default: {
        backgroundColor: "transparent"
      },
      outline: {
        border: "1px solid",
        borderColor: "input",
        backgroundColor: "transparent",
        "&:hover": {
          backgroundColor: "accent",
          color: "accent.foreground"
        }
      }
    },
    size: {
      default: {
        height: "10",
        paddingX: "3",
        minWidth: "10"
      },
      sm: {
        height: "9",
        paddingX: "2.5",
        minWidth: "9"
      },
      lg: {
        height: "11",
        paddingX: "5",
        minWidth: "11"
      }
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
})

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    RecipeVariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cx(toggleVariants({ variant, size }), className)}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
