"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"
import { cx, css } from "../../styled-system/css"
import { radioGroup, radioGroupItem, radioGroupIndicator } from "../../styled-system/recipes"
import { type RadioGroupVariantProps, type RadioGroupItemVariantProps } from "../../styled-system/recipes"

export interface RadioGroupProps 
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>, 'orientation'>,
    RadioGroupVariantProps {
  className?: string
}

export interface RadioGroupItemProps 
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    RadioGroupItemVariantProps {
  className?: string
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, orientation, spacing, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cx(radioGroup({ orientation, spacing }), className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, size, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cx(radioGroupItem({ size }), className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className={radioGroupIndicator()}>
        <Circle className={css({
          h: size === 'sm' ? '2' : size === 'lg' ? '3' : '2.5',
          w: size === 'sm' ? '2' : size === 'lg' ? '3' : '2.5',
          fill: 'current'
        })} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }