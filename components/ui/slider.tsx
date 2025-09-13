"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cx } from "../../styled-system/css"
import { slider, sliderTrack, sliderRange, sliderThumb } from "../../styled-system/recipes"
import { type SliderVariantProps, type SliderTrackVariantProps, type SliderThumbVariantProps } from "../../styled-system/recipes"

export interface SliderProps 
  extends Omit<React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>, 'orientation'>,
    SliderVariantProps {
  className?: string
  trackSize?: SliderTrackVariantProps['size']
  thumbSize?: SliderThumbVariantProps['size']
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, orientation, trackSize, thumbSize, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cx(slider({ orientation }), className)}
    {...props}
  >
    <SliderPrimitive.Track className={sliderTrack({ orientation, size: trackSize })}>
      <SliderPrimitive.Range className={sliderRange()} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className={sliderThumb({ size: thumbSize })} />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }