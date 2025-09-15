import * as React from "react"

import { css, cx } from "@/styled-system/css"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className={css({ position: "relative", width: "100%", overflow: "auto" })}>
    <table
      ref={ref}
      className={cx(css({ width: "100%", captionSide: "bottom", fontSize: "0.875rem" }), className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cx(css({ '& tr': { borderBottom: "1px solid token(colors.border)" } }), className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cx(css({ '& tr:last-child': { border: "0" } }), className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cx(
      css({
        borderTop: "1px solid token(colors.border)",
        backgroundColor: "muted",
        opacity: "0.5",
        fontWeight: "500",
        '& > tr:last-child': { borderBottom: "0" }
      }),
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cx(
      css({
        borderBottom: "1px solid token(colors.border)",
        transition: "colors",
        _hover: { backgroundColor: "muted", opacity: "0.5" },
        '&[data-state=selected]': { backgroundColor: "muted" }
      }),
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cx(
      css({
        height: "3rem",
        paddingX: "1rem",
        textAlign: "left",
        verticalAlign: "middle",
        fontWeight: "500",
        color: "muted.foreground",
        '&:has([role=checkbox])': { paddingRight: "0" }
      }),
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cx(
      css({
        padding: "1rem",
        verticalAlign: "middle",
        '&:has([role=checkbox])': { paddingRight: "0" }
      }),
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cx(
      css({
        marginTop: "1rem",
        fontSize: "0.875rem",
        color: "muted.foreground"
      }),
      className
    )}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
