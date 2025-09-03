"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { BreathingElement } from "./breathing-element";

const BreathingInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & {
    breathingEnabled?: boolean;
    containerClassName?: string;
  }
>(({ className, containerClassName, breathingEnabled = true, type, ...props }, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <BreathingElement
      variant="border"
      enabled={breathingEnabled && isFocused}
      className={cn("w-full", containerClassName)}
    >
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
    </BreathingElement>
  );
});
BreathingInput.displayName = "BreathingInput";

export { BreathingInput };