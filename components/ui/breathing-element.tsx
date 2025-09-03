"use client";

import { motion, HTMLMotionProps } from 'framer-motion';
import { useBreathing } from '@/lib/animations/hooks/useBreathing';
import { breathingVariants } from '@/lib/animations/variants/breathing';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export type BreathingVariant = 'logo' | 'pulse' | 'border' | 'glow' | 'subtle';

export interface BreathingElementProps extends Omit<HTMLMotionProps<"div">, 'animate' | 'variants'> {
  children: ReactNode;
  variant?: BreathingVariant;
  enabled?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const BreathingElement = ({ 
  children, 
  variant = 'pulse',
  enabled = true,
  className,
  as = 'div',
  ...props
}: BreathingElementProps) => {
  const shouldAnimate = useBreathing(enabled);
  const Component = motion[as as keyof typeof motion] as typeof motion.div;
  
  return (
    <Component
      animate={shouldAnimate ? variant : undefined}
      variants={breathingVariants}
      className={cn(className)}
      {...props}
    >
      {children}
    </Component>
  );
};

export const BreathingLogo = ({ 
  children, 
  className,
  ...props
}: Omit<BreathingElementProps, 'variant'>) => {
  return (
    <BreathingElement
      variant="logo"
      className={cn("inline-block", className)}
      {...props}
    >
      {children}
    </BreathingElement>
  );
};

export const BreathingButton = ({ 
  children, 
  className,
  ...props
}: Omit<BreathingElementProps, 'variant'>) => {
  return (
    <BreathingElement
      variant="pulse"
      as="button"
      className={cn("transition-all", className)}
      {...props}
    >
      {children}
    </BreathingElement>
  );
};

export const BreathingInput = ({ 
  children, 
  className,
  focused = false,
  ...props
}: Omit<BreathingElementProps, 'variant'> & { focused?: boolean }) => {
  return (
    <BreathingElement
      variant="border"
      enabled={focused}
      className={cn("transition-shadow", className)}
      {...props}
    >
      {children}
    </BreathingElement>
  );
};