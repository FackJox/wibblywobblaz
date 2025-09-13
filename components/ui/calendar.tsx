"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { css, cx } from "@/styled-system/css"
import { button as buttonRecipe } from "@/styled-system/recipes"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cx(css({ padding: "0.75rem" }), className)}
      classNames={{
        months: css({
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          sm: { flexDirection: "row", gap: "0 1rem" }
        }),
        month: css({ display: "flex", flexDirection: "column", gap: "1rem" }),
        caption: css({
          display: "flex",
          justifyContent: "center",
          paddingTop: "0.25rem",
          position: "relative",
          alignItems: "center"
        }),
        caption_label: css({ fontSize: "0.875rem", fontWeight: "500" }),
        nav: css({ display: "flex", alignItems: "center", gap: "0.25rem" }),
        nav_button: cx(
          buttonRecipe({ variant: "outline" }),
          css({
            height: "1.75rem",
            width: "1.75rem",
            backgroundColor: "transparent",
            padding: "0",
            opacity: "0.5",
            _hover: { opacity: "1" }
          })
        ),
        nav_button_previous: css({ position: "absolute", left: "0.25rem" }),
        nav_button_next: css({ position: "absolute", right: "0.25rem" }),
        table: css({
          width: "100%",
          borderCollapse: "collapse",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem"
        }),
        head_row: css({ display: "flex" }),
        head_cell: css({
          color: "muted.foreground",
          borderRadius: "0.375rem",
          width: "2.25rem",
          fontWeight: "400",
          fontSize: "0.8rem"
        }),
        row: css({ display: "flex", width: "100%", marginTop: "0.5rem" }),
        cell: css({
          height: "2.25rem",
          width: "2.25rem",
          textAlign: "center",
          fontSize: "0.875rem",
          padding: "0",
          position: "relative",
          _focusWithin: {
            position: "relative",
            zIndex: "20"
          }
        }),
        day: cx(
          buttonRecipe({ variant: "ghost" }),
          css({
            height: "2.25rem",
            width: "2.25rem",
            padding: "0",
            fontWeight: "400",
            '&[aria-selected]': { opacity: "1" }
          })
        ),
        day_range_end: "day-range-end",
        day_selected: css({
          backgroundColor: "primary",
          color: "primary.foreground",
          _hover: {
            backgroundColor: "primary",
            color: "primary.foreground"
          },
          _focus: {
            backgroundColor: "primary",
            color: "primary.foreground"
          }
        }),
        day_today: css({
          backgroundColor: "accent",
          color: "accent.foreground"
        }),
        day_outside: css({
          color: "muted.foreground",
          '&[aria-selected]': {
            backgroundColor: "accent",
            opacity: "0.5",
            color: "muted.foreground"
          }
        }),
        day_disabled: css({
          color: "muted.foreground",
          opacity: "0.5"
        }),
        day_range_middle: css({
          '&[aria-selected]': {
            backgroundColor: "accent",
            color: "accent.foreground"
          }
        }),
        day_hidden: css({ visibility: "hidden" }),
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className={css({ height: "1rem", width: "1rem" })} />,
        IconRight: ({ ...props }) => <ChevronRight className={css({ height: "1rem", width: "1rem" })} />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
