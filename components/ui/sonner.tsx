"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import { css } from "@/styled-system/css"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: `group toast ${css({
            ".group[.toaster] &": {
              bg: "background",
              color: "foreground",
              borderColor: "border",
              boxShadow: "lg"
            }
          })}`,
          description: css({
            ".toast &": {
              color: "muted.foreground"
            }
          }),
          actionButton: css({
            ".toast &": {
              bg: "primary",
              color: "primary.foreground"
            }
          }),
          cancelButton: css({
            ".toast &": {
              bg: "muted",
              color: "muted.foreground"
            }
          })
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
