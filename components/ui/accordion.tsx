"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cx, css } from "../../styled-system/css"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cx(css({ borderBottom: "1px solid", borderColor: "border" }), className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className={css({ display: "flex" })}>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cx(
        css({
          display: "flex",
          flex: "1",
          alignItems: "center",
          justifyContent: "space-between",
          paddingY: "4",
          fontWeight: "medium",
          transition: "all",
          _hover: { textDecoration: "underline" },
          "&[data-state=open] > svg": { transform: "rotate(180deg)" }
        }),
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className={css({ height: "4", width: "4", flexShrink: "0", transition: "transform", transitionDuration: "200ms" })} />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={css({ 
      overflow: "hidden", 
      fontSize: "sm", 
      transition: "all",
      "&[data-state=closed]": { animation: "accordion-up" },
      "&[data-state=open]": { animation: "accordion-down" }
    })}
    {...props}
  >
    <div className={cx(css({ paddingBottom: "4", paddingTop: "0" }), className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
