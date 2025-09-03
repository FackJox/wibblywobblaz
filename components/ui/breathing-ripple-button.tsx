"use client";

import { forwardRef } from 'react';
import { RippleButton, RippleButtonProps } from './ripple-button';
import { BreathingElement } from './breathing-element';
import { cn } from '@/lib/utils';

export interface BreathingRippleButtonProps extends RippleButtonProps {
  breathingEnabled?: boolean;
  breathingVariant?: 'pulse' | 'subtle';
}

export const BreathingRippleButton = forwardRef<
  HTMLButtonElement,
  BreathingRippleButtonProps
>(({ 
  breathingEnabled = true, 
  breathingVariant = 'pulse',
  className,
  children,
  ...props 
}, ref) => {
  if (!breathingEnabled) {
    return (
      <RippleButton
        ref={ref}
        className={className}
        {...props}
      >
        {children}
      </RippleButton>
    );
  }

  return (
    <BreathingElement
      variant={breathingVariant}
      className={cn("inline-block", className)}
      as="span"
    >
      <RippleButton
        ref={ref}
        className="w-full"
        {...props}
      >
        {children}
      </RippleButton>
    </BreathingElement>
  );
});

BreathingRippleButton.displayName = 'BreathingRippleButton';